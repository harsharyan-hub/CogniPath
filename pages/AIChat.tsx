import React, { useState, useEffect, useRef } from 'react';
import { getTutorResponse, getCounsellorResponse } from '../services/geminiService';
import { Message, Feedback, Attachment } from '../types';
import { Send, User, Bot, Loader2, Sparkles, ThumbsUp, ThumbsDown, Paperclip, X, FileText } from 'lucide-react';

interface AIChatProps {
  mode: 'tutor' | 'counsellor';
}

const AIChat: React.FC<AIChatProps> = ({ mode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storageKey = `scholar_chat_${mode}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      // Initial greeting
      const initialMsg: Message = {
        id: 'init',
        role: 'model',
        text: mode === 'tutor' 
          ? "Hello! I'm your AI Tutor. What topic would you like to learn about today? I can explain things from the basics. You can also upload images of questions."
          : "Hi there, I'm Mira. I'm here to listen. How have you been feeling lately? You can share anything with me.",
        timestamp: Date.now()
      };
      setMessages([initialMsg]);
    }
  }, [mode, storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
    if (!activeFeedbackId) {
      scrollToBottom();
    }
  }, [messages, storageKey, activeFeedbackId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = (event.target?.result as string).split(',')[1];
        setAttachment({
          name: file.name,
          mimeType: file.type,
          data: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachment) || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
      attachment: attachment ? { ...attachment } : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachment(null);
    setIsLoading(true);

    try {
      // Format history for Gemini
      const history = messages.slice(-20).map(m => {
        const parts: any[] = [];
        if (m.attachment) {
           parts.push({
             inlineData: {
               mimeType: m.attachment.mimeType,
               data: m.attachment.data
             }
           });
        }
        if (m.text) {
          parts.push({ text: m.text });
        }
        return {
          role: m.role,
          parts: parts
        };
      });

      const responseText = mode === 'tutor' 
        ? await getTutorResponse(history, userMsg.text, userMsg.attachment)
        : await getCounsellorResponse(history, userMsg.text);

      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: 'model',
        text: responseText || "I apologize, I'm having trouble connecting right now.",
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (msgId: string, isHelpful: boolean, comment?: string) => {
    const newFeedback: Feedback = { isHelpful, comment };
    
    setMessages(prev => prev.map(msg => 
      msg.id === msgId ? { ...msg, feedback: newFeedback } : msg
    ));
    
    setActiveFeedbackId(null);
    setFeedbackComment('');
  };

  const themeColor = mode === 'tutor' ? 'indigo' : 'rose';
  const Icon = mode === 'tutor' ? Sparkles : Bot;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`p-4 border-b border-slate-100 bg-${themeColor}-50 flex items-center gap-3`}>
        <div className={`w-10 h-10 rounded-full bg-${themeColor}-100 flex items-center justify-center text-${themeColor}-600`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 capitalize">{mode === 'tutor' ? 'AI Personal Tutor' : 'Empathic Counsellor'}</h1>
          <p className="text-xs text-slate-500">
            {mode === 'tutor' ? 'Expert in simplifying complex topics' : 'Here to listen and support you'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className="group">
            <div
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${msg.role === 'user' ? 'bg-slate-200' : `bg-${themeColor}-100 text-${themeColor}-600`}
              `}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-slate-600" /> : <Icon className="w-5 h-5" />}
              </div>
              
              <div className={`
                max-w-[85%] relative
                ${msg.role === 'user' ? 'items-end flex flex-col' : 'items-start flex flex-col'}
              `}>
                <div className={`
                  p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap overflow-hidden
                  ${msg.role === 'user' 
                    ? 'bg-slate-800 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}
                `}>
                  {msg.attachment && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                      {msg.attachment.mimeType.startsWith('image') ? (
                        <img 
                          src={`data:${msg.attachment.mimeType};base64,${msg.attachment.data}`} 
                          alt="Attachment" 
                          className="max-w-full h-auto max-h-60 object-contain bg-black/20"
                        />
                      ) : (
                         <div className="flex items-center gap-2 p-2 bg-white/10">
                            <FileText className="w-5 h-5" />
                            <span className="text-xs">{msg.attachment.name}</span>
                         </div>
                      )}
                    </div>
                  )}
                  {msg.text}
                </div>

                {/* Feedback UI for Bot Messages */}
                {msg.role === 'model' && (
                  <div className="mt-2 flex items-center gap-2">
                    {msg.feedback ? (
                      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                        <span className="font-medium">Feedback:</span>
                        {msg.feedback.isHelpful ? (
                          <span className="text-emerald-600 flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> Helpful</span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1"><ThumbsDown className="w-3 h-3" /> Not Helpful</span>
                        )}
                        {msg.feedback.comment && <span className="text-slate-500 max-w-[150px] truncate">- "{msg.feedback.comment}"</span>}
                      </div>
                    ) : (
                      <div className={`
                        flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        ${activeFeedbackId === msg.id ? 'opacity-100' : ''}
                      `}>
                        {activeFeedbackId === msg.id ? (
                          <div className="flex flex-col gap-2 p-3 bg-white border border-slate-200 shadow-lg rounded-xl z-10 min-w-[250px] animate-in fade-in slide-in-from-top-2">
                            <p className="text-xs font-semibold text-slate-700">Was this response helpful?</p>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleFeedback(msg.id, true, feedbackComment)}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-medium transition-colors"
                              >
                                <ThumbsUp className="w-3 h-3" /> Yes
                              </button>
                              <button 
                                onClick={() => handleFeedback(msg.id, false, feedbackComment)}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-medium transition-colors"
                              >
                                <ThumbsDown className="w-3 h-3" /> No
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="Any comments? (optional)"
                              value={feedbackComment}
                              onChange={(e) => setFeedbackComment(e.target.value)}
                              className="text-xs w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                              autoFocus
                            />
                            <button 
                              onClick={() => setActiveFeedbackId(null)}
                              className="text-xs text-slate-400 hover:text-slate-600 self-end"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-xs text-slate-400">Rate this response:</span>
                            <button 
                              onClick={() => { setActiveFeedbackId(msg.id); setFeedbackComment(''); }}
                              className="p-1 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded transition-colors"
                              title="Helpful"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => { setActiveFeedbackId(msg.id); setFeedbackComment(''); }}
                              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Not helpful"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm ml-12">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="capitalize">{mode === 'counsellor' ? 'Counsellor' : 'Tutor'} is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="relative flex items-end gap-2">
          {mode === 'tutor' && (
            <>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect} 
                accept="image/*,application/pdf"
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-3 rounded-xl transition-colors ${attachment ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                title="Attach image or PDF"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="flex-1 relative">
             {attachment && (
              <div className="absolute bottom-full mb-2 left-0 bg-slate-100 rounded-lg p-2 flex items-center gap-2 border border-slate-200 animate-in fade-in slide-in-from-bottom-1">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="text-xs text-slate-700 max-w-[150px] truncate">{attachment.name}</span>
                <button 
                  type="button" 
                  onClick={() => { setAttachment(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="hover:bg-slate-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'tutor' ? "Ask about a topic..." : "Share what's on your mind..."}
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          
          <button
            type="submit"
            disabled={(!input.trim() && !attachment) || isLoading}
            className={`
              p-3 rounded-xl transition-colors
              ${(input.trim() || attachment) && !isLoading ? `bg-${themeColor}-600 text-white hover:bg-${themeColor}-700` : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
            `}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;