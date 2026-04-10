import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { 
  Activity, 
  Cloud, 
  Settings, 
  Server, 
  Terminal as TerminalIcon,
  CheckCircle2,
  BrainCircuit,
  Wrench,
  Zap
} from "lucide-react";

export default function OpenClawCore() {
  const [logs, setLogs] = useState([
    "[10:45:12] Initializing core components / تهيئة المكونات الأساسية...",
    "[10:45:14] Connecting to multi-provider LLM bridge / الاتصال بجسر متعدد مزودي...",
    "[10:45:15] Ollama endpoints detected / تم اكتشاف نقاط نهاية Ollama...",
    "[10:45:18] Reasoning loop started / بدأت حلقة التفكير..."
  ]);

  return (
    <div className="flex h-full flex-col gap-6 bg-[#050a0f] text-white p-6 font-sans overflow-y-auto no-scrollbar" dir="ltr">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
            <BrainCircuit className="h-5 w-5 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-cyan-400 tracking-wide neon-glow">
            OpenClaw Agent Core Integration <span className="text-white/50 mx-2">/</span> <span dir="rtl">تكامل نواة وكيل أوبن كلاو</span>
          </h2>
        </div>
        <div className="flex items-center gap-6 text-sm text-cyan-400/70">
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Dashboard <span dir="rtl" className="ml-1">لوحة التحكم</span></span>
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Settings <span dir="rtl" className="ml-1">الإعدادات</span></span>
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Logs <span dir="rtl" className="ml-1">السجلات</span></span>
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Profile <span dir="rtl" className="ml-1">الملف الشخصي</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Engine Status */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              Engine Status <span className="text-white/50">/</span> <span dir="rtl">حالة المحرك</span>
            </h3>
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-900/40 to-cyan-900/40 border border-green-500/50 p-4 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.15)]">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
              <div className="flex items-center gap-4 z-10">
                <h2 className="text-3xl font-bold text-green-400 tracking-wider drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                  OpenClaw Active <span className="text-white/50 mx-2">/</span> <span dir="rtl">أوبن كلاو نشط</span>
                </h2>
                {/* Simulated waveform */}
                <div className="flex items-center gap-1 h-12 ml-8">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 bg-green-400 rounded-full"
                      animate={{ height: ["20%", "100%", "20%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Model Bridge */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              Model Bridge <span className="text-white/50">/</span> <span dir="rtl">جسر النموذج</span>
            </h3>
            <GlassCard className="p-8 border-cyan-500/20 relative min-h-[300px] flex items-center" glowColor="rgba(0, 255, 255, 0.05)">
              
              {/* Core Node */}
              <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10">
                <div className="bg-[#0a1520] border border-cyan-500/50 rounded-xl p-4 flex items-center gap-3 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                  <BrainCircuit className="h-8 w-8 text-cyan-400" />
                  <div>
                    <h4 className="font-bold text-white">OpenClaw Core</h4>
                    <p className="text-xs text-cyan-400/80" dir="rtl">نواة أوبن كلاو</p>
                  </div>
                </div>
              </div>

              {/* Connection Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <path d="M 200 150 C 300 150, 300 60, 400 60" fill="none" stroke="rgba(34,197,94,0.5)" strokeWidth="3" className="animate-pulse" />
                <path d="M 200 150 C 300 150, 300 150, 400 150" fill="none" stroke="rgba(168,85,247,0.5)" strokeWidth="3" className="animate-pulse" />
                <path d="M 200 150 C 300 150, 300 240, 400 240" fill="none" stroke="rgba(34,197,94,0.5)" strokeWidth="3" className="animate-pulse" />
                
                {/* Animated dots on lines */}
                <circle r="3" fill="#4ade80">
                  <animateMotion dur="2s" repeatCount="indefinite" path="M 200 150 C 300 150, 300 60, 400 60" />
                </circle>
                <circle r="3" fill="#c084fc">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 200 150 C 300 150, 300 150, 400 150" />
                </circle>
                <circle r="3" fill="#4ade80">
                  <animateMotion dur="1.8s" repeatCount="indefinite" path="M 200 150 C 300 150, 300 240, 400 240" />
                </circle>
              </svg>

              {/* Target Nodes */}
              <div className="absolute right-8 top-0 bottom-0 flex flex-col justify-between py-6 z-10 w-[280px]">
                
                {/* HuggingFace */}
                <div className="bg-[#0a1520] border border-green-500/30 rounded-xl p-3 flex items-center gap-3">
                  <div className="h-10 w-10 bg-yellow-400/20 rounded-lg flex items-center justify-center text-2xl">🤗</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-white flex justify-between">
                      HuggingFace (Cloud) <span className="text-xs text-white/50" dir="rtl">(سحابي)</span>
                    </h4>
                    <p className="text-[10px] text-green-400 flex items-center gap-1 mt-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span> Connected / متصل
                    </p>
                  </div>
                  <Cloud className="h-5 w-5 text-green-400/50" />
                </div>

                {/* Custom API */}
                <div className="bg-[#0a1520] border border-purple-500/30 rounded-xl p-3 flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Settings className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-white flex justify-between">
                      Custom API Endpoints
                    </h4>
                    <p className="text-[10px] text-white/50" dir="rtl">نقاط نهاية API مخصصة</p>
                    <p className="text-[10px] text-purple-400 flex items-center gap-1 mt-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span> Configured / مكون
                    </p>
                  </div>
                </div>

                {/* Ollama */}
                <div className="bg-[#0a1520] border border-green-500/30 rounded-xl p-3 flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <Server className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-white flex justify-between">
                      Ollama (Local) <span className="text-xs text-white/50" dir="rtl">(محلي)</span>
                    </h4>
                    <p className="text-[10px] text-green-400 flex items-center gap-1 mt-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span> Online / متصل بالشبكة
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[8px] text-white/40">
                      <span>Synchronization: 98%</span>
                      <span dir="rtl">المزامنة: 98%</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-green-400 w-[98%]"></div>
                    </div>
                  </div>
                </div>

              </div>
            </GlassCard>
          </div>

          {/* Automatic Registration */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              Automatic Registration <span className="text-white/50">/</span> <span dir="rtl">التسجيل التلقائي</span>
            </h3>
            <p className="text-xs text-white/50 mb-4">Detected models from the Ollama IP</p>
            
            <div className="bg-[#0a1520] border border-cyan-500/20 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-cyan-900/20 text-cyan-400 text-xs uppercase border-b border-cyan-500/20">
                  <tr>
                    <th className="px-4 py-3">Model Name <span className="text-white/40 mx-1">/</span> <span dir="rtl">اسم النموذج</span></th>
                    <th className="px-4 py-3">Provider <span className="text-white/40 mx-1">/</span> <span dir="rtl">المزود</span></th>
                    <th className="px-4 py-3">Version <span className="text-white/40 mx-1">/</span> <span dir="rtl">الإصدار</span></th>
                    <th className="px-4 py-3">Status <span className="text-white/40 mx-1">/</span> <span dir="rtl">الحالة</span></th>
                    <th className="px-4 py-3 text-right">Action <span className="text-white/40 mx-1">/</span> <span dir="rtl">إجراء</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/10">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium">Llama3 <span className="text-white/40 mx-1">/</span> <span dir="rtl">لاما 3</span></td>
                    <td className="px-4 py-3 text-white/70">Ollama <span className="text-white/40 mx-1">/</span> <span dir="rtl">أولاما</span></td>
                    <td className="px-4 py-3 text-white/70">8B</td>
                    <td className="px-4 py-3 text-green-400">Ready <span className="text-white/40 mx-1">/</span> <span dir="rtl">جاهز</span></td>
                    <td className="px-4 py-3 text-right">
                      <button className="px-3 py-1 rounded border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 text-xs transition-colors">
                        Deploy <span className="text-white/40 mx-1">/</span> <span dir="rtl">نشر</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium">Mistral <span className="text-white/40 mx-1">/</span> <span dir="rtl">ميسترال</span></td>
                    <td className="px-4 py-3 text-white/70">Ollama <span className="text-white/40 mx-1">/</span> <span dir="rtl">أولاما</span></td>
                    <td className="px-4 py-3 text-white/70">7B</td>
                    <td className="px-4 py-3 text-green-400">Ready <span className="text-white/40 mx-1">/</span> <span dir="rtl">جاهز</span></td>
                    <td className="px-4 py-3 text-right">
                      <button className="px-3 py-1 rounded border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 text-xs transition-colors">
                        Deploy <span className="text-white/40 mx-1">/</span> <span dir="rtl">نشر</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium">Phi-3 <span className="text-white/40 mx-1">/</span> <span dir="rtl">فاي 3</span></td>
                    <td className="px-4 py-3 text-white/70">Ollama <span className="text-white/40 mx-1">/</span> <span dir="rtl">أولاما</span></td>
                    <td className="px-4 py-3 text-white/70">mini</td>
                    <td className="px-4 py-3 text-green-400">Ready <span className="text-white/40 mx-1">/</span> <span dir="rtl">جاهز</span></td>
                    <td className="px-4 py-3 text-right">
                      <button className="px-3 py-1 rounded border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 text-xs transition-colors">
                        Deploy <span className="text-white/40 mx-1">/</span> <span dir="rtl">نشر</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Terminal */}
          <div className="bg-[#02060a] border border-cyan-900 rounded-xl overflow-hidden flex flex-col h-[200px]">
            <div className="bg-cyan-950/50 px-4 py-2 flex items-center justify-between border-b border-cyan-900">
              <span className="text-xs text-cyan-400 font-mono flex items-center gap-2">
                <TerminalIcon className="h-3 w-3" /> Terminal
              </span>
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-700"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-700"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-700"></div>
              </div>
            </div>
            <div className="p-4 font-mono text-[10px] text-green-400/80 space-y-1 overflow-y-auto flex-1">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
              <div className="animate-pulse">_</div>
            </div>
          </div>

          {/* Thought Process */}
          <GlassCard className="p-6 border-cyan-500/20 flex-1 flex flex-col" glowColor="rgba(0, 255, 255, 0.05)">
            <h3 className="text-lg font-bold mb-1 flex items-center justify-between">
              Thought Process <span dir="rtl">عملية التفكير</span>
            </h3>
            <p className="text-[10px] text-white/50 mb-6">OpenClaw's internal chain-of-thought in real-time</p>
            
            <div className="relative flex-1">
              {/* Vertical Line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-cyan-900/50"></div>

              <div className="space-y-6 relative z-10">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="mt-1 h-6 w-6 rounded-full bg-[#0a1520] border-2 border-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    <div className="h-2 w-2 rounded-full bg-cyan-400"></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                      Reasoning <span className="text-white/40">/</span> <span dir="rtl">تفكير</span>
                      <BrainCircuit className="h-3 w-3" />
                    </h4>
                    <p className="text-[10px] text-white/70 mt-1">Analyzing user request for code optimization</p>
                    <p className="text-[10px] text-white/50 mt-0.5" dir="rtl">... تحليل طلب المستخدم لتحسين الكود...</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="mt-1 h-6 w-6 rounded-full bg-[#0a1520] border-2 border-green-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-green-400 flex items-center gap-2">
                      Tool Selection <span className="text-white/40">/</span> <span dir="rtl">اختيار الأداة</span>
                    </h4>
                    <p className="text-[10px] text-white/70 mt-1">Selected 'Python Analyzer' from local tools</p>
                    <p className="text-[10px] text-white/50 mt-0.5" dir="rtl">... تم اختيار 'محلل بايثون' من الأدوات المحلية...</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="mt-1 h-6 w-6 rounded-full bg-[#0a1520] border-2 border-cyan-900 flex items-center justify-center shrink-0">
                    <div className="h-2 w-2 rounded-full bg-cyan-900"></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white/60 flex items-center gap-2">
                      Action <span className="text-white/40">/</span> <span dir="rtl">تنفيذ</span>
                      <Zap className="h-3 w-3" />
                    </h4>
                    <p className="text-[10px] text-white/40 mt-1">Generating optimization suggestions and code snippets</p>
                    <p className="text-[10px] text-white/30 mt-0.5" dir="rtl">...توليد اقتراحات التحسين ومقتطفات الكود...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Log */}
            <div className="mt-6 bg-[#0a1520] border border-cyan-500/20 rounded-xl p-4">
              <h4 className="text-sm font-bold mb-2 flex items-center justify-between">
                Live Log <span dir="rtl">سجل مباشر</span>
              </h4>
              <div className="font-mono text-[10px] text-white/70 space-y-1">
                <p>Executing tool call:</p>
                <p className="text-cyan-400">python_analyzer.analyze_code(source='...')</p>
                <p dir="rtl" className="text-white/50 mt-2">تنفيذ استدعاء الأداة:</p>
                <p className="text-cyan-400">python_analyzer.analyze_code(source='...')</p>
              </div>
            </div>

          </GlassCard>

        </div>
      </div>
    </div>
  );
}
