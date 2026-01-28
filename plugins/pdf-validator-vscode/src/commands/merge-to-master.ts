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
 * Command: pdf-validator.mergeToMaster
 * Merge current branch to master with CHANGELOG generation
 * - Generate CHANGELOG for current version
 * - Commit CHANGELOG in both repos
 * - Merge branch into master
 * - Sync submodule
 */
export function mergeToMasterCommand() {
  return async () => {
    const output = getOutputChannel()
    output.appendLine('\n=== Merge to Master Command Triggered ===')
    output.show(true)

    try {
      const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
      if (!workspaceRoot) {
        vscode.window.showErrorMessage('No workspace folder found')
        return
      }

      const versionService = new VersionService(workspaceRoot)
      const changelogService = new ChangelogService(workspaceRoot)
      const currentBranch = await versionService.getCurrentBranch()
      const currentVersion = await versionService.getCurrentVersion()

      // Validate: cannot merge from master
      if (currentBranch === 'master' || currentBranch === 'main') {
        vscode.window.showErrorMessage('Cannot merge master into master. Switch to a feature or version branch first.')
        return
      }

      // Check git is clean
      const isClean = await versionService.isGitClean()
      if (!isClean) {
        vscode.window.showErrorMessage('Git working directory has uncommitted changes. Please commit or stash first.')
        return
      }

      // Confirm
      const confirmed = await vscode.window.showInformationMessage(
        `Merge "${currentBranch}" (${currentVersion}) into master?\n\nThis will:\n1. Generate CHANGELOG\n2. Commit CHANGELOG\n3. Merge into master\n4. Sync submodule`,
        { modal: true },
        'Merge',
        'Cancel'
      )

      if (confirmed !== 'Merge') {
        output.appendLine('User cancelled merge')
        return
      }

      const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
      statusBar.show()
      const submodulePath = path.join(workspaceRoot, 'src', 'validator')
      const hasSubmodule = fs.existsSync(submodulePath)

      try {
        // Step 1: Generate and commit CHANGELOG in submodule
        if (hasSubmodule) {
          statusBar.text = '$(loading~spin) Updating submodule CHANGELOG...'
          output.appendLine('[1/6] Generating CHANGELOG for submodule...')
          const subChangelogService = new ChangelogService(submodulePath)
          await subChangelogService.updateChangelogFile(currentVersion, submodulePath)
          try {
            await execAsync(
              `git add CHANGELOG.md && git commit -m "docs: Add CHANGELOG for ${currentVersion}"`,
              { cwd: submodulePath }
            )
            output.appendLine('Submodule CHANGELOG committed')
          } catch {
            output.appendLine('No submodule CHANGELOG changes to commit')
          }
        } else {
          output.appendLine('[1/6] Submodule not found, skipping')
        }

        // Step 2: Generate and commit CHANGELOG in main repo
        statusBar.text = '$(loading~spin) Updating main CHANGELOG...'
        output.appendLine('[2/6] Generating CHANGELOG for main repo...')
        await changelogService.updateChangelogFile(currentVersion, workspaceRoot)
        try {
          const addFiles = hasSubmodule ? 'CHANGELOG.md src/validator' : 'CHANGELOG.md'
          await execAsync(
            `git add ${addFiles} && git commit -m "docs: Add CHANGELOG for ${currentVersion}"`,
            { cwd: workspaceRoot }
          )
          output.appendLine('Main repo CHANGELOG committed')
        } catch {
          output.appendLine('No main repo CHANGELOG changes to commit')
        }

        // Step 3: Merge submodule to master
        if (hasSubmodule) {
          statusBar.text = '$(loading~spin) Merging submodule to master...'
          output.appendLine('[3/6] Merging submodule to master...')
          await execAsync(`git checkout master && git merge ${currentBranch}`, {
            cwd: submodulePath,
          })
          output.appendLine('Submodule merged to master')
        } else {
          output.appendLine('[3/6] Submodule not found, skipping')
        }

        // Step 4: Checkout master in main repo
        statusBar.text = '$(loading~spin) Merging to master...'
        output.appendLine('[4/6] Checking out master...')
        await execAsync('git checkout master', { cwd: workspaceRoot })
        output.appendLine('Switched to master')

        // Step 5: Merge branch into master
        output.appendLine('[5/6] Merging branch into master...')
        await execAsync(`git merge ${currentBranch}`, { cwd: workspaceRoot })
        output.appendLine(`Merged ${currentBranch} into master`)

        // Step 6: Update submodule reference
        if (hasSubmodule) {
          statusBar.text = '$(loading~spin) Syncing submodule...'
          output.appendLine('[6/6] Syncing submodule reference...')
          try {
            await execAsync(
              'git add src/validator && git commit -m "chore: Sync validator submodule after merge"',
              { cwd: workspaceRoot }
            )
            output.appendLine('Submodule reference updated')
          } catch {
            output.appendLine('Submodule reference already up to date')
          }
        } else {
          output.appendLine('[6/6] Submodule sync skipped')
        }

        statusBar.text = '$(check) Merge complete!'
        output.appendLine(`\n=== Merged ${currentBranch} into master successfully ===\n`)
        vscode.window.showInformationMessage(
          `Merged ${currentBranch} (${currentVersion}) into master. Don't forget to push!`
        )

        setTimeout(() => statusBar.hide(), 3000)
      } catch (error) {
        statusBar.hide()
        // Try to go back to original branch on failure
        try {
          await execAsync(`git checkout ${currentBranch}`, { cwd: workspaceRoot })
          if (hasSubmodule) {
            await execAsync(`git checkout ${currentBranch}`, { cwd: submodulePath })
          }
        } catch { /* best effort */ }
        throw error
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      output.appendLine(`\nERROR: ${msg}`)
      output.appendLine('=== Merge to Master Failed ===\n')
      vscode.window.showErrorMessage(`Merge failed: ${msg}`)
    }
  }
}
