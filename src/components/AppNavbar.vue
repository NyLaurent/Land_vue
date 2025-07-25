<script setup lang="ts">
import { computed } from 'vue'
import { Globe, FileCheck, Home, Map } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import NavUser from '@/components/NavUser.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })

// Static user data
const userData = {
  name: 'Property Manager',
  email: 'manager@landmanagement.io',
  avatar: '/avatars/user.jpg',
}

// Reactive navigation data that updates with language changes
const navMain = computed(() => [
  {
    title: t('nav.my_land'),
    url: '/my-land',
    icon: Home,
    routeName: 'my-land',
  },
  {
    title: t('nav.transfers'),
    url: '/transfers',
    icon: FileCheck,
    routeName: 'transfers',
  },
  {
    title: t('nav.map_view'),
    url: '/map',
    icon: Map,
    routeName: 'map',
  },
])

const isActiveRoute = (routeName: string) => {
  return route.name === routeName
}

const navigateTo = (url: string) => {
  router.push(url)
}
</script>

<template>
  <nav class="bg-blue-600 border-b border-blue-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Brand/Logo Section -->
        <div class="flex items-center space-x-4">
          <a href="#" class="flex items-center space-x-3 group">
            <div
              class="bg-blue-500 flex aspect-square size-10 items-center justify-center rounded-xl border border-blue-400 transition-all duration-300 group-hover:bg-blue-400"
            >
              <Globe class="size-5 text-white" />
            </div>
            <div class="hidden sm:block">
              <div class="text-white font-bold text-lg">{{ t('brand.name') }}</div>
              <div class="text-blue-100 text-xs">{{ t('brand.tagline') }}</div>
            </div>
          </a>
        </div>

        <!-- Navigation Menu -->
        <div class="hidden md:flex items-center space-x-1">
          <Button
            v-for="item in navMain"
            :key="item.title"
            @click="navigateTo(item.url)"
            variant="ghost"
            class="text-white hover:text-white hover:bg-blue-500 transition-all duration-200 rounded-lg px-4 py-2 font-medium border-0"
            :class="isActiveRoute(item.routeName) ? 'bg-blue-500 text-white font-semibold' : ''"
          >
            <component :is="item.icon" class="size-4 mr-2" />
            <span>{{ item.title }}</span>
          </Button>
        </div>

        <!-- Right Side: Language Switcher & User Menu -->
        <div class="flex items-center space-x-3">
          <LanguageSwitcher />
          <NavUser :user="userData" />
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center space-x-3">
          <LanguageSwitcher />
          <NavUser :user="userData" />
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div class="md:hidden border-t border-blue-700 py-3">
        <div class="flex flex-col space-y-1">
          <Button
            v-for="item in navMain"
            :key="item.title"
            @click="navigateTo(item.url)"
            variant="ghost"
            class="w-full justify-start text-white hover:text-white hover:bg-blue-500 transition-all duration-200 rounded-lg px-4 py-2 font-medium border-0"
            :class="isActiveRoute(item.routeName) ? 'bg-blue-500 text-white font-semibold' : ''"
          >
            <component :is="item.icon" class="size-4 mr-2" />
            <span>{{ item.title }}</span>
          </Button>
        </div>
      </div>
    </div>
  </nav>
</template> 