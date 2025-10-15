import React, { useState, useRef, useEffect } from 'react';
import { 
  Send as SendIcon, 
  SmartToy as BotIcon, 
  Person as UserIcon, 
  OpenInNew as ExternalLinkIcon, 
  ThumbUp as ThumbsUpIcon, 
  ThumbDown as ThumbsDownIcon, 
  CircularProgress as LoaderIcon 
} from '@mui/icons-material';

interface AISource {
  law_id: number;
  article_id?: number;
  excerpt: string;
  score: number;
  law_number?: string;
  article_number?: string;
}

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sources?: AISource[];
  confidence?: number;
  timestamp: Date;
  query_id?: string;
}

interface AIChatProps {
  className?: string;
}

const AIChat: React.FC<AIChatProps> = ({ className = '' }) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/ai/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          query: userMessage.content,
          max_sources: 5,
          include_context: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.answer_text,
        sources: data.sources,
        confidence: data.confidence,
        timestamp: new Date(),
        query_id: data.query_id,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error while processing your question. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const submitFeedback = async (queryId: string, feedbackType: 'useful' | 'not_useful' | 'incorrect') => {
    try {
      await fetch('/api/v1/ai/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          query_id: queryId,
          feedback_type: feedbackType,
        }),
      });
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High confidence';
    if (confidence >= 0.6) return 'Medium confidence';
    return 'Low confidence';
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
          <BotIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Legal AI Assistant</h3>
          <p className="text-sm text-gray-600">Ask questions about Moroccan law</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <BotIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to the Legal AI Assistant
            </h4>
            <p className="text-gray-600 mb-4">
              Ask me questions about Moroccan laws, regulations, and legal procedures.
            </p>
            <div className="text-sm text-gray-500">
              <p>Example questions:</p>
              <ul className="mt-2 space-y-1">
                <li>• What are the requirements for starting a business?</li>
                <li>• How do I file a tax return?</li>
                <li>• What are my rights as an employee?</li>
              </ul>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl flex space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {message.type === 'user' ? (
                  <UserIcon className="w-4 h-4" />
                ) : (
                  <BotIcon className="w-4 h-4" />
                )}
              </div>
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Sources:</h5>
                    <div className="space-y-2">
                      {message.sources.map((source, index) => (
                        <div
                          key={index}
                          className="text-sm bg-white rounded p-2 border"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">
                              {source.law_number} - Article {source.article_number}
                            </span>
                            <span className="text-xs text-gray-500">
                              Score: {source.score.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs">
                            {source.excerpt}
                          </p>
                          <a
                            href={`/legal/laws/${source.law_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-1"
                          >
                            View Law <ExternalLinkIcon className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confidence and Feedback */}
                {message.type === 'assistant' && message.confidence !== undefined && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Confidence:</span>
                        <span className={`text-xs font-medium ${getConfidenceColor(message.confidence)}`}>
                          {getConfidenceText(message.confidence)} ({message.confidence.toFixed(2)})
                        </span>
                      </div>
                      {message.query_id && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => submitFeedback(message.query_id!, 'useful')}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Helpful"
                          >
                            <ThumbsUpIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => submitFeedback(message.query_id!, 'not_useful')}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Not helpful"
                          >
                            <ThumbsDownIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-2">
                  {formatDate(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-3xl flex space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                <BotIcon className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <LoaderIcon className="w-4 h-4" />
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about Moroccan law..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          <p>
            <strong>Disclaimer:</strong> This AI assistant provides informational responses based on available legal sources. 
            For official legal advice, please consult the Official Bulletin or a licensed lawyer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
