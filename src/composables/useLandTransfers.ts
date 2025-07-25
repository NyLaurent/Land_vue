import { useQuery } from '@tanstack/vue-query'
import { supabase } from '@/lib/supabaseClient'
import type { LandTransfer } from '@/types'

const fetchLandTransfers = async () => {
  const { data, error } = await supabase
    .from('transfers')
    .select()
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error((error as any).message)
  }

  return data as LandTransfer[]
}

export const useLandTransfers = () => {
  return useQuery({
    queryKey: ['land_transfers'],
    queryFn: fetchLandTransfers,
  })
}
