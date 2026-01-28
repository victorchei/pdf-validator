import * as assert from 'assert'
import { VersionService } from '../services/version.service'

suite('Scenario Test Suite', () => {
  let versionService: VersionService

  setup(() => {
    versionService = new VersionService('/test')
  })

  suite('Scenario 1: Create PATCH from master branch', () => {
    test('should allow PATCH version creation from master branch', () => {
      const validation = versionService.validateVersionCreation('master', 'PATCH')
      assert.strictEqual(validation.isValid, true)
    })

    test('should allow PATCH version creation from main branch', () => {
      const validation = versionService.validateVersionCreation('main', 'PATCH')
      assert.strictEqual(validation.isValid, true)
    })

    test('should reject PATCH version creation from feature branch', () => {
      const validation = versionService.validateVersionCreation('feature/fix-bug', 'PATCH')
      assert.strictEqual(validation.isValid, false)
      assert.ok(validation.error?.includes('master/main'))
    })

    test('should calculate correct PATCH version', () => {
      const newVersion = versionService.calculateNewVersion('v1.0.0', 'PATCH')
      assert.strictEqual(newVersion, 'v1.0.1')
    })
  })

  suite('Scenario 2: Create MINOR from master', () => {
    test('should allow MINOR version creation from master', () => {
      const validation = versionService.validateVersionCreation('master', 'MINOR')
      assert.strictEqual(validation.isValid, true)
    })

    test('should calculate correct MINOR version', () => {
      const newVersion = versionService.calculateNewVersion('v1.0.0', 'MINOR')
      assert.strictEqual(newVersion, 'v1.1.0')
    })

    test('should reset PATCH to 0 on MINOR increment', () => {
      const newVersion = versionService.calculateNewVersion('v1.0.5', 'MINOR')
      assert.strictEqual(newVersion, 'v1.1.0')
    })
  })

  suite('Scenario 3: Create MAJOR from master', () => {
    test('should allow MAJOR version creation from master', () => {
      const validation = versionService.validateVersionCreation('master', 'MAJOR')
      assert.strictEqual(validation.isValid, true)
    })

    test('should calculate correct MAJOR version', () => {
      const newVersion = versionService.calculateNewVersion('v1.0.0', 'MAJOR')
      assert.strictEqual(newVersion, 'v2.0.0')
    })

    test('should reset MINOR and PATCH to 0 on MAJOR increment', () => {
      const newVersion = versionService.calculateNewVersion('v1.5.3', 'MAJOR')
      assert.strictEqual(newVersion, 'v2.0.0')
    })
  })

  suite('Scenario 4: Prevent MINOR from non-master branch', () => {
    test('should reject MINOR version creation from feature branch', () => {
      const validation = versionService.validateVersionCreation('feature/new-feature', 'MINOR')
      assert.strictEqual(validation.isValid, false)
      assert.ok(validation.error?.includes('master'))
    })

    test('should reject MINOR version creation from develop branch', () => {
      const validation = versionService.validateVersionCreation('develop', 'MINOR')
      assert.strictEqual(validation.isValid, false)
      assert.ok(validation.error?.includes('MINOR'))
    })
  })

  suite('Scenario 5: Prevent MAJOR from non-master branch', () => {
    test('should reject MAJOR version creation from feature branch', () => {
      const validation = versionService.validateVersionCreation('feature/breaking-change', 'MAJOR')
      assert.strictEqual(validation.isValid, false)
      assert.ok(validation.error?.includes('master'))
    })

    test('should reject MAJOR version creation from hotfix branch', () => {
      const validation = versionService.validateVersionCreation('hotfix/critical-bug', 'MAJOR')
      assert.strictEqual(validation.isValid, false)
      assert.ok(validation.error?.includes('MAJOR'))
    })
  })

  suite('Scenario 6: Version increment sequences', () => {
    test('should handle sequential PATCH increments', () => {
      let version = 'v1.0.0'
      version = versionService.calculateNewVersion(version, 'PATCH') // v1.0.1
      assert.strictEqual(version, 'v1.0.1')

      version = versionService.calculateNewVersion(version, 'PATCH') // v1.0.2
      assert.strictEqual(version, 'v1.0.2')

      version = versionService.calculateNewVersion(version, 'PATCH') // v1.0.3
      assert.strictEqual(version, 'v1.0.3')
    })

    test('should handle MINOR then PATCH sequence', () => {
      let version = 'v1.0.0'
      version = versionService.calculateNewVersion(version, 'MINOR') // v1.1.0
      assert.strictEqual(version, 'v1.1.0')

      version = versionService.calculateNewVersion(version, 'PATCH') // v1.1.1
      assert.strictEqual(version, 'v1.1.1')
    })

    test('should handle MAJOR then MINOR then PATCH sequence', () => {
      let version = 'v1.5.3'
      version = versionService.calculateNewVersion(version, 'MAJOR') // v2.0.0
      assert.strictEqual(version, 'v2.0.0')

      version = versionService.calculateNewVersion(version, 'MINOR') // v2.1.0
      assert.strictEqual(version, 'v2.1.0')

      version = versionService.calculateNewVersion(version, 'PATCH') // v2.1.1
      assert.strictEqual(version, 'v2.1.1')
    })
  })

  suite('Scenario 7: Version format validation', () => {
    test('should accept valid version formats', () => {
      const versions = ['v1.0.0', '1.0.0', 'v10.20.30', '99.99.99']
      versions.forEach((version) => {
        assert.strictEqual(versionService.validateVersionFormat(version), true, `Should accept ${version}`)
      })
    })

    test('should reject invalid version formats', () => {
      const versions = ['v1.0', '1.x.y', 'invalid', 'v1.0.0.0', '1-0-0']
      versions.forEach((version) => {
        assert.strictEqual(versionService.validateVersionFormat(version), false, `Should reject ${version}`)
      })
    })
  })

  suite('Scenario 8: Version comparison', () => {
    test('should correctly order versions', () => {
      const versions = ['v1.0.0', 'v1.0.1', 'v1.1.0', 'v2.0.0']

      // Check ascending order
      assert.strictEqual(versionService.compareVersions(versions[0], versions[1]), -1)
      assert.strictEqual(versionService.compareVersions(versions[1], versions[2]), -1)
      assert.strictEqual(versionService.compareVersions(versions[2], versions[3]), -1)

      // Check descending order
      assert.strictEqual(versionService.compareVersions(versions[3], versions[2]), 1)
      assert.strictEqual(versionService.compareVersions(versions[2], versions[1]), 1)
      assert.strictEqual(versionService.compareVersions(versions[1], versions[0]), 1)

      // Check equality
      assert.strictEqual(versionService.compareVersions(versions[0], versions[0]), 0)
    })
  })
})
