# AI Configuration Guide

## External AI API Setup

The Convergence platform uses external AI APIs for the legal Q&A assistant. No local ML models are required.

### Supported Providers

1. **OpenAI (Recommended)**
2. **Anthropic Claude**

### Configuration Steps

#### Option 1: OpenAI Configuration

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Set the environment variable:
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```
3. Or create a `.env` file in the project root:
   ```
   OPENAI_API_KEY=your-api-key-here
   AI_PROVIDER=openai
   AI_MODEL=gpt-4
   ```

#### Option 2: Anthropic Configuration

1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. Set the environment variable:
   ```bash
   export ANTHROPIC_API_KEY="your-api-key-here"
   ```
3. Or create a `.env` file in the project root:
   ```
   ANTHROPIC_API_KEY=your-api-key-here
   AI_PROVIDER=anthropic
   AI_MODEL=claude-3-sonnet-20240229
   ```

### Available Models

#### OpenAI Models:
- `gpt-4` (Recommended for best quality)
- `gpt-3.5-turbo` (Faster, lower cost)

#### Anthropic Models:
- `claude-3-sonnet-20240229` (Recommended)
- `claude-3-haiku-20240307` (Faster, lower cost)

### Configuration Parameters

You can customize the AI behavior by setting these environment variables:

```bash
# AI Provider (openai or anthropic)
AI_PROVIDER=openai

# Model to use
AI_MODEL=gpt-4

# Maximum tokens in response
AI_MAX_TOKENS=1000

# Temperature (0.0 = deterministic, 1.0 = creative)
AI_TEMPERATURE=0.7
```

### Testing the AI Integration

Once configured, you can test the AI integration by:

1. Starting the backend server
2. Going to the AI Assistant page in the frontend
3. Asking a legal question

The AI will:
- Search the legal database for relevant context
- Use the external API to generate a response
- Provide citations from the legal documents

### Cost Considerations

- **OpenAI GPT-4**: Higher cost, best quality
- **OpenAI GPT-3.5-turbo**: Lower cost, good quality
- **Anthropic Claude**: Competitive pricing, excellent quality

### Security Notes

- Never commit API keys to version control
- Use environment variables or secure configuration files
- Consider rate limiting for production use
- Monitor API usage and costs
