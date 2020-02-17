# Browser based Configstore
> A wrapper around localstorage, sessionstorage and cookies for client side config storage

# Install

## NPM

```
$ npm i browser-configstore
```

## Yarn

```
$ yarn add browser-configstore
```

# Quickstart
```javascript
import { getConfig, setConfig, deleteConfig, SESSION } from 'browser-configstore'

setConfig('foo', true)
console.log(getConfig('foo')) // true
deleteConfig('foo')
console.log(getConfig('foo')) // undefined

// save an object

const obj = { count: 1, hello: 'world' }
setConfig('myObject', obj)
console.log(getConfig('myObject')) //  { count: 1, hello: 'world' }

// save in session storage
setConfig('count', 23, SESSION)
console.log(getConfig('count', SESSION)) // 23
deleteConfig('count', SESSION)
console.log(getConfig('count', SESSION)) // undefined

```

# API
## Modes 
| Mode  | Description        |
|-------|------------------- |
| LOCAL | (default) use local storage  |
| SESSION | use session storage |
| SESSION_OR_LOCAL | get the value from session first, failing that get the value from local storage |
| NON_PERSISTENT | Store in a memory map, won't persist if page reloads/navigates away to another page (non-single page app) | 

## getConfig (key, mode = LOCAL)
Get value stored in key

## setConfig (key, value, mode = LOCAL)
Store the given value (must be `stringify`able) at the set key.

## deleteConfig (key, mode = LOCAL)
Remove the given key from storage.

## getCookie (key)
Gets the given key from the stored cookie.

## setCookie (key, value, days = null)
Set the given value at the key in the cookie, with an optional expiry time in days on the cookie.

## deleteCookie (key)
Remove the given key from the cookie.