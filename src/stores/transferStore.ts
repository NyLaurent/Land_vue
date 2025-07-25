import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'vue-sonner'
import type { Transfer, TransferInsert } from '@/types'

export const useTransferStore = defineStore('transfer', () => {
  // State
  const transfers = ref<Transfer[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const transferCount = computed(() => transfers.value.length)
  const pendingTransfers = computed(() =>
    transfers.value.filter((transfer) => transfer.status === 'pending'),
  )
  const completedTransfers = computed(() =>
    transfers.value.filter((transfer) => transfer.status === 'completed'),
  )

  // Actions
  const fetchTransfers = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('transfers')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      transfers.value = data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch transfer records'
      toast.error(`Failed to load transfers: ${error.value}`)
    } finally {
      loading.value = false
    }
  }

  const addTransfer = async (
    transferData: Omit<TransferInsert, 'contract_document' | 'status'> & { contract_url: string },
  ) => {
    loading.value = true
    error.value = null

    try {
      // Insert the transfer record into the database with the provided URL
      const { data, error: dbError } = await supabase
        .from('transfers')
        .insert({
          recipient_name: transferData.recipient_name,
          parcel_id: transferData.parcel_id,
          contract_document: transferData.contract_url,
          status: 'pending',
        })
        .select()
        .single()

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`)
      }

      transfers.value.unshift(data)
      toast.success('Land transfer initiated successfully!')

      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to initiate transfer'
      toast.error(`Transfer failed: ${error.value}`)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTransferStatus = async (id: number, status: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('transfers')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw new Error(updateError.message)
      }

      // Update local state
      const index = transfers.value.findIndex((transfer) => transfer.id === id)
      if (index !== -1) {
        transfers.value[index] = data
      }

      toast.success('Transfer status updated successfully!')
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update transfer status'
      toast.error(`Status update failed: ${error.value}`)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTransfer = async (id: number, updateData: { recipient_name?: string; parcel_id?: string; status?: string }) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('transfers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw new Error(updateError.message)
      }

      // Update local state
      const index = transfers.value.findIndex((transfer) => transfer.id === id)
      if (index !== -1) {
        transfers.value[index] = data
      }

      toast.success('Transfer updated successfully!')
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update transfer'
      toast.error(`Update failed: ${error.value}`)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTransfer = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase.from('transfers').delete().eq('id', id)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      // Remove from local state
      transfers.value = transfers.value.filter((transfer) => transfer.id !== id)
      toast.success('Transfer record deleted successfully!')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete transfer record'
      toast.error(`Delete failed: ${error.value}`)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    transfers,
    loading,
    error,
    // Getters
    transferCount,
    pendingTransfers,
    completedTransfers,
    // Actions
    fetchTransfers,
    addTransfer,
    updateTransferStatus,
    updateTransfer,
    deleteTransfer,
    clearError,
  }
})
