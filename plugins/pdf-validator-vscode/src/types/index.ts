export interface Version {
  version: string
  branch: string
  deployed: boolean
  status: 'stable' | 'beta' | 'alpha'
}

export interface GitConfig {
  mainRepo: string
  submodule: string
  submodulePath: string
}

export interface Commit {
  hash: string
  message: string
  author: string
  date: Date
}

export interface ChangelogEntry {
  version: string
  date: Date
  commits: Commit[]
}
