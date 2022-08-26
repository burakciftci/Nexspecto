const tagReg = /<\/?([^<|^>]*)>/g
/**
 * string cut
 *
 * @export
 * @param {any} value
 * @param {any} limit
 * @returns
 */
export function cutStr(value, limit) {
  if (!value) {
    return ''
  }
  value = '' + value
  // remove html tag
  value = value.replace(tagReg, '')
  let strLength = 0
  const strLen = value.length
  let strCut = ''
  for (let i = 0; i < strLen; i++) {
    const a = value.charAt(i)
    strLength++
    if (encodeURI(a).length > 4) {
      // 中文字符的长度经编码之后大于4
      strLength += 1
    }
    strCut = strCut.concat(a)
    if (strLength > limit) {
      strCut = strCut.concat('...')
      return strCut
    }
    if (strLength === limit) {
      return strCut
    }
  }

  // 如果给定字符串小于指定长度，则返回源字符串；
  if (strLength < limit) {
    return value
  }
}

/**
 * simple version deep copy
 * @param {Object} obj
 */
export function deepClone(obj) {
  // obj not contain special type like：undefined,NaN,function
  return JSON.parse(JSON.stringify(obj))
}

export function jsonProp(obj) {
  // type check
  if (!obj || (typeof obj !== 'object')) {
    return obj
  }
  Object.keys(obj).forEach((key) => {
    if ((typeof obj[key]) === 'object') {
      obj[key] = JSON.stringify(obj[key])
    }
  })
  return obj
}

/**
 * Generates RFC4 compilent guid
 * @returns Guid value  as {string}
 */
export function generateUUID() { // Public Domain/MIT
  let d = new Date().getTime() // Timestamp
  let d2 = (performance && performance.now && (performance.now() * 1000)) || 0// Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16// random number between 0 and 16
    if (d > 0) { // Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else { // Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

