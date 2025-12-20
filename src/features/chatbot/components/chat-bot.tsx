'use client';

import ReactMarkdown from 'react-markdown';
import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, Bot } from 'lucide-react';
import type { ChatMessage } from '../types/chat-data.type';
import { chatbotService } from '../services/chatbot.services';

import chatbot from '@/assets/chatbot.png';

export default function AIChatSidebar() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(400); // Default width of the sidebar
  const isDragging = useRef(false); // Track dragging state
  const sidebarRef = useRef<HTMLDivElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage({ message: userMsg.content });

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.chatbotReply || 'Xin lỗi, tôi không nhận được phản hồi.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: 'Hệ thống đang bận, vui lòng thử lại sau.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle drag to resize sidebar
  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = 'ew-resize';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.current) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 300 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = 'default';
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* --- FLOATING BUTTON --- */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-transform hover:scale-110 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 overflow-hidden ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <img src={chatbot} alt='Chatbot' className='scale-150 w-10 h-10 rounded-full object-cover object-top ' />
      </button>

      {/* Main Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed bottom-0 right-0 top-0 z-50 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* HEADER */}
        <div className='flex items-center justify-between border-b border-gray-100 bg-emerald-600 p-4 text-white'>
          <div className='flex items-center gap-2'>
            <div className='rounded-full bg-white/20 p-1.5'>
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className='text-lg font-semibold'>Trợ lý AI</h2>
              <p className='text-xs text-emerald-100'>SproutVR - Phân tích dữ liệu</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className='rounded-full p-1 hover:bg-white/20 transition-colors'>
            <X size={20} />
          </button>
        </div>

        {/* CHAT AREA */}
        <div className='flex h-[calc(100%-130px)] flex-col gap-4 overflow-y-auto bg-gray-50 p-4 pb-20'>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`flex max-w-[85%] items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-white border-gray-200 text-gray-600'
                      : 'bg-emerald-100 border-emerald-200 text-emerald-600'
                  }`}
                >
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={16} />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`relative rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className='whitespace-pre-wrap leading-relaxed'>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </p>
                  <span
                    className={`mt-1 block text-[10px] ${msg.role === 'user' ? 'text-emerald-200' : 'text-gray-400'}`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className='flex justify-start'>
              <div className='flex items-end gap-2'>
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600'>
                  <Bot size={16} />
                </div>
                <div className='rounded-2xl rounded-bl-none border border-gray-100 bg-white px-4 py-3 shadow-sm'>
                  <div className='flex gap-1'>
                    <span className='h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.3s]'></span>
                    <span className='h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.15s]'></span>
                    <span className='h-2 w-2 animate-bounce rounded-full bg-emerald-400'></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* FOOTER (INPUT) */}
        <div className='absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-4'>
          <div className='relative flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-2 py-2 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-500 transition-all'>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Hỏi về tiến độ lớp 12A1...'
              className='flex-1 resize-none bg-transparent px-2 text-sm text-gray-700 placeholder-gray-400 outline-none max-h-32 overflow-y-auto'
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className='rounded-lg bg-emerald-600 p-2 text-white transition-colors hover:bg-emerald-700 disabled:bg-gray-300'
            >
              <Send size={18} />
            </button>
          </div>
          <div className='mt-2 text-center text-[10px] text-gray-400'>Powered by Google Dialogflow & SproutVR</div>
        </div>

        {/* Drag Handle */}
        <div
          onMouseDown={handleMouseDown}
          className='absolute top-0 left-0 h-full w-2 cursor-ew-resize bg-transparent'
        />
      </div>
    </>
  );
}
