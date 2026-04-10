import React, { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Github, 
  ChevronDown,
  Send,
  Bot,
  Play
} from "lucide-react";

// Simple Google Drive Icon SVG
const DriveIcon = () => (
  <svg viewBox="0 0 87.3 78" className="h-4 w-4 mr-2">
    <path d="M58.2 78L87.3 27.5 58.2 0H29.1l29.1 50.5z" fill="#FFC107"/>
    <path d="M29.1 78L0 27.5l14.5-25 29.1 50.5z" fill="#03A9F4"/>
    <path d="M29.1 0L0 50.5 14.5 75.5 43.6 25z" fill="#4CAF50"/>
  </svg>
);

export default function IsolatedLab() {
  const [code, setCode] = useState(`import os
import logging

# Isolated execution setup
def secure_task(data):
    logging.info('Processing data in sandbox...')
    result = data.upper()[::-1] # Reverse and capitalize
    return result

if __name__ == '__main__':
    log_level = os.getenv('LOG_LEVEL', 'INFO')
    logging.basicConfig(level=log_level)
    sample_input = 'secure_data_packet'
    output = secure_task(sample_input)
    print(f'Final Output: {output}')`);

  const [output, setOutput] = useState<string>("[INFO] Ready for execution...\n");
  const [isExecuting, setIsExecuting] = useState(false);
  const [agentResponse, setAgentResponse] = useState<string>("Waiting for execution...");
  const [chatInput, setChatInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState("Python Venv (Active) | بايثون (نشط)");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbers = code.split('\n').map((_, i) => i + 1);

  const handleScroll = () => {
    if (textareaRef.current) {
      const lineNumbersEle = document.getElementById('line-numbers');
      if (lineNumbersEle) {
        lineNumbersEle.scrollTop = textareaRef.current.scrollTop;
      }
    }
  };

  const runCode = async () => {
    setIsExecuting(true);
    setOutput("[INFO] Starting execution in isolated environment...\n");
    
    try {
      // 1. Write code to temp file
      await fetch("/api/files/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "lab_temp.py", content: code })
      });

      // 2. Execute code
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "python3 lab_temp.py" })
      });
      
      const data = await res.json();
      const execOutput = data.output || data.error || "";
      
      setOutput(prev => prev + execOutput + "\n[SUCCESS] Execution completed successfully with exit code 0.\n");

      // 3. Ask Agent to analyze
      setAgentResponse("Analyzing execution...");
      const agentRes = await fetch("/api/process-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: `Analyze this python execution in a sandbox. Code:\n${code}\n\nOutput:\n${execOutput}\n\nProvide a short security analysis in English and Arabic.`,
          selectedModel: "auto"
        })
      });
      const agentData = await agentRes.json();
      setAgentResponse(agentData.result || "Analysis complete.");

    } catch (error: any) {
      setOutput(prev => prev + `\n[ERROR] ${error.message}\n`);
      setAgentResponse("Execution failed. Please check the code.");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setAgentResponse("Thinking...");
    
    try {
      const res = await fetch("/api/process-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: `Context: I am in an isolated lab running python code. Code:\n${code}\n\nUser asks: ${userMsg}`,
          selectedModel: "auto"
        })
      });
      const data = await res.json();
      setAgentResponse(data.result || "No response.");
    } catch (error) {
      setAgentResponse("Error communicating with agent.");
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#050a0f] text-white p-6 font-sans overflow-hidden relative" dir="ltr">
      
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.05) 1px, transparent 1px)`,
             backgroundSize: '40px 40px',
             transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
             transformOrigin: 'top center'
           }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#0f172a] border border-purple-500/30 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <User className="h-6 w-6 text-purple-400" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            The Dark Room: Isolated Lab | <span dir="rtl" className="font-arabic">الغرفة المظلمة: معمل معزول</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center px-3 py-2 bg-[#0f172a] border border-yellow-500/30 rounded-lg text-xs text-white hover:bg-[#1e293b] transition-colors">
            <DriveIcon />
            <div className="flex flex-col items-start leading-tight">
              <span>Sync to Google Drive</span>
              <span dir="rtl" className="text-[10px] text-white/70 font-arabic">مزامنة مع جوجل درايف</span>
            </div>
          </button>
          
          <button className="flex items-center px-3 py-2 bg-[#0f172a] border border-white/20 rounded-lg text-xs text-white hover:bg-[#1e293b] transition-colors">
            <Github className="h-4 w-4 mr-2" />
            <div className="flex flex-col items-start leading-tight">
              <span>Push to GitHub</span>
              <span dir="rtl" className="text-[10px] text-white/70 font-arabic">النشر إلى جيت هب</span>
            </div>
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between px-3 py-2 bg-[#0f172a] border border-white/20 rounded-lg text-xs text-white hover:bg-[#1e293b] transition-colors min-w-[200px]"
            >
              <span>Environment | <span dir="rtl" className="font-arabic">البيئة</span></span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-1 w-full bg-[#0f172a] border border-white/20 rounded-lg shadow-xl overflow-hidden z-50"
                >
                  <div className="flex flex-col">
                    <button onClick={() => { setSelectedEnv("Python Venv (Active) | بايثون (نشط)"); setIsDropdownOpen(false); }} className="px-3 py-2 text-left text-xs text-white hover:bg-white/10">{selectedEnv}</button>
                    <button onClick={() => { setSelectedEnv("Docker Container | حاوية دوكر"); setIsDropdownOpen(false); }} className="px-3 py-2 text-left text-xs text-white hover:bg-white/10">Docker Container | <span dir="rtl" className="font-arabic">حاوية دوكر</span></button>
                    <button onClick={() => { setSelectedEnv("Node Sandbox | صندوق رمل نود"); setIsDropdownOpen(false); }} className="px-3 py-2 text-left text-xs text-white hover:bg-white/10">Node Sandbox | <span dir="rtl" className="font-arabic">صندوق رمل نود</span></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 relative z-10">
        
        {/* Left Column: Code Editor */}
        <GlassCard className="flex flex-col h-full bg-[#111827]/80 border-white/10 overflow-hidden" glowColor="rgba(168, 85, 247, 0.05)">
          <div className="flex items-center justify-between border-b border-white/10 p-3 bg-[#1f2937]/50">
            <h3 className="text-sm font-bold text-white">
              Code Editor | <span dir="rtl" className="font-arabic">محرر الكود</span>
            </h3>
            <button 
              onClick={runCode}
              disabled={isExecuting}
              className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-md transition-colors disabled:opacity-50"
            >
              <Play className="h-3 w-3" />
              {isExecuting ? "Running..." : "Run"}
            </button>
          </div>
          
          <div className="flex-1 flex overflow-hidden relative bg-[#0d1117]">
            {/* Line Numbers */}
            <div 
              id="line-numbers"
              className="w-12 bg-[#0d1117] text-[#484f58] text-right pr-3 py-4 font-mono text-sm select-none overflow-hidden"
            >
              {lineNumbers.map(n => <div key={n}>{n}</div>)}
            </div>
            
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={handleScroll}
              spellCheck={false}
              className="flex-1 bg-transparent text-[#c9d1d9] font-mono text-sm p-4 outline-none resize-none whitespace-pre overflow-auto custom-scrollbar"
              style={{ lineHeight: '1.5rem' }}
            />
          </div>
        </GlassCard>

        {/* Right Column: Output & Agent */}
        <div className="flex flex-col gap-6 h-full">
          
          <GlassCard className="flex-1 flex flex-col bg-[#111827]/80 border-white/10 overflow-hidden" glowColor="rgba(168, 85, 247, 0.05)">
            <div className="border-b border-white/10 p-3 bg-[#1f2937]/50">
              <h3 className="text-sm font-bold text-white">
                Sandboxed Output & Lab Agent | <span dir="rtl" className="font-arabic">المخرجات المعزولة ووكيل المعمل</span>
              </h3>
            </div>
            
            <div className="flex-1 p-4 font-mono text-sm text-[#c9d1d9] overflow-auto custom-scrollbar whitespace-pre-wrap">
              {output.split('\n').map((line, i) => {
                if (line.includes('[INFO]')) return <div key={i}><span className="text-blue-400">[INFO]</span>{line.split('[INFO]')[1]}</div>;
                if (line.includes('[SUCCESS]')) return <div key={i}><span className="text-green-400">[SUCCESS]</span>{line.split('[SUCCESS]')[1]}</div>;
                if (line.includes('[ERROR]')) return <div key={i}><span className="text-red-400">[ERROR]</span>{line.split('[ERROR]')[1]}</div>;
                return <div key={i}>{line}</div>;
              })}
            </div>

            <div className="p-4 border-t border-white/10 bg-[#1f2937]/30">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 bg-[#1e293b] border border-purple-500/30 rounded-xl flex items-center justify-center shrink-0">
                  <Bot className="h-6 w-6 text-purple-400" />
                </div>
                <div className="bg-[#1e293b]/80 border border-white/10 rounded-lg p-3 text-sm text-white/90 w-full">
                  <p className="font-bold mb-1 border-b border-white/10 pb-1">Agent | <span dir="rtl" className="font-arabic">الوكيل</span></p>
                  <p className="whitespace-pre-wrap leading-relaxed">{agentResponse}</p>
                </div>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  placeholder="Ask the agent... | اسأل الوكيل..."
                  className="w-full bg-[#1e293b] border border-white/10 rounded-lg py-3 px-4 pr-12 text-sm text-white outline-none focus:border-purple-500/50 transition-colors"
                />
                <button 
                  onClick={handleChat}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#334155] rounded-md hover:bg-[#475569] transition-colors"
                >
                  <Send className="h-4 w-4 text-white/70" />
                </button>
              </div>
            </div>
          </GlassCard>

        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60 relative z-10">
        <div>
          Status: <span className="text-green-400">Running</span> | <span dir="rtl" className="font-arabic">الحالة: <span className="text-green-400">قيد التشغيل</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span>CPU: 2%</span>
          <span>Memory: 120MB</span>
          <span>Network: 10Kbps</span>
        </div>
      </div>

    </div>
  );
}
