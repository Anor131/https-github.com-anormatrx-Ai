import { execSync } from "child_process";

export class GitHubService {
  /**
   * Gets the current git status
   */
  public getStatus(): string {
    try {
      return execSync("git status", { encoding: "utf-8" });
    } catch (error) {
      return "Git not initialized or error running git status";
    }
  }

  /**
   * Commits changes with a message
   */
  public commit(message: string): string {
    try {
      execSync("git add .", { encoding: "utf-8" });
      return execSync(`git commit -m "${message}"`, { encoding: "utf-8" });
    } catch (error) {
      return `Commit failed: ${String(error)}`;
    }
  }

  /**
   * Pushes changes to the remote
   */
  public push(): string {
    try {
      return execSync("git push", { encoding: "utf-8" });
    } catch (error) {
      return `Push failed: ${String(error)}`;
    }
  }

  /**
   * Pulls changes from the remote
   */
  public pull(): string {
    try {
      return execSync("git pull", { encoding: "utf-8" });
    } catch (error) {
      return `Pull failed: ${String(error)}`;
    }
  }
}

export const gitHubService = new GitHubService();
