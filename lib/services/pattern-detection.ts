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
      title: '⚠️ Migraine Risk Detected',
      body: `Your typical ${dayName.toLowerCase()} pattern is forming...`,
      details: {
        explanation: `On ${dayName.toLowerCase()} during ${pattern.timeOfDay} you usually get migraines when ${activeConditions.join(' and ')}. Today you're following the same pattern.`,
        confidence: pattern.confidence,
        dataPoints: [
          `Previous occurrences: ${pattern.occurrences} times`,
          `Expected time: in ${Math.round(hoursUntil)} hours`,
          ...activeConditions.map(c => `Active factor: ${c}`),
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
      title: '💡 Pattern Forming',
      body: `${triggerCount} of ${Object.keys(pattern.conditions).length} factors that usually lead to migraines are active`,
      details: {
        explanation: `Based on your previous migraines, we've detected that certain factors often lead to migraines later in the day.`,
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

    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
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
      morning: 10,
      afternoon: 14,
      evening: 19,
      night: 2,
    };

    const expectedHour = timeMap[timeOfDay] || 12;
    let diff = expectedHour - currentHour;

    if (diff < 0) diff += 24;

    return diff;
  }

  // Get day name in English
  private getDayName(dayOfWeek: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  }

  // Get condition text in English
  private getConditionText(condition: string): string {
    const texts: { [key: string]: string } = {
      lowActivity: 'you haven\'t been active',
      poorSleep: 'you slept poorly',
      lowWater: 'you drank little water',
      highStress: 'you\'ve had high stress',
    };
    return texts[condition] || condition;
  }

  // Get suggested actions based on conditions
  private getSuggestedActions(conditions: Pattern['conditions']): string[] {
    const actions: string[] = [];

    if (conditions.lowActivity) {
      actions.push('Take a 20-minute walk now');
    }
    if (conditions.lowWater) {
      actions.push('Drink 2 glasses of water');
    }
    if (conditions.highStress) {
      actions.push('Take a 10-minute break and breathe deeply');
    }

    actions.push('Take a preventative medication');
    actions.push('Use your Relivia device');
    actions.push('Avoid bright lights for the next hour');

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
        title: '🎉 Great job!',
        body: `You broke your typical ${this.getDayName(currentDayOfWeek).toLowerCase()} pattern`,
        details: {
          explanation: 'You did something different today and it worked!',
          confidence: bestPattern.confidence,
          dataPoints: [
            'You changed your usual behavior',
            'No migraine occurred',
            'This is worth noting!',
          ],
        },
      };

      await NotificationService.sendNotification(notification);
    }
  }
}

export default PatternDetectionService.getInstance();
