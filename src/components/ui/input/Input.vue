<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  defaultValue?: string | number
  modelValue?: string | number
  type?: string
}>()

const emits = defineEmits<{
  'update:modelValue': [payload: string | number]
}>()
</script>

<template>
  <input
    data-slot="input"
    :class="
      cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-offset-0',
        props.class,
      )
    "
    :type="type"
    :value="modelValue ?? defaultValue"
    @input="
      emits('update:modelValue', ($event.target as HTMLInputElement).value)
    "
  />
</template>
