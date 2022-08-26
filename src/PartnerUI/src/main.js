import { createApp, nextTick } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import store from './store'
import router from './router'
import i18n from './lang'
import Cookies from 'js-cookie'
import settings from '@/settings'
import Maska from 'maska'
import { isString, isArray } from '@/utils/validate'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import './styles/element-variables.scss'
import enLang from 'element-plus/lib/locale/lang/en'
import trLang from 'element-plus/dist/locale/tr'

import '@/styles/index.scss' // global css

import './icons' // icon
import './permission' // permission control

import SvgIcon from '@/components/SvgIcon'
import { parseTime } from "@/utils";
import { formatPhoneNumber, formatTRY } from "@/filters";
// svg component

import VOtpInput from 'vue3-otp-input';

const app = createApp(App)

app.config.warnHandler = function (msg, vm, trace) {
  return null
}

app.directive("uppercase", {
  inserted: function (el, _, vnode) {
    el.addEventListener('keyup', function (e) {
      e.target.value = e.target.value.toLocaleUpperCase('tr-TR')
      vnode.componentInstance.$emit('input', e.target.value.toLocaleUpperCase('tr-TR'))
    })
  }
})

app.directive("lowercase", {
  inserted: function (el, _, vnode) {
    el.addEventListener('keyup', function (e) {
      e.target.value = e.target.value.toLocaleLowerCase('tr-TR')
      // vnode.componentInstance.$emit('input', e.target.value.toLocaleLowerCase('tr-TR'))
    })
  }
})

const { errorLog: needErrorLog } = settings

function checkNeed() {
  const env = process.env.NODE_ENV
  if (isString(needErrorLog)) {
    return env === needErrorLog
  }
  if (isArray(needErrorLog)) {
    return needErrorLog.includes(env)
  }
  return false
}

if (checkNeed()) {
  console.log(app)
  app.config.errorHandler = function (err, vm, info, a) {
    // Don't ask me why I use Vue.nextTick, it just a hack.
    // detail see https://forum.vuejs.org/t/dispatch-in-vue-config-errorhandler-has-some-problem/23500
    nextTick(() => {
      store.dispatch('errorLog/addErrorLog', {
        err,
        vm,
        info,
        url: window.location.href
      })
      console.error(err, info)
    })
  }
}

app.config.productionTip = false

// register globally
app.component('SvgIcon', SvgIcon)
app.component('v-otp-input', VOtpInput)
app.use(ElementPlus, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: trLang // 如果使用中文，无需设置，请删除
})
app.use(store)
app.use(router)
app.use(i18n)
app.use(Maska)
app.use(VueClipboard)
app.mount('#app')

app.config.globalProperties.$filters = {
  parseTime,
  formatPhoneNumber,
  formatTRY
}


export default app
