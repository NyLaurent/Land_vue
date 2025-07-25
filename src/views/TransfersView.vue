<script setup lang="ts">
import { ref, watch } from 'vue'
import { ArrowRightLeft, TrendingUp, Clock, CheckCircle, Activity } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import TransferForm from '@/components/transfers/TransferForm.vue'
import TransferList from '@/components/transfers/TransferList.vue'
import { useI18n } from 'vue-i18n'
import { useTransferStore } from '@/stores/transferStore'

const isTransferDialogOpen = ref(false)
const formRef = ref<InstanceType<typeof TransferForm> | null>(null)
const { t } = useI18n()

// Use the transfer store to get transfer data
const transferStore = useTransferStore()

// Use the store's computed properties directly
const { transferCount, pendingTransfers, completedTransfers } = transferStore

// Load transfers when component mounts
transferStore.fetchTransfers()

const handleFormSuccess = () => {
  isTransferDialogOpen.value = false
}

watch(isTransferDialogOpen, (isOpen) => {
  if (!isOpen) {
    setTimeout(() => {
      if (formRef.value && typeof formRef.value.resetForm === 'function') {
        formRef.value.resetForm()
      }
    }, 100)
  }
})
</script>

<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="relative overflow-hidden rounded-2xl bg-blue-100 p-8 text-blue-900 border border-blue-200">
      <div class="relative z-10">
        <div class="mb-4">
          <h1 class="text-3xl font-bold">{{ t('titles.land_transfers') }}</h1>
          <p class="text-blue-700 mt-2">{{ t('descriptions.land_transfers') }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold">{{ transferCount }}</div>
            <div class="text-blue-700 text-sm">{{ t('stats.total_transfers') }}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold">{{ pendingTransfers.length }}</div>
            <div class="text-blue-700 text-sm">{{ t('stats.pending') }}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold">{{ completedTransfers.length }}</div>
            <div class="text-blue-700 text-sm">{{ t('stats.completed') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card class="bg-white border border-gray-200 hover:scale-105 transition-transform duration-300">
        <CardContent class="p-6 text-center">
          <div class="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <ArrowRightLeft class="w-5 h-5 text-white" />
          </div>
          <h3 class="font-semibold text-sm mb-2 text-blue-900">{{ t('buttons.start_transfer') }}</h3>
          <Dialog>
            <DialogTrigger as-child>
              <Button class="bg-blue-600 w-full text-white border border-blue-600 hover:bg-blue-700 transition-all duration-200">
                {{ t('buttons.start_transfer') }}
              </Button>
            </DialogTrigger>
            <DialogContent class="max-w-2xl bg-white border border-gray-200">
              <TransferForm />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card class="bg-white border border-gray-200">
        <CardContent class="p-6 text-center">
          <div class="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock class="w-5 h-5 text-white" />
          </div>
          <h3 class="font-semibold text-sm mb-2 text-blue-900">{{ t('stats.pending') }}</h3>
          <div class="text-2xl font-bold text-blue-600">{{ pendingTransfers.length }}</div>
        </CardContent>
      </Card>

      <Card class="bg-white border border-gray-200">
        <CardContent class="p-6 text-center">
          <div class="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle class="w-5 h-5 text-blue-600" />
          </div>
          <h3 class="font-semibold text-sm mb-2 text-blue-900">{{ t('stats.completed') }}</h3>
          <div class="text-2xl font-bold text-blue-600">{{ completedTransfers.length }}</div>
        </CardContent>
      </Card>

      <Card class="bg-white border border-gray-200">
        <CardContent class="p-6 text-center">
          <div class="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 bg-gray-100">
            <Activity class="w-5 h-5 text-gray-600" />
          </div>
          <h3 class="font-semibold text-sm mb-2 text-gray-700">{{ t('stats.total_transfers') }}</h3>
          <div class="text-2xl font-bold text-gray-600">{{ transferCount }}</div>
        </CardContent>
      </Card>
    </div>

    <!-- Transfer Records -->
    <Card class="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle class="text-blue-900">{{ t('titles.transfer_records') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="mb-4 p-4 bg-blue-100 rounded-xl border border-blue-200">
          <h3 class="text-blue-900 font-semibold">{{ t('tips.transfer_process') }}</h3>
          <p class="text-blue-700 mt-2">{{ t('descriptions.transfer_tip') }}</p>
        </div>
        <TransferList />
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
.bg-white {
  background: #ffffff;
}
</style>
