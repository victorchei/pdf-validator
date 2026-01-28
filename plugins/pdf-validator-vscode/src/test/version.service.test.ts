import * as assert from 'assert'
import * as path from 'path'
import { VersionService } from '../services/version.service'

suite('VersionService Test Suite', () => {
  let versionService: VersionService

  setup(() => {
    // Use a test workspace path
    const testWorkspace = path.join(__dirname, '../../test-workspace')
    versionService = new VersionService(testWorkspace)
  })

  suite('parseVersion', () => {
    test('should parse version with v prefix', () => {
      const result = versionService.parseVersion('v1.2.3')
      assert.strictEqual(result?.major, 1)
      assert.strictEqual(result?.minor, 2)
      assert.strictEqual(result?.patch, 3)
    })

    test('should parse version without v prefix', () => {
      const result = versionService.parseVersion('1.2.3')
      assert.strictEqual(result?.major, 1)
      assert.strictEqual(result?.minor, 2)
      assert.strictEqual(result?.patch, 3)
    })

    test('should return null for invalid format', () => {
      assert.strictEqual(versionService.parseVersion('1.2'), null)
      assert.strictEqual(versionService.parseVersion('v1.x.y'), null)
      assert.strictEqual(versionService.parseVersion('invalid'), null)
    })
  })

  suite('formatVersion', () => {
    test('should format with v prefix by default', () => {
      const result = versionService.formatVersion({ major: 1, minor: 2, patch: 3 })
      assert.strictEqual(result, 'v1.2.3')
    })

    test('should format without v prefix when specified', () => {
      const result = versionService.formatVersion({ major: 1, minor: 2, patch: 3 }, false)
      assert.strictEqual(result, '1.2.3')
    })
  })

  suite('calculateNewVersion', () => {
    test('should calculate PATCH version correctly', () => {
      const result = versionService.calculateNewVersion('v1.0.0', 'PATCH')
      assert.strictEqual(result, 'v1.0.1')
    })

    test('should calculate MINOR version correctly', () => {
      const result = versionService.calculateNewVersion('v1.0.0', 'MINOR')
      assert.strictEqual(result, 'v1.1.0')
    })

    test('should calculate MAJOR version correctly', () => {
      const result = versionService.calculateNewVersion('v1.0.0', 'MAJOR')
      assert.strictEqual(result, 'v2.0.0')
    })

    test('should reset patch on MINOR increment', () => {
      const result = versionService.calculateNewVersion('v1.0.5', 'MINOR')
      assert.strictEqual(result, 'v1.1.0')
    })

    test('should reset minor and patch on MAJOR increment', () => {
      const result = versionService.calculateNewVersion('v1.5.3', 'MAJOR')
      assert.strictEqual(result, 'v2.0.0')
    })
  })

  suite('validateVersionFormat', () => {
    test('should validate correct formats', () => {
      assert.strictEqual(versionService.validateVersionFormat('v1.0.0'), true)
      assert.strictEqual(versionService.validateVersionFormat('1.0.0'), true)
      assert.strictEqual(versionService.validateVersionFormat('v10.20.30'), true)
    })

    test('should reject invalid formats', () => {
      assert.strictEqual(versionService.validateVersionFormat('v1.0'), false)
      assert.strictEqual(versionService.validateVersionFormat('1.x.y'), false)
      assert.strictEqual(versionService.validateVersionFormat('invalid'), false)
    })
  })

  suite('validateVersionCreation', () => {
    test('PATCH should be allowed from any branch', () => {
      const result = versionService.validateVersionCreation('feature/test', 'PATCH')
      assert.strictEqual(result.isValid, true)
    })

    test('MINOR should only be allowed from master', () => {
      const resultMaster = versionService.validateVersionCreation('master', 'MINOR')
      assert.strictEqual(resultMaster.isValid, true)

      const resultFeature = versionService.validateVersionCreation('feature/test', 'MINOR')
      assert.strictEqual(resultFeature.isValid, false)
      assert.ok(resultFeature.error?.includes('master'))
    })

    test('MAJOR should only be allowed from master', () => {
      const resultMaster = versionService.validateVersionCreation('master', 'MAJOR')
      assert.strictEqual(resultMaster.isValid, true)

      const resultDevelop = versionService.validateVersionCreation('develop', 'MAJOR')
      assert.strictEqual(resultDevelop.isValid, false)
      assert.ok(resultDevelop.error?.includes('master'))
    })

    test('main should be treated as master', () => {
      const resultMinor = versionService.validateVersionCreation('main', 'MINOR')
      assert.strictEqual(resultMinor.isValid, true)

      const resultMajor = versionService.validateVersionCreation('main', 'MAJOR')
      assert.strictEqual(resultMajor.isValid, true)
    })
  })

  suite('compareVersions', () => {
    test('should compare versions correctly', () => {
      assert.strictEqual(versionService.compareVersions('v1.0.0', 'v1.0.1'), -1)
      assert.strictEqual(versionService.compareVersions('v1.0.1', 'v1.0.0'), 1)
      assert.strictEqual(versionService.compareVersions('v1.0.0', 'v1.0.0'), 0)
    })

    test('should compare major versions', () => {
      assert.strictEqual(versionService.compareVersions('v1.0.0', 'v2.0.0'), -1)
      assert.strictEqual(versionService.compareVersions('v2.0.0', 'v1.0.0'), 1)
    })

    test('should compare minor versions', () => {
      assert.strictEqual(versionService.compareVersions('v1.1.0', 'v1.2.0'), -1)
      assert.strictEqual(versionService.compareVersions('v1.2.0', 'v1.1.0'), 1)
    })
  })
})
