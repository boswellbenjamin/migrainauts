import { MigrainEvent, DayData, AnyTrackingEntry } from '../types';
import { NotificationData } from '../types/notifications';
import NotificationService from './notification-service';

interface Pattern {
  dayOfWeek: number;
  timeOfDay: string;
  conditions: {
    lowActivity: boolean;
    poorSleep: boolean;
    lowWater: boolean;
    highStress: boolean;
  };
  occurrences: number;
  confidence: number;
}

export class PatternDetectionService {
  private static instance: PatternDetectionService;

  private constructor() {}

  static getInstance(): PatternDetectionService {
    if (!PatternDetectionService.instance) {
      PatternDetectionService.instance = new PatternDetectionService();
    }
    return PatternDetectionService.instance;
  }

  // Analyze migraine patterns
  analyzePatterns(migraines: MigrainEvent[], dayData: DayData[]): Pattern[] {
    const patterns: Map<string, Pattern> = new Map();

    migraines.forEach(migraine => {
      const date = new Date(migraine.date);
      const dayOfWeek = date.getDay();
      const timeOfDay = this.getTimeOfDay(migraine.startTime);

      // Find the day data for this migraine
      const day = dayData.find(d => {
        const dDate = new Date(d.date);
        return dDate.toDateString() === date.toDateString();
      });

      if (!day) return;

      // Analyze conditions
      const conditions = this.analyzeConditions(day);

      // Create pattern key
      const key = `${dayOfWeek}_${timeOfDay}`;

      if (patterns.has(key)) {
        const existing = patterns.get(key)!;
        existing.occurrences++;
        // Update conditions (they must match for pattern to be valid)
        existing.conditions = {
          lowActivity: existing.conditions.lowActivity && conditions.lowActivity,
          poorSleep: existing.conditions.poorSleep && conditions.poorSleep,
          lowWater: existing.conditions.lowWater && conditions.lowWater,
          highStress: existing.conditions.highStress && conditions.highStress,
        };
      } else {
        patterns.set(key, {
          dayOfWeek,
          timeOfDay,
          conditions,
          occurrences: 1,
          confidence: 0,
        });
      }
    });

    // Calculate confidence scores
    const patternArray = Array.from(patterns.values());
    patternArray.forEach(pattern => {
      // Confidence based on occurrences and condition consistency
      const occurrenceScore = Math.min(pattern.occurrences / 5, 1); // Max at 5 occurrences
      const conditionCount = Object.values(pattern.conditions).filter(Boolean).length;
      const conditionScore = conditionCount / 4;

      pattern.confidence = (occurrenceScore * 0.6 + conditionScore * 0.4);
    });

    return patternArray
      .filter(p => p.confidence > 0.3) // Only return patterns with >30% confidence
      .sort((a, b) => b.confidence - a.confidence);
  }

  // Check current day against known patterns
  async checkForPatterns(
    currentDayData: DayData,
    patterns: Pattern[],
    migraines: MigrainEvent[]
  ): Promise<void> {
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const currentTimeOfDay = this.getTimeOfDay(
      `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    );
    const currentConditions = this.analyzeConditions(currentDayData);

    // Find matching patterns
    const matchingPatterns = patterns.filter(pattern => {
      return (
        pattern.dayOfWeek === currentDayOfWeek &&
        this.isTimeNear(pattern.timeOfDay, currentTimeOfDay) &&
        this.conditionsMatch(pattern.conditions, currentConditions)
      );
    });

    if (matchingPatterns.length === 0) return;

    const bestMatch = matchingPatterns[0];

    // Check if we already sent a notification today
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const recentNotifications = NotificationService.getAllNotifications().filter(
      n => n.type === 'predictive_warning' && n.sentTime && new Date(n.sentTime) >= todayStart
    );

    if (recentNotifications.length > 0) {
      console.log('Already sent predictive warning today');
      return;
    }

    // Calculate time until expected migraine
    const hoursUntil = this.calculateHoursUntil(bestMatch.timeOfDay);

    if (hoursUntil > 0 && hoursUntil <= 4) {
      // Send predictive warning
      await this.sendPredictiveWarning(bestMatch, currentDayData, hoursUntil);
    } else if (hoursUntil > 4 && hoursUntil <= 8) {
      // Send early pattern notification
      await this.sendEarlyPatternNotification(bestMatch, currentDayData);
    }
  }

  // Send predictive warning notification
  private async sendPredictiveWarning(
    pattern: Pattern,
    currentDay: DayData,
    hoursUntil: number
  ): Promise<void> {
    const dayName = this.getDayName(pattern.dayOfWeek);
    const activeConditions = Object.entries(pattern.conditions)
      .filter(([_, active]) => active)
      .map(([condition, _]) => this.getConditionText(condition));

    const actions = this.getSuggestedActions(pattern.conditions);

    const notification: Omit<NotificationData, 'id' | 'sentTime' | 'read'> = {
      type: 'predictive_warning',
      priority: 'high',
      title: '⚠️ Migränrisk upptäckt',
      body: `Ditt vanliga mönster för ${dayName.toLowerCase()} formar sig...`,
      details: {
        explanation: `På ${dayName.toLowerCase()} ${pattern.timeOfDay} brukar du få migrän när ${activeConditions.join(' och ')}. Idag följer du samma mönster.`,
        confidence: pattern.confidence,
        dataPoints: [
          `Tidigare händelser: ${pattern.occurrences} gånger`,
          `Förväntad tid: om ${Math.round(hoursUntil)} timmar`,
          ...activeConditions.map(c => `Aktiv faktor: ${c}`),
        ],
        actions: actions.map((action, i) => ({
          id: `action_${i}`,
          title: action,
          type: i === 0 ? 'primary' : 'secondary',
        })),
      },
      patternData: {
        dayOfWeek: dayName,
        timeOfDay: pattern.timeOfDay,
        factors: activeConditions,
      },
    };

    await NotificationService.sendNotification(notification);
  }

  // Send early pattern notification
  private async sendEarlyPatternNotification(
    pattern: Pattern,
    currentDay: DayData
  ): Promise<void> {
    const activeConditions = Object.entries(pattern.conditions)
      .filter(([_, active]) => active)
      .map(([condition, _]) => this.getConditionText(condition));

    const triggerCount = activeConditions.length;

    const notification: Omit<NotificationData, 'id' | 'sentTime' | 'read'> = {
      type: 'early_pattern',
      priority: 'medium',
      title: '💡 Mönster formar sig',
      body: `${triggerCount} av ${Object.keys(pattern.conditions).length} faktorer som brukar leda till migrän är aktiva`,
      details: {
        explanation: `Baserat på dina tidigare migräner har vi upptäckt att vissa faktorer ofta leder till migrän senare på dagen.`,
        confidence: pattern.confidence,
        dataPoints: activeConditions,
        triggers: Object.entries(pattern.conditions).map(([name, active]) => ({
          name: this.getConditionText(name),
          active,
        })),
      },
    };

    await NotificationService.sendNotification(notification);
  }

  // Analyze day conditions
  private analyzeConditions(day: DayData): Pattern['conditions'] {
    let lowActivity = true;
    let poorSleep = true;
    let lowWater = true;
    let highStress = true;

    day.trackingEntries.forEach(entry => {
      switch (entry.type) {
        case 'activity':
          if (entry.tracked && entry.value) {
            lowActivity = false;
          }
          break;
        case 'sleep':
          if (entry.tracked && (entry as any).hours && (entry as any).hours >= 7) {
            poorSleep = false;
          }
          break;
        case 'water':
          if (entry.tracked && (entry as any).glasses && (entry as any).glasses >= 6) {
            lowWater = false;
          }
          break;
        case 'stress':
          if (entry.tracked && (entry as any).level !== 'high') {
            highStress = false;
          }
          break;
      }
    });

    return { lowActivity, poorSleep, lowWater, highStress };
  }

  // Check if conditions match (at least 75% overlap)
  private conditionsMatch(
    patternConditions: Pattern['conditions'],
    currentConditions: Pattern['conditions']
  ): boolean {
    const conditions = Object.keys(patternConditions) as Array<keyof Pattern['conditions']>;
    const matches = conditions.filter(
      key => patternConditions[key] === currentConditions[key]
    ).length;

    return matches / conditions.length >= 0.75;
  }

  // Get time of day category
  private getTimeOfDay(time: string): string {
    const hour = parseInt(time.split(':')[0]);

    if (hour >= 5 && hour < 12) return 'morgon';
    if (hour >= 12 && hour < 17) return 'middag';
    if (hour >= 17 && hour < 21) return 'kväll';
    return 'natt';
  }

  // Check if times are near each other
  private isTimeNear(time1: string, time2: string): boolean {
    // Same time category is considered "near"
    return time1 === time2;
  }

  // Calculate hours until expected time
  private calculateHoursUntil(timeOfDay: string): number {
    const now = new Date();
    const currentHour = now.getHours();

    // Map time of day to approximate hours
    const timeMap: { [key: string]: number } = {
      morgon: 10,
      middag: 14,
      kväll: 19,
      natt: 2,
    };

    const expectedHour = timeMap[timeOfDay] || 12;
    let diff = expectedHour - currentHour;

    if (diff < 0) diff += 24;

    return diff;
  }

  // Get day name in Swedish
  private getDayName(dayOfWeek: number): string {
    const days = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
    return days[dayOfWeek];
  }

  // Get condition text in Swedish
  private getConditionText(condition: string): string {
    const texts: { [key: string]: string } = {
      lowActivity: 'du inte varit aktiv',
      poorSleep: 'du sovit dåligt',
      lowWater: 'du druckit lite vatten',
      highStress: 'du haft hög stress',
    };
    return texts[condition] || condition;
  }

  // Get suggested actions based on conditions
  private getSuggestedActions(conditions: Pattern['conditions']): string[] {
    const actions: string[] = [];

    if (conditions.lowActivity) {
      actions.push('Gå på en 20 minuters promenad nu');
    }
    if (conditions.lowWater) {
      actions.push('Drick 2 glas vatten');
    }
    if (conditions.highStress) {
      actions.push('Ta 10 minuters paus och andas djupt');
    }

    actions.push('Ta en förebyggande medicin');
    actions.push('Använd Relivia enheten');
    actions.push('Undvik starka ljus nästa timme');

    return actions.slice(0, 5); // Max 5 actions
  }

  // Check for positive reinforcement
  async checkForPositiveReinforcement(
    currentDay: DayData,
    patterns: Pattern[],
    migraines: MigrainEvent[]
  ): Promise<void> {
    const now = new Date();
    const currentDayOfWeek = now.getDay();

    // Find patterns that match today
    const todayPatterns = patterns.filter(p => p.dayOfWeek === currentDayOfWeek);

    if (todayPatterns.length === 0) return;

    const bestPattern = todayPatterns[0];
    const currentConditions = this.analyzeConditions(currentDay);

    // Check if user broke the pattern
    const patternBroken = !this.conditionsMatch(bestPattern.conditions, currentConditions);

    // Check if there was no migraine today
    const hadMigrainetToday = migraines.some(m => {
      const mDate = new Date(m.date);
      return mDate.toDateString() === now.toDateString();
    });

    if (patternBroken && !hadMigrainetToday) {
      const notification: Omit<NotificationData, 'id' | 'sentTime' | 'read'> = {
        type: 'positive_reinforcement',
        priority: 'low',
        title: '🎉 Bra jobbat!',
        body: `Du bröt ditt vanliga ${this.getDayName(currentDayOfWeek).toLowerCase()}smönster`,
        details: {
          explanation: 'Du gjorde något annorlunda idag och det fungerade!',
          confidence: bestPattern.confidence,
          dataPoints: [
            'Du ändrade ditt vanliga beteende',
            'Ingen migrän inträffade',
            'Detta är värt att notera!',
          ],
        },
      };

      await NotificationService.sendNotification(notification);
    }
  }
}

export default PatternDetectionService.getInstance();
