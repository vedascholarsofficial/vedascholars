'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { aiService } from '@/services/aiService';
import Button from '@/components/ui/Button';
import ReactMarkdown from 'react-markdown';

type Message = {
    role: 'user' | 'assistant' | 'system';
    text: string;
};

type Chat = {
    _id: string;
    title: string;
    updatedAt: string;
};

export default function VedaBotPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', text: 'Hello! I am VedaBot, your personal career and academic assistant. Start a new conversation below!' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Rename Modal State
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isAuthenticated) router.push('/login');
        else fetchChats();
    }, [isAuthenticated, router]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const fetchChats = async () => {
        try {
            const data = await aiService.getChats();
            setChats(data);
        } catch (e) {
            console.error("Failed loading chat history");
        }
    };

    const loadChat = async (id: string) => {
        if (isTyping) return;
        setActiveChatId(id);
        setMessages([]);
        try {
            const data = await aiService.getChatById(id);
            setMessages(data.messages || []);
        } catch (e) {
            setMessages([{ role: 'system', text: 'Failed to load chat history. Neural connection blocked.' }]);
        }
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleNewChat = () => {
        if (isTyping) return;
        setActiveChatId(null);
        setMessages([{ role: 'assistant', text: 'Hello! I am VedaBot. I am ready to evaluate your resume, analyze logic, or formulate new plans.' }]);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsTyping(true);

        try {
            const response = await aiService.sendMessage(userMsg, activeChatId);
            setMessages(prev => [...prev, { role: 'assistant', text: response.reply }]);
            
            // If it was a new chat, the backend returned a new chatId. We must snap to it.
            if (!activeChatId && response.chatId) {
                setActiveChatId(response.chatId);
                fetchChats(); // Refresh sidebar to show new chat
            }
        } catch (error: any) {
            setMessages(prev => [...prev, { 
                role: 'system', 
                text: error.response?.data?.message || 'Warning: Server lost connection to the core. Ensure your API token is mapped.' 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm("Permanently destroy this conversational thread?")) return;
        try {
            await aiService.deleteChat(id);
            if (activeChatId === id) handleNewChat();
            fetchChats();
        } catch(err) { alert("Deletion protocol failed."); }
    };

    const handleRenameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!renamingId || !newTitle.trim()) return;
        try {
            await aiService.renameChat(renamingId, newTitle);
            setRenamingId(null);
            fetchChats();
        } catch(err) { alert("Rename locked."); }
    };

    if (!isAuthenticated) return null;

    return (
        <section className="h-[calc(100vh-80px)] w-full bg-white flex overflow-hidden">
            
            {/* --- SIDEBAR CONFIGURATION --- */}
            <div className={`transition-all duration-300 z-20 flex-shrink-0 ${isSidebarOpen ? 'w-full md:w-72 lg:w-80 border-r border-slate-200 bg-[#0f172a]' : 'w-0 overflow-hidden'} absolute md:relative h-full`}>
                <div className="flex flex-col h-full w-full md:w-72 lg:w-80 min-w-[288px] text-white p-4">
                    
                    {/* Header Action */}
                    <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                        <Button onClick={handleNewChat} className="bg-[#8B2BB4] text-white hover:bg-[#742493] w-full font-bold flex items-center justify-center gap-2 py-3 rounded-xl transition-all shadow-md border-none">
                            <span className="text-xl">+</span> New Generation
                        </Button>
                    </div>

                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Knowledge Base History</p>
                    
                    {/* Chat History List */}
                    <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                        {chats.length === 0 && (
                            <p className="text-slate-500 text-sm px-2 mt-4 italic">No historical nodes found.</p>
                        )}
                        {chats.map(chat => (
                            <div key={chat._id} className="relative group">
                                <button 
                                    onClick={() => loadChat(chat._id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-sm flex items-center justify-between group-hover:bg-slate-800 ${activeChatId === chat._id ? 'bg-slate-800 border-l-[4px] border-[#8B2BB4] text-white' : 'text-slate-300 border-l-[4px] border-transparent'}`}
                                >
                                    <span className="truncate pr-12">{chat.title}</span>
                                </button>
                                
                                {/* CRUD Icons (Hover Reveal) */}
                                <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 ${activeChatId === chat._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity bg-slate-800 p-1 rounded-md`}>
                                    <button onClick={(e) => { e.stopPropagation(); setRenamingId(chat._id); setNewTitle(chat.title); }} className="text-slate-400 hover:text-[#8B2BB4] p-1" title="Rename Node">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button onClick={(e) => handleDelete(e, chat._id)} className="text-slate-400 hover:text-red-400 p-1" title="Eradicate">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Branding */}
                    <div className="mt-4 border-t border-slate-700 pt-4 flex items-center justify-center opacity-80">
                         <span className="bg-[#8B2BB4] text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] mr-2">VB</span>
                         <span className="text-xs font-bold tracking-widest text-[#8B2BB4]">GEMINI NEURAL LINK</span>
                    </div>
                </div>
            </div>

            {/* --- MAIN CHAT ENGINE --- */}
            <div className="flex-1 flex flex-col h-full bg-white relative w-full">
                
                {/* Mobile Toggle & Header Ribbon */}
                <div className="h-16 border-b border-slate-200 bg-white flex items-center px-4 justify-between shrink-0 shadow-sm z-10">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors md:mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </button>
                    <h2 className="font-heading font-bold text-slate-800 text-lg flex-1 text-center md:text-left truncate px-4">
                        {activeChatId ? chats.find(c => c._id === activeChatId)?.title || "Active Neural Session" : "Deploying New Intelligence"}
                    </h2>
                </div>

                {/* Conversation Canvas */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 scroll-smooth">
                    <div className="max-w-4xl mx-auto space-y-8 pb-10">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                
                                {msg.role !== 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-[#24112D] flex items-center justify-center shrink-0 mt-2 mr-4 shadow-md border border-[#8B2BB4]">
                                        <span className="text-[#8B2BB4] text-[10px] font-black">VB</span>
                                    </div>
                                )}

                                <div className={`max-w-[100%] sm:max-w-[85%] text-[15px] leading-relaxed break-words overflow-hidden ${
                                    msg.role === 'user' 
                                        ? 'bg-slate-100 p-5 rounded-3xl rounded-tr-sm text-slate-800 font-medium' 
                                        : msg.role === 'system'
                                        ? 'bg-red-50 text-red-700 border border-red-200 rounded-2xl p-5 w-full shadow-sm'
                                        : 'markdown-wrapper flex-1 pr-4' // Transparent background for bot (like ChatGPT)
                                }`}>
                                    {msg.role === 'user' || msg.role === 'system' ? (
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                    ) : (
                                        <ReactMarkdown 
                                            components={{
                                                p: ({node, ...props}) => <p className="mb-4 last:mb-0 text-slate-800 leading-relaxed" {...props} />,
                                                strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
                                                ul: ({node, ...props}) => <ul className="list-disc ml-5 mb-4 space-y-2 marker:text-slate-400" {...props} />,
                                                ol: ({node, ...props}) => <ol className="list-decimal ml-5 mb-4 space-y-2 marker:text-slate-400" {...props} />,
                                                li: ({node, ...props}) => <li className="leading-relaxed text-slate-800" {...props} />,
                                                h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3 mt-4 text-[#24112D]" {...props} />,
                                                h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-4 text-[#24112D]" {...props} />,
                                                h3: ({node, ...props}) => <h3 className="font-bold mb-2 mt-3 text-[#24112D]" {...props} />,
                                                code: ({node, ...props}) => <code className="bg-slate-100 px-2 py-1 rounded text-sm text-pink-600 font-mono" {...props} />
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {isTyping && (
                            <div className="flex justify-start items-center gap-4 text-slate-400 font-medium mt-4">
                                <div className="w-8 h-8 rounded-full bg-[#24112D] flex items-center justify-center shrink-0 shadow-md border border-[#8B2BB4] animate-pulse">
                                    <span className="text-[#8B2BB4] text-[10px] font-black">VB</span>
                                </div>
                                <div className="flex gap-2 items-center h-4">
                                    <div className="w-2 h-2 bg-[#8B2BB4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-[#8B2BB4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-[#8B2BB4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Command Input Dock */}
                <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                    <div className="max-w-4xl mx-auto relative">
                        <form onSubmit={handleSend} className="relative flex items-center shadow-[0_0_25px_rgba(0,0,0,0.05)] rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors focus-within:border-[#8B2BB4] focus-within:shadow-[0_0_20px_rgba(139,43,180,0.15)] overflow-hidden">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend(e);
                                    }
                                }}
                                placeholder="Message VedaBot (Press Enter to transmit)..."
                                disabled={isTyping}
                                rows={1}
                                className="w-full pl-6 pr-16 py-5 outline-none resize-none text-[15px] font-medium disabled:opacity-60 bg-transparent placeholder:text-slate-400 max-h-32 overflow-y-auto"
                                style={{ minHeight: '64px' }}
                            />
                            <button 
                                type="submit" 
                                disabled={isTyping || !input.trim()}
                                className="absolute right-3 bottom-3 top-3 bg-[#24112D] text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#32163E] disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 -rotate-90"><path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" /></svg>
                            </button>
                        </form>
                        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3 mb-1">
                            VedaBot can make mistakes. Verify critical logic.
                        </p>
                    </div>
                </div>

            </div>

            {/* Rename Modal Portal Overlay */}
            {renamingId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <form onSubmit={handleRenameSubmit} className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Rename Session Title</h3>
                        <input 
                            autoFocus
                            required
                            type="text" 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 outline-none font-medium focus:border-[#8B2BB4]"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                        />
                        <div className="flex gap-3 justify-end">
                            <button type="button" onClick={() => setRenamingId(null)} className="px-5 py-2 text-slate-500 font-bold text-sm tracking-wide">Cancel</button>
                            <button type="submit" className="px-5 py-2 bg-[#8B2BB4] text-white rounded-lg font-bold text-sm tracking-wide shadow-md hover:bg-[#742493] transition-colors">Save Change</button>
                        </div>
                    </form>
                </div>
            )}
            
        </section>
    );
}
