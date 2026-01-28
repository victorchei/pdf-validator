import * as assert from 'assert'
import { ChangelogService } from '../services/changelog.service'

suite('ChangelogService Test Suite', () => {
  let changelogService: ChangelogService

  setup(() => {
    changelogService = new ChangelogService('/test')
  })

  suite('categorizeCommits', () => {
    test('should categorize feat commits as Features', () => {
      const commits = [
        { hash: 'abc123', message: 'feat: add new button', author: 'dev', date: '2026-01-28' },
      ]
      const result = changelogService.categorizeCommits(commits)
      assert.strictEqual(result['Features'].length, 1)
      assert.strictEqual(result['Features'][0].hash, 'abc123')
    })

    test('should categorize fix commits as Bug Fixes', () => {
      const commits = [
        { hash: 'def456', message: 'fix: resolve crash on load', author: 'dev', date: '2026-01-28' },
      ]
      const result = changelogService.categorizeCommits(commits)
      assert.strictEqual(result['Bug Fixes'].length, 1)
    })

    test('should categorize feat! commits as Breaking Changes', () => {
      const commits = [
        { hash: 'ghi789', message: 'feat!: remove deprecated API', author: 'dev', date: '2026-01-28' },
      ]
      const result = changelogService.categorizeCommits(commits)
      assert.strictEqual(result['Breaking Changes'].length, 1)
    })

    test('should categorize breaking keyword as Breaking Changes', () => {
      const commits = [
        { hash: 'jkl012', message: 'refactor: breaking change in auth', author: 'dev', date: '2026-01-28' },
      ]
      const result = changelogService.categorizeCommits(commits)
      assert.strictEqual(result['Breaking Changes'].length, 1)
    })

    test('should categorize other commits as Other', () => {
      const commits = [
        { hash: 'mno345', message: 'chore: update deps', author: 'dev', date: '2026-01-28' },
        { hash: 'pqr678', message: 'docs: update readme', author: 'dev', date: '2026-01-28' },
      ]
      const result = changelogService.categorizeCommits(commits)
      assert.strictEqual(result['Other'].length, 2)
    })

    test('should handle mixed commits', () => {
      const commits = [
        { hash: 'a1', message: 'feat: new feature', author: 'dev', date: '2026-01-28' },
        { hash: 'a2', message: 'fix: bug fix', author: 'dev', date: '2026-01-28' },
        { hash: 'a3', message: 'chore: cleanup', author: 'dev', date: '2026-01-28' },
        { hash: 'a4', message: 'feat!: breaking feature', author: 'dev', date: '2026-01-28' },
      ]
      const result = changelogService.categorizeCommits(commits)
      assert.strictEqual(result['Features'].length, 1)
      assert.strictEqual(result['Bug Fixes'].length, 1)
      assert.strictEqual(result['Other'].length, 1)
      assert.strictEqual(result['Breaking Changes'].length, 1)
    })

    test('should handle empty commits array', () => {
      const result = changelogService.categorizeCommits([])
      assert.strictEqual(result['Features'].length, 0)
      assert.strictEqual(result['Bug Fixes'].length, 0)
      assert.strictEqual(result['Other'].length, 0)
      assert.strictEqual(result['Breaking Changes'].length, 0)
    })
  })
})
