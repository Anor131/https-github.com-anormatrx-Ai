export class GemmaService {
  /**
   * Executes a prompt using local Gemma 3 4B via Ollama
   */
  public async execute(prompt: string): Promise<string> {
    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemma-3-4b-it-abliterated",
          prompt: prompt,
          stream: false
        })
      });
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Gemma execution failed:", error);
      return "فشل الاتصال بمحرك Gemma المحلي (Ollama).";
    }
  }
}
