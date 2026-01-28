import * as vscode from 'vscode'
import { getOutputChannel } from '../extension'
import { askVersionType, confirmVersionCreation, VersionService } from '../services/version.service'

/**
 * Command: pdf-validator.createVersion
 * Creates a new version branch with automatic SemVer calculation
 * - MAJOR/MINOR: Only from master branch
 * - PATCH: Can be created from any branch
 */
export function createVersionCommand(_context: vscode.ExtensionContext) {
  return async () => {
    const output = getOutputChannel()
    output.appendLine('\n=== Create New Version Command Triggered ===')
    output.show(true) // Show output channel but don't steal focus

    console.log('[createVersionCommand] Command triggered')
    try {
      const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath

      if (!workspaceRoot) {
        const msg = 'No workspace folder found'
        output.appendLine(`ERROR: ${msg}`)
        console.error('[createVersionCommand]', msg)
        vscode.window.showErrorMessage(`❌ ${msg}`)
        return
      }

      output.appendLine(`Workspace root: ${workspaceRoot}`)
      console.log('[createVersionCommand] Workspace root:', workspaceRoot)

      const versionService = new VersionService(workspaceRoot)
      const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
      statusBar.show()

      try {
        // Step 1: Check Git is clean
        statusBar.text = '$(loading~spin) Checking Git status...'
        output.appendLine('\n[1/8] Checking Git status...')
        console.log('[createVersionCommand] Checking Git status...')
        const isClean = await versionService.isGitClean()
        output.appendLine(`Git is clean: ${isClean}`)

        if (!isClean) {
          const msg = 'Git working directory has uncommitted changes. Please commit or stash them first.'
          output.appendLine(`ERROR: ${msg}`)
          console.warn('[createVersionCommand] Git has uncommitted changes')
          vscode.window.showErrorMessage(`❌ ${msg}`)
          statusBar.hide()
          return
        }

        // Step 2: Get current branch
        statusBar.text = '$(loading~spin) Getting current branch...'
        output.appendLine('\n[2/8] Getting current branch...')
        console.log('[createVersionCommand] Getting current branch...')
        const currentBranch = await versionService.getCurrentBranch()
        output.appendLine(`Current branch: ${currentBranch}`)
        console.log('[createVersionCommand] Current branch:', currentBranch)

        // Step 3: Get current version
        statusBar.text = '$(loading~spin) Reading current version...'
        output.appendLine('\n[3/8] Reading current version...')
        console.log('[createVersionCommand] Reading current version...')
        const currentVersion = await versionService.getCurrentVersion()
        output.appendLine(`Current version: ${currentVersion}`)
        console.log('[createVersionCommand] Current version:', currentVersion)

        // Step 4: Ask for version type
        statusBar.text = '$(info) Waiting for version type selection...'
        output.appendLine('\n[4/8] Asking for version type...')
        console.log('[createVersionCommand] Asking for version type...')
        const versionType = await askVersionType()

        if (!versionType) {
          output.appendLine('User cancelled version type selection')
          console.log('[createVersionCommand] User cancelled version type selection')
          statusBar.hide()
          return // User cancelled
        }

        output.appendLine(`Selected version type: ${versionType}`)
        console.log('[createVersionCommand] Selected version type:', versionType)

        // Step 5: Validate branch for version type
        output.appendLine('\n[5/8] Validating version creation...')
        console.log('[createVersionCommand] Validating version creation...')
        const validation = versionService.validateVersionCreation(currentBranch, versionType)

        if (!validation.isValid) {
          output.appendLine(`ERROR: Validation failed - ${validation.error}`)
          console.error('[createVersionCommand] Validation failed:', validation.error)
          vscode.window.showErrorMessage(validation.error!)
          statusBar.hide()
          return
        }
        output.appendLine('Validation passed')

        // Step 6: Calculate new version
        statusBar.text = '$(loading~spin) Calculating new version...'
        output.appendLine('\n[6/8] Calculating new version...')
        console.log('[createVersionCommand] Calculating new version...')
        const newVersion = versionService.calculateNewVersion(currentVersion, versionType)
        output.appendLine(`New version: ${newVersion}`)
        console.log('[createVersionCommand] New version:', newVersion)

        // Step 7: Confirm creation
        output.appendLine('\n[7/8] Asking for confirmation...')
        console.log('[createVersionCommand] Asking for confirmation...')
        const confirmed = await confirmVersionCreation(currentVersion, newVersion, versionType)

        if (!confirmed) {
          output.appendLine('User cancelled confirmation')
          console.log('[createVersionCommand] User cancelled confirmation')
          statusBar.hide()
          return
        }
        output.appendLine('User confirmed')

        // Step 8: Create branch and update files
        statusBar.text = `$(loading~spin) Creating branch ${newVersion}...`
        output.appendLine(`\n[8/8] Creating version branch ${newVersion}...`)
        console.log('[createVersionCommand] Creating version branch...')
        const message = await versionService.createVersionBranch(newVersion, versionType)

        statusBar.text = '$(check) Version branch created!'
        output.appendLine(`\n✅ SUCCESS: ${message}`)
        output.appendLine('=== Command Completed Successfully ===\n')
        console.log('[createVersionCommand] Success:', message)
        vscode.window.showInformationMessage(`✅ ${message}`)

        // Auto-hide status bar after 3 seconds
        setTimeout(() => statusBar.hide(), 3000)
      } catch (error) {
        statusBar.hide()
        const errorMessage = error instanceof Error ? error.message : String(error)
        output.appendLine(`\n❌ ERROR: ${errorMessage}`)
        output.appendLine('=== Command Failed ===\n')
        console.error('[createVersionCommand] Error:', errorMessage, error)
        vscode.window.showErrorMessage(`❌ Error: ${errorMessage}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      output.appendLine(`\n❌ UNEXPECTED ERROR: ${errorMessage}`)
      output.appendLine('=== Command Failed ===\n')
      console.error('[createVersionCommand] Unexpected error:', errorMessage, error)
      vscode.window.showErrorMessage(`❌ Unexpected error: ${errorMessage}`)
    }
  }
}
