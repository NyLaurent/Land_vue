import { ref } from 'vue'
import { useTransferStore } from '@/stores/transferStore'
import type { TransferInsert } from '@/types'

export type TransferData = Omit<TransferInsert, 'contract_document' | 'status'> & {
  contract_url: string
}

export const useLandTransfer = () => {
  const transferStore = useTransferStore()
  const isPending = ref(false)
  const error = ref<Error | null>(null)

  const mutate = async (
    data: TransferData,
    options?: {
      onSuccess?: () => void
      onError?: (error: Error) => void
    },
  ) => {
    isPending.value = true
    error.value = null

    try {
      await transferStore.addTransfer(data)
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
