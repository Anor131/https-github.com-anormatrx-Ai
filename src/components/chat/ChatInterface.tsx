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
  const [selectedModel, setSelectedModel] = useState('llama3');
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "مرحباً، كيف يمكنني استخدام نماذج اللغة المختلفة؟\nHello, how can I use different language models?" },
    { role: "assistant", content: "مرحباً! يمكنك استخدام القائمة المنسدلة في الأعلى للتبديل بين النماذج المحلية والسحابية.\n\n```python\ndef route_query(query, model_type='auto'):\n    # ... routing logic\n    return response\n```" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [liveLog, setLiveLog] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    setIsTyping(true);

    const task = userMessageText.toLowerCase();
    const isMission = task.includes("project") || task.includes("build") || task.includes("create") || task.includes("develop");

    if (isMission) {
      setLiveLog("💀 Gemini: Analyzing risks and cleaning context...");
      setTimeout(() => setLiveLog("🧠 GPT-4: Generating mission plan..."), 2000);
      setTimeout(() => setLiveLog("⚙️ Gemma is coding..."), 4000);
      setTimeout(() => setLiveLog("💀 Gemini: Cleaning and securing the mission..."), 7000);
    }

    try {
      const result = await routerService.handle(userMessageText);
      let displayContent = result.content;
      
      if (result.type === "python") {
        displayContent = `**[DARKROOM EXECUTION]**\n\n\`\`\`python\n${result.content}\n\`\`\``;
      } else if (result.type === "maintenance") {
        displayContent = `**[SYSTEM MAINTENANCE REPORT]**\n\n${result.content}`;
      }

      if (isMission) {
        setLiveLog("🛡️ Gemini has secured and optimized the mission.");
        setTimeout(() => setLiveLog(null), 3000);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: displayContent }]);
    } catch (error: any) {
      setLiveLog(null);
      setMessages((prev) => [...prev, { role: "assistant", content: error.message || "عذراً، حدث خطأ أثناء معالجة طلبك." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const panelVariants = {
    hidden: { opacity: 0, x: 50, rotateY: 15 },
    visible: { opacity: 1, x: 0, rotateY: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="h-full bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col items-center justify-between p-6 relative" dir="rtl">
      
      {/* 1. Header - العنوان العلوي */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-4xl py-4 px-8 bg-black/40 border border-cyan-500/30 rounded-2xl backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] flex justify-center items-center shrink-0"
      >
        <h1 className="text-xl font-bold tracking-wider text-cyan-400 text-center">
          Focus-Driven Agent Chat UI / واجهة دردشة الوكيل المرتكزة على التركيز
        </h1>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-cyan-500/5 rounded-2xl"></div>
      </motion.header>

      {/* 2. Model Selector - اختيار النموذج (يسار علوي) */}
      <div className="absolute top-24 left-10 z-20 w-64 text-left hidden lg:block" dir="ltr">
        <div className="p-4 bg-black/60 border border-slate-800 rounded-xl backdrop-blur-md">
          <div className="flex justify-between items-center mb-4 text-xs font-semibold text-slate-400">
            <span>Model Selector / اختيار النموذج</span>
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="group cursor-pointer p-2 rounded-lg hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all">
              <span className="text-slate-200">LOCAL: </span>
              <span className="text-cyan-400 font-mono italic">llama3</span>
              <span className="ml-2 text-[10px] text-green-500 uppercase">● Active</span>
            </div>
            <div className="group cursor-pointer p-2 rounded-lg hover:bg-slate-500/10 border border-transparent">
              <span className="text-slate-400 italic font-mono">gpt-4 (Cloud)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Chat Area - منطقة المحادثة */}
      <main className="flex-1 w-full max-w-4xl flex flex-col overflow-hidden py-6 relative z-10">
        <div className="flex-1 overflow-y-auto pr-4 space-y-8 no-scrollbar" ref={scrollRef}>
          {messages.map((msg, idx) => (
            msg.role === "user" ? (
              <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="self-end max-w-lg ml-auto">
                <div className="p-4 bg-slate-900/40 rounded-2xl rounded-tr-none border border-slate-800 backdrop-blur-sm">
                  <div className="text-right leading-relaxed prose prose-invert prose-sm">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={idx}
                initial="hidden" animate="visible" variants={panelVariants}
                className="self-start w-full max-w-2xl bg-[#0a0f14]/80 border border-cyan-500/20 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative group mr-auto"
              >
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
                    <span className="text-xs">🤖</span>
                  </div>
                  <div className="flex-1 space-y-4 overflow-hidden">
                    <div className="prose prose-invert prose-sm max-w-none leading-7">
                      <ReactMarkdown
                        components={{
                          code({node, inline, className, children, ...props}: any) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline ? (
                              <div className="rounded-xl overflow-hidden border border-slate-700 bg-black/50 font-mono text-sm my-4" dir="ltr">
                                <div className="bg-slate-800/50 px-4 py-1 text-xs text-slate-400 flex justify-between items-center">
                                  <span>{match?.[1] || 'code'}</span>
                                  <button className="hover:text-cyan-400">Copy</button>
                                </div>
                                <pre className="p-4 text-cyan-300 overflow-x-auto">
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </pre>
                              </div>
                            ) : (
                              <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-[0.9em]" {...props}>
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-10 w-20 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              </motion.div>
            )
          ))}
          
          {isTyping && (
            <motion.div 
              initial="hidden" animate="visible" variants={panelVariants}
              className="self-start w-full max-w-2xl bg-[#0a0f14]/80 border border-cyan-500/20 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative group mr-auto"
            >
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
                  <span className="text-xs">🤖</span>
                </div>
                <div className="flex-1 flex items-center h-10">
                  <span className="animate-pulse text-cyan-400 text-2xl tracking-widest leading-none">...</span>
                </div>
              </div>
              <div className="absolute top-0 right-10 w-20 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            </motion.div>
          )}
        </div>
      </main>

      {/* 4. Controls - لوحة التحكم السفلى */}
      <footer className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-4 shrink-0 relative z-10">
        
        {/* Sidebar Actions */}
        <div className="hidden lg:flex col-span-2 flex-col space-y-4">
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
        </div>

        {/* Input Bar */}
        <div className="col-span-1 lg:col-span-8 relative">
          <AnimatePresence>
            {liveLog && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -top-20 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 w-max"
              >
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono text-cyan-300">{liveLog}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute -top-12 right-0 flex items-center space-x-3 space-x-reverse">
             <span className="text-xs text-slate-400 uppercase tracking-tighter">Voice Response / استجابة صوتية</span>
             <button 
              onClick={() => setIsVoiceResponse(!isVoiceResponse)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${isVoiceResponse ? 'bg-cyan-500' : 'bg-slate-700'}`}
             >
               <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isVoiceResponse ? '-translate-x-6' : 'translate-x-0'}`} />
             </button>
          </div>
          
          <div className="bg-black/60 border border-slate-700 rounded-2xl p-4 flex items-center shadow-inner group focus-within:border-cyan-500/50 transition-all">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتب رسالتك... / Type your message..." 
              className="bg-transparent flex-1 outline-none text-sm placeholder:text-slate-600"
            />
            <button 
              onClick={handleSend}
              className="p-3 bg-cyan-600/20 border border-cyan-500/30 rounded-xl text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            >
              <FiSend className="rotate-180" />
            </button>
          </div>
        </div>

        {/* Metrics - المقاييس */}
        <div className="hidden lg:block col-span-2 p-3 bg-black/60 border border-slate-800 rounded-xl font-mono text-[10px] space-y-1" dir="ltr">
          <div className="flex justify-between text-yellow-500/80">
            <span>Latency:</span>
            <span>120ms</span>
          </div>
          <div className="flex justify-between text-green-500/80 border-t border-slate-800 pt-1">
            <span>Tokens/sec:</span>
            <span>45</span>
          </div>
        </div>

      </footer>

      {/* Background Decor - زخرفة الخلفية */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-1/4 left-10 w-[1px] h-64 bg-gradient-to-b from-transparent via-cyan-500 to-transparent"></div>
        <div className="absolute bottom-1/4 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
}
