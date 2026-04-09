import fs from "fs";

export class PluginService {
  private plugins: Record<string, (data: any) => Promise<string>> = {};

  constructor() {
    // Register default plugins
    this.register("web", async (data: any) => {
      const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Site</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white flex items-center justify-center min-h-screen">
    <div class="text-center p-8 border border-cyan-500/30 rounded-3xl bg-white/5 backdrop-blur-xl">
        <h1 class="text-4xl font-bold mb-4 text-cyan-400">${data}</h1>
        <p class="text-white/60">تم إنشاء هذا الموقع تلقائياً بواسطة نظام AI 3D Nexus</p>
    </div>
</body>
</html>`;
      fs.writeFileSync("index.html", html, "utf-8");
      return "تم إنشاء الموقع بنجاح وحفظه في index.html";
    });
  }

  public register(name: string, func: (data: any) => Promise<string>) {
    this.plugins[name] = func;
  }

  public async run(name: string, data: any): Promise<string> {
    if (this.plugins[name]) {
      return await this.plugins[name](data);
    }
    return "Plugin not found";
  }

  public hasPlugin(name: string): boolean {
    return !!this.plugins[name];
  }
}

export const pluginService = new PluginService();
