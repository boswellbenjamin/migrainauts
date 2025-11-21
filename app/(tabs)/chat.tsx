import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
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
    'What\'s my biggest trigger?',
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
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ThemedText type="title">AI Assistant</ThemedText>
        <ThemedText style={{ color: colors.darkGray, marginTop: 4 }}>
          Ask anything about your migraines
        </ThemedText>
      </View>

      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={{ paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 1 && (
          <View style={styles.quickRepliesSection}>
            <ThemedText style={{ color: colors.darkGray, fontSize: 12, marginBottom: 12 }}>
              Quick Questions
            </ThemedText>
            {quickReplies.map((reply, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => sendMessage(reply)}
                style={[
                  styles.quickReply,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <ThemedText style={{ fontSize: 13 }}>{reply}</ThemedText>
                <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {messages.map(message => (
          <View
            key={message.id}
            style={[
              styles.messageRow,
              message.sender === 'user' && { justifyContent: 'flex-end' },
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                {
                  backgroundColor:
                    message.sender === 'user'
                      ? colors.primary
                      : colors.card,
                  borderColor:
                    message.sender === 'ai' ? colors.border : colors.primary,
                },
              ]}
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
      </ScrollView>

      <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
        <View
          style={[
            styles.inputField,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              { color: colors.text },
            ]}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.darkGray}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
          >
            <MaterialIcons
              name="send"
              size={20}
              color={inputText.trim() ? colors.primary : colors.mediumGray}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  quickRepliesSection: {
    marginBottom: 20,
  },
  quickReply: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    gap: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    maxHeight: 100,
  },
});

