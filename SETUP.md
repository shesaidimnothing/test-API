# AI Assistant Setup Guide

This is a Claude.ai-inspired chat interface built with Next.js and TypeScript, ready for AI model integration.

## Features

- 🎨 Modern, responsive UI inspired by Claude.ai
- 💬 Real-time chat interface with message history
- 🌙 Dark/light mode support
- 📱 Mobile-friendly design
- ⚡ Auto-scrolling and smooth animations
- 🔧 Ready for AI model integration

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.openai.com/v1
NEXT_PUBLIC_API_KEY=your_api_key_here
NEXT_PUBLIC_DEFAULT_MODEL=gpt-3.5-turbo

# Optional: Override default settings
# NEXT_PUBLIC_MAX_TOKENS=2000
# NEXT_PUBLIC_TEMPERATURE=0.7
# NEXT_PUBLIC_SYSTEM_PROMPT="You are a helpful AI assistant."
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## AI Model Integration

The application is structured to easily integrate with various AI models:

### Supported Models

- OpenAI GPT-3.5/GPT-4
- Anthropic Claude
- Custom API endpoints

### Integration Steps

1. **Update API Configuration**: Modify `src/lib/config.ts` with your API settings
2. **Implement API Service**: Update `src/lib/api.ts` with your specific API calls
3. **Add Authentication**: Implement proper API key management
4. **Error Handling**: Add robust error handling for API failures

### Example API Integration

```typescript
// In src/lib/api.ts
export class AIService {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model || 'gpt-3.5-turbo',
        messages: request.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return {
      message: {
        id: Date.now().toString(),
        content: data.choices[0].message.content,
        role: "assistant",
        timestamp: new Date(),
      },
      usage: data.usage,
    };
  }
}
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main chat page
├── components/         # Reusable components
│   ├── ChatInput.tsx   # Message input component
│   ├── ChatMessage.tsx # Individual message component
│   ├── LoadingIndicator.tsx # Loading animation
│   └── WelcomeScreen.tsx # Welcome screen
├── lib/               # Utilities and configuration
│   ├── api.ts         # AI service and API integration
│   └── config.ts      # Application configuration
```

## Customization

### Styling

The application uses Tailwind CSS for styling. Key customization points:

- **Colors**: Update the color scheme in `src/app/globals.css`
- **Layout**: Modify component layouts in individual component files
- **Animations**: Customize animations in `src/app/globals.css`

### Features

Enable/disable features in `src/lib/config.ts`:

```typescript
FEATURES: {
  PERSIST_HISTORY: true,    // Save chat history
  TYPING_INDICATOR: true,   // Show typing animation
  MESSAGE_REACTIONS: true,  // Add reaction buttons
  FILE_UPLOAD: true,        // Enable file uploads
  VOICE_INPUT: true,        // Enable voice input
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- AWS Amplify
- Self-hosted

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own AI applications!
