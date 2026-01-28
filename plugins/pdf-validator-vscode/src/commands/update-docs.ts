import { exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import * as vscode from 'vscode'
import { getOutputChannel } from '../extension'
import { ChangelogService } from '../services/changelog.service'
import { VersionService } from '../services/version.service'

const execAsync = promisify(exec)

/**
 * Command: pdf-validator.updateDocs
 * Update documentation and generate CHANGELOG
 */
export function updateDocsCommand() {
  return async () => {
    const output = getOutputChannel()
    output.appendLine('\n=== Update Documentation Command Triggered ===')
    output.show(true)

    try {
      const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
      if (!workspaceRoot) {
        vscode.window.showErrorMessage('No workspace folder found')
        return
      }

      const versionService = new VersionService(workspaceRoot)
      const changelogService = new ChangelogService(workspaceRoot)
      const currentVersion = await versionService.getCurrentVersion()
      const currentBranch = await versionService.getCurrentBranch()

      // Confirm
      const confirmed = await vscode.window.showInformationMessage(
        `Update documentation and generate CHANGELOG for ${currentVersion} (branch: ${currentBranch})?`,
        { modal: true },
        'Update',
        'Cancel'
      )

      if (confirmed !== 'Update') {
        output.appendLine('User cancelled')
        return
      }

      const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
      statusBar.show()

      try {
        // Step 1: Generate CHANGELOG for main repo
        statusBar.text = '$(loading~spin) Generating CHANGELOG...'
        output.appendLine('[1/4] Generating CHANGELOG for main repo...')
        await changelogService.updateChangelogFile(currentVersion, workspaceRoot)
        output.appendLine('CHANGELOG.md updated in main repo')

        // Step 2: Generate CHANGELOG for submodule
        statusBar.text = '$(loading~spin) Updating submodule docs...'
        output.appendLine('[2/4] Generating CHANGELOG for submodule...')
        const submodulePath = path.join(workspaceRoot, 'src', 'validator')
        if (fs.existsSync(submodulePath)) {
          const subChangelogService = new ChangelogService(submodulePath)
          await subChangelogService.updateChangelogFile(currentVersion, submodulePath)
          output.appendLine('CHANGELOG.md updated in submodule')
        } else {
          output.appendLine('Submodule not found, skipping')
        }

        // Step 3: Update versions.json
        statusBar.text = '$(loading~spin) Updating versions.json...'
        output.appendLine('[3/4] Updating versions.json...')
        try {
          await execAsync('npm run generate-versions', { cwd: workspaceRoot })
          output.appendLine('versions.json updated')
        } catch {
          output.appendLine('Warning: generate-versions script not found, skipping')
        }

        // Step 4: Commit documentation changes
        statusBar.text = '$(loading~spin) Committing changes...'
        output.appendLine('[4/4] Committing documentation changes...')

        // Commit submodule changes first
        if (fs.existsSync(submodulePath)) {
          try {
            await execAsync('git add CHANGELOG.md && git commit -m "docs: Update CHANGELOG for ' + currentVersion + '"', {
              cwd: submodulePath,
            })
            output.appendLine('Submodule CHANGELOG committed')
          } catch {
            output.appendLine('No submodule changes to commit')
          }
        }

        // Commit main repo changes
        try {
          await execAsync(
            'git add CHANGELOG.md public/versions.json src/validator && git commit -m "docs: Update documentation for ' + currentVersion + '"',
            { cwd: workspaceRoot }
          )
          output.appendLine('Main repo documentation committed')
        } catch {
          output.appendLine('No main repo changes to commit')
        }

        statusBar.text = '$(check) Documentation updated!'
        output.appendLine('\n=== Documentation Updated Successfully ===\n')
        vscode.window.showInformationMessage(`Documentation updated for ${currentVersion}`)

        setTimeout(() => statusBar.hide(), 3000)
      } catch (error) {
        statusBar.hide()
        throw error
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      output.appendLine(`\nERROR: ${msg}`)
      output.appendLine('=== Update Documentation Failed ===\n')
      vscode.window.showErrorMessage(`Update documentation failed: ${msg}`)
    }
  }
}
