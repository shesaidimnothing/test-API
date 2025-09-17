# Ollama Integration Setup

This project is now configured to work with Ollama, a local AI model server. Follow these steps to get it running:

## Prerequisites

1. **Install Ollama**: Download and install Ollama from [https://ollama.ai](https://ollama.ai)

2. **Start Ollama Server**: 
   ```bash
   ollama serve
   ```

3. **Pull a Model**: Download a model (e.g., llama2):
   ```bash
   ollama pull llama2
   ```

## Configuration

The application is configured to connect to Ollama at `http://127.0.0.1:11434` by default.

### Environment Variables (Optional)

You can set these environment variables to customize the setup:

- `OLLAMA_HOST`: Ollama server URL (default: `http://127.0.0.1:11434`)
- `NEXT_PUBLIC_DEFAULT_MODEL`: Default model to use (default: `llama2`)

Create a `.env.local` file in the project root:

```env
OLLAMA_HOST=http://127.0.0.1:11434
NEXT_PUBLIC_DEFAULT_MODEL=llama2
```

## Available Models

The following Ollama models are pre-configured:

- `llama2` (default)
- `llama3`
- `codellama`
- `mistral`
- `neural-chat`
- `starcoder`

To use a different model, either:
1. Set the `NEXT_PUBLIC_DEFAULT_MODEL` environment variable
2. Or modify the `DEFAULT_MODEL` in `src/lib/config.ts`

## Running the Application

1. Start the Next.js development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Start chatting with your local AI model!

## Troubleshooting

### "Failed to connect to Ollama API" Error

- Make sure Ollama is running: `ollama serve`
- Check that the model is downloaded: `ollama list`
- Verify the Ollama server is accessible: `curl http://127.0.0.1:11434/api/tags`

### CORS Issues

The application uses an API route (`/api/ollama`) to proxy requests to Ollama, which should prevent CORS issues. If you still encounter problems, you can:

1. Configure Ollama CORS settings
2. Or modify the `useApiRoute` parameter in the AIService constructor

## API Structure

The integration uses the Ollama Chat API:

- **Endpoint**: `POST /api/chat`
- **Request Format**: Standard chat completion format
- **Response Format**: Ollama chat response format

The application automatically handles:
- Message formatting
- Error handling
- Token counting
- Response streaming (disabled by default)
