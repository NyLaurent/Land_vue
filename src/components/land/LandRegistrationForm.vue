<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { useLandRegistration } from '@/composables/useLandRegistration'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  success: []
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const formSchema = toTypedSchema(
  z
    .object({
      parcel_id: z
        .number({ message: 'Parcel ID is required' })
        .int({ message: 'Parcel ID must be a whole number' })
        .positive({ message: 'Parcel ID must be a positive number' }),
      size: z
        .number({ message: 'Land size is required' })
        .positive({ message: 'Land size must be a positive number' })
        .max(1000000, { message: 'Land size cannot exceed 1,000,000 square meters' }),
      ownership_type: z
        .string({ message: 'Ownership type is required' })
        .min(1, { message: 'Please select an ownership type' }),
      ownership_proof: z
        .instanceof(File)
        .refine((file) => file.size <= 10 * 1024 * 1024, {
          message: 'File size must be less than 10MB',
        })
        .refine(
          (file) => ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
          {
            message: 'File must be PDF, JPG, JPEG, or PNG format',
          },
        ),
    })
    .refine((data) => data.ownership_proof, {
      message: 'Please provide either a file upload or a document URL',
      path: ['ownership_proof'],
    }),
)

const { handleSubmit, setFieldValue, resetForm } = useForm({
  validationSchema: formSchema,
})

const { mutate, isPending, error } = useLandRegistration()
const { t } = useI18n()

const onSubmit = handleSubmit(async (values) => {
  try {
    const ownershipProofUrl = await fileToDataUrl(values.ownership_proof)

    const formData = {
      parcel_id: values.parcel_id,
      size: values.size,
      ownership_type: values.ownership_type,
      ownership_proof_url: ownershipProofUrl,
    }

    mutate(formData, {
      onSuccess: () => {
        resetForm()
        emit('success')
      },
    })
  } catch (error) {
    console.error('Form submission error:', error)
  }
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    setFieldValue('ownership_proof', target.files[0])
  }
}

const handleUrlChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.value.trim()) {
    // Clear the file input when a URL is entered
    setFieldValue('ownership_proof', undefined)
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

// Helper function to convert file to data URL
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

defineExpose({
  resetForm,
})
</script>

<template>
  <div class="space-y-4 p-4">
    <form class="space-y-4" @submit="onSubmit">
      <!-- Form Fields Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Parcel ID Field -->
        <FormField v-slot="{ componentField }" name="parcel_id">
          <FormItem>
            <FormLabel class="text-sm font-medium text-gray-700">
              {{ t('forms.labels.parcel_id') }} *
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                :placeholder="t('forms.placeholders.parcel_id')" 
                v-bind="componentField"
                class="border-gray-300 focus:border-blue-500 focus:ring-blue-200 h-9"
              />
            </FormControl>
            <FormMessage class="text-red-500 text-xs" />
          </FormItem>
        </FormField>

        <!-- Land Size Field -->
        <FormField v-slot="{ componentField }" name="size">
          <FormItem>
            <FormLabel class="text-sm font-medium text-gray-700">
              {{ t('forms.labels.land_size') }} *
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                :placeholder="t('forms.placeholders.land_size')"
                v-bind="componentField"
                class="border-gray-300 focus:border-blue-500 focus:ring-blue-200 h-9"
              />
            </FormControl>
            <FormMessage class="text-red-500 text-xs" />
          </FormItem>
        </FormField>
      </div>

      <!-- Ownership Type Field -->
      <FormField v-slot="{ componentField }" name="ownership_type">
        <FormItem>
          <FormLabel class="text-sm font-medium text-gray-700">
            {{ t('forms.labels.ownership_type') }} *
          </FormLabel>
          <FormControl>
            <Input
              type="text"
              :placeholder="t('forms.placeholders.ownership_type')"
              v-bind="componentField"
              class="border-gray-300 focus:border-blue-500 focus:ring-blue-200 h-9"
            />
          </FormControl>
          <FormMessage class="text-red-500 text-xs" />
        </FormItem>
      </FormField>

      <!-- Document Upload Section -->
      <div class="space-y-2 p-3 rounded-lg bg-gray-50 border">
        <FormField v-slot="{ componentField }" name="ownership_proof">
          <FormItem>
            <FormLabel class="text-sm font-medium text-gray-700">
              {{ t('forms.file_upload.ownership_proof') }} *
            </FormLabel>
            <FormControl>
              <Input
                ref="fileInput"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                @change="handleFileChange"
                class="file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-600 file:text-white file:text-sm hover:file:bg-blue-700 cursor-pointer h-9"
              />
            </FormControl>
            <p class="text-xs text-gray-500 mt-1">
              {{ t('forms.file_upload.accepted_formats') }}
            </p>
            <FormMessage class="text-red-500 text-xs" />
          </FormItem>
        </FormField>
      </div>

      <!-- Submit Button -->
      <div class="pt-2">
        <Button 
          type="submit" 
          class="w-full bg-blue-600 text-white hover:bg-blue-700 h-10"
          :disabled="isPending"
        >
          <Loader2 v-if="isPending" class="mr-2 h-4 w-4 animate-spin" />
          <span>{{ isPending ? t('messages.registering') : t('buttons.register_land') }}</span>
        </Button>
      </div>
    </form>
  </div>
</template>
