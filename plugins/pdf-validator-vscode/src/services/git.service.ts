import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { Commit } from '../types'
import { logger } from '../utils/logger'

export class GitService {
  private mainRepoPath: string
  private submodulePath: string

  constructor(mainRepoPath: string) {
    this.mainRepoPath = mainRepoPath
    this.submodulePath = path.join(mainRepoPath, 'src', 'validator')
  }

  /**
   * Execute git command in specified directory
   */
  private executeGit(command: string, repoPath: string): string {
    try {
      logger.debug(`Executing: git ${command} in ${repoPath}`)
      const result = execSync(`cd ${repoPath} && git ${command}`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      })
      return result.trim()
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      logger.error(`Git command failed: ${command}\n${errorMsg}`)
      throw error
    }
  }

  /**
   * Get current branch
   */
  async getCurrentBranch(isSubmodule: boolean = false): Promise<string> {
    const repoPath = isSubmodule ? this.submodulePath : this.mainRepoPath
    const branch = this.executeGit('rev-parse --abbrev-ref HEAD', repoPath)
    return branch
  }

  /**
   * Create branch in repo and submodule
   */
  async createBranch(branchName: string): Promise<void> {
    try {
      logger.info(`Creating branch: ${branchName}`)

      // Create in main repo
      this.executeGit(`checkout -b ${branchName}`, this.mainRepoPath)
      logger.success(`Branch created in main repo: ${branchName}`)

      // Create in submodule
      this.executeGit(`checkout -b ${branchName}`, this.submodulePath)
      logger.success(`Branch created in submodule: ${branchName}`)

      // Update submodule reference in main repo
      this.executeGit('add src/validator', this.mainRepoPath)
      this.executeGit(`commit -m "chore: Update validator submodule to ${branchName}"`, this.mainRepoPath)
      logger.success(`Submodule reference updated`)
    } catch (error) {
      logger.error(`Failed to create branch: ${branchName}`)
      throw error
    }
  }

  /**
   * Checkout branch in both repos
   */
  async checkoutBranch(branchName: string): Promise<void> {
    try {
      logger.info(`Checking out branch: ${branchName}`)

      // Checkout in main repo
      this.executeGit(`checkout ${branchName}`, this.mainRepoPath)
      logger.success(`Switched to ${branchName} in main repo`)

      // Checkout in submodule
      this.executeGit(`checkout ${branchName}`, this.submodulePath)
      logger.success(`Switched to ${branchName} in submodule`)
    } catch (error) {
      logger.error(`Failed to checkout branch: ${branchName}`)
      throw error
    }
  }

  /**
   * List all branches
   */
  async listBranches(): Promise<string[]> {
    try {
      const branches = this.executeGit('branch -a', this.mainRepoPath)
      return branches
        .split('\n')
        .map((b) => b.replace(/^\*?\s+/, '').trim())
        .filter((b) => b.length > 0)
    } catch (error) {
      logger.error('Failed to list branches')
      return []
    }
  }

  /**
   * Get commits since another branch
   */
  async getCommitsSince(fromBranch: string, toBranch: string = 'HEAD'): Promise<Commit[]> {
    try {
      const format = '%h|%s|%an|%ai'
      const log = this.executeGit(`log ${fromBranch}..${toBranch} --pretty=format:"${format}"`, this.mainRepoPath)

      if (!log) {
        return []
      }

      return log.split('\n').map((line) => {
        const [hash, message, author, date] = line.split('|')
        return {
          hash: hash.trim(),
          message: message.trim(),
          author: author.trim(),
          date: new Date(date.trim()),
        }
      })
    } catch (error) {
      logger.warning('Failed to get commits')
      return []
    }
  }

  /**
   * Commit changes
   */
  async commit(message: string, files?: string[]): Promise<void> {
    try {
      if (files && files.length > 0) {
        const fileStr = files.join(' ')
        this.executeGit(`add ${fileStr}`, this.mainRepoPath)
      } else {
        this.executeGit('add -A', this.mainRepoPath)
      }

      this.executeGit(`commit -m "${message}"`, this.mainRepoPath)
      logger.success(`Committed: ${message}`)
    } catch (error) {
      logger.error(`Failed to commit: ${message}`)
      throw error
    }
  }

  /**
   * Push branch
   */
  async push(branchName?: string): Promise<void> {
    try {
      const branch = branchName || (await this.getCurrentBranch())
      logger.info(`Pushing ${branch}...`)

      // Push main repo
      this.executeGit(`push origin ${branch}`, this.mainRepoPath)
      logger.success(`Pushed main repo: ${branch}`)

      // Push submodule
      this.executeGit(`push origin ${branch}`, this.submodulePath)
      logger.success(`Pushed submodule: ${branch}`)
    } catch (error) {
      logger.error('Failed to push')
      throw error
    }
  }

  /**
   * Merge to master
   */
  async mergeToMaster(fromBranch: string): Promise<void> {
    try {
      logger.info(`Merging ${fromBranch} to master...`)

      // Merge in main repo
      this.executeGit('checkout master', this.mainRepoPath)
      this.executeGit(`merge ${fromBranch}`, this.mainRepoPath)
      logger.success('Merged in main repo')

      // Merge in submodule
      this.executeGit('checkout master', this.submodulePath)
      this.executeGit(`merge ${fromBranch}`, this.submodulePath)
      logger.success('Merged in submodule')

      // Update submodule reference
      this.executeGit('add src/validator', this.mainRepoPath)
      this.executeGit('commit -m "chore: Update validator submodule to master"', this.mainRepoPath)
    } catch (error) {
      logger.error('Failed to merge to master')
      throw error
    }
  }

  /**
   * Check if directory is a git repository
   */
  isGitRepository(repoPath: string): boolean {
    const gitPath = path.join(repoPath, '.git')
    return fs.existsSync(gitPath)
  }

  /**
   * Get modified files
   */
  async getModifiedFiles(): Promise<string[]> {
    try {
      const status = this.executeGit('status --short', this.mainRepoPath)
      return status.split('\n').filter((s) => s.length > 0)
    } catch (error) {
      return []
    }
  }
}
