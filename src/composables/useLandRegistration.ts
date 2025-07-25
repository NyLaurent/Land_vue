import { ref } from 'vue'
import { useLandStore } from '@/stores/landStore'
import type { LandInsert } from '@/types'

export type RegistrationData = Omit<LandInsert, 'supporting_documents' | 'status'> & {
  ownership_proof_url: string
}

export const useLandRegistration = () => {
  const landStore = useLandStore()
  const isPending = ref(false)
  const error = ref<Error | null>(null)

  const mutate = async (
    data: RegistrationData,
    options?: {
      onSuccess?: () => void
      onError?: (error: Error) => void
    },
  ) => {
    isPending.value = true
    error.value = null

    try {
      await landStore.addLand(data)
      options?.onSuccess?.()
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
      options?.onError?.(error.value)
    } finally {
      isPending.value = false
    }
  }

  return {
    mutate,
    isPending,
    error,
  }
}
