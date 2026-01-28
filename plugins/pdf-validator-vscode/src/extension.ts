import * as vscode from 'vscode'
import { createVersionCommand } from './commands/create-version'
import { deployCommand } from './commands/deploy'
import { mergeToMasterCommand } from './commands/merge-to-master'
import { pushCommand } from './commands/push'
import { updateDocsCommand } from './commands/update-docs'
import { VersionService } from './services/version.service'

let versionService: VersionService
let statusBarItem: vscode.StatusBarItem
let outputChannel: vscode.OutputChannel

export function getOutputChannel(): vscode.OutputChannel {
  return outputChannel
}

class VersionTreeProvider implements vscode.TreeDataProvider<VersionItem> {
  constructor(private versionService: VersionService) {}

  getTreeItem(element: VersionItem): vscode.TreeItem {
    return element
  }

  async getChildren(element?: VersionItem): Promise<VersionItem[]> {
    if (!element) {
      // Root items
      return [
        new VersionItem(
          'Create New Version',
          'pdf-validator.createVersion',
          vscode.TreeItemCollapsibleState.None,
          '$(add)'
        ),
        new VersionItem(
          'Deploy Current Branch',
          'pdf-validator.deploy',
          vscode.TreeItemCollapsibleState.None,
          '$(rocket)'
        ),
        new VersionItem(
          'Update Documentation',
          'pdf-validator.updateDocs',
          vscode.TreeItemCollapsibleState.None,
          '$(book)'
        ),
        new VersionItem(
          'Merge to Master',
          'pdf-validator.mergeToMaster',
          vscode.TreeItemCollapsibleState.None,
          '$(git-merge)'
        ),
        new VersionItem(
          'Push',
          'pdf-validator.push',
          vscode.TreeItemCollapsibleState.None,
          '$(cloud-upload)'
        ),
        new VersionItem(
          'Show Version Info',
          'pdf-validator.showVersionInfo',
          vscode.TreeItemCollapsibleState.None,
          '$(info)'
        ),
      ]
    }
    return []
  }
}

class VersionItem extends vscode.TreeItem {
  constructor(
    label: string,
    commandId: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    icon?: string
  ) {
    super(label, collapsibleState)
    this.command = {
      command: commandId,
      title: label,
    }
    if (icon) {
      this.iconPath = new vscode.ThemeIcon(icon.replace(/\$\(|\)/g, ''))
    }
  }
}

export async function activate(context: vscode.ExtensionContext) {
  // Create output channel for logging
  outputChannel = vscode.window.createOutputChannel('PDF Validator')
  context.subscriptions.push(outputChannel)

  outputChannel.appendLine('PDF Validator Extension activated')
  console.log('PDF Validator Extension activated')

  // Register commands first so they are always available
  const createVersionCmd = vscode.commands.registerCommand('pdf-validator.createVersion', createVersionCommand(context))
  const deployCmd = vscode.commands.registerCommand('pdf-validator.deploy', deployCommand())
  const updateDocsCmd = vscode.commands.registerCommand('pdf-validator.updateDocs', updateDocsCommand())
  const mergeToMasterCmd = vscode.commands.registerCommand('pdf-validator.mergeToMaster', mergeToMasterCommand())
  const pushCmd = vscode.commands.registerCommand('pdf-validator.push', pushCommand())
  const showVersionCmd = vscode.commands.registerCommand('pdf-validator.showVersionInfo', () =>
    showVersionInfo(versionService)
  )
  context.subscriptions.push(createVersionCmd, deployCmd, updateDocsCmd, mergeToMasterCmd, pushCmd, showVersionCmd)
  outputChannel.appendLine('All commands registered')

  // Initialize Services
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
  if (!workspaceFolder) {
    const msg = 'No workspace folder found. Extension functionality limited.'
    outputChannel.appendLine(`WARNING: ${msg}`)
    console.warn(msg)
    vscode.window.showWarningMessage(`PDF Validator: ${msg}`)
    return
  }

  outputChannel.appendLine(`Workspace folder: ${workspaceFolder.uri.fsPath}`)

  versionService = new VersionService(workspaceFolder.uri.fsPath)

  // Register Tree View Provider
  const treeDataProvider = new VersionTreeProvider(versionService)
  vscode.window.registerTreeDataProvider('pdf-validator-view', treeDataProvider)

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  statusBarItem.command = 'pdf-validator.showVersionInfo'
  context.subscriptions.push(statusBarItem)

  // Update status bar with current version
  updateStatusBar(versionService)

  // Watch for file changes to update status bar
  const watcher = vscode.workspace.createFileSystemWatcher('**/package.json')
  watcher.onDidChange(() => updateStatusBar(versionService))
  context.subscriptions.push(watcher)

  vscode.window.showInformationMessage('PDF Validator Helper is ready!')
  outputChannel.appendLine('PDF Validator Extension activation complete')
  outputChannel.appendLine('---')
}

async function updateStatusBar(versionService: VersionService) {
  try {
    const currentVersion = await versionService.getCurrentVersion()
    const currentBranch = await versionService.getCurrentBranch()

    statusBarItem.text = `$(package) ${currentVersion} (${currentBranch})`
    statusBarItem.show()
  } catch (error) {
    console.error('Error updating status bar:', error)
  }
}

async function showVersionInfo(versionService: VersionService) {
  try {
    const currentVersion = await versionService.getCurrentVersion()
    const currentBranch = await versionService.getCurrentBranch()

    vscode.window.showInformationMessage(`📦 Version: ${currentVersion}\n🌿 Branch: ${currentBranch}`)
  } catch (error) {
    console.error('Error showing version info:', error)
    vscode.window.showErrorMessage('Failed to get version info')
  }
}

export function deactivate() {
  outputChannel?.appendLine('PDF Validator Extension deactivated')
  console.log('PDF Validator Extension deactivated')
  outputChannel?.dispose()
}
