import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Cpu, 
  MessageSquare, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Database, 
  Globe, 
  Wrench,
  User,
  BrainCircuit,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

export default function OpenClawCore() {
  const [diagnostics, setDiagnostics] = useState<any>(null);

  useEffect(() => {
    const fetchDiagnostics = async () => {
      try {
        const response = await fetch("/api/diagnostics");
        const data = await response.json();
        setDiagnostics(data);
      } catch (error) {
        console.error("Failed to fetch diagnostics:", error);
      }
    };

    fetchDiagnostics();
    const interval = setInterval(fetchDiagnostics, 5000);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { id: "user", name: "المستخدم", icon: User, color: "text-white" },
    { id: "chat", name: "واجهة الدردشة", icon: MessageSquare, color: "text-cyan-400" },
    { id: "brain", name: "نواة OpenClaw", icon: BrainCircuit, color: "text-purple-400", isCore: true },
    { id: "router", name: "الموجه (Router)", icon: Zap, color: "text-yellow-400" },
  ];

  const targets = [
    { id: "llm", name: "نماذج LLM", icon: BrainCircuit, desc: "Gemini / GPT-4", status: diagnostics?.modules.ai_models || "جاري التحميل" },
    { id: "darkroom", name: "الغرفة المظلمة", icon: Database, desc: "تنفيذ الأكواد", status: diagnostics?.modules.sandbox || "جاري التحميل" },
    { id: "maintenance", name: "وكيل الصيانة", icon: Wrench, desc: "تحسين النظام", status: diagnostics?.modules.orchestrator || "جاري التحميل" },
    { id: "external", name: "APIs خارجية", icon: Globe, desc: "خدمات الويب", status: diagnostics?.modules.web_automation || "جاري التحميل" },
  ];

  return (
    <div className="flex h-full flex-col gap-8 overflow-y-auto no-scrollbar pb-10">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30">
          <Cpu className="h-6 w-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold tracking-tighter neon-glow">نواة OpenClaw | OPENCLAW CORE</h3>
          <p className="text-xs text-white/40 font-mono uppercase tracking-widest">بنية النظام العصبية الموحدة</p>
        </div>
      </div>

      <GlassCard className="p-12 relative overflow-hidden" glowColor="rgba(0, 255, 255, 0.05)">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 flex flex-col items-center gap-12">
          {/* Top Flow: User -> Chat -> Brain */}
          <div className="flex items-center gap-8 md:gap-16">
            {nodes.slice(0, 3).map((node, i) => (
              <React.Fragment key={node.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-xl ${node.isCore ? "scale-125 border-purple-500/50 bg-purple-500/10" : ""}`}>
                    <node.icon className={`h-8 w-8 ${node.color}`} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{node.name}</span>
                </motion.div>
                {i < 2 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    className="origin-left"
                  >
                    <ArrowRight className="h-6 w-6 text-white/20" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Router Node */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="h-12 w-px bg-gradient-to-b from-purple-500/50 to-yellow-500/50" />
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
              <Zap className="h-6 w-6 text-yellow-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400">الموجه الذكي</span>
          </motion.div>

          {/* Bottom Targets */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            {targets.map((target, i) => (
              <motion.div
                key={target.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <GlassCard className="p-4 text-center group hover:border-cyan-500/50 transition-all" glowColor="rgba(0, 255, 255, 0.05)">
                  <target.icon className="mx-auto h-6 w-6 mb-3 text-white/40 group-hover:text-cyan-400 transition-colors" />
                  <h4 className="text-xs font-bold mb-1">{target.name}</h4>
                  <p className="text-[8px] text-white/30 mb-3 font-mono">{target.desc}</p>
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] font-bold text-green-500 uppercase tracking-tighter">{target.status}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6" glowColor="rgba(168, 85, 247, 0.1)">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-purple-400" /> بروتوكولات الأمان
          </h4>
          <div className="space-y-3">
            {[
              "تشفير البيانات العصبي (AES-256)",
              "عزل العمليات في بيئة Sandbox",
              "التحقق من الهوية عبر الرابط العصبي",
              "مراقبة النشاط في الوقت الفعلي"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-white/60">
                <div className="h-1 w-1 rounded-full bg-purple-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6" glowColor="rgba(0, 255, 255, 0.1)">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" /> كفاءة المعالجة
          </h4>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-white/40">دقة التوجيه</span>
                <span className="text-cyan-400">99.8%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 w-[99.8%]" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-white/40">سرعة الاستجابة</span>
                <span className="text-purple-400">140ms</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 w-[85%]" />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
