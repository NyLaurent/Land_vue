<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useTransferStore } from '@/stores/transferStore'
import type { Transfer } from '@/types'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

const props = defineProps<{
  open: boolean
  transfer: Transfer | null
}>()

const emit = defineEmits(['update:open'])

const internalOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const formSchema = toTypedSchema(
  z.object({
    recipient_name: z.string().min(2, 'Recipient name is required'),
    parcel_id: z.string().min(5, 'Parcel ID must be at least 5 characters'),
    status: z.enum(['pending', 'completed', 'cancelled']),
  }),
)

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: formSchema,
})

const transferStore = useTransferStore()
const isLoading = ref(false)

watch(
  () => props.transfer,
  (newTransfer) => {
    if (newTransfer) {
      setValues({
        recipient_name: newTransfer.recipient_name,
        parcel_id: newTransfer.parcel_id,
        status: newTransfer.status as 'pending' | 'completed' | 'cancelled',
      })
    } else {
      resetForm()
    }
  },
)

const onSubmit = handleSubmit(async (values) => {
  if (!props.transfer) return

  try {
    isLoading.value = true
    await transferStore.updateTransfer(props.transfer.id, {
      recipient_name: values.recipient_name,
      parcel_id: values.parcel_id,
      status: values.status,
    })
    emit('update:open', false)
  } catch (error) {
    console.error('Update failed:', error)
  } finally {
    isLoading.value = false
  }
})


</script>

<template>
  <Dialog v-model:open="internalOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Land Transfer</DialogTitle>
      </DialogHeader>
      <form class="space-y-6 py-4" @submit.prevent="onSubmit">
        <FormField v-slot="{ componentField }" name="recipient_name">
          <FormItem>
            <FormLabel>Recipient Name</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="parcel_id">
          <FormItem>
            <FormLabel>Parcel ID</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="status">
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl>
              <select v-bind="componentField" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" :disabled="isLoading">
            <span v-if="isLoading">Saving...</span>
            <span v-else>Save Changes</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
