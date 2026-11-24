<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { useSettingsStore } from '@/stores/settingsStore'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')

async function handleSubmit() {
  if (!email.value || !password.value) return
  const result = await authStore.login(email.value, password.value)
  if (result.success) {
    const redirectUrl = (route.query.redirect as string) || '/admin/articles'
    router.push(redirectUrl)
  }
}

function fillDemo(userEmail: string) {
  email.value = userEmail
  password.value = 'password123'
}
</script>

<template>
  <div class="min-h-screen bg-[#f8faf9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <!-- Custom Uploaded Logo or Fallback Emblem -->
      <div v-if="settingsStore.settings.logo_image_url" class="h-16 flex items-center justify-center mx-auto mb-3">
        <img
          :src="settingsStore.settings.logo_image_url"
          :alt="settingsStore.settings.site_title || 'Logo'"
          class="h-full w-auto max-w-[180px] object-contain drop-shadow-md"
        />
      </div>
      <div v-else class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006432] to-[#022314] text-[#f3e5ab] font-serif text-3xl font-bold flex items-center justify-center mx-auto shadow-lg ring-4 ring-[#c59b27]/30 border border-[#c59b27]">
        {{ settingsStore.settings.navbar_badge || 'NU' }}
      </div>
      <h1 class="mt-4 font-serif text-3xl font-bold tracking-tight text-[#006432]">
        MUKTAMAR NU CMS
      </h1>
      <p class="mt-1 text-xs text-slate-500 uppercase tracking-widest font-sans">
        Panel Manajemen Warta & Publikasi
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
      <div class="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-slate-200">
        <!-- Alert Error jika login gagal -->
        <div
          v-if="authStore.error"
          class="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5"
        >
          <AlertCircle class="w-4 h-4 text-rose-600 shrink-0" />
          <span>{{ authStore.error }}</span>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Input Email -->
          <div>
            <label for="email" class="block text-xs font-semibold text-slate-800 mb-1.5">
              Alamat Email Redaksi
            </label>
            <div class="relative">
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                placeholder="redaksi@nu.id atau admin@rojabiyyah.id"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006432] focus:bg-white transition-all shadow-2xs"
              />
              <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <!-- Input Password -->
          <div>
            <label for="password" class="block text-xs font-semibold text-slate-800 mb-1.5">
              Kata Sandi
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                type="password"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006432] focus:bg-white transition-all shadow-2xs"
              />
              <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <!-- Tombol Masuk -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#006432] to-[#0b7c43] text-white text-xs font-bold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#006432] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Loader2 v-if="authStore.isLoading" class="w-4 h-4 animate-spin" />
              <span v-else class="flex items-center gap-2">
                Masuk ke Panel Redaksi <ArrowRight class="w-4 h-4" />
              </span>
            </button>
          </div>
        </form>

        <!-- Quick Demo Credentials Box -->
        <div class="mt-6 pt-6 border-t border-slate-100">
          <span class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
            Akun Percobaan (Demo)
          </span>
          <div class="space-y-2">
            <button
              type="button"
              @click="fillDemo('admin@rojabiyyah.id')"
              class="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-[#e8f5ee] border border-slate-200 hover:border-[#006432] transition-colors text-left flex items-center justify-between text-xs cursor-pointer"
            >
              <div>
                <span class="font-bold text-slate-800 block text-[11px]">Administrator Utama</span>
                <span class="text-slate-500 text-[10px]">admin@rojabiyyah.id</span>
              </div>
              <span class="text-[10px] text-[#006432] font-semibold">Pilih</span>
            </button>

            <button
              type="button"
              @click="fillDemo('editor@rojabiyyah.id')"
              class="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-[#e8f5ee] border border-slate-200 hover:border-[#006432] transition-colors text-left flex items-center justify-between text-xs cursor-pointer"
            >
              <div>
                <span class="font-bold text-slate-800 block text-[11px]">Redaktur Pelaksana</span>
                <span class="text-slate-500 text-[10px]">editor@rojabiyyah.id</span>
              </div>
              <span class="text-[10px] text-[#006432] font-semibold">Pilih</span>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <RouterLink to="/" class="text-xs text-[#006432] hover:underline font-semibold">
          &larr; Kembali ke Beranda Utama Muktamar
        </RouterLink>
      </div>
    </div>
  </div>
</template>
