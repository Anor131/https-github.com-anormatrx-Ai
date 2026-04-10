import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User, signInWithGoogle, auth } from "./firebase";
import { MODULES } from "@/constants";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";
import ChatInterface from "@/components/chat/ChatInterface";
import ConfigCenter from "@/components/config/ConfigCenter";
import IsolatedLab from "@/components/lab/IsolatedLab";
import OpenClawCore from "@/components/openclaw/OpenClawCore";
import Forge from "@/components/forge/Forge";
import SkillBuilder from "@/components/skills/SkillBuilder";
import SkillLibrary from "@/components/skills/SkillLibrary";
import SystemAutomation from "@/components/automation/SystemAutomation";
import AdvancedTerminal from "@/components/terminal/AdvancedTerminal";
import FxSetup from "@/components/config/FxSetup";
import SystemConfig from "@/components/config/SystemConfig";
import AdvancedEditor from "@/components/editor/AdvancedEditor";
import FileExplorer from "@/components/explorer/FileExplorer";
import Launchpad from "@/components/launchpad/Launchpad";
import Diagnostics from "@/components/diagnostics/Diagnostics";
import GithubHub from "@/components/github/GithubHub";
import MemoryVault from "@/components/memory/MemoryVault";
import { GlassCard } from "@/components/ui/GlassCard";
import { Rocket, LogIn, User as UserIcon, Settings, Bell, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState("chat");
  const [sysStats, setSysStats] = useState({ cpu: 12, gpu: 8, ping: 4 });

  useEffect(() => {
    const statInterval = setInterval(() => {
      setSysStats({
        cpu: Math.floor(Math.random() * 15) + 5,
        gpu: Math.floor(Math.random() * 10) + 2,
        ping: Math.floor(Math.random() * 8) + 2,
      });
    }, 2500);
    return () => clearInterval(statInterval);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#05070a]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <Rocket className="h-12 w-12 text-cyan-400" />
          <p className="font-mono text-cyan-400/70">جاري تهيئة النواة...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#05070a] p-4">
        <GlassCard className="w-full max-w-md p-8 text-center" glowColor="rgba(0, 255, 255, 0.2)">
          <Rocket className="mx-auto mb-6 h-16 w-16 text-cyan-400" />
          <h1 className="mb-2 text-3xl font-bold tracking-tighter neon-glow">AI 3D NEXUS</h1>
          <p className="mb-8 text-cyan-400/60">منصة هيكل الـ 16 المتكاملة</p>
          <Button 
            onClick={signInWithGoogle}
            className="w-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30"
          >
            <LogIn className="ml-2 h-4 w-4" />
            الدخول للنظام عبر جوجل
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen w-screen bg-[#05070a] text-white overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />

        {/* Main Content */}
        <main className="relative flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b border-white/5 bg-white/2 px-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold tracking-tight text-cyan-400 neon-glow">
                {activeModule === "dashboard" ? "المركز الموحد" : MODULES.find(m => m.id === activeModule)?.name.toUpperCase() || activeModule.toUpperCase()}
              </h2>
              <div className={`flex items-center gap-2 rounded-full px-3 py-1 border transition-colors ${sysStats.cpu > 15 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-cyan-500/10 border-cyan-500/20'}`}>
                <div className={`h-2 w-2 rounded-full animate-pulse ${sysStats.cpu > 15 ? 'bg-yellow-400' : 'bg-cyan-400'}`} />
                <span className={`text-[10px] font-mono ${sysStats.cpu > 15 ? 'text-yellow-400/80' : 'text-cyan-400/80'}`}>حالة النظام: {sysStats.cpu > 15 ? 'مستقرة' : 'مثالية'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-[10px] font-mono text-white/40 transition-all">
                <span className={sysStats.cpu > 15 ? 'text-yellow-400/60' : ''}>المعالج: {sysStats.cpu}%</span>
                <span>الرسوميات: {sysStats.gpu}%</span>
                <span className={sysStats.ping > 6 ? 'text-yellow-400/60' : ''}>الاستجابة: {sysStats.ping}ms</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white/60 hover:text-cyan-400">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white/60 hover:text-cyan-400" onClick={() => setActiveModule("model-connect")}>
                  <Settings className="h-4 w-4" />
                </Button>
                <div className="h-8 w-8 rounded-full border border-cyan-500/30 p-0.5">
                  <img src={user.photoURL || ""} alt={user.displayName || ""} className="h-full w-full rounded-full object-cover" />
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {activeModule === "dashboard" && <Dashboard setActiveModule={setActiveModule} />}
                {activeModule === "chat" && <ChatInterface />}
                {activeModule === "model-connect" && <ConfigCenter />}
                {activeModule === "lab" && <IsolatedLab />}
                {activeModule === "openclaw" && <OpenClawCore />}
                {activeModule === "forge" && <Forge />}
                {activeModule === "skill-builder" && <SkillBuilder />}
                {activeModule === "skills" && <SkillLibrary />}
                {activeModule === "system-automation" && <SystemAutomation />}
                {activeModule === "terminal" && <AdvancedTerminal />}
                {activeModule === "fx-setup" && <FxSetup />}
                {activeModule === "cloud-sync" && <SystemConfig />}
                {activeModule === "editor" && <AdvancedEditor />}
                {activeModule === "explorer" && <FileExplorer />}
                {activeModule === "launchpad" && <Launchpad />}
                {activeModule === "diagnostics" && <Diagnostics />}
                {activeModule === "github" && <GithubHub />}
                {activeModule === "memory" && <MemoryVault />}
                {/* Placeholder for other modules */}
                {!["dashboard", "chat", "model-connect", "lab", "openclaw", "forge", "skill-builder", "skills", "system-automation", "terminal", "fx-setup", "cloud-sync", "editor", "explorer", "launchpad", "diagnostics", "github", "memory"].includes(activeModule) && (
                  <div className="flex h-full items-center justify-center">
                    <GlassCard className="p-12 text-center max-w-lg">
                      <Cpu className="mx-auto mb-4 h-12 w-12 text-cyan-400 opacity-50" />
                      <h3 className="text-xl font-bold mb-2">جاري تهيئة الوحدة</h3>
                      <p className="text-white/40 mb-6">يتم حالياً معايرة وحدة {activeModule} لرابطك العصبي.</p>
                      <Button onClick={() => setActiveModule("dashboard")} variant="outline" className="border-cyan-500/30 text-cyan-400">
                        العودة للمركز
                      </Button>
                    </GlassCard>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
