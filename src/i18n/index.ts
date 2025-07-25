import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'
import type { I18n, I18nOptions, Locale } from 'vue-i18n'

export const SUPPORT_LOCALES = ['en', 'rw']

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages: messages,
})

setI18nLanguage('en')

export function setupI18n(options: I18nOptions = { locale: 'en' }): I18n {
  if (options.locale) {
    setI18nLanguage(options.locale)
  }
  return i18n
}

export function getLocale(): string {
  return i18n.global.locale.value
}

export function setLocale(locale: Locale): void {
  i18n.global.locale.value = locale
}

export function setI18nLanguage(locale: Locale): void {
  setLocale(locale)
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html')!.setAttribute('lang', locale)
}

const getResourceMessages = (r: any) => r.default || r

export async function loadLocaleMessages(locale: Locale) {
  const messages = await import(`./locales/${locale}.json`).then(getResourceMessages)

  i18n.global.setLocaleMessage(locale, messages)

  return nextTick()
}

export default i18n
