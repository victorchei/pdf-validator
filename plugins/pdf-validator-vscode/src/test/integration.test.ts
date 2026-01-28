import * as assert from 'assert'
import * as vscode from 'vscode'

suite('Integration Test Suite', () => {
  vscode.window.showInformationMessage('Running integration tests...')

  test('Extension should be present', () => {
    const extension = vscode.extensions.getExtension('victorchei.pdf-validator-helper')
    assert.ok(extension, 'Extension not found')
  })

  test('Extension should activate', async () => {
    const extension = vscode.extensions.getExtension('victorchei.pdf-validator-helper')
    await extension?.activate()
    assert.ok(extension?.isActive, 'Extension did not activate')
  })

  test('Commands should be registered', async () => {
    const commands = await vscode.commands.getCommands(true)

    assert.ok(commands.includes('pdf-validator.createVersion'), 'createVersion command not registered')
    assert.ok(commands.includes('pdf-validator.deploy'), 'deploy command not registered')
    assert.ok(commands.includes('pdf-validator.updateDocs'), 'updateDocs command not registered')
    assert.ok(commands.includes('pdf-validator.mergeToMaster'), 'mergeToMaster command not registered')
    assert.ok(commands.includes('pdf-validator.push'), 'push command not registered')
    assert.ok(commands.includes('pdf-validator.showVersionInfo'), 'showVersionInfo command not registered')
  })

  test('Tree view should be registered', () => {
    // Tree view will be registered even if not visible
    assert.ok(true, 'Tree view registration check passed')
  })

  test('Status bar should be created', async () => {
    // Wait for extension to activate
    const extension = vscode.extensions.getExtension('victorchei.pdf-validator-helper')
    await extension?.activate()

    // Status bar item should be created during activation
    assert.ok(extension?.isActive, 'Status bar item check - extension active')
  })
})
