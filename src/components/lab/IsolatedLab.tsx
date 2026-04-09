import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  FlaskConical, 
  Terminal as TerminalIcon, 
  Play, 
  Database, 
  Activity, 
  ShieldAlert,
  Cpu,
  Save,
  List,
  Info,
  Code2,
  FolderTree
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";
import { cn } from "@/lib/utils";
import FileExplorer from "./FileExplorer";
import CodeEditor from "./CodeEditor";

interface AgentLog {
  timestamp: string;
  action: string;
  result: any;
}

export default function IsolatedLab() {
  const { playSound } = useAudioFeedback();
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [command, setCommand] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [memoryKey, setMemoryKey] = useState("");
  const [memoryValue, setMemoryValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"terminal" | "editor">("terminal");

  const executeAction = async (action: string, payload?: any) => {
    setIsExecuting(true);
    playSound("click");
    
    try {
      const endpoint = action === "run" ? "/api/terminal" : "/api/agent/execute";
      const body = action === "run" ? { command: payload } : { action, payload };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      const newLog: AgentLog = {
        timestamp: new Date().toLocaleTimeString(),
        action,
        result: data.output || data.result
      };
      
      setLogs(prev => [newLog, ...prev]);
      
      if (action === "info") {
        setSystemInfo(data.result);
      }
    } catch (error) {
      console.error("Agent execution error:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  useEffect(() => {
    executeAction("info");
  }, []);

  return (
    <div className="flex h-full flex-col gap-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <FlaskConical className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tighter neon-glow">المختبر المعزول | ISOLATED LAB</h3>
            <p className="text-xs text-white/40 font-mono uppercase tracking-widest">DARKROOM SYSTEM AGENT v1.0.4</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-3 py-1">
            <ShieldAlert className="mr-2 h-3 w-3" /> بيئة معزولة نشطة
          </Badge>
          <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-3 py-1">
            <Activity className="mr-2 h-3 w-3" /> مراقبة الوكيل: متصل
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Left Column: File Explorer & Quick Controls */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-hidden">
          <FileExplorer onFileSelect={setSelectedFile} />
          
          <GlassCard className="p-4" glowColor="rgba(168, 85, 247, 0.1)">
            <h4 className="text-[10px] font-bold mb-3 text-white/40 tracking-widest uppercase">تحكم سريع</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => executeAction("list")}
                className="border-white/10 text-[10px] text-white/60 hover:text-purple-400 h-8"
              >
                <List className="mr-2 h-3 w-3" /> الملفات
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => executeAction("info")}
                className="border-white/10 text-[10px] text-white/60 hover:text-purple-400 h-8"
              >
                <Info className="mr-2 h-3 w-3" /> النظام
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Center Column: Editor / Terminal */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 overflow-hidden">
          <div className="flex gap-2">
            <Button 
              onClick={() => setActiveTab("terminal")}
              className={cn(
                "flex-1 h-10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                activeTab === "terminal" ? "bg-purple-500 text-black" : "bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              <TerminalIcon className="mr-2 h-4 w-4" /> المحطة الطرفية
            </Button>
            <Button 
              onClick={() => setActiveTab("editor")}
              className={cn(
                "flex-1 h-10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                activeTab === "editor" ? "bg-orange-500 text-black" : "bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              <Code2 className="mr-2 h-4 w-4" /> محرر الأكواد
            </Button>
          </div>

          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "terminal" ? (
                <motion.div 
                  key="terminal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full flex flex-col gap-4"
                >
                  <GlassCard className="p-4" glowColor="rgba(168, 85, 247, 0.1)">
                    <div className="flex gap-2">
                      <Input 
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && executeAction("run", command)}
                        placeholder="أدخل أمر النظام..."
                        className="bg-white/5 border-white/10 h-10 text-xs focus:border-purple-500/50"
                      />
                      <Button 
                        size="icon" 
                        onClick={() => executeAction("run", command)}
                        disabled={isExecuting || !command}
                        className="bg-purple-500 hover:bg-purple-400 text-black shrink-0"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </GlassCard>
                  
                  <GlassCard className="flex-1 flex flex-col overflow-hidden" glowColor="rgba(168, 85, 247, 0.05)">
                    <div className="border-b border-white/5 p-3 flex items-center justify-between bg-white/2">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">المخرجات (OUTPUT)</span>
                      <Button variant="ghost" size="sm" onClick={() => setLogs([])} className="h-6 text-[8px] text-white/20">مسح</Button>
                    </div>
                    <ScrollArea className="flex-1 p-4 font-mono text-xs">
                      <div className="space-y-4">
                        {logs.map((log, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center gap-2 opacity-40">
                              <span className="text-[8px]">{log.timestamp}</span>
                              <span className="text-[8px] uppercase">{log.action}</span>
                            </div>
                            <pre className="whitespace-pre-wrap text-white/80">{typeof log.result === 'object' ? JSON.stringify(log.result, null, 2) : log.result}</pre>
                          </div>
                        ))}
                        {logs.length === 0 && <p className="text-white/10 italic">في انتظار الأوامر...</p>}
                      </div>
                    </ScrollArea>
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div 
                  key="editor"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full"
                >
                  <CodeEditor 
                    selectedFile={selectedFile} 
                    onRun={(code) => executeAction("python", code)} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Memory & System Info */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 overflow-y-auto no-scrollbar">
          <GlassCard className="p-6" glowColor="rgba(0, 255, 255, 0.1)">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Database className="h-4 w-4 text-cyan-400" /> نظام الذاكرة
            </h4>
            <div className="space-y-4">
              <Input 
                value={memoryKey}
                onChange={(e) => setMemoryKey(e.target.value)}
                placeholder="المفتاح..."
                className="bg-white/5 border-white/10 h-10 text-xs"
              />
              <Input 
                value={memoryValue}
                onChange={(e) => setMemoryValue(e.target.value)}
                placeholder="القيمة..."
                className="bg-white/5 border-white/10 h-10 text-xs"
              />
              <Button 
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold h-10"
                onClick={() => executeAction("remember", [memoryKey, memoryValue])}
                disabled={isExecuting || !memoryKey || !memoryValue}
              >
                <Save className="mr-2 h-4 w-4" /> حفظ
              </Button>
            </div>
          </GlassCard>

          {systemInfo && (
            <GlassCard className="p-4" glowColor="rgba(255, 255, 255, 0.05)">
              <h4 className="text-[10px] font-bold mb-3 text-white/40 tracking-widest uppercase">خصائص البيئة</h4>
              <div className="space-y-2 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-white/20">OS:</span>
                  <span className="text-purple-400">{systemInfo.os}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/20">CWD:</span>
                  <span className="text-cyan-400 truncate ml-4">{systemInfo.cwd}</span>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
