import { exec } from 'child_process'
import * as path from 'path'
import { promisify } from 'util'
import * as vscode from 'vscode'
import { getOutputChannel } from '../extension'
import { VersionService } from '../services/version.service'

const execAsync = promisify(exec)

/**
 * Command: pdf-validator.deploy
 * Deploy current branch to GitHub Pages
 * - master: deploys to root
 * - v*.*.*: deploys to versioned subdirectory
 */
export function deployCommand() {
  return async () => {
    const output = getOutputChannel()
    output.appendLine('\n=== Deploy Command Triggered ===')
    output.show(true)

    try {
      const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
      if (!workspaceRoot) {
        vscode.window.showErrorMessage('No workspace folder found')
        return
      }

      const versionService = new VersionService(workspaceRoot)
      const currentBranch = await versionService.getCurrentBranch()

      // Validate: deploy only from master or version branches
      const isVersionBranch = versionService.validateVersionFormat(currentBranch)
      const isMaster = currentBranch === 'master' || currentBranch === 'main'

      if (!isMaster && !isVersionBranch) {
        vscode.window.showErrorMessage(
          `Deploy is only allowed from master or version branches (v*.*.*). Current branch: ${currentBranch}`
        )
        return
      }

      // Check git is clean
      const isClean = await versionService.isGitClean()
      if (!isClean) {
        vscode.window.showErrorMessage('Git working directory has uncommitted changes. Please commit first.')
        return
      }

      // Confirm deploy
      const target = isMaster ? 'root (latest)' : `version ${currentBranch}`
      const confirmed = await vscode.window.showInformationMessage(
        `Deploy branch "${currentBranch}" to GitHub Pages (${target})?`,
        { modal: true },
        'Deploy',
        'Cancel'
      )

      if (confirmed !== 'Deploy') {
        output.appendLine('User cancelled deploy')
        return
      }

      const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
      statusBar.show()

      try {
        // Step 1: Generate versions.json
        statusBar.text = '$(loading~spin) Generating versions.json...'
        output.appendLine('[1/4] Generating versions.json...')
        try {
          await execAsync('npm run generate-versions', { cwd: workspaceRoot })
          output.appendLine('versions.json generated')
        } catch {
          output.appendLine('Warning: generate-versions script not found, skipping')
        }

        // Step 2: Build
        statusBar.text = '$(loading~spin) Building project...'
        output.appendLine('[2/4] Building project...')
        await execAsync('npm run build', { cwd: workspaceRoot })
        output.appendLine('Build complete')

        // Step 3: Push to trigger GitHub Actions deploy
        statusBar.text = '$(loading~spin) Pushing to origin...'
        output.appendLine('[3/4] Pushing to origin to trigger deploy workflow...')
        await execAsync(`git push origin ${currentBranch}`, { cwd: workspaceRoot })
        output.appendLine('Pushed to origin')

        // Step 4: Check if submodule needs push
        statusBar.text = '$(loading~spin) Checking submodule...'
        output.appendLine('[4/4] Checking submodule...')
        const submodulePath = path.join(workspaceRoot, 'src', 'validator')
        try {
          await execAsync(`git push origin ${currentBranch}`, { cwd: submodulePath })
          output.appendLine('Submodule pushed')
        } catch {
          output.appendLine('Submodule push skipped (no changes or no remote branch)')
        }

        statusBar.text = '$(check) Deploy triggered!'
        output.appendLine('\n=== Deploy triggered successfully ===')
        output.appendLine('GitHub Actions will handle the actual deployment.')
        output.appendLine('Check repository Actions tab for deploy status.')
        vscode.window.showInformationMessage(
          `Deploy triggered for ${currentBranch}. Check GitHub Actions for status.`
        )

        setTimeout(() => statusBar.hide(), 3000)
      } catch (error) {
        statusBar.hide()
        throw error
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      output.appendLine(`\nERROR: ${msg}`)
      output.appendLine('=== Deploy Failed ===\n')
      vscode.window.showErrorMessage(`Deploy failed: ${msg}`)
    }
  }
}
