# Gemini-Style Chat Application

A modern, responsive chat application with real-time AI integration.

## Features

- **Real-time AI Chat**: Integrated with OpenAI GPT, Google Gemini, or Anthropic Claude
- **OTP Authentication**: Phone-based login with country code selection
- **Chatroom Management**: Create, delete, and search chatrooms
- **Rich Chat Interface**: Image uploads, message copying, typing indicators
- **Responsive Design**: Mobile-first with dark mode support
- **Persistent Storage**: LocalStorage for offline data persistence

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure AI API

Choose one of the following AI providers:

#### Option A: OpenAI (Recommended)
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env.local`:
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

#### Option B: Google Gemini
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env.local`:
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
3. Update `src/components/chat/MessageInput.tsx` to use `generateGeminiResponse`

#### Option C: Anthropic Claude
1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. Add to `.env.local`:
```
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```
3. Update `src/components/chat/MessageInput.tsx` to use `generateClaudeResponse`

### 3. Start Development Server
```bash
npm run dev
```

## Important Security Notes

⚠️ **For Production**: The current setup uses API keys in the frontend for demo purposes. In a production environment:

1. **Use a Backend Proxy**: Never expose API keys in frontend code
2. **Implement Rate Limiting**: Prevent API abuse
3. **Add Authentication**: Secure your AI endpoints
4. **Use Environment Variables**: Store secrets securely

## Usage

1. **Login**: Enter your phone number and verify with any 6-digit OTP
2. **Create Chatroom**: Click "New Chat" to create a chatroom
3. **Start Chatting**: Send messages and get real-time AI responses
4. **Upload Images**: Click the image icon to share photos
5. **Copy Messages**: Hover over messages to copy them
6. **Search**: Use the search bar to find specific chatrooms

## Architecture

- **Frontend**: React + TypeScript + Vite
- **State Management**: Zustand with localStorage persistence
- **Styling**: Tailwind CSS with custom design system
- **Forms**: React Hook Form + Zod validation
- **AI Integration**: OpenAI/Gemini/Claude APIs
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## API Switching

To switch between AI providers, modify the import in `src/components/chat/MessageInput.tsx`:

```typescript
// For OpenAI (default)
import { generateAIResponse } from '../../utils/aiService';

// For Google Gemini
import { generateGeminiResponse as generateAIResponse } from '../../utils/aiService';

// For Anthropic Claude
import { generateClaudeResponse as generateAIResponse } from '../../utils/aiService';
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.