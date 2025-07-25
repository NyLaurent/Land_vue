<template>
  <div class="language-switcher">
    <select
      v-model="currentLocale"
      @change="handleLocaleChange"
      class="locale-selector glass-effect border-white/30 text-gray-700 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/20 transition-all duration-200"
      aria-label="Select language"
    >
      <option v-for="locale in supportedLocales" :key="locale.code" :value="locale.code">
        {{ locale.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Locale } from 'vue-i18n'
import { SUPPORT_LOCALES, loadLocaleMessages, setI18nLanguage } from '@/i18n'

const { locale, availableLocales } = useI18n()

const supportedLocales = [
  { code: 'en', name: 'English' },
  { code: 'rw', name: 'Ikinyarwanda' },
]

const currentLocale = ref<string>(locale.value)

const handleLocaleChange = async () => {
  const newLocale = currentLocale.value as Locale

  if (newLocale === locale.value) return

  try {
    if (!availableLocales.includes(newLocale)) {
      await loadLocaleMessages(newLocale)
    }

    setI18nLanguage(newLocale)
    localStorage.setItem('preferred-locale', newLocale)
  } catch (error) {
    console.error('Failed to load locale:', error)
    currentLocale.value = locale.value
  }
}

watch(locale, (newLocale) => {
  currentLocale.value = newLocale
})

onMounted(async () => {
  // Load saved locale preference
  const savedLocale = localStorage.getItem('preferred-locale')
  if (savedLocale && SUPPORT_LOCALES.includes(savedLocale)) {
    currentLocale.value = savedLocale
    if (savedLocale !== locale.value) {
      try {
        if (!availableLocales.includes(savedLocale as Locale)) {
          await loadLocaleMessages(savedLocale as Locale)
        }
        setI18nLanguage(savedLocale as Locale)
      } catch (error) {
        console.error('Failed to initialize saved locale:', error)
        currentLocale.value = locale.value
      }
    }
  }
})
</script>

<style scoped>
.locale-selector {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.locale-selector option {
  background: white;
  color: #374151;
}
</style>
