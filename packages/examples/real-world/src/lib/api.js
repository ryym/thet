import 'isomorphic-fetch'

const API_ROOT = 'https://api.github.com'

export const fetchUser = login =>
  fetchData(`${API_ROOT}/users/${login}`)

export const fetchStarred = (login, nextPageUrl) =>
  fetchData(nextPageUrl || `${API_ROOT}/users/${login}/starred`)

export const fetchRepo = fullName =>
  fetchData(`${API_ROOT}/repos/${fullName}`)

export const fetchStargazers = (fullName, nextPageUrl) =>
  fetchData(nextPageUrl || `${API_ROOT}/repos/${fullName}/stargazers`)

function fetchData(url) {
  return fetch(url).then(res => res.json().then(data => {
    if (!res.ok) {
      return Promise.reject(data)
    }
    const nextPageUrl = getNextPageUrl(res)
    return { data, nextPageUrl }
  }))
}

const getNextPageUrl = res => {
  const link = res.headers.get('link')
  if (!link) {
    return null
  }

  const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1)
  if (!nextLink) {
    return null
  }

  return nextLink.split(';')[0].slice(1, -1)
}
