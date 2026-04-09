import fs from "fs";
import path from "path";
import { exec } from "child_process";
import os from "os";

export class DarkRoomAgent {
  private name: string = "DarkRoom System Agent";
  private memoryFile: string = "agent_memory.json";
  private logFile: string = "agent_logs.txt";
  private memory: any;

  constructor() {
    this.memory = this.loadMemory();
  }

  // ---------------------------
  // MEMORY SYSTEM
  // ---------------------------
  private loadMemory(): any {
    if (fs.existsSync(this.memoryFile)) {
      try {
        const data = fs.readFileSync(this.memoryFile, "utf-8");
        return JSON.parse(data);
      } catch (e) {
        return {};
      }
    }
    return {};
  }

  private saveMemory(): void {
    fs.writeFileSync(this.memoryFile, JSON.stringify(this.memory, null, 4), "utf-8");
  }

  public remember(key: string, value: any): string {
    this.memory[key] = value;
    this.saveMemory();
    return "Saved to memory";
  }

  // ---------------------------
  // LOGGING SYSTEM
  // ---------------------------
  public log(message: string): void {
    const time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const logMessage = `[${time}] ${message}\n`;
    fs.appendFileSync(this.logFile, logMessage, "utf-8");
  }

  // ---------------------------
  // COMMAND EXECUTION
  // ---------------------------
  public async runCommand(command: string): Promise<string> {
    this.log(`Executing: ${command}`);
    return new Promise((resolve) => {
      exec(command, (error, stdout, stderr) => {
        const output = stdout || stderr || (error ? error.message : "No output");
        this.log(`Output: ${output}`);
        resolve(output);
      });
    });
  }

  // ---------------------------
  // SYSTEM ACTIONS
  // ---------------------------
  public systemInfo(): any {
    return {
      os: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      freeMem: Math.round(os.freemem() / 1024 / 1024) + " MB",
      totalMem: Math.round(os.totalmem() / 1024 / 1024) + " MB",
      cwd: process.cwd(),
      time: new Date().toISOString()
    };
  }

  public async runPython(code: string): Promise<string> {
    this.log(`Running Python: ${code}`);
    return this.runCommand(`python3 -c "${code.replace(/"/g, '\\"')}"`);
  }

  public async installPackage(packageName: string): Promise<string> {
    this.log(`Installing package: ${packageName}`);
    return this.runCommand(`pip install ${packageName}`);
  }

  public listFiles(): string[] {
    return fs.readdirSync(".");
  }

  // ---------------------------
  // MAIN ROUTER
  // ---------------------------
  public async execute(action: string, payload?: any): Promise<any> {
    switch (action) {
      case "run":
        return await this.runCommand(payload);
      case "python":
        return await this.runPython(payload);
      case "install":
        return await this.installPackage(payload);
      case "info":
        return this.systemInfo();
      case "list":
        return this.listFiles();
      case "remember":
        if (Array.isArray(payload) && payload.length === 2) {
          return this.remember(payload[0], payload[1]);
        }
        return "Invalid payload for remember";
      default:
        return "Unknown action";
    }
  }
}
