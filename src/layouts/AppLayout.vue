<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

const route = useRoute()
const { t } = useI18n({ useScope: 'global' })

const breadcrumbs = computed(() => {
  const routeName = route.name as string
  const breadcrumbMap: Record<string, { title: string; path?: string }[]> = {
    'my-land': [
      { title: t('nav.my_land') }
    ],
    'transfers': [
      { title: t('nav.transfers') }
    ],
    'map': [
      { title: t('nav.map_view') }
    ]
  }
  
  return breadcrumbMap[routeName] || [{ title: 'Dashboard' }]
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Navbar -->
    <AppNavbar />
    
    <!-- Main Content Area -->
    <div class="flex flex-col">
      <!-- Breadcrumb Header -->
      <header class="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 sm:px-6 lg:px-8 py-4">
        <div class="max-w-7xl mx-auto">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="/">
                  {{ t('brand.name') }}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem v-for="(breadcrumb, index) in breadcrumbs" :key="index">
                <BreadcrumbLink v-if="breadcrumb.path" :href="breadcrumb.path">
                  {{ breadcrumb.title }}
                </BreadcrumbLink>
                <BreadcrumbPage v-else>
                  {{ breadcrumb.title }}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template> 