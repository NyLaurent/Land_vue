<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTransferStore } from '@/stores/transferStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal } from 'lucide-vue-next'

import UpdateTransferDialog from './UpdateTransferDialog.vue'

const transferStore = useTransferStore()

onMounted(() => {
  transferStore.fetchTransfers()
})

const isUpdateDialogOpen = ref(false)
const selectedTransfer = ref<any | null>(null)

const statusVariant = computed(() => {
  return (status: string) => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'processing':
        return 'secondary'
      case 'pending':
        return 'outline'
      case 'rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const handleUpdate = (transfer: any) => {
  selectedTransfer.value = transfer
  isUpdateDialogOpen.value = true
}

const handleDelete = async (id: number) => {
  try {
    await transferStore.deleteTransfer(id)
  } catch (error) {
    console.error('Delete failed:', error)
  }
}
</script>

<template>
  <div class="mt-6 border rounded-lg">
    <div v-if="transferStore.loading" class="p-4 space-y-4">
      <Skeleton class="h-8 w-full" v-for="n in 3" :key="n" />
    </div>

    <div v-else-if="transferStore.error" class="p-4 text-red-500">
      <p>Error fetching transfers: {{ transferStore.error }}</p>
    </div>

    <Table v-else-if="transferStore.transfers.length > 0">
      <TableHeader>
        <TableRow>
          <TableHead>Parcel ID</TableHead>
          <TableHead>Recipient Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date Initiated</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="transfer in transferStore.transfers" :key="transfer.id">
          <TableCell class="font-medium">{{ transfer.parcel_id }}</TableCell>
          <TableCell>{{ transfer.recipient_name }}</TableCell>
          <TableCell>
            <Badge :variant="statusVariant(transfer.status)">
              {{ transfer.status.replace('_', ' ') }}
            </Badge>
          </TableCell>
          <TableCell>{{ formatDate(transfer.created_at) }}</TableCell>
          <TableCell class="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" class="w-8 h-8 p-0">
                  <span class="sr-only">Open menu</span>
                  <MoreHorizontal class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="handleUpdate(transfer)">Update</DropdownMenuItem>
                <DropdownMenuItem @click="handleDelete(transfer.id)" class="text-red-600"
                  >Delete</DropdownMenuItem
                >
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div v-else class="p-6 text-center text-muted-foreground">
      <p>No land transfers have been initiated yet.</p>
    </div>

    <UpdateTransferDialog v-model:open="isUpdateDialogOpen" :transfer="selectedTransfer" />
  </div>
</template>
