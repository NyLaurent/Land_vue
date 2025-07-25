import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'vue-sonner'
import type { LandTransfer } from '@/types'

// The form can accept a File object for a new contract, or a string (URL) for an existing one.
type UpdateTransferData = Partial<Omit<LandTransfer, 'id' | 'created_at' | 'contract_url'>> & {
  id: string
  contract?: File | string
}

const updateLandTransfer = async (formData: UpdateTransferData) => {
  let contract_url = typeof formData.contract === 'string' ? formData.contract : undefined

  if (formData.contract instanceof File) {
    const file = formData.contract
    const fileExt = file.name.split('.').pop()
    const filePath = `contracts/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('proofs_and_contracts')
      .upload(filePath, file)

    if (uploadError) throw new Error(`Storage Error: ${(uploadError as any).message}`)

    const { data: urlData } = supabase.storage.from('proofs_and_contracts').getPublicUrl(filePath)
    if (!urlData) throw new Error('Could not get public URL for the new contract.')

    contract_url = urlData.publicUrl
  }

  const { error: dbError } = await supabase
    .from('transfers')
    .update({
      recipient_id: formData.recipient_id,
      parcel_id: formData.parcel_id,
      contract_url: contract_url,
    })
    .match({ id: formData.id })

  if (dbError) throw new Error(`Database Error: ${(dbError as any).message}`)

  return { ...formData, contract_url }
}

export const useUpdateLandTransfer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateLandTransfer,
    onSuccess: () => {
      toast.success('Land transfer updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['land_transfers'] })
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.message}`)
    },
  })
}
