import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMic, FiUpload, FiRepeat, FiSend, FiCpu, FiActivity } from 'react-icons/fi';
import ReactMarkdown from "react-markdown";
import { routerService } from "@/services/RouterService";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [isVoiceResponse, setIsVoiceResponse] = useState(false);
  const [selectedModel, setSelectedModel] = useState('auto');
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "مرحباً، أنا نظام **OpenClaw Core** (الإصدار 9.0).\n\nأنا لست مجرد واجهة دردشة، بل أنا **نظام تشغيل متكامل** قادر على:\n- إدارة الملفات والأوامر (Terminal).\n- تحليل المشاريع البرمجية وبنائها.\n- استخراج البيانات بصمت (WORM-AI).\n- التبديل الذكي بين النماذج السحابية والمحلية.\n\nكيف يمكنني مساعدتك اليوم؟" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [liveLog, setLiveLog] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<{ text: string, color: string }>({ text: "IDLE", color: "gray" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isIdle, setIsIdle] = useState(true);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = () => {
    setIsIdle(false);
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    idleTimeoutRef.current = setTimeout(() => {
      setIsIdle(true);
    }, 60000); // 60 seconds
  };

  useEffect(() => {
    resetIdleTimer();
    const events = ['mousemove', 'keydown', 'click', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetIdleTimer));
    
    return () => {
      events.forEach(event => window.removeEventListener(event, resetIdleTimer));
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, liveLog]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessageText = input;
    const userMessage: Message = { role: "user", content: userMessageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // 1. إظهار رسالة "جاري التفكير..." في الواجهة
    setLiveLog("Thinking...");
    setIsTyping(true);
    setSystemStatus({ text: "PROCESSING", color: "orange" });

    try {
      // 2. إرسال الطلب للنواة (OpenClaw Core)
      const response = await fetch('/api/process-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userMessageText, 
          selectedModel: selectedModel, // النموذج المختار من القائمة
          projectPath: "default", // المشروع المختار من سطح المكتب
          stream: true // تفعيل البث المباشر (Streaming)
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantMessage = "";

      // إضافة رسالة فارغة للمساعد ليتم تعبئتها تدريجياً
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      setIsTyping(false); // إيقاف تأثير "..." لأننا بدأنا نستقبل النص
      setLiveLog("Streaming...");

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') continue;
              
              try {
                const data = JSON.parse(dataStr);
                if (data.error) {
                  throw new Error(data.error);
                }
                if (data.text) {
                  assistantMessage += data.text;
                  // تحديث آخر رسالة بالنص الجديد
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = assistantMessage;
                    return newMessages;
                  });
                }
              } catch (e: any) {
                if (e.message === dataStr || !e.message) {
                   console.error("Error parsing stream data:", e);
                } else {
                   throw e; // Re-throw the API error to be caught by the outer try-catch
                }
              }
            }
          }
        }
      }
      
      if (assistantMessage.includes("OFFLINE")) {
        setSystemStatus({ text: "OFFLINE - Keys Missing", color: "red" });
      } else {
        setSystemStatus({ text: "ONLINE", color: "#0ea5e9" }); // cyan-500
      }
    } catch (error: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: error.message || "عذراً، حدث خطأ أثناء معالجة طلبك." }]);
      setSystemStatus({ text: "OFFLINE - Error", color: "red" });
    } finally {
      setIsTyping(false);
      setLiveLog(null);
    }
  };

  const panelVariants = {
    hidden: { opacity: 0, x: 50, rotateY: 15 },
    visible: { opacity: 1, x: 0, rotateY: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="h-full bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col items-center justify-between p-6 relative" dir="rtl">
      
      {/* 2. Main Chat Area - منطقة المحادثة */}
      <main className="flex-1 w-full max-w-4xl flex flex-col overflow-hidden py-6 relative z-10">
        <div className="flex-1 overflow-y-auto pr-4 space-y-4 no-scrollbar" ref={scrollRef}>
          {messages.map((msg, idx) => (
            msg.role === "user" ? (
              <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex w-full justify-start">
                <div className="text-right text-slate-200 text-sm leading-relaxed max-w-2xl">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={idx}
                initial="hidden" animate="visible" variants={panelVariants}
                className="flex w-full justify-end" dir="ltr"
              >
                <div className="text-left text-cyan-300 text-sm leading-relaxed prose prose-invert prose-sm max-w-3xl">
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )
          ))}
          
          {isTyping && (
            <motion.div 
              initial="hidden" animate="visible" variants={panelVariants}
              className="flex w-full justify-end" dir="ltr"
            >
              <div className="flex items-center h-10">
                <span className="animate-pulse text-cyan-400 text-2xl tracking-widest leading-none">...</span>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* 4. Controls - لوحة التحكم السفلى */}
      <footer className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-4 shrink-0 relative z-10">
        
        {/* Sidebar Actions */}
        <AnimatePresence>
          {isIdle && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="hidden lg:flex col-span-2 flex-col space-y-4"
            >
              {[
                { icon: <FiMic />, label: 'Voice / صوت' },
                { icon: <FiUpload />, label: 'Upload / رفع' },
                { icon: <FiRepeat />, label: 'Provider / مزود' }
              ].map((item, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-3 rounded-xl bg-black/40 border border-slate-800 hover:border-cyan-500/50 transition-all group">
                  <span className="text-lg text-slate-400 group-hover:text-cyan-400">{item.icon}</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-200">{item.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar */}
        <div className={`col-span-1 relative transition-all duration-500 ${isIdle ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          <AnimatePresence>
            {liveLog && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 w-max"
              >
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono text-cyan-300">{liveLog}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="bg-black/60 border border-slate-700 rounded-2xl p-2 flex items-center shadow-inner group focus-within:border-cyan-500/50 transition-all gap-2">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-slate-900/80 border border-slate-700 text-cyan-400 text-xs font-mono rounded-xl px-3 py-3 outline-none focus:border-cyan-500/50 appearance-none cursor-pointer shrink-0"
              dir="ltr"
            >
              <option value="auto">🧠 Auto Intelligence</option>
              <option value="gemini-3.1-pro-preview">✨ Gemini 3.1 Pro</option>
              <option value="gemini-3-flash-preview">✨ Gemini 3 Flash (Free)</option>
              <option value="gemma-3-4b-it-abliterated">⚡ Gemma 3 4B (Local)</option>
              <option value="llama3">🦙 Llama 3 (Local)</option>
              <option value="gpt-4">☁️ GPT-4 (Cloud)</option>
            </select>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتب رسالتك... / Type your message..." 
              className="bg-transparent flex-1 outline-none text-sm placeholder:text-slate-600 px-2"
            />
            <button 
              onClick={handleSend}
              className="p-3 bg-cyan-600/20 border border-cyan-500/30 rounded-xl text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)] shrink-0"
            >
              <FiSend className="rotate-180" />
            </button>
          </div>
        </div>

        {/* Metrics - المقاييس */}
        <AnimatePresence>
          {isIdle && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="hidden lg:block col-span-2 p-3 bg-black/60 border border-slate-800 rounded-xl font-mono text-[10px] space-y-1" dir="ltr"
            >
              <div className="flex justify-between text-yellow-500/80">
                <span>Latency:</span>
                <span>120ms</span>
              </div>
              <div className="flex justify-between text-green-500/80 border-t border-slate-800 pt-1">
                <span>Tokens/sec:</span>
                <span>45</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </footer>

      {/* Background Decor - زخرفة الخلفية */}
      <AnimatePresence>
        {isIdle && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-0"
          >
            <div className="absolute top-1/4 left-10 w-[1px] h-64 bg-gradient-to-b from-transparent via-cyan-500 to-transparent"></div>
            <div className="absolute bottom-1/4 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
