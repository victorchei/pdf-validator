import { exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import * as vscode from 'vscode'

const execAsync = promisify(exec)

export type VersionType = 'MAJOR' | 'MINOR' | 'PATCH'

interface SemVer {
  major: number
  minor: number
  patch: number
}

export class VersionService {
  private workspaceRoot: string

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot
  }

  /**
   * Parse version string to SemVer object
   * @param version - Version string like "1.0.0" or "v1.0.0"
   * @returns SemVer object or null if invalid
   */
  parseVersion(version: string): SemVer | null {
    const cleaned = version.replace(/^v/, '')
    const match = cleaned.match(/^(\d+)\.(\d+)\.(\d+)$/)

    if (!match) {
      return null
    }

    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10),
    }
  }

  /**
   * Format SemVer object to string
   * @param version - SemVer object
   * @param withPrefix - Add 'v' prefix
   * @returns Formatted version string
   */
  formatVersion(version: SemVer, withPrefix: boolean = true): string {
    const formatted = `${version.major}.${version.minor}.${version.patch}`
    return withPrefix ? `v${formatted}` : formatted
  }

  /**
   * Get current version from package.json
   * @returns Current version string like "v1.0.0" or error
   */
  async getCurrentVersion(): Promise<string> {
    try {
      const packageJsonPath = path.join(this.workspaceRoot, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      const version = packageJson.version

      if (!version || !this.parseVersion(version)) {
        throw new Error('Invalid version format in package.json')
      }

      return `v${version}`
    } catch (error) {
      throw new Error(`Failed to read current version: ${error}`)
    }
  }

  /**
   * Calculate new version based on increment type
   * @param currentVersion - Current version like "v1.0.0"
   * @param type - Type of increment: MAJOR, MINOR, or PATCH
   * @returns New version string like "v1.1.0"
   */
  calculateNewVersion(currentVersion: string, type: VersionType): string {
    const parsed = this.parseVersion(currentVersion)

    if (!parsed) {
      throw new Error(`Invalid current version: ${currentVersion}`)
    }

    const newVersion: SemVer = { ...parsed }

    switch (type) {
      case 'MAJOR':
        newVersion.major += 1
        newVersion.minor = 0
        newVersion.patch = 0
        break
      case 'MINOR':
        newVersion.minor += 1
        newVersion.patch = 0
        break
      case 'PATCH':
        newVersion.patch += 1
        break
    }

    return this.formatVersion(newVersion, true)
  }

  /**
   * Validate version format (vX.Y.Z)
   * @param version - Version string to validate
   * @returns true if valid SemVer format
   */
  validateVersionFormat(version: string): boolean {
    return this.parseVersion(version) !== null
  }

  /**
   * Get current Git branch name
   * @returns Branch name like "master" or "v1.0.1"
   */
  async getCurrentBranch(): Promise<string> {
    try {
      const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD', {
        cwd: this.workspaceRoot,
      })
      return stdout.trim()
    } catch (error) {
      throw new Error(`Failed to get current branch: ${error}`)
    }
  }

  /**
   * Check if current branch is master
   * @returns true if on master branch
   */
  async isOnMasterBranch(): Promise<boolean> {
    const branch = await this.getCurrentBranch()
    return branch === 'master' || branch === 'main'
  }

  /**
   * Validate if version creation is allowed for current branch and type
   * @param branchName - Current branch name
   * @param versionType - Type of version being created
   * @returns Validation result with error message if invalid
   */
  validateVersionCreation(branchName: string, versionType: VersionType): { isValid: boolean; error?: string } {
    // PATCH versions can be created from any branch
    if (versionType === 'PATCH') {
      return { isValid: true }
    }

    // MAJOR and MINOR can only be created from master
    if (branchName !== 'master' && branchName !== 'main') {
      return {
        isValid: false,
        error: `❌ ${versionType} version can only be created from master branch. Current branch: ${branchName}`,
      }
    }

    return { isValid: true }
  }

  /**
   * Detect the main branch name (master or main) for a given repo
   */
  async detectMainBranch(repoPath: string = this.workspaceRoot): Promise<string> {
    try {
      const { stdout } = await execAsync('git branch --list main master', { cwd: repoPath })
      const branches = stdout.trim().split('\n').map((b) => b.replace(/^\*?\s+/, '').trim())
      if (branches.includes('main')) return 'main'
      if (branches.includes('master')) return 'master'
      return 'main'
    } catch {
      return 'main'
    }
  }

  /**
   * Check if Git working directory is clean
   * @returns true if no uncommitted changes
   */
  async isGitClean(): Promise<boolean> {
    try {
      const { stdout } = await execAsync('git status --porcelain', {
        cwd: this.workspaceRoot,
      })
      return stdout.trim().length === 0
    } catch (error) {
      throw new Error(`Failed to check Git status: ${error}`)
    }
  }

  /**
   * Get list of all version branches
   * @returns Array of version branch names like ['v1.0.0', 'v1.0.1', 'v1.1.0']
   */
  async getVersionBranches(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('git branch -r', {
        cwd: this.workspaceRoot,
      })

      const branches = stdout
        .split('\n')
        .map((b) => b.trim())
        .filter((b) => b.startsWith('origin/v') && this.validateVersionFormat(b.split('/')[1]))
        .map((b) => b.split('/')[1])

      return [...new Set(branches)].sort() // Remove duplicates and sort
    } catch (error) {
      throw new Error(`Failed to list version branches: ${error}`)
    }
  }

  /**
   * Create a new version branch and update package.json
   * @param newVersion - New version string like "v1.0.1"
   * @param versionType - Type of version being created
   * @returns Success message
   */
  async createVersionBranch(newVersion: string, versionType: VersionType): Promise<string> {
    // Validate version format
    if (!this.validateVersionFormat(newVersion)) {
      throw new Error(`Invalid version format: ${newVersion}`)
    }

    // Create branch
    try {
      await execAsync(`git checkout -b ${newVersion}`, {
        cwd: this.workspaceRoot,
      })

      // Update package.json in main repo
      await this.updatePackageJsonVersion(newVersion)

      // Update submodule
      const submodulePath = path.join(this.workspaceRoot, 'src', 'validator')
      const hasSubmodule = fs.existsSync(path.join(submodulePath, '.git')) || fs.existsSync(submodulePath)
      if (hasSubmodule) {
        // Detect submodule main branch (main or master)
        const submoduleMainBranch = await this.detectMainBranch(submodulePath)

        // Checkout main branch in submodule first
        await execAsync(`git checkout ${submoduleMainBranch}`, {
          cwd: submodulePath,
        })

        // Create version branch in submodule from main branch
        await execAsync(`git checkout -b ${newVersion}`, {
          cwd: submodulePath,
        })

        // Update package.json in submodule
        await this.updatePackageJsonVersion(newVersion, submodulePath)

        // Commit in submodule
        await execAsync(`git add package.json && git commit -m "chore: bump version to ${newVersion}"`, {
          cwd: submodulePath,
        })
      }

      // Commit in main repo (include submodule reference if exists)
      const filesToAdd = hasSubmodule ? 'package.json src/validator' : 'package.json'
      await execAsync(`git add ${filesToAdd} && git commit -m "chore: Create ${newVersion}"`, {
        cwd: this.workspaceRoot,
      })

      return `Created branch ${newVersion} and updated version in both repos`
    } catch (error) {
      throw new Error(`Failed to create version branch: ${error}`)
    }
  }

  /**
   * Update package.json with new version
   * @param version - New version like "v1.0.1" or "1.0.1"
   * @param repoPath - Path to repository (default: main workspace)
   */
  private async updatePackageJsonVersion(version: string, repoPath: string = this.workspaceRoot): Promise<void> {
    const packageJsonPath = path.join(repoPath, 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

    // Remove 'v' prefix for package.json
    packageJson.version = version.replace(/^v/, '')

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
  }

  /**
   * Compare two versions
   * @param v1 - First version
   * @param v2 - Second version
   * @returns -1 if v1 < v2, 0 if equal, 1 if v1 > v2
   */
  compareVersions(v1: string, v2: string): number {
    const parsed1 = this.parseVersion(v1)
    const parsed2 = this.parseVersion(v2)

    if (!parsed1 || !parsed2) {
      throw new Error('Invalid version format for comparison')
    }

    if (parsed1.major !== parsed2.major) {
      return parsed1.major < parsed2.major ? -1 : 1
    }
    if (parsed1.minor !== parsed2.minor) {
      return parsed1.minor < parsed2.minor ? -1 : 1
    }
    if (parsed1.patch !== parsed2.patch) {
      return parsed1.patch < parsed2.patch ? -1 : 1
    }

    return 0
  }
}

/**
 * Helper function to ask user for version type
 * @returns Selected version type or undefined if cancelled
 */
export async function askVersionType(): Promise<VersionType | undefined> {
  const selection = await vscode.window.showQuickPick(
    [
      {
        label: '🔴 MAJOR',
        description: 'Breaking changes (x.0.0)',
        value: 'MAJOR',
      },
      {
        label: '🟢 MINOR',
        description: 'New features (x.y.0)',
        value: 'MINOR',
      },
      {
        label: '🔵 PATCH',
        description: 'Bug fixes (x.y.z)',
        value: 'PATCH',
      },
    ],
    {
      placeHolder: 'Select version type (only MAJOR/MINOR from master)',
      matchOnDescription: true,
    }
  )

  return selection?.value as VersionType | undefined
}

/**
 * Show version creation preview
 * @param currentVersion - Current version
 * @param newVersion - New version being created
 * @param versionType - Type of version
 * @returns true if user confirmed
 */
export async function confirmVersionCreation(
  currentVersion: string,
  newVersion: string,
  versionType: VersionType
): Promise<boolean> {
  const result = await vscode.window.showInformationMessage(
    `Create new ${versionType} version?\n\n${currentVersion} → ${newVersion}`,
    { modal: true },
    'Create',
    'Cancel'
  )

  return result === 'Create'
}
