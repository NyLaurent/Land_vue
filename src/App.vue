<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from './layouts/AppLayout.vue'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <Toaster position="bottom-right" theme="light" :close-button="true" />
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>
