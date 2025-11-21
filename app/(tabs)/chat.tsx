import React, { useState } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { MaterialIcons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I can help you understand your migraine patterns and answer questions about your data.',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickReplies = [
    'How many migraines this month?',
    'What&apos;s my biggest trigger?',
    'Will I get a migraine today?',
    'What should I do now?',
  ];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'This is a simulated AI response. In production, this would connect to Claude API.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View style={{ backgroundColor: colors.card, borderBottomColor: colors.border, borderBottomWidth: 1, paddingHorizontal: 20, paddingVertical: 16 }}>
        <ThemedText style={{ fontSize: 24, fontWeight: '700' }}>AI Assistant</ThemedText>
        <ThemedText style={{ color: colors.darkGray, fontSize: 14, marginTop: 4 }}>Ask anything about your migraines</ThemedText>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          {messages.length === 1 && (
            <View>
              <ThemedText style={{ color: colors.darkGray, fontSize: 12, marginBottom: 12 }}>Quick Questions</ThemedText>
              {quickReplies.map((reply, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => sendMessage(reply)}
                  style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <ThemedText style={{ fontSize: 13 }}>{reply}</ThemedText>
                  <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {messages.map(message => (
            <View key={message.id} style={{ flexDirection: 'row', marginBottom: 12, justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <View
                style={{
                  maxWidth: '80%',
                  backgroundColor: message.sender === 'user' ? colors.primary : colors.card,
                  borderColor: message.sender === 'ai' ? colors.border : colors.primary,
                  borderWidth: 1,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 12,
                }}
              >
                <ThemedText
                  style={{
                    color: message.sender === 'user' ? '#fff' : colors.text,
                    fontSize: 14,
                  }}
                >
                  {message.text}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{ borderTopColor: colors.border, borderTopWidth: 1, paddingHorizontal: 16, paddingVertical: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 12,
            gap: 8,
            backgroundColor: colors.card,
          }}
        >
          <TextInput
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 4,
                maxHeight: 100,
                color: colors.text,
              },
            ]}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.darkGray}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity onPress={() => sendMessage(inputText)} disabled={!inputText.trim()}>
            <MaterialIcons name="send" size={20} color={inputText.trim() ? colors.primary : colors.mediumGray} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
