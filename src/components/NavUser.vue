<script setup lang="ts">
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles, User } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const props = defineProps<{
  user: {
    name: string
    email: string
    avatar: string
  }
}>()

const { t } = useI18n()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="relative h-10 w-10 rounded-full bg-white/20 border border-white/30 hover:bg-white/30 transition-all duration-200"
      >
        <Avatar class="h-8 w-8 rounded-full">
          <AvatarImage :src="user.avatar" :alt="user.name" />
          <AvatarFallback class="rounded-full bg-blue-500 text-white border border-blue-400">
            <User class="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-64 bg-white border border-gray-200"
      side="bottom"
      align="end"
      :side-offset="8"
    >
      <DropdownMenuLabel class="p-0 font-normal">
        <div class="flex items-center gap-3 px-3 py-3 text-left">
          <Avatar class="h-10 w-10 rounded-full">
            <AvatarImage :src="user.avatar" :alt="user.name" />
            <AvatarFallback class="rounded-full bg-blue-500 text-white border border-blue-400">
              <User class="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div class="grid flex-1 text-left leading-tight">
            <span class="truncate font-semibold text-blue-900">{{ user.name }}</span>
            <span class="truncate text-sm text-blue-700">{{ user.email }}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator class="bg-gray-200" />
      <DropdownMenuGroup>
        <DropdownMenuItem class="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-0">
          <Sparkles class="mr-3 h-4 w-4 text-blue-600" />
          <span class="text-blue-900">{{ t('user_menu.upgrade_pro') }}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator class="bg-gray-200" />
      <DropdownMenuGroup>
        <DropdownMenuItem class="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-0">
          <BadgeCheck class="mr-3 h-4 w-4 text-blue-600" />
          <span class="text-blue-900">{{ t('user_menu.account_settings') }}</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-0">
          <CreditCard class="mr-3 h-4 w-4 text-blue-600" />
          <span class="text-blue-900">{{ t('user_menu.billing') }}</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-0">
          <Bell class="mr-3 h-4 w-4 text-blue-600" />
          <span class="text-blue-900">{{ t('user_menu.notifications') }}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator class="bg-gray-200" />
      <DropdownMenuItem class="px-3 py-2 hover:bg-red-50 cursor-pointer transition-colors border-0">
        <LogOut class="mr-3 h-4 w-4 text-red-600" />
        <span class="text-red-700">{{ t('user_menu.sign_out') }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
