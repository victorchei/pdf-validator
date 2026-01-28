import { exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface CommitEntry {
  hash: string
  message: string
  author: string
  date: string
}

export class ChangelogService {
  private workspaceRoot: string

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot
  }

  /**
   * Get commits between current branch and master
   */
  async getCommitsSinceMaster(repoPath: string = this.workspaceRoot): Promise<CommitEntry[]> {
    try {
      const { stdout } = await execAsync(
        'git log master..HEAD --pretty=format:"%h|%s|%an|%ai"',
        { cwd: repoPath }
      )

      if (!stdout.trim()) {
        return []
      }

      return stdout
        .trim()
        .split('\n')
        .map((line) => {
          const [hash, message, author, date] = line.replace(/^"|"$/g, '').split('|')
          return { hash, message, author, date }
        })
    } catch {
      return []
    }
  }

  /**
   * Categorize commits by conventional commit type
   */
  categorizeCommits(commits: CommitEntry[]): Record<string, CommitEntry[]> {
    const categories: Record<string, CommitEntry[]> = {
      'Breaking Changes': [],
      'Features': [],
      'Bug Fixes': [],
      'Other': [],
    }

    for (const commit of commits) {
      const msg = commit.message.toLowerCase()
      if (msg.startsWith('feat!') || msg.includes('breaking')) {
        categories['Breaking Changes'].push(commit)
      } else if (msg.startsWith('feat')) {
        categories['Features'].push(commit)
      } else if (msg.startsWith('fix')) {
        categories['Bug Fixes'].push(commit)
      } else {
        categories['Other'].push(commit)
      }
    }

    return categories
  }

  /**
   * Generate CHANGELOG content for a version
   */
  async generateChangelog(version: string, repoPath: string = this.workspaceRoot): Promise<string> {
    const commits = await this.getCommitsSinceMaster(repoPath)
    const categories = this.categorizeCommits(commits)
    const date = new Date().toISOString().split('T')[0]

    let content = `## [${version}] - ${date}\n\n`

    for (const [category, entries] of Object.entries(categories)) {
      if (entries.length === 0) continue
      content += `### ${category}\n\n`
      for (const entry of entries) {
        content += `- ${entry.message} (${entry.hash})\n`
      }
      content += '\n'
    }

    if (commits.length === 0) {
      content += `- Version ${version} release\n\n`
    }

    return content
  }

  /**
   * Prepend changelog entry to CHANGELOG.md
   */
  async updateChangelogFile(version: string, repoPath: string = this.workspaceRoot): Promise<void> {
    const changelogPath = path.join(repoPath, 'CHANGELOG.md')
    const newContent = await this.generateChangelog(version, repoPath)

    let existing = ''
    if (fs.existsSync(changelogPath)) {
      existing = fs.readFileSync(changelogPath, 'utf-8')
    }

    // Insert after header or at beginning
    const headerMatch = existing.match(/^# .+\n\n?/)
    if (headerMatch) {
      const header = headerMatch[0]
      const rest = existing.slice(header.length)
      fs.writeFileSync(changelogPath, header + newContent + rest)
    } else {
      fs.writeFileSync(changelogPath, `# Changelog\n\n${newContent}${existing}`)
    }
  }
}
