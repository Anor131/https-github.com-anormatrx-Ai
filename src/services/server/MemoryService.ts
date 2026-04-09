import fs from "fs";

export class MemoryService {
  private file: string = "memory.json";
  private memory: any = { projects: [] };

  constructor() {
    this.load();
  }

  private load() {
    if (fs.existsSync(this.file)) {
      try {
        const data = fs.readFileSync(this.file, "utf-8");
        this.memory = JSON.parse(data);
        if (!this.memory.projects) {
          this.memory.projects = [];
        }
      } catch (e) {
        this.memory = { projects: [] };
      }
    }
  }

  private save() {
    fs.writeFileSync(this.file, JSON.stringify(this.memory, null, 4), "utf-8");
  }

  public add(key: string, value: any) {
    this.memory[key] = value;
    this.save();
  }

  public get(key: string): any {
    return this.memory[key] || null;
  }

  public addProject(name: string, info: any) {
    this.memory.projects.push({
      name: name,
      info: info
    });
    this.save();
  }

  public getProjects() {
    return this.memory.projects;
  }
}
