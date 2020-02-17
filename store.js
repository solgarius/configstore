const _memoryStore = {}
const MEMORY_STORE = {
  getItem: key => _memoryStore[key],
  setItem: (key, value) => { _memoryStore[key] = value },
  removeItem: key => { delete _memoryStore[key] }
}

const LOCAL = 'local'
const SESSION = 'session'
const SESSION_OR_LOCAL = 'sessionOrLocal'
const NON_PERSISTENT = 'memory'

function getConfig (key, mode = LOCAL) {
  if (mode === SESSION_OR_LOCAL) {
    let sessionVal = getConfig(key, SESSION)
    return (sessionVal != null) ? sessionVal : getConfig(key, LOCAL)
  }
  let val = storage(mode).getItem(key)
  if (val && val.length > 0 && val[0] === '{') {
    let parsedVal = JSON.parse(val)
    return parsedVal.d || parsedVal
  } else {
    return val
  }
}

function setConfig (key, value, mode = LOCAL) {
  if (mode === SESSION_OR_LOCAL) {
    // set config in both locations
    setConfig(key, value, SESSION)
    setConfig(key, value, LOCAL)
    return
  }
  // value is not null or undefined
  if (value != null) {
    storage(mode).setItem(key, JSON.stringify({ d: value }))
  } else {
    storage(mode).setItem(key, value)
  }
}

function deleteConfig (key, mode = LOCAL) {
  if (mode === SESSION_OR_LOCAL) {
    // remove config from both locations
    deleteConfig(key, SESSION)
    deleteConfig(key, LOCAL)
    return
  }
  storage(mode).removeItem(key)
}

function getCookie (key) {
  let nameEQ = key + '='
  let keyValuePairs = document.cookie.split(';')
  for (let i = 0; i < keyValuePairs.length; i++) {
    let keyValuePair = keyValuePairs[i]
    while (keyValuePair.charAt(0) === ' ') {
      keyValuePair = keyValuePair.substring(1, keyValuePair.length)
    }
    if (keyValuePair.indexOf(nameEQ) === 0) {
      return keyValuePair.substring(nameEQ.length, keyValuePair.length)
    }
  }
  return null
}

export function setCookie (key, value, days) {
  let expires = ''
  if (days) {
    let date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = `; expires=${date.toUTCString()}`
  }
  document.cookie = `${key}=${value}${expires}; path=/`
}

function deleteCookie (key) {
  setCookie(key, '', -1)
}

function storage (mode = LOCAL) {
  if (mode === SESSION) {
    return window.sessionStorage || MEMORY_STORE
  } else if (mode === LOCAL) {
    return window.localStorage || MEMORY_STORE
  }
  return MEMORY_STORE
}

module.exports = {
  SESSION, LOCAL, SESSION_OR_LOCAL, NON_PERSISTENT, getConfig, setConfig, deleteConfig, setCookie, getCookie, deleteCookie
}
