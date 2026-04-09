import React from "react";
import { MODULES } from "@/constants";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LogOut } from "lucide-react";
import { auth } from "@/firebase";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (id: string) => void;
}

export default function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  const { playSound } = useAudioFeedback();

  return (
    <aside className="flex w-20 flex-col items-center border-r border-white/5 bg-white/2 py-6 backdrop-blur-sm">
      <div 
        className="mb-10 cursor-pointer transition-transform hover:scale-110"
        onClick={() => {
          setActiveModule("dashboard");
          playSound("open");
        }}
        onMouseEnter={() => playSound("hover")}
      >
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          <LayoutDashboard className="h-6 w-6 text-cyan-400" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto no-scrollbar">
        {MODULES.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          
          return (
            <Tooltip key={module.id}>
              <TooltipTrigger render={
                <button
                  onClick={() => {
                    setActiveModule(module.id);
                    playSound("click");
                  }}
                  onMouseEnter={() => playSound("hover")}
                  className={cn(
                    "group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
                    isActive 
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,255,255,0.2)]" 
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive && "neon-glow")} />
                  {isActive && (
                    <div className="absolute -left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
                  )}
                </button>
              } />
              <TooltipContent side="right" className="bg-[#0a0c10] border-white/10 text-cyan-400">
                <p className="font-bold">{module.name}</p>
                <p className="text-[10px] text-white/60">{module.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <div className="mt-auto pt-6">
        <Tooltip>
          <TooltipTrigger render={
            <button 
              onClick={() => auth.signOut()}
              className="flex h-12 w-12 items-center justify-center rounded-xl text-white/40 transition-all hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />
            </button>
          } />
          <TooltipContent side="right" className="bg-[#0a0c10] border-red-500/20 text-red-400">
            <p>قطع الرابط العصبي</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}
