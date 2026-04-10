import { useState, useRef, useEffect } from 'react';
import '../../styles/AiChat.css';
import { postAiChat } from '../../api/aiChat';

function AiChat({ data }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '你好！我是AI助手，有什么可以帮助你的吗？' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const res = await postAiChat({ "content": userMessage });
            console.log(res)
            const aiResponse = res.data || '抱歉，我暂时无法回答这个问题。';
            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        } catch (err) {
            console.error('AI Chat Error:', err);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '发送消息失败，请稍后重试。'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([
            { role: 'assistant', content: '你好！我是AI助手，有什么可以帮助你的吗？' }
        ]);
    };

    return (
        <div className="aichat-container">
            <div className="aichat-header">
                <span>AI 助手</span>
                <button className="aichat-clear" onClick={clearChat}>清空对话</button>
            </div>
            <div className="aichat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`aichat-message ${msg.role}`}>
                        <div className="aichat-avatar">
                            <img src={msg.role === 'user' ? data.avatarpath : "/image/Head.png"} alt="" className='aihead' />
                        </div>
                        <div className="aichat-content">
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="aichat-message assistant">
                        <div className="aichat-avatar"><img src="/image/Head.png" alt="" /></div>
                        <div className="aichat-content">
                            <span className="aichat-typing">正在思考中...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="aichat-input-area">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入消息..."
                    rows={1}
                />
                <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
                    发送
                </button>
            </div>
        </div>
    );
}

export default AiChat;
