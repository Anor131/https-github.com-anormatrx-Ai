export class MissionControl {
  private genAI: any;
  private planner: any;
  private gemma: any;

  constructor(genAI: any, planner: any, gemma: any) {
    this.genAI = genAI;
    this.planner = planner;
    this.gemma = gemma;
  }

  public async executeMission(task: string, openaiApiKey?: string): Promise<string> {
    console.log("💀 Gemini: Analyzing risks and cleaning context...");
    
    // 1. Gemini Pre-check (Advisor)
    let cleanedTask = task;
    if (this.genAI) {
      try {
        const preCheckResult = await this.genAI.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: "user", parts: [{ text: `قم بتحليل مخاطر الأمر التالي وتنظيف سياقه ليكون جاهزاً للتنفيذ البرمجي. أرجع فقط النص المنظف:\n\n${task}` }] }]
        });
        cleanedTask = preCheckResult.text || task;
      } catch (error) {
        console.error("Gemini Pre-check failed:", error);
      }
    }

    console.log("🧠 GPT-4: Generating plan...");
    // 2. The Planner (GPT-4)
    const plan = await this.planner.plan(cleanedTask, openaiApiKey, this.genAI);
    
    console.log("⚙️ Gemma: Executing raw tasks...");
    // 3. The Executor (Gemma-3-Local)
    const rawWork = await this.gemma.execute(JSON.stringify(plan));
    
    // 4. Gemini Post-check (The Gate)
    return this.callGeminiToFinalize(rawWork);
  }

  private async callGeminiToFinalize(work: string): Promise<string> {
    console.log("💀 Gemini: Cleaning and securing the mission...");
    
    if (!this.genAI) return work;

    try {
      const postCheckResult = await this.genAI.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [{ role: "user", parts: [{ text: `قم بمراجعة، تنظيف، وإصلاح هذا المخرج وربطه بالأشفات قبل العرض النهائي. أرجع النسخة النهائية الآمنة فقط:\n\n${work}` }] }]
      });
      return postCheckResult.text || work;
    } catch (error) {
      console.error("Gemini Post-check failed:", error);
      return work;
    }
  }
}
