import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Send as SendIcon, SmartToy as BotIcon, Person as UserIcon, OpenInNew as ExternalLinkIcon, ThumbUp as ThumbsUpIcon, ThumbDown as ThumbsDownIcon } from '@mui/icons-material';
const AIChat = ({ className = '' }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    // Scroll to bottom when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);
    const sendMessage = async () => {
        if (!input.trim() || loading)
            return;
        const userMessage = {
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
            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: data.answer_text,
                sources: data.sources,
                confidence: data.confidence,
                timestamp: new Date(),
                query_id: data.query_id,
            };
            setMessages(prev => [...prev, assistantMessage]);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: 'I apologize, but I encountered an error while processing your question. Please try again.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    const submitFeedback = async (queryId, feedbackType) => {
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
        }
        catch (err) {
            console.error('Failed to submit feedback:', err);
        }
    };
    const formatDate = (date) => {
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.8)
            return 'text-green-600';
        if (confidence >= 0.6)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    const getConfidenceText = (confidence) => {
        if (confidence >= 0.8)
            return 'High confidence';
        if (confidence >= 0.6)
            return 'Medium confidence';
        return 'Low confidence';
    };
    return (_jsxs("div", { className: `flex flex-col h-full bg-white rounded-lg shadow-sm border ${className}`, children: [_jsxs("div", { className: "flex items-center space-x-3 p-4 border-b border-gray-200", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full", children: _jsx(BotIcon, { className: "w-6 h-6 text-blue-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Legal AI Assistant" }), _jsx("p", { className: "text-sm text-gray-600", children: "Ask questions about Moroccan law" })] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.length === 0 && (_jsxs("div", { className: "text-center py-8", children: [_jsx(BotIcon, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h4", { className: "text-lg font-medium text-gray-900 mb-2", children: "Welcome to the Legal AI Assistant" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Ask me questions about Moroccan laws, regulations, and legal procedures." }), _jsxs("div", { className: "text-sm text-gray-500", children: [_jsx("p", { children: "Example questions:" }), _jsxs("ul", { className: "mt-2 space-y-1", children: [_jsx("li", { children: "\u2022 What are the requirements for starting a business?" }), _jsx("li", { children: "\u2022 How do I file a tax return?" }), _jsx("li", { children: "\u2022 What are my rights as an employee?" })] })] })] })), messages.map((message) => (_jsx("div", { className: `flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-3xl flex space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`, children: [_jsx("div", { className: `flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600'}`, children: message.type === 'user' ? (_jsx(UserIcon, { className: "w-4 h-4" })) : (_jsx(BotIcon, { className: "w-4 h-4" })) }), _jsxs("div", { className: `rounded-lg px-4 py-2 ${message.type === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'}`, children: [_jsx("div", { className: "whitespace-pre-wrap", children: message.content }), message.sources && message.sources.length > 0 && (_jsxs("div", { className: "mt-3 pt-3 border-t border-gray-200", children: [_jsx("h5", { className: "text-sm font-medium text-gray-700 mb-2", children: "Sources:" }), _jsx("div", { className: "space-y-2", children: message.sources.map((source, index) => (_jsxs("div", { className: "text-sm bg-white rounded p-2 border", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsxs("span", { className: "font-medium", children: [source.law_number, " - Article ", source.article_number] }), _jsxs("span", { className: "text-xs text-gray-500", children: ["Score: ", source.score.toFixed(2)] })] }), _jsx("p", { className: "text-gray-600 text-xs", children: source.excerpt }), _jsxs("a", { href: `/legal/laws/${source.law_id}`, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-1", children: ["View Law ", _jsx(ExternalLinkIcon, { className: "w-3 h-3 ml-1" })] })] }, index))) })] })), message.type === 'assistant' && message.confidence !== undefined && (_jsx("div", { className: "mt-3 pt-3 border-t border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-xs text-gray-500", children: "Confidence:" }), _jsxs("span", { className: `text-xs font-medium ${getConfidenceColor(message.confidence)}`, children: [getConfidenceText(message.confidence), " (", message.confidence.toFixed(2), ")"] })] }), message.query_id && (_jsxs("div", { className: "flex space-x-1", children: [_jsx("button", { onClick: () => submitFeedback(message.query_id, 'useful'), className: "p-1 text-gray-400 hover:text-green-600 transition-colors", title: "Helpful", children: _jsx(ThumbsUpIcon, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => submitFeedback(message.query_id, 'not_useful'), className: "p-1 text-gray-400 hover:text-red-600 transition-colors", title: "Not helpful", children: _jsx(ThumbsDownIcon, { className: "w-4 h-4" }) })] }))] }) })), _jsx("div", { className: "text-xs text-gray-500 mt-2", children: formatDate(message.timestamp) })] })] }) }, message.id))), loading && (_jsx("div", { className: "flex justify-start", children: _jsxs("div", { className: "max-w-3xl flex space-x-3", children: [_jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center", children: _jsx(BotIcon, { className: "w-4 h-4" }) }), _jsx("div", { className: "bg-gray-100 rounded-lg px-4 py-2", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" }), _jsx("span", { className: "text-gray-600", children: "Thinking..." })] }) })] }) })), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "p-4 border-t border-gray-200", children: [error && (_jsx("div", { className: "mb-3 p-3 bg-red-50 border border-red-200 rounded-md", children: _jsx("p", { className: "text-sm text-red-600", children: error }) })), _jsxs("div", { className: "flex space-x-2", children: [_jsx("input", { ref: inputRef, type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: handleKeyPress, placeholder: "Ask a question about Moroccan law...", className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", disabled: loading }), _jsx("button", { onClick: sendMessage, disabled: !input.trim() || loading, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: _jsx(SendIcon, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "mt-2 text-xs text-gray-500", children: _jsxs("p", { children: [_jsx("strong", { children: "Disclaimer:" }), " This AI assistant provides informational responses based on available legal sources. For official legal advice, please consult the Official Bulletin or a licensed lawyer."] }) })] })] }));
};
export default AIChat;
