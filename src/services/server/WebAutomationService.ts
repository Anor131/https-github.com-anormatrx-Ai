import axios from "axios";
import * as cheerio from "cheerio";

export class WebAutomationService {
  /**
   * Fetches the content of a URL and returns the text.
   */
  public async fetchContent(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const $ = cheerio.load(response.data);
      
      // Remove script and style elements
      $('script, style').remove();
      
      return $('body').text().trim().replace(/\s+/g, ' ').substring(0, 5000);
    } catch (error) {
      console.error(`[WebAutomation] Error fetching ${url}:`, error);
      throw new Error(`Failed to fetch content from ${url}`);
    }
  }

  /**
   * Performs a simple search (simulated or via an API if available)
   */
  public async search(query: string): Promise<string> {
    // For now, we'll just return a message saying we're searching
    return `Searching for: ${query}... (Web search integration pending API key)`;
  }
}

export const webAutomationService = new WebAutomationService();
