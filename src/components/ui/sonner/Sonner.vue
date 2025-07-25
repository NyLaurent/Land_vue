<script lang="ts" setup>
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner'

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    class="toaster group"
    v-bind="props"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--success-bg': '#dcfce7',
      '--success-text': '#15803d',
      '--success-border': '#22c55e',
      '--error-bg': '#fef2f2',
      '--error-text': '#dc2626',
      '--error-border': '#ef4444',
    }"
  />
</template>

<style>
/* Success toast styling */
.toaster [data-type="success"] {
  background-color: var(--success-bg) !important;
  color: var(--success-text) !important;
  border-color: var(--success-border) !important;
}

/* Error toast styling */
.toaster [data-type="error"] {
  background-color: var(--error-bg) !important;
  color: var(--error-text) !important;
  border-color: var(--error-border) !important;
}

/* Success toast icon */
.toaster [data-type="success"] [data-icon] {
  color: var(--success-text) !important;
}

/* Error toast icon */
.toaster [data-type="error"] [data-icon] {
  color: var(--error-text) !important;
}

/* Close button styling for success */
.toaster [data-type="success"] [data-close-button] {
  color: var(--success-text) !important;
}

/* Close button styling for error */
.toaster [data-type="error"] [data-close-button] {
  color: var(--error-text) !important;
}
</style>
