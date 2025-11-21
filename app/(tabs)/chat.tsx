import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { MaterialIcons } from '@expo/vector-icons';
import { useData } from '@/lib/context/DataContext';
import { chatWithAI, ReplicateMessage } from '@/lib/api/replicate';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { migraines, dayData, loading: dataLoading } = useData();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I can help you understand your migraine patterns and answer questions about your data. What would you like to know?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);

  const quickReplies = [
    'When was my last migraine?',
    "What's my biggest trigger?",
    'Show me my patterns',
    'What should I track today?',
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isAIThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsAIThinking(true);

    try {
      // Build conversation history for context
      const conversationHistory: ReplicateMessage[] = messages
        .filter(m => m.sender !== 'ai' || m.id !== '1') // Exclude initial greeting
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        }));

      // Call real AI with user's migraine data
      const aiResponse = await chatWithAI(text, conversationHistory, {
        migraines,
        dayData,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAIThinking(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 pt-14 pb-4">
        <ThemedText className="text-3xl font-bold mb-1">
          AI Assistant
        </ThemedText>
        <ThemedText className="text-gray-600 dark:text-gray-400 text-sm">
          Ask anything about your migraines
        </ThemedText>
      </View>

      <ScrollView
        ref={scrollViewRef}
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
                    fontSize: 16,
                  }}
                >
                  {message.text}
                </ThemedText>
              </View>
            </View>
          ))}

          {/* AI Thinking Indicator */}
          {isAIThinking && (
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              <View
                style={{
                  maxWidth: '80%',
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <ActivityIndicator size="small" color={colors.primary} />
                <ThemedText style={{ color: colors.darkGray, fontSize: 14 }}>
                  Thinking...
                </ThemedText>
              </View>
            </View>
          )}
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
                paddingVertical: 14,
                paddingHorizontal: 4,
                maxHeight: 100,
                color: colors.text,
                fontSize: 16,
              },
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
            disabled={!inputText.trim() || isAIThinking}
            style={{ justifyContent: 'flex-end', paddingBottom: 12 }}
          >
            <MaterialIcons
              name="send"
              size={20}
              color={inputText.trim() && !isAIThinking ? colors.primary : colors.mediumGray}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
