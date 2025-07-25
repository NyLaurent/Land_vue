<script setup lang="ts">
import { ref, watch } from 'vue'
import { PlusCircle, Map, Building2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LandRegistrationForm from '@/components/land/LandRegistrationForm.vue'
import RegistrationList from '@/components/land/RegistrationList.vue'
import { useI18n } from 'vue-i18n'

const isRegistrationDialogOpen = ref(false)
const formRef = ref<InstanceType<typeof LandRegistrationForm> | null>(null)
const { t } = useI18n()

const handleFormSuccess = () => {
  isRegistrationDialogOpen.value = false
}

watch(isRegistrationDialogOpen, (isOpen) => {
  if (!isOpen) {
    setTimeout(() => {
      if (formRef.value && typeof formRef.value.resetForm === 'function') {
        formRef.value.resetForm()
      }
    }, 100)
  }
})
</script>

<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="relative overflow-hidden rounded-2xl bg-blue-600 p-8 text-white border border-blue-700">
      <div class="relative z-10">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">{{ t('titles.my_reg') }}</h1>
            <p class="text-blue-100 text-lg">{{ t('descriptions.manage_portfolio') }}</p>
          </div>
          <div class="hidden md:block">
            <Building2 class="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card class="bg-white border border-gray-200 hover:scale-105 transition-transform duration-300">
        <CardHeader class="text-center pb-4">
          <div class="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlusCircle class="h-6 w-6 text-white" />
          </div>
          <CardTitle class="text-blue-900">{{ t('titles.register_new') }}</CardTitle>
          <CardDescription class="text-blue-700">{{ t('descriptions.add_property') }}</CardDescription>
        </CardHeader>
        <CardContent class="text-center">
          <Dialog v-model:open="isRegistrationDialogOpen">
            <DialogTrigger as-child>
              <Button class="bg-blue-600 w-full text-white border border-blue-600 hover:bg-blue-700 transition-all duration-200">
                <PlusCircle class="mr-2 h-4 w-4" />
                {{ t('buttons.register_land') }}
              </Button>
            </DialogTrigger>
            <DialogContent class="max-w-lg bg-white border border-gray-200">
              <DialogHeader>
                <DialogTitle class="text-2xl font-bold text-gray-800">{{ t('titles.register_new') }}</DialogTitle>
                <DialogDescription class="text-gray-600">
                  {{ t('descriptions.register_description') }}
                </DialogDescription>
              </DialogHeader>

              <LandRegistrationForm ref="formRef" @success="handleFormSuccess" />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card class="bg-white border border-gray-200 hover:scale-105 transition-transform duration-300">
        <CardHeader class="text-center pb-4">
          <div class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Map class="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle class="text-blue-900">{{ t('nav.map_view') }}</CardTitle>
          <CardDescription class="text-blue-700">{{ t('descriptions.explore_map_desc') }}</CardDescription>
        </CardHeader>
        <CardContent class="text-center">
          <Button variant="outline" class="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
            {{ t('buttons.explore_map') }}
          </Button>
        </CardContent>
      </Card>

      <Card class="bg-white border border-gray-200 hover:scale-105 transition-transform duration-300">
        <CardHeader class="text-center pb-4">
          <div class="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 class="h-6 w-6 text-white" />
          </div>
          <CardTitle class="text-blue-900">{{ t('titles.portfolio_stats') }}</CardTitle>
          <CardDescription class="text-blue-700">{{ t('descriptions.view_stats_desc') }}</CardDescription>
        </CardHeader>
        <CardContent class="text-center">
          <Button variant="outline" class="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
            {{ t('buttons.view_stats') }}
          </Button>
        </CardContent>
      </Card>
    </div>

    <!-- Properties List Section -->
          <Card class="bg-white border border-gray-200">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-2xl text-gray-800">{{ t('titles.your_properties') }}</CardTitle>
            <CardDescription class="text-gray-600">
              {{ t('descriptions.track_properties') }}
            </CardDescription>
          </div>
          <div class="bg-blue-600 p-3 rounded-xl">
            <Building2 class="h-6 w-6 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <RegistrationList />
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
.bg-white {
  background: #ffffff;
}
</style>
