import OpenAI from 'openai';

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

// Conversation history for context
let conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

export const generateAIResponse = async (message: string, chatroomId: string): Promise<string> => {
  try {
    // Add user message to conversation history
    conversationHistory.push({ role: 'user', content: message });
    
    // Keep only last 10 messages for context (to manage token limits)
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are Gemini, a helpful and friendly AI assistant. You provide thoughtful, accurate, and engaging responses. Keep your responses conversational and helpful. If you don't know something, admit it honestly.`
        },
        ...conversationHistory
      ],
      max_tokens: 500,
      temperature: 0.7,
      stream: false
    });

    const aiResponse = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response right now.";
    
    // Add AI response to conversation history
    conversationHistory.push({ role: 'assistant', content: aiResponse });
    
    return aiResponse;
  } catch (error) {
    console.error('AI API Error:', error);
    
    // Fallback responses for when API fails
    const fallbackResponses = [
      "I'm having trouble connecting right now. Could you try again?",
      "Sorry, I'm experiencing some technical difficulties. Please retry your message.",
      "I'm temporarily unavailable. Please try again in a moment.",
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};

// Alternative: Google Gemini API implementation
export const generateGeminiResponse = async (message: string): Promise<string> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: message
          }]
        }]
      })
    });

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || "I couldn't generate a response right now.";
  } catch (error) {
    console.error('Gemini API Error:', error);
    return "I'm having trouble connecting right now. Could you try again?";
  }
};

// Alternative: Anthropic Claude API implementation
export const generateClaudeResponse = async (message: string): Promise<string> => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    return data.content[0]?.text || "I couldn't generate a response right now.";
  } catch (error) {
    console.error('Claude API Error:', error);
    return "I'm having trouble connecting right now. Could you try again?";
  }
};

// Clear conversation history for new chatrooms
export const clearConversationHistory = () => {
  conversationHistory = [];
};