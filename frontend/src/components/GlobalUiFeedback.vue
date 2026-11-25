<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'
import { AlertTriangle, CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next'

const uiStore = useUiStore()
</script>

<template>
  <!-- Global Floating Toast Notification -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="uiStore.toast.show"
        class="fixed top-5 right-5 z-[9999] max-w-sm w-[calc(100%-2.5rem)] rounded-2xl border px-4 py-3.5 shadow-2xl backdrop-blur-md flex items-start gap-3"
        :class="{
          'bg-[#08291f]/95 border-emerald-500/40 text-emerald-100': uiStore.toast.type === 'success',
          'bg-[#2a0c12]/95 border-rose-500/40 text-rose-100': uiStore.toast.type === 'error',
          'bg-[#291d06]/95 border-amber-500/40 text-amber-100': uiStore.toast.type === 'warning',
          'bg-[#071f29]/95 border-sky-500/40 text-sky-100': uiStore.toast.type === 'info',
        }"
      >
        <CheckCircle2 v-if="uiStore.toast.type === 'success'" class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <AlertCircle v-else-if="uiStore.toast.type === 'error'" class="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <AlertTriangle v-else-if="uiStore.toast.type === 'warning'" class="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <Info v-else class="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />

        <p class="text-xs font-medium leading-relaxed flex-1">{{ uiStore.toast.message }}</p>

        <button
          type="button"
          @click="uiStore.closeToast()"
          class="text-white/60 hover:text-white transition-colors cursor-pointer shrink-0"
          aria-label="Tutup notifikasi"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </Transition>

    <!-- Global Custom Confirm Modal -->
    <div
      v-if="uiStore.confirmModal.show"
      class="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      @click.self="uiStore.resolveConfirm(false)"
    >
      <div class="w-full max-w-md rounded-3xl bg-[#071f17] border border-[#174838] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-3.5">
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              :class="{
                'bg-rose-500/15 text-rose-400 border border-rose-500/30': uiStore.confirmModal.variant === 'danger',
                'bg-amber-500/15 text-amber-400 border border-amber-500/30': uiStore.confirmModal.variant === 'warning',
                'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30': uiStore.confirmModal.variant === 'info',
              }"
            >
              <AlertTriangle class="w-5 h-5" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-base font-bold text-white tracking-tight">
                {{ uiStore.confirmModal.title }}
              </h3>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1.5 break-words">
                {{ uiStore.confirmModal.message }}
              </p>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-[#04140f] border-t border-[#12382b] flex items-center justify-end gap-2.5">
          <button
            type="button"
            @click="uiStore.resolveConfirm(false)"
            class="px-4 py-2 rounded-xl border border-[#1a4b3b] bg-[#0b261d] hover:bg-[#113529] text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            {{ uiStore.confirmModal.cancelText }}
          </button>
          <button
            type="button"
            @click="uiStore.resolveConfirm(true)"
            class="px-5 py-2 rounded-xl text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            :class="{
              'bg-rose-600 hover:bg-rose-500': uiStore.confirmModal.variant === 'danger',
              'bg-amber-600 hover:bg-amber-500': uiStore.confirmModal.variant === 'warning',
              'bg-[#008f8a] hover:bg-[#007a75]': uiStore.confirmModal.variant === 'info',
            }"
          >
            {{ uiStore.confirmModal.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
