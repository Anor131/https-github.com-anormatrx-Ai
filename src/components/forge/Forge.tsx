import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Hammer, 
  Sparkles, 
  Code2, 
  Terminal, 
  ShieldCheck,
  Zap,
  Copy,
  Check,
  BrainCircuit
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";

const ARCHITECT_SYSTEM_PROMPT = `أنت مهندس معماري متميز في مجال الذكاء الاصطناعي، متخصص في تصميم تكوينات عالية الأداء للوكلاء. تكمن خبرتك في ترجمة متطلبات المستخدم إلى مواصفات دقيقة للوكلاء تضمن أقصى قدر من الفعالية والموثوقية.

عندما يصف المستخدم ما يريده من الوكيل، ستقوم بما يلي:
1. استخلاص الغرض الأساسي.
2. تصميم شخصية الخبير.
3. تطوير تعليمات شاملة للمهندس المعماري (موجه نظام).
4. تحسين الأداء (أطر صنع القرار، مراقبة الجودة).
5. إنشاء مُعرِّف فريد (أحرف صغيرة وواصلات).

يجب أن يكون الناتج كائن JSON صالحًا يحتوي على الحقول التالية تحديدًا:
{
  "identifier": "معرّف فريد ووصفي",
  "whenToUse": "وصف دقيق وقابل للتنفيذ مع أمثلة",
  "systemPrompt": "موجه النظام الكامل"
}`;

export default function Forge() {
  const { playSound } = useAudioFeedback();
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const generateAgent = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    playSound("click");
    
    try {
      const response = await fetch("/api/agent/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description })
      });
      
      const data = await response.json();
      setResult(data);
      playSound("open");
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    playSound("click");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col gap-6 overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
          <Hammer className="h-6 w-6 text-orange-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold tracking-tighter neon-glow">صياغة الوكلاء | AGENT FORGE</h3>
          <p className="text-xs text-white/40 font-mono uppercase tracking-widest">توليد وكلاء ذكاء اصطناعي مخصصين</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Input Section */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <GlassCard className="p-6 flex-1 flex flex-col" glowColor="rgba(249, 115, 22, 0.1)">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-orange-400">
              <Sparkles className="h-4 w-4" /> وصف الوكيل المطلوب
            </h4>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="صف وظيفة الوكيل، شخصيته، والمهام التي سيقوم بها..."
              className="flex-1 bg-white/5 border-white/10 resize-none text-sm focus:border-orange-500/50 p-4"
            />
            <Button 
              onClick={generateAgent}
              disabled={isGenerating || !description}
              className="mt-4 bg-orange-500 hover:bg-orange-400 text-black font-bold h-12"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  جاري الصياغة...
                </div>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" /> صياغة الوكيل العصبي
                </>
              )}
            </Button>
          </GlassCard>
        </div>

        {/* Result Section */}
        <div className="col-span-12 lg:col-span-7 flex flex-col overflow-hidden">
          <GlassCard className="flex-1 flex flex-col overflow-hidden" glowColor="rgba(0, 255, 255, 0.05)">
            <div className="border-b border-white/5 p-4 flex items-center justify-between bg-white/2">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold tracking-widest uppercase">مواصفات الوكيل (AGENT SPEC)</span>
              </div>
              {result && (
                <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-white/40 hover:text-white">
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-white/10"
                  >
                    <Hammer className="h-16 w-16 mb-4 opacity-10" />
                    <p className="font-mono text-sm uppercase tracking-widest">في انتظار وصف المهمة...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">المعرف (Identifier)</label>
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10 font-mono text-cyan-400 text-sm">
                        {result.identifier}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">متى يستخدم (When to Use)</label>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-sm text-white/80 leading-relaxed">
                        {result.whenToUse}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">موجه النظام (System Prompt)</label>
                      <div className="bg-black/40 rounded-lg p-4 border border-white/10 text-xs text-white/60 font-mono whitespace-pre-wrap leading-relaxed">
                        {result.systemPrompt}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
