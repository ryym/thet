import { camelizeKeys } from 'humps'
import { schema, normalize } from 'normalizr'

// GitHub's API may return results with uppercase letters while the query
// doesn't contain any. For example, "someuser" could result in "SomeUser"
// leading to a frozen UI as it wouldn't find "someuser" in the entities.
// That's why we're forcing lower cases down there.
export function normalizeKey(key) {
  return key != null && String(key).toLowerCase()
}

const userSchema = new schema.Entity('users', {}, {
  idAttribute: user => normalizeKey(user.login)
})

const repoSchema = new schema.Entity('repos', {
  owner: userSchema
}, {
  idAttribute: repo => normalizeKey(repo.fullName)
})

// Schemas for Github API responses.
export const Schemas = {
  USER: userSchema,
  USER_ARRAY: new schema.Array(userSchema),
  REPO: repoSchema,
  REPO_ARRAY: new schema.Array(repoSchema)
}

const normalizer = (schema) => (json) => {
  return normalize(camelizeKeys(json), schema)
}

export const normalizeUser = normalizer(Schemas.USER)
export const normalizeUsers = normalizer(Schemas.USER_ARRAY)
export const normalizeRepo = normalizer(Schemas.REPO)
export const normalizeRepos = normalizer(Schemas.REPO_ARRAY)
