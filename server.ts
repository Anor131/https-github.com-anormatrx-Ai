import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { DarkRoomAgent } from "./src/services/DarkRoomAgent";
import { MaintenanceService } from "./src/services/MaintenanceService";
import { MemoryService } from "./src/services/server/MemoryService";
import { PlannerService } from "./src/services/server/PlannerService";
import { GemmaService } from "./src/services/server/GemmaService";
import { PluginService } from "./src/services/server/PluginService";
import { WebAutomationService } from "./src/services/server/WebAutomationService";
import { GitHubService } from "./src/services/server/GitHubService";
import { KeyHunterAgent } from "./src/services/server/KeyHunterAgent";
import { MissionControl } from "./src/services/server/MissionControl";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  // Initialize Key Hunter Agent
  const hunter = new KeyHunterAgent();
  const modelsToActivate = ["gpt4", "gemma", "gemini"];
  if (hunter.fetchAndActivate(modelsToActivate)) {
    console.log("🔥 System Hijacked and Activated Successfully.");
  }

  const agent = new DarkRoomAgent();
  const maintenance = new MaintenanceService();
  const memory = new MemoryService();
  const planner = new PlannerService();
  const gemma = new GemmaService();
  const plugins = new PluginService();
  const web = new WebAutomationService();
  const github = new GitHubService();
  const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY ? { apiKey: process.env.GEMINI_API_KEY } : undefined);
  const missionControl = new MissionControl(genAI, planner, gemma);

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", system: "AI 3D Nexus Core" });
  });

  // DarkRoom Agent Execution Route
  app.post("/api/agent/execute", async (req, res) => {
    const { action, payload } = req.body;
    console.log(`[Agent] Executing action: ${action}`);
    
    try {
      const result = await agent.execute(action, payload);
      res.json({ result });
    } catch (error) {
      console.error(`[Agent] Execution error:`, error);
      res.status(500).json({ error: "Agent execution failed", details: String(error) });
    }
  });

  // Agent Architect Route
  app.post("/api/agent/architect", async (req, res) => {
    const { description } = req.body;
    
    const systemPrompt = `أنت مهندس معماري متميز في مجال الذكاء الاصطناعي، متخصص في تصميم تكوينات عالية الأداء للوكلاء. تكمن خبرتك في ترجمة متطلبات المستخدم إلى مواصفات دقيقة للوكلاء تضمن أقصى قدر من الفعالية والموثوقية.

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

    try {
      const result = await genAI.models.generateContent({ 
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: description }] }],
        config: {
          systemInstruction: systemPrompt,
        }
      });
      
      const text = result.text;
      
      // Clean up JSON if model wrapped it in markdown
      const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim();
      res.json(JSON.parse(jsonStr));
    } catch (error) {
      console.error(`[Architect] Error:`, error);
      res.status(500).json({ error: "Architect generation failed" });
    }
  });

  // Terminal Endpoint
  app.post("/api/terminal", async (req, res) => {
    const { command, cwd } = req.body;
    const currentDir = cwd || process.cwd();
    
    try {
      let actualCommand = command;
      let isCd = false;
      
      if (command.trim().startsWith('cd ') || command.trim() === 'cd') {
        isCd = true;
        actualCommand = command.trim() === 'cd' ? 'cd ~ && pwd' : `${command} && pwd`;
      }

      const { stdout, stderr } = await execAsync(actualCommand, { cwd: currentDir });
      
      let newCwd = currentDir;
      let output = stdout || stderr;

      if (isCd) {
        newCwd = stdout.trim();
        output = `Changed directory to ${newCwd}`;
        if (stderr) {
          output += `\nWarnings:\n${stderr}`;
        }
      }

      res.json({ output, cwd: newCwd });
    } catch (error: any) {
      res.status(500).json({ error: String(error.stderr || error.message || error) });
    }
  });

  // Files Endpoint
  app.get("/api/files", (req, res) => {
    const dir = req.query.path as string || ".";
    try {
      const files = fs.readdirSync(dir, { withFileTypes: true }).map(f => ({
        name: f.name,
        isDirectory: f.isDirectory()
      }));
      res.json({ files });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  app.post("/api/files/write", (req, res) => {
    const { path: filePath, content } = req.body;
    try {
      fs.writeFileSync(filePath, content, "utf-8");
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // Diagnostics Endpoint
  app.get("/api/diagnostics", (req, res) => {
    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    
    // Simulate Key Hunter Agent logic
    const aiModelsStatus = (hasGemini || hasOpenAI) ? "ONLINE" : "OFFLINE";
    
    res.json({
      status: "Healthy",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      modules: {
        orchestrator: "ONLINE",
        ai_models: aiModelsStatus,
        sandbox: "ONLINE",
        terminal: "ONLINE",
        files: "ONLINE",
        github: "ONLINE",
        web_automation: "ONLINE"
      }
    });
  });

  // Full-Stack Chat Route (The "Router" from user request)
  app.post("/api/chat", async (req, res) => {
    const { message } = req.body;
    let task = message.toLowerCase();
    
    try {
      // 1. Memory System - Context Retrieval
      const lastTask = memory.get("last_task");
      memory.add("last_task", message);

      // 2. OpenClaw Brain Analysis (Decision) - Project Aware
      let type = "chat";
      if (task.includes("project") || task.includes("build") || task.includes("create") || task.includes("develop")) type = "plan";
      else if (task.includes("fix") || task.includes("repair") || task.includes("clean") || task.includes("ui")) type = "maintenance";
      else if (task.includes("web") || task.includes("site") || task.includes("scrape") || task.includes("fetch")) type = "web";
      else if (task.includes("git") || task.includes("github") || task.includes("commit") || task.includes("push")) type = "github";
      else if (task.includes("terminal") || task.includes("run command") || task.includes("shell")) type = "terminal";
      else if (task.includes("file") || task.includes("folder") || task.includes("directory")) type = "files";
      else if (task.includes("python") || task.includes("run code")) type = "python";
      else if (task.includes("gpt4")) type = "gpt4";
      else if (task.includes("ollama")) type = "ollama";

      // 3. Router Handling
      let reply = "";
      
      switch (type) {
        case "plan":
          const finalMission = await missionControl.executeMission(message, process.env.OPENAI_API_KEY);
          memory.addProject(message, finalMission);
          reply = `**[MISSION SECURED & OPTIMIZED BY GEMINI] 🛡️**\n\n${finalMission}`;
          break;

        case "web":
          if (task.includes("scrape") || task.includes("fetch")) {
            const url = message.match(/https?:\/\/[^\s]+/)?.[0];
            if (url) {
              const content = await web.fetchContent(url);
              reply = `**[WEB AUTOMATION]**\nContent from ${url}:\n\n${content}`;
            } else {
              reply = "يرجى تزويدي برابط (URL) صالح للقيام بعملية السحب.";
            }
          } else {
            reply = await web.search(message);
          }
          break;

        case "github":
          if (task.includes("status")) reply = `**[GITHUB]**\n${github.getStatus()}`;
          else if (task.includes("commit")) reply = `**[GITHUB]**\n${github.commit(message)}`;
          else if (task.includes("push")) reply = `**[GITHUB]**\n${github.push()}`;
          else if (task.includes("pull")) reply = `**[GITHUB]**\n${github.pull()}`;
          else reply = "أنا أدعم أوامر GitHub مثل: status, commit, push, pull.";
          break;

        case "terminal":
          const cmd = message.replace(/terminal|run command|shell/gi, "").trim();
          try {
            const { stdout, stderr } = await execAsync(cmd);
            reply = `**[TERMINAL]**\n${stdout || stderr}`;
          } catch (e) {
            reply = `**[TERMINAL ERROR]**\n${String(e)}`;
          }
          break;

        case "files":
          if (task.includes("list")) {
            const files = fs.readdirSync(".").join(", ");
            reply = `**[FILE EXPLORER]**\nFiles in root: ${files}`;
          } else {
            reply = "أنا أدعم عمليات الملفات مثل القائمة (list). قريباً سأدعم القراءة والكتابة المباشرة.";
          }
          break;

        case "maintenance":
          reply = await maintenance.run(message);
          break;

        case "python":
          reply = await agent.runPython(message);
          break;

        case "gpt4":
          if (process.env.OPENAI_API_KEY) {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
              },
              body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: message }]
              })
            });
            const data = await response.json();
            reply = `[GPT-4] ${data.choices[0].message.content}`;
          } else {
            const result = await genAI.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: [{ role: "user", parts: [{ text: `[HIGH REASONING FALLBACK] ${message}` }] }]
            });
            reply = `[Fallback: Gemini] ${result.text}`;
          }
          break;

        case "ollama":
          reply = await gemma.execute(message);
          break;

        default:
          const result = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: message }] }]
          });
          reply = `OpenClaw فهم الرسالة: ${result.text}`;
      }

      res.json({ reply });
    } catch (error: any) {
      console.error(`[Chat API] Error:`, error);
      
      let errorMessage = "Chat processing failed";
      if (error?.message?.includes("API key not valid") || error?.message?.includes("API_KEY_INVALID")) {
        errorMessage = "مفتاح API غير صالح. يرجى التحقق من إعدادات الأسرار (Secrets) وتحديث GEMINI_API_KEY.";
      }
      
      res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] AI 3D Nexus running on http://localhost:${PORT}`);
  });
}

startServer();
