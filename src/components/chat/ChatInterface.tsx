import React, { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Send, Trash2, Mic, Volume2, Sparkles, RefreshCcw } from "lucide-react";
import { generateChatResponse } from "@/lib/gemini";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import ThreeScene from "@/components/ThreeScene";
import { routerService } from "@/services/RouterService";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "مرحباً بك مجدداً، أيها القائد. كيف يمكنني مساعدتك في عملياتك الموحدة اليوم؟" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const result = await routerService.handle(input);
      
      let displayContent = result.content;
      
      // Enhanced formatting for different module responses
      if (result.content.includes("**[DARKROOM EXECUTION]**")) {
        // Already formatted by server or handled here
      } else if (result.content.includes("**[WEB AUTOMATION]**")) {
        // Web scraping results
      } else if (result.content.includes("**[GITHUB]**")) {
        // Git operations
      } else if (result.content.includes("**[TERMINAL]**")) {
        // Shell command output
      } else if (result.content.includes("**[FILE EXPLORER]**")) {
        // File system operations
      } else if (result.type === "python") {
        displayContent = `**[DARKROOM EXECUTION]**\n\n\`\`\`python\n${result.content}\n\`\`\``;
      } else if (result.type === "maintenance") {
        displayContent = `**[SYSTEM MAINTENANCE REPORT]**\n\n${result.content}`;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: displayContent }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "عذراً، حدث خطأ أثناء معالجة طلبك." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-500/30">
            <Sparkles className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">جلسة تفاعل الذكاء الاصطناعي المباشرة</h3>
            <p className="text-xs text-white/40 font-mono">النموذج النشط: GEMINI 3 FLASH | سرعة المعالجة: 120 رمز/ثانية</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-white/10 text-white/60 hover:text-cyan-400" onClick={() => setMessages([])}>
            <Trash2 className="ml-2 h-4 w-4" /> مسح الدردشة
          </Button>
          <Button variant="outline" size="sm" className="border-white/10 text-white/60 hover:text-cyan-400">
            <RefreshCcw className="ml-2 h-4 w-4" /> تبديل النموذج
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Chat Area */}
        <GlassCard className="flex flex-1 flex-col overflow-hidden" glowColor="rgba(0, 255, 255, 0.05)">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="flex flex-col gap-6">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === "user" 
                      ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-100" 
                      : "bg-white/5 border border-white/10 text-white/80"
                  }`}>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
                      {msg.role === "user" ? "المستخدم" : "مساعد الذكاء الاصطناعي"}
                    </p>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" />
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-white/5 p-4">
            <div className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="اكتب رسالتك هنا..."
                className="bg-white/5 border-white/10 pl-24 py-6 focus:border-cyan-500/50"
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button variant="ghost" size="icon" className="text-white/40 hover:text-cyan-400">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white/40 hover:text-cyan-400">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg mr-2">
                  <span className="text-[10px] font-mono text-cyan-400">Pulse</span>
                  <div className="flex items-end gap-0.5 h-3">
                    {[0.4, 0.7, 0.3, 0.9, 0.5].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [`${h * 100}%`, `${(1 - h) * 100}%`, `${h * 100}%`] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                        className="w-0.5 bg-cyan-400"
                      />
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={handleSend}
                  className="bg-cyan-500 text-black hover:bg-cyan-400"
                >
                  <Send className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* 3D Assistant View */}
        <div className="hidden lg:flex w-80 flex-col gap-6">
          <GlassCard className="flex-1 overflow-hidden relative" glowColor="rgba(139, 92, 246, 0.2)">
            <div className="absolute top-4 right-4 z-10">
              <div className="flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 border border-cyan-500/20">
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-400/80">بث مباشر</span>
              </div>
            </div>
            <ThreeScene />
          </GlassCard>
          
          <GlassCard className="p-4" glowColor="rgba(0, 255, 255, 0.1)">
            <h4 className="text-xs font-bold mb-3 text-white/60 tracking-widest uppercase">مقاييس النظام</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-white/40">زمن الاستجابة</span>
                <span className="text-cyan-400">4ms</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 w-[15%]" />
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-white/40">صحة النموذج</span>
                <span className="text-green-400">مثالية</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 w-[95%]" />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
