/**
 * Created by jiachenpan on 16/11/18.
 */

export function generateNon(str) {
  const validMap = ['admin', 'editor']
  return validMap.indexOf(str.trim()) >= 0
}

export function generateTitle(title, p) {
  if (title === undefined) return ''
  const output = title.split('-')
  let first = ''
  let last = ''
  if (output.length > 1) {
    // last = title.split('-').pop();

    [first, last] = output
    if (p !== undefined) {
      last = `-${p[last]}`
    } else {
      last = `-${last}`
    }
  } else {
    first = title
  }

  const hasKey = this.$te(`route.${first}`)

  const translatedTitle = this.$t(`route.${first}`) + last // $t :this method from vue-i18n, inject in @/lang/index.js
  if (hasKey) {
    return translatedTitle
  }
  return first
}

