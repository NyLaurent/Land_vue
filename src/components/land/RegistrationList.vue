<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLandStore } from '@/stores/landStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-vue-next'

const landStore = useLandStore()

onMounted(() => {
  landStore.fetchLands()
})

const statusVariant = computed(() => {
  return (status: string) => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'under_review':
        return 'secondary'
      case 'pending':
      default:
        return 'outline'
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
</script>

<template>
  <div class="mt-6 border rounded-lg">
    <div v-if="landStore.loading" class="p-4 space-y-4">
      <Skeleton class="h-8 w-full" v-for="n in 3" :key="n" />
    </div>

    <div v-else-if="landStore.error" class="p-4 text-red-500">
      <p>Error fetching land records: {{ landStore.error }}</p>
    </div>

    <Table v-else-if="landStore.lands.length > 0">
      <TableHeader>
        <TableRow>
          <TableHead>Parcel ID</TableHead>
          <TableHead>Size (sqm)</TableHead>
          <TableHead>Ownership Type</TableHead>
          <TableHead>Date Submitted</TableHead>
          <TableHead>Status</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="land in landStore.lands" :key="land.id">
          <TableCell class="font-medium">{{ land.parcel_id }}</TableCell>
          <TableCell>{{ land.size.toLocaleString() }}</TableCell>
          <TableCell class="capitalize">{{ land.ownership_type }}</TableCell>
          <TableCell>{{ formatDate(land.created_at) }}</TableCell>
          <TableCell>
            <Badge :variant="statusVariant(land.status)">
              {{ land.status.replace('_', ' ') }}
            </Badge>
          </TableCell>
          <TableCell class="text-right">
            <div class="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                @click="landStore.deleteLand(land.id)"
                :disabled="landStore.loading"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div v-else class="p-6 text-center text-muted-foreground">
      <p>You have not submitted any land registrations yet.</p>
    </div>
  </div>
</template>
