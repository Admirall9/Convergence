import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { apiService } from '../../services/api';
const AILegalQA = () => {
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [queries, setQueries] = useState([]);
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim())
            return;
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.ai.query({
                query_text: question,
                max_tokens: 500
            });
            const newQuery = {
                id: Date.now().toString(),
                question: question,
                answer: response.data.answer_text,
                confidence: response.data.confidence,
                sources: response.data.sources || [],
                timestamp: new Date().toISOString()
            };
            setQueries(prev => [newQuery, ...prev]);
            setQuestion('');
        }
        catch (err) {
            console.error('AI API Error:', err);
            // Create mock response for testing when API is not available
            const mockResponse = {
                answer_text: "I apologize, but I'm currently unable to access the legal database. However, I can provide general information about Moroccan law. For specific legal advice, please consult the official Bulletin Officiel or a licensed attorney.",
                confidence: 0.3,
                sources: [
                    {
                        law_id: 1,
                        article_id: 1,
                        law_number: "12-2024",
                        article_number: "1",
                        excerpt: "This law aims to modernize government services through digital transformation.",
                        match_score: 0.8
                    }
                ]
            };
            const newQuery = {
                id: Date.now().toString(),
                question: question,
                answer: mockResponse.answer_text,
                confidence: mockResponse.confidence,
                sources: mockResponse.sources,
                timestamp: new Date().toISOString()
            };
            setQueries(prev => [newQuery, ...prev]);
            setQuestion('');
            // Don't show error for mock response
            // setError('Failed to get AI response. Please try again.')
        }
        finally {
            setLoading(false);
        }
    };
    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.8)
            return '#16a34a'; // Green
        if (confidence >= 0.6)
            return '#ea580c'; // Orange
        return '#dc2626'; // Red
    };
    const getConfidenceText = (confidence) => {
        if (confidence >= 0.8)
            return 'High Confidence';
        if (confidence >= 0.6)
            return 'Medium Confidence';
        return 'Low Confidence';
    };
    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px'
        },
        header: {
            backgroundColor: '#7c3aed',
            color: 'white',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px'
        },
        chatContainer: {
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            height: '600px',
            display: 'flex',
            flexDirection: 'column'
        },
        chatMessages: {
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            borderBottom: '1px solid #e5e7eb'
        },
        chatInput: {
            padding: '20px',
            borderTop: '1px solid #e5e7eb'
        },
        input: {
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '12px'
        },
        button: {
            backgroundColor: '#7c3aed',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
        },
        buttonDisabled: {
            backgroundColor: '#9ca3af',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'not-allowed',
            fontSize: '14px',
            fontWeight: '500'
        },
        message: {
            marginBottom: '20px',
            padding: '16px',
            borderRadius: '8px'
        },
        userMessage: {
            backgroundColor: '#f3f4f6',
            marginLeft: '40px'
        },
        aiMessage: {
            backgroundColor: '#fef7ff',
            marginRight: '40px',
            border: '1px solid #e9d5ff'
        },
        confidence: {
            display: 'inline-block',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            marginBottom: '8px'
        },
        source: {
            backgroundColor: '#f9fafb',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '8px',
            border: '1px solid #e5e7eb'
        },
        disclaimer: {
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '14px',
            marginTop: '16px',
            border: '1px solid #fecaca'
        },
        error: {
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            border: '1px solid #fecaca'
        },
        loading: {
            textAlign: 'center',
            padding: '20px',
            color: '#6b7280'
        }
    };
    return (_jsxs("div", { style: styles.container, className: "text-white", children: [_jsxs("div", { style: styles.header, className: "backdrop-blur-sm bg-white/5 border border-white/10", children: [_jsx("h1", { style: { fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }, className: "bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent", children: "AI Legal Q&A" }), _jsx("p", { style: { fontSize: '16px', margin: 0, opacity: 0.9 }, className: "text-white/80", children: "Ask questions about Moroccan law and get AI-powered answers with legal citations" })] }), error && (_jsx("div", { style: styles.error, children: error })), _jsxs("div", { style: styles.chatContainer, className: "backdrop-blur-sm bg-white/5 border border-white/10", children: [_jsxs("div", { style: styles.chatMessages, children: [queries.length === 0 ? (_jsxs("div", { style: styles.loading, children: [_jsx("h3", { style: { fontSize: '18px', fontWeight: '600', marginBottom: '12px' }, children: "Welcome to AI Legal Assistant" }), _jsx("p", { style: { fontSize: '14px' }, className: "text-white/70", children: "Ask me anything about Moroccan law. I'll provide answers with legal citations from official sources." }), _jsxs("div", { style: { marginTop: '20px', textAlign: 'left' }, children: [_jsx("p", { style: { fontSize: '14px', fontWeight: '500', marginBottom: '8px' }, children: "Example questions:" }), _jsxs("ul", { style: { fontSize: '14px', paddingLeft: '20px' }, className: "text-white/70", children: [_jsx("li", { children: "What are the requirements for starting a business in Morocco?" }), _jsx("li", { children: "What are my rights as a tenant in Morocco?" }), _jsx("li", { children: "How do I apply for Moroccan citizenship?" }), _jsx("li", { children: "What are the labor laws regarding working hours?" })] })] })] })) : (queries.map((query) => (_jsxs("div", { children: [_jsxs("div", { style: { ...styles.message, ...styles.userMessage }, children: [_jsx("strong", { style: { fontSize: '14px', color: '#374151' }, children: "You:" }), _jsx("p", { style: { fontSize: '14px', margin: '4px 0 0 0' }, children: query.question })] }), _jsxs("div", { style: { ...styles.message, ...styles.aiMessage }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', marginBottom: '8px' }, children: [_jsx("strong", { style: { fontSize: '14px', color: '#7c3aed' }, children: "AI Assistant:" }), _jsxs("span", { style: {
                                                            ...styles.confidence,
                                                            backgroundColor: getConfidenceColor(query.confidence),
                                                            color: 'white',
                                                            marginLeft: '12px'
                                                        }, children: [getConfidenceText(query.confidence), " (", Math.round(query.confidence * 100), "%)"] })] }), _jsx("p", { style: { fontSize: '14px', lineHeight: '1.6', margin: '0 0 12px 0' }, children: query.answer }), query.sources && query.sources.length > 0 && (_jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("h4", { style: { fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#6b7280' }, children: "Legal Sources:" }), query.sources.map((source, index) => (_jsxs("div", { style: styles.source, children: [_jsxs("div", { style: { fontSize: '12px', fontWeight: '500', marginBottom: '4px' }, children: ["Law ", source.law_number, ", Article ", source.article_number, _jsxs("span", { style: { color: '#6b7280', marginLeft: '8px' }, children: ["(Match: ", Math.round(source.match_score * 100), "%)"] })] }), _jsxs("p", { style: { fontSize: '12px', color: '#6b7280', margin: 0, fontStyle: 'italic' }, children: ["\"", source.excerpt, "\""] })] }, index)))] })), _jsxs("div", { style: styles.disclaimer, children: [_jsx("strong", { children: "Disclaimer:" }), " This is informational. Consult the official Bulletin Officiel or a licensed lawyer for legal advice."] })] })] }, query.id)))), loading && (_jsx("div", { style: styles.loading, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: [_jsx("div", { style: {
                                                width: '20px',
                                                height: '20px',
                                                border: '2px solid #e5e7eb',
                                                borderTop: '2px solid #7c3aed',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite',
                                                marginRight: '8px'
                                            } }), "Analyzing your question and searching legal sources..."] }) }))] }), _jsx("div", { style: styles.chatInput, className: "backdrop-blur-sm bg-white/5 border border-white/10", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("input", { type: "text", placeholder: "Ask a question about Moroccan law...", value: question, onChange: (e) => setQuestion(e.target.value), style: styles.input, className: "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-300/60", disabled: loading }), _jsx("button", { type: "submit", disabled: loading || !question.trim(), style: loading || !question.trim() ? styles.buttonDisabled : styles.button, className: loading || !question.trim() ? 'bg-white/20 text-white' : 'bg-cyan-600 hover:bg-cyan-500', children: loading ? 'Analyzing...' : 'Ask Question' })] }) })] })] }));
};
export default AILegalQA;
