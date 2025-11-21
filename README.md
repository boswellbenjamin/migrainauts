# Migrainauts

An AI-powered migraine prediction and prevention app built during a hackathon. Track your migraines, discover patterns, and receive intelligent alerts before migraines occur.

## Core Features

### Smart Pattern Detection

- AI-powered analysis of your migraine triggers
- Detects patterns based on day of week, time of day, and lifestyle factors
- Confidence scoring for each identified pattern

### Predictive Alerts

- **Migraine Risk Detection**: Get warnings 2-4 hours before expected migraines
- **Early Pattern Warning**: Alerts 6-8 hours before when triggers are active
- **Positive Reinforcement**: Celebrate when you break your patterns
- Customizable notification preferences with Do Not Disturb support

### Comprehensive Tracking

- Log migraines with start/end times and severity
- Track lifestyle factors: activity, sleep, water intake, stress levels
- Daily insights dashboard showing patterns and trends

### AI Chat Assistant

- Get personalized advice about your migraine patterns
- Powered by Replicate AI integration

### Relivia Device Support

- Ready for integration with Relivia device
- Device pairing and usage tracking

## Tech Stack

- **Frontend**: React Native + Expo (iOS, Android, Web)
- **UI**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context API
- **Storage**: AsyncStorage (local device storage)
- **AI**: Replicate API integration
- **Notifications**: Expo Notifications API

## Getting Started

### Prerequisites

- Node.js 16+
- Expo CLI: `npm install -g expo-cli`

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/migrainauts.git
cd migrainauts

# Install dependencies
npm install

# Start the app
npm start

# Run on iOS/Android/Web
npm run ios     # iOS simulator
npm run android # Android emulator
npm run web     # Web browser
```

## Key Screens

| Screen            | Purpose                                                         |
| ----------------- | --------------------------------------------------------------- |
| **Dashboard**     | Overview of today's tracking and quick access to common actions |
| **Track**         | Log migraines and daily lifestyle factors                       |
| **Insights**      | View pattern detection results and historical data              |
| **Chat**          | Get AI-powered personalized advice                              |
| **Notifications** | View all alerts with detailed explanations                      |
| **Settings**      | Configure notification preferences                              |

## How It Works

1. **Log Your Data**: Track migraines and daily factors (sleep, activity, water intake, stress)
2. **AI Analysis**: The app analyzes your data to identify migraine patterns
3. **Smart Alerts**: Receive notifications when conditions match your patterns
4. **Prevention**: Act on suggestions to prevent or minimize migraines

## Development

- Built with **TypeScript** for type safety
- **Expo Router** for file-based routing
- **TailwindCSS** for styling
- Clean architecture with services, hooks, and context providers

## Notes

- This is a hackathon project with room for enhancement
- All data is stored locally on device (no cloud sync currently)
- Pattern detection runs on-device without external API calls
- Notifications respect device notification permissions

## Contributing

Contributions welcome! Feel free to open issues and pull requests.

## License

MIT License. Feel free to use this project as you wish.

Built during a hackathon to help people predict and prevent migraines before they happen.
