import { exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import * as vscode from 'vscode'
import { getOutputChannel } from '../extension'
import { VersionService } from '../services/version.service'

const execAsync = promisify(exec)

/**
 * Command: pdf-validator.push
 * Push current branch and submodule to origin
 */
export function pushCommand() {
  return async () => {
    const output = getOutputChannel()
    output.appendLine('\n=== Push Command Triggered ===')
    output.show(true)

    try {
      const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
      if (!workspaceRoot) {
        vscode.window.showErrorMessage('No workspace folder found')
        return
      }

      const versionService = new VersionService(workspaceRoot)
      const currentBranch = await versionService.getCurrentBranch()

      // Confirm push
      const confirmed = await vscode.window.showInformationMessage(
        `Push branch "${currentBranch}" to origin?`,
        { modal: true },
        'Push',
        'Cancel'
      )

      if (confirmed !== 'Push') {
        output.appendLine('User cancelled push')
        return
      }

      const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
      statusBar.show()

      try {
        // Step 1: Push submodule
        const submodulePath = path.join(workspaceRoot, 'src', 'validator')
        if (fs.existsSync(submodulePath)) {
          statusBar.text = '$(loading~spin) Pushing submodule...'
          output.appendLine('[1/2] Pushing submodule...')
          try {
            await execAsync(`git push origin ${currentBranch}`, { cwd: submodulePath })
            output.appendLine('Submodule pushed')
          } catch {
            output.appendLine('Submodule push skipped (no remote branch or no changes)')
          }
        } else {
          output.appendLine('[1/2] No submodule found, skipping')
        }

        // Step 2: Push main repo
        statusBar.text = '$(loading~spin) Pushing main repo...'
        output.appendLine('[2/2] Pushing main repo...')
        await execAsync(`git push origin ${currentBranch}`, { cwd: workspaceRoot })
        output.appendLine('Main repo pushed')

        statusBar.text = '$(check) Push complete!'
        output.appendLine(`\n=== Push completed for ${currentBranch} ===\n`)
        vscode.window.showInformationMessage(`Pushed ${currentBranch} to origin`)

        setTimeout(() => statusBar.hide(), 3000)
      } catch (error) {
        statusBar.hide()
        throw error
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      output.appendLine(`\nERROR: ${msg}`)
      output.appendLine('=== Push Failed ===\n')
      vscode.window.showErrorMessage(`Push failed: ${msg}`)
    }
  }
}
