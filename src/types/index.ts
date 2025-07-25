// Land table structure matching Supabase
export interface Land {
  id: number // int8 Primary Key
  created_at: string // timestamptz
  parcel_id: number // int2
  size: number // int4
  ownership_type: string // text
  supporting_documents: string // text (file URL)
  status: string // text
}

// Transfers table structure matching Supabase
export interface Transfer {
  id: number // int8 Primary Key
  created_at: string // timestamptz
  recipient_name: string // text
  contract_document: string // text (file URL)
  status: string // text
  parcel_id: string // text
}

// Types for form data (without auto-generated fields)
export type LandInsert = Omit<Land, 'id' | 'created_at'>
export type TransferInsert = Omit<Transfer, 'id' | 'created_at'>

// Legacy interfaces for backward compatibility (will be updated gradually)
export interface LandRegistration {
  id: string
  user_id: string
  parcel_id: string
  address: string
  land_size: number
  ownership_type: string
  ownership_proof_url: string
  status: 'pending' | 'under_review' | 'approved'
  created_at: string
}

export interface LandTransfer {
  id: string
  initiator_id: string
  recipient_id: string
  parcel_id: string
  contract_url: string
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
}
