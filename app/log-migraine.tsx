import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

type Step = 'confirm' | 'time' | 'intensity' | 'symptoms' | 'success';

const SYMPTOMS = [
  'Nausea',
  'Light sensitivity',
  'Sound sensitivity',
  'Throbbing pain',
  'Aura',
  'One-sided pain',
];

export default function LogMigraineScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [currentStep, setCurrentStep] = useState<Step>('confirm');
  const [intensity, setIntensity] = useState<number>(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isMigraining, setIsMigraining] = useState<boolean>(true);

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'confirm':
        setCurrentStep('time');
        break;
      case 'time':
        setCurrentStep('intensity');
        break;
      case 'intensity':
        setCurrentStep('symptoms');
        break;
      case 'symptoms':
        setCurrentStep('success');
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'time':
        setCurrentStep('confirm');
        break;
      case 'intensity':
        setCurrentStep('time');
        break;
      case 'symptoms':
        setCurrentStep('intensity');
        break;
    }
  };

  const getIntensityLabel = (value: number) => {
    if (value <= 3) return 'Mild';
    if (value <= 5) return 'Moderate';
    if (value <= 7) return 'Severe';
    return 'Unbearable';
  };

  const getIntensityColor = (value: number) => {
    if (value <= 3) return colors.success;
    if (value <= 5) return colors.warning;
    if (value <= 7) return colors.error;
    return colors.danger;
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          onPress={currentStep === 'confirm' ? () => {} : handleBack}
          disabled={currentStep === 'confirm'}
        >
          <MaterialIcons
            name={currentStep === 'confirm' ? 'close' : 'arrow-back'}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
        <ThemedText type="subtitle">Log Migraine</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Step Indicator */}
        <View style={styles.progressContainer}>
          {(['confirm', 'time', 'intensity', 'symptoms'] as const).map((step, index) => (
            <View
              key={step}
              style={{ flex: 1, alignItems: 'center', gap: 8 }}
            >
              <View
                style={[
                  styles.progressDot,
                  {
                    backgroundColor:
                      ['confirm', 'time', 'intensity', 'symptoms'].indexOf(currentStep) >= index
                        ? colors.primary
                        : colors.lightGray,
                  },
                ]}
              />
              {index < 3 && (
                <View
                  style={[
                    styles.progressLine,
                    {
                      backgroundColor:
                        ['confirm', 'time', 'intensity', 'symptoms'].indexOf(currentStep) > index
                          ? colors.primary
                          : colors.lightGray,
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        {/* Step Content */}
        <View style={styles.content}>
          {currentStep === 'confirm' && (
            <ConfirmStep colors={colors} setIsMigraining={setIsMigraining} isMigraining={isMigraining} />
          )}

          {currentStep === 'time' && (
            <TimeStep colors={colors} />
          )}

          {currentStep === 'intensity' && (
            <IntensityStep
              colors={colors}
              intensity={intensity}
              setIntensity={setIntensity}
              getIntensityLabel={getIntensityLabel}
              getIntensityColor={getIntensityColor}
            />
          )}

          {currentStep === 'symptoms' && (
            <SymptomsStep
              colors={colors}
              selectedSymptoms={selectedSymptoms}
              onToggle={handleSymptomToggle}
            />
          )}

          {currentStep === 'success' && (
            <SuccessStep colors={colors} intensity={intensity} symptomsCount={selectedSymptoms.length} />
          )}
        </View>

        {/* Navigation Buttons */}
        {currentStep !== 'success' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                },
              ]}
              onPress={currentStep === 'confirm' ? () => {} : handleBack}
              disabled={currentStep === 'confirm'}
            >
              <ThemedText style={{ fontWeight: '600' }}>
                {currentStep === 'confirm' ? 'Cancel' : 'Back'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleNext}
            >
              <Text style={{ fontWeight: '600', color: '#fff', fontSize: 16 }}>
                {currentStep === 'symptoms' ? 'Finish' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 'success' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => setCurrentStep('confirm')}
            >
              <Text style={{ fontWeight: '600', color: '#fff', fontSize: 16 }}>
                Log Another
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

// Step Components
function ConfirmStep({ colors, isMigraining, setIsMigraining }: any) {
  return (
    <View style={{ gap: 24 }}>
      <View style={{ alignItems: 'center', gap: 16 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.error + '20',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MaterialCommunityIcons name="headache" size={48} color={colors.error} />
        </View>
        <ThemedText type="title" style={{ fontSize: 24 }}>
          Do you have a migraine?
        </ThemedText>
      </View>

      <View style={{ gap: 12 }}>
        <TouchableOpacity
          style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor: colors.error,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setIsMigraining(true)}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Yes, I have one now
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ThemedText style={{ fontSize: 16, fontWeight: '600' }}>
            No, but I had symptoms
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TimeStep({ colors }: any) {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={{ gap: 24 }}>
      <View style={{ alignItems: 'center', gap: 12 }}>
        <ThemedText type="subtitle">When did it start?</ThemedText>
        <ThemedText style={{ color: colors.darkGray }}>
          Adjust the time if needed
        </ThemedText>
      </View>

      <View
        style={{
          padding: 24,
          borderRadius: 12,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Text style={{ fontSize: 48, fontWeight: '700', color: colors.primary }}>
          {timeString}
        </Text>
        <ThemedText style={{ color: colors.darkGray }}>Just now</ThemedText>
      </View>

      <TouchableOpacity
        style={{
          padding: 16,
          borderRadius: 12,
          backgroundColor: colors.lightGray,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ThemedText style={{ color: colors.primary, fontWeight: '600' }}>
          Adjust Time
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

function IntensityStep({
  colors,
  intensity,
  setIntensity,
  getIntensityLabel,
  getIntensityColor,
}: any) {
  return (
    <View style={{ gap: 24 }}>
      <View style={{ alignItems: 'center', gap: 12 }}>
        <ThemedText type="subtitle">How severe?</ThemedText>
        <ThemedText style={{ color: colors.darkGray }}>
          Rate your pain level
        </ThemedText>
      </View>

      <View
        style={{
          padding: 24,
          borderRadius: 12,
          backgroundColor: getIntensityColor(intensity) + '20',
          borderWidth: 1,
          borderColor: getIntensityColor(intensity),
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 56, fontWeight: '700', color: getIntensityColor(intensity) }}>
          {intensity}
        </Text>
        <ThemedText style={{ color: colors.darkGray, fontSize: 14 }}>
          {getIntensityLabel(intensity)}
        </ThemedText>
      </View>

      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 }}>
          <ThemedText style={{ fontSize: 12, color: colors.darkGray }}>Mild</ThemedText>
          <ThemedText style={{ fontSize: 12, color: colors.darkGray }}>Unbearable</ThemedText>
        </View>
        <View
          style={{
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.lightGray,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${(intensity / 10) * 100}%`,
              backgroundColor: getIntensityColor(intensity),
              borderRadius: 4,
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 }}>
          <Text style={{ fontSize: 11, color: colors.darkGray }}>1</Text>
          <Text style={{ fontSize: 11, color: colors.darkGray }}>10</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        {[1, 3, 5, 7, 10].map(value => (
          <TouchableOpacity
            key={value}
            onPress={() => setIntensity(value)}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: intensity === value ? colors.primary : colors.card,
              borderWidth: 1,
              borderColor: intensity === value ? colors.primary : colors.border,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontWeight: '600',
                color: intensity === value ? '#fff' : colors.text,
              }}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function SymptomsStep({ colors, selectedSymptoms, onToggle }: any) {
  return (
    <View style={{ gap: 24 }}>
      <View style={{ alignItems: 'center', gap: 12 }}>
        <ThemedText type="subtitle">Any symptoms?</ThemedText>
        <ThemedText style={{ color: colors.darkGray }}>
          Select what you&apos;re experiencing
        </ThemedText>
      </View>

      <View style={{ gap: 8 }}>
        {SYMPTOMS.map(symptom => (
          <TouchableOpacity
            key={symptom}
            onPress={() => onToggle(symptom)}
            style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: selectedSymptoms.includes(symptom)
                ? colors.primary + '20'
                : colors.card,
              borderWidth: selectedSymptoms.includes(symptom) ? 1.5 : 1,
              borderColor: selectedSymptoms.includes(symptom) ? colors.primary : colors.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                backgroundColor: selectedSymptoms.includes(symptom)
                  ? colors.primary
                  : colors.lightGray,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {selectedSymptoms.includes(symptom) && (
                <MaterialIcons name="check" size={14} color="#fff" />
              )}
            </View>
            <ThemedText style={{ flex: 1, fontWeight: '500' }}>{symptom}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function SuccessStep({ colors, intensity, symptomsCount }: any) {
  return (
    <View style={{ gap: 24, alignItems: 'center' }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.success + '20',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <MaterialIcons name="check-circle" size={48} color={colors.success} />
      </View>

      <View style={{ alignItems: 'center', gap: 8 }}>
        <ThemedText type="title" style={{ fontSize: 24 }}>
          Migraine Logged!
        </ThemedText>
        <ThemedText style={{ color: colors.darkGray }}>
          This is your 3rd this month
        </ThemedText>
      </View>

      <View
        style={{
          width: '100%',
          padding: 16,
          borderRadius: 12,
          backgroundColor: colors.lightGray,
          gap: 12,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <ThemedText style={{ color: colors.darkGray }}>Intensity</ThemedText>
          <ThemedText style={{ fontWeight: '600' }}>{intensity}/10</ThemedText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <ThemedText style={{ color: colors.darkGray }}>Symptoms recorded</ThemedText>
          <ThemedText style={{ fontWeight: '600' }}>{symptomsCount}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 4,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressLine: {
    width: 24,
    height: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    minHeight: 300,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
});

