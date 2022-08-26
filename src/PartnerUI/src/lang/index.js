import { createI18n } from 'vue-i18n'
import Cookies from 'js-cookie'

import elementEnLocale from 'element-plus/lib/locale/lang/en'
import elementTrLocale from 'element-plus/lib/locale/lang/tr'
import enLocale from './en'
import trLocale from './tr'

import financeTr from './tr/finance'
import financeEn from './en/finance'

import hrTr from './tr/hr'
import hrEn from './en/hr'

import bpmTr from './tr/bpm'
import bpmEn from './en/bpm'

import crmTr from './tr/crm'
import crmEn from './en/crm'

import weTr from './tr/we'
import weEn from './en/we'

import dmsTr from './tr/dms'
import dmsEn from './en/dms'

import policyTr from './tr/policy'

const messages = {
  en: {
    ...enLocale,
    ...financeEn,
    ...elementEnLocale,
    ...hrEn,
    ...bpmEn,
    ...crmEn,
    ...weEn,
    ...dmsEn
  },
  tr: {
    ...trLocale,
    ...financeTr,
    ...elementTrLocale,
    ...hrTr,
    ...bpmTr,
    ...crmTr,
    ...weTr,
    ...dmsTr,
    ...policyTr
  }
}
export const numberFormats = {
  'en-US': {
    currency: {
      style: 'currency', currency: 'USD'
    }
  },
  'ja-JP': {
    currency: {
      style: 'currency', currency: 'JPY', currencyDisplay: 'symbol'
    }
  },
  'tr-TR': {
    currency: {
      style: 'currency', currency: 'TRY', currencyDisplay: 'symbol'
    }
  }
}
const i18n =  createI18n({
  locale: Cookies.get('language') || 'tr',
  messages, numberFormats: numberFormats
})

export default i18n
