<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, ShieldCheck, Newspaper, MapPin, Settings } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { useSettingsStore } from '@/stores/settingsStore'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

onMounted(() => {
  settingsStore.fetchSettings()
})

async function handleSubmit() {
  if (!email.value || !password.value) return
  const result = await authStore.login(email.value, password.value)
  if (result.success) {
    const redirectUrl = (route.query.redirect as string) || '/admin/content'
    router.push(redirectUrl)
  }
}
</script>

<template>
  <div class="min-h-screen w-full grid lg:grid-cols-12 bg-white">
    <!-- Left Full-Height Branded Panel (Desktop) -->
    <div class="hidden lg:flex lg:col-span-7 relative overflow-hidden bg-gradient-to-br from-[#021d13] via-[#053825] to-[#006432] text-white flex-col justify-between p-12 xl:p-16">
      <!-- Subtle Decorative Glow -->
      <div class="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-[#c59b27]/15 blur-3xl pointer-events-none"></div>

      <!-- Top Brand (Tautan ke Halaman Publik) -->
      <RouterLink
        to="/"
        title="Kembali ke Halaman Publik"
        class="relative z-10 inline-flex items-center gap-4 w-fit group hover:opacity-90 transition-opacity"
      >
        <div v-if="settingsStore.settings.logo_image_url" class="h-12 sm:h-14 flex items-center shrink-0">
          <img
            :src="settingsStore.settings.logo_image_url"
            :alt="settingsStore.settings.site_title || 'Logo'"
            class="h-full w-auto max-w-[180px] object-contain drop-shadow-md mix-blend-screen"
          />
        </div>
        <div v-else class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center p-1.5 border border-[#c59b27]/50 shadow-lg group-hover:border-[#f3e5ab] transition-colors shrink-0 overflow-hidden">
          <img src="/favicon-96x96.png" alt="Logo Panitia Rojabiyyah" class="w-full h-full object-contain" />
        </div>
        <div class="min-w-0">
          <p class="text-[11px] uppercase tracking-[0.18em] text-emerald-300 font-semibold group-hover:text-[#f3e5ab] transition-colors truncate">
            {{ settingsStore.settings.site_title || 'PANITIA ROJABIYYAH' }}
          </p>
          <p class="text-lg font-extrabold text-white tracking-tight leading-tight truncate">
            {{ settingsStore.settings.site_subtitle || 'HAUL ABAH KE-5' }}
          </p>
        </div>
      </RouterLink>

      <!-- Center Hero Copy -->
      <div class="relative z-10 max-w-xl space-y-6 my-auto py-12">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-emerald-200 backdrop-blur-xs">
          <ShieldCheck class="w-4 h-4 text-[#f3e5ab]" />
          <span>Akses Khusus Panitia &amp; Pengelola</span>
        </div>

        <h1 class="font-serif text-4xl xl:text-5xl font-bold tracking-tight leading-tight text-white">
          PANEL PANITIA<br />
          <span class="text-[#f3e5ab]">ROJABIYYAH</span>
        </h1>

        <p class="text-sm xl:text-base text-emerald-100/80 leading-relaxed">
          Pusat kendali untuk mengelola berita acara, jadwal agenda, galeri dokumentasi, katalog Tabbarukan, peta titik lokasi, dan tampilan situs secara terpadu.
        </p>

        <div class="grid grid-cols-3 gap-4 pt-4">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <Newspaper class="w-5 h-5 text-[#f3e5ab] mb-2" />
            <p class="text-xs font-bold text-white">Berita &amp; Warta</p>
            <p class="text-[11px] text-emerald-100/70 mt-0.5">Kelola artikel &amp; foto liputan</p>
          </div>
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <MapPin class="w-5 h-5 text-[#f3e5ab] mb-2" />
            <p class="text-xs font-bold text-white">Peta &amp; Info</p>
            <p class="text-[11px] text-emerald-100/70 mt-0.5">Atur titik lokasi &amp; panduan</p>
          </div>
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <Settings class="w-5 h-5 text-[#f3e5ab] mb-2" />
            <p class="text-xs font-bold text-white">Tampilan Situs</p>
            <p class="text-[11px] text-emerald-100/70 mt-0.5">Tema, banner &amp; keamanan</p>
          </div>
        </div>
      </div>

      <!-- Bottom Copyright -->
      <div class="relative z-10 flex items-center justify-between text-xs text-emerald-200/70 border-t border-white/10 pt-6">
        <span>&copy; {{ new Date().getFullYear() }} Panitia Rojabiyyah</span>
        <span>Dashboard Admin</span>
      </div>
    </div>

    <!-- Right Full-Height Login Form Panel -->
    <div class="lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 lg:px-14 xl:px-20 py-12 bg-[#f8faf9] lg:bg-white">
      <div class="w-full max-w-md mx-auto">
        <!-- Mobile Brand Header -->
        <RouterLink to="/" class="lg:hidden block text-center mb-8 hover:opacity-90 transition-opacity">
          <div v-if="settingsStore.settings.logo_image_url" class="h-14 flex items-center justify-center mx-auto mb-3">
            <img
              :src="settingsStore.settings.logo_image_url"
              :alt="settingsStore.settings.site_title || 'Logo'"
              class="h-full w-auto max-w-[160px] object-contain"
            />
          </div>
          <div v-else class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#006432] to-[#022314] flex items-center justify-center p-1.5 mx-auto shadow-md border border-[#c59b27] overflow-hidden">
            <img src="/favicon-96x96.png" alt="Logo Panitia Rojabiyyah" class="w-full h-full object-contain" />
          </div>
          <h1 class="mt-3 font-serif text-2xl font-bold text-[#006432]">
            PANEL PANITIA ROJABIYYAH
          </h1>
          <p class="text-xs text-slate-500 mt-1">Dashboard Admin &amp; Manajemen Konten</p>
        </RouterLink>

        <!-- Form Header -->
        <div class="mb-8">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Masuk ke Dashboard
          </h2>
          <p class="text-sm text-slate-500 mt-1.5">
            Masukkan email dan kata sandi panitia untuk melanjutkan.
          </p>
        </div>

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
            <label for="email" class="block text-xs font-semibold text-slate-800 mb-2">
              Email Admin
            </label>
            <div class="relative">
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                placeholder="admin@rojabiyyah.id"
                class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006432] focus:border-[#006432] transition-all shadow-2xs"
              />
              <Mail class="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <!-- Input Password -->
          <div>
            <label for="password" class="block text-xs font-semibold text-slate-800 mb-2">
              Kata Sandi
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="Masukkan kata sandi"
                class="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006432] focus:border-[#006432] transition-all shadow-2xs"
              />
              <Lock class="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                :aria-label="showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Tombol Masuk -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="authStore.isLoading || authStore.retryAfterSeconds > 0"
              class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#006432] to-[#0b7c43] text-white text-sm font-bold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#006432] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Loader2 v-if="authStore.isLoading" class="w-4 h-4 animate-spin" />
              <span v-else-if="authStore.retryAfterSeconds > 0">
                Tunggu {{ authStore.retryAfterSeconds }} detik...
              </span>
              <span v-else class="flex items-center gap-2">
                Masuk ke Dashboard Admin <ArrowRight class="w-4 h-4" />
              </span>
            </button>
          </div>
        </form>

        <div class="mt-8 pt-6 border-t border-slate-200 text-center">
          <RouterLink to="/" class="text-xs text-[#006432] hover:underline font-semibold">
            &larr; Kembali ke Beranda Utama
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
