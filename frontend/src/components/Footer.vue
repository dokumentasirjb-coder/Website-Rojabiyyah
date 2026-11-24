<script setup lang="ts">
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  Shield, 
  ChevronRight
} from 'lucide-vue-next'
import SocialIcons from '@/components/SocialIcons.vue'
import { useSettingsStore } from '@/stores/settingsStore'

const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()

function handleNav(targetPath: string) {
  if (route.path === targetPath) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.push(targetPath)
  }
}
</script>

<template>
  <footer 
    class="text-slate-300 text-xs border-t transition-colors duration-300"
    :style="{
      backgroundColor: settingsStore.settings.footer_bg_color || 'var(--site-footer-bg, #042623)',
      borderColor: 'rgba(255, 255, 255, 0.08)'
    }"
  >
    <!-- Main Footer Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
        
        <!-- Kolom 1: Profil Organisasi & Medsos (5/12) -->
        <div class="lg:col-span-5 space-y-5">
          <!-- Logo & Brand Header (Admin Controlled) -->
          <div class="flex items-center gap-3.5">
            <!-- Custom Uploaded Logo (Transparent & Precise) -->
            <div
              v-if="settingsStore.settings.logo_image_url"
              class="h-10 sm:h-11 max-h-11 flex items-center shrink-0"
            >
              <img
                :src="settingsStore.settings.logo_image_url"
                :alt="settingsStore.settings.site_title || 'Logo'"
                class="h-full w-auto max-w-[130px] object-contain drop-shadow-sm"
              />
            </div>

            <!-- Fallback Badge Emblem (When no custom logo is uploaded) -->
            <div
              v-else
              class="w-11 h-11 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center p-0.5 shrink-0 shadow-sm"
            >
              <svg viewBox="0 0 100 100" class="w-full h-full">
                <circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#008f8a" stroke-width="4" stroke-dasharray="180 50" />
                <circle cx="50" cy="50" r="36" fill="none" stroke="#b38856" stroke-width="3" />
                <text x="50" y="58" font-family="sans-serif" font-size="28" font-weight="900" fill="#008f8a" text-anchor="middle">
                  {{ settingsStore.settings.navbar_badge || '35' }}
                </text>
              </svg>
            </div>
            <div>
              <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block leading-tight">
                {{ settingsStore.settings.site_title || 'Muktamar Ke-35' }}
              </span>
              <span class="font-bold text-lg text-white block leading-none">
                {{ settingsStore.settings.site_subtitle || 'Nahdlatul Ulama' }}
              </span>
            </div>
          </div>

          <!-- Deskripsi Singkat (Admin Controlled) -->
          <p class="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
            {{ settingsStore.settings.footer_description || 'Portal resmi penyelenggaraan Muktamar ke-35 Nahdlatul Ulama (NU). Wadah permusyawaratan tertinggi para ulama nusantara dalam merawat tradisi keilmuan dan mengawal kemaslahatan bangsa.' }}
          </p>

          <div class="text-[11px] text-slate-300 font-medium italic border-l-2 border-[#008f8a] pl-3 py-0.5">
            {{ settingsStore.settings.footer_quote || '“Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa”' }}
          </div>

          <!-- Ikon Media Sosial Resmi (Admin Controlled URLs) -->
          <div class="pt-2">
            <span class="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Ikuti Media Sosial Resmi
            </span>
            <div class="flex items-center gap-2.5 flex-wrap">
              <!-- Instagram -->
              <a
                v-if="settingsStore.settings.social_instagram"
                :href="settingsStore.settings.social_instagram"
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#008f8a] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/60 cursor-pointer"
                aria-label="Instagram Resmi Muktamar"
                title="Instagram"
              >
                <SocialIcons name="instagram" :size="16" />
              </a>

              <!-- YouTube -->
              <a
                v-if="settingsStore.settings.social_youtube"
                :href="settingsStore.settings.social_youtube"
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#008f8a] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/60 cursor-pointer"
                aria-label="YouTube Resmi Muktamar"
                title="YouTube"
              >
                <SocialIcons name="youtube" :size="16" />
              </a>

              <!-- Facebook -->
              <a
                v-if="settingsStore.settings.social_facebook"
                :href="settingsStore.settings.social_facebook"
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#008f8a] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/60 cursor-pointer"
                aria-label="Facebook Resmi Muktamar"
                title="Facebook"
              >
                <SocialIcons name="facebook" :size="16" />
              </a>

              <!-- X / Twitter -->
              <a
                v-if="settingsStore.settings.social_twitter"
                :href="settingsStore.settings.social_twitter"
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#008f8a] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/60 cursor-pointer"
                aria-label="X / Twitter Resmi Muktamar"
                title="X (Twitter)"
              >
                <SocialIcons name="twitter" :size="15" />
              </a>

              <!-- TikTok -->
              <a
                v-if="settingsStore.settings.social_tiktok"
                :href="settingsStore.settings.social_tiktok"
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#008f8a] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/60 cursor-pointer"
                aria-label="TikTok Resmi Muktamar"
                title="TikTok"
              >
                <SocialIcons name="tiktok" :size="15" />
              </a>

              <!-- WhatsApp Hotline -->
              <a
                v-if="settingsStore.settings.social_whatsapp"
                :href="settingsStore.settings.social_whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#008f8a] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/60 cursor-pointer"
                aria-label="WhatsApp Hotline Muktamar"
                title="WhatsApp Hotline"
              >
                <SocialIcons name="whatsapp" :size="16" />
              </a>
            </div>
          </div>
        </div>

        <!-- Kolom 2: Navigasi Cepat (3/12) -->
        <div class="lg:col-span-3 space-y-4">
          <h4 class="font-bold text-sm text-white tracking-wide uppercase text-[12px]">
            Jelajahi
          </h4>
          <ul class="space-y-2.5 font-normal text-slate-400">
            <li>
              <button
                type="button"
                @click="handleNav('/')"
                class="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
              >
                <ChevronRight class="w-3 h-3 text-[#008f8a]" />
                <span>Beranda Utama</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                @click="handleNav('/tentang')"
                class="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
              >
                <ChevronRight class="w-3 h-3 text-[#008f8a]" />
                <span>Tentang Muktamar</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                @click="handleNav('/agenda')"
                class="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
              >
                <ChevronRight class="w-3 h-3 text-[#008f8a]" />
                <span>Jadwal & Agenda</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                @click="handleNav('/berita')"
                class="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
              >
                <ChevronRight class="w-3 h-3 text-[#008f8a]" />
                <span>Warta & Liputan</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                @click="handleNav('/galeri')"
                class="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
              >
                <ChevronRight class="w-3 h-3 text-[#008f8a]" />
                <span>Galeri Foto</span>
              </button>
            </li>
          </ul>
        </div>

        <!-- Kolom 3: Sekretariat & Kontak (4/12) - (Admin Controlled) -->
        <div class="lg:col-span-4 space-y-4">
          <h4 class="font-bold text-sm text-white tracking-wide uppercase text-[12px]">
            Sekretariat Panitia
          </h4>
          <ul class="space-y-3 font-normal text-slate-400">
            <li class="flex items-start gap-2.5">
              <MapPin class="w-4 h-4 text-[#008f8a] shrink-0 mt-0.5" />
              <span>
                {{ settingsStore.settings.contact_address || 'Kompleks Pondok Pesantren Bahrul Ulum, Tambakberas, Kec. Jombang, Kab. Jombang, Jawa Timur 61451' }}
              </span>
            </li>
            <li class="flex items-center gap-2.5">
              <Mail class="w-4 h-4 text-[#008f8a] shrink-0" />
              <a :href="'mailto:' + settingsStore.settings.contact_email" class="hover:text-white transition-colors">
                {{ settingsStore.settings.contact_email || 'muktamar@nu.id' }}
              </a>
            </li>
            <li class="flex items-center gap-2.5">
              <Phone class="w-4 h-4 text-[#008f8a] shrink-0" />
              <a :href="'tel:' + settingsStore.settings.contact_phone" class="hover:text-white transition-colors">
                {{ settingsStore.settings.contact_phone || '+62 (0321) 8899-7700' }}
              </a>
            </li>
            <li class="flex items-center gap-2.5 text-[11px] text-slate-400">
              <Clock class="w-4 h-4 text-[#008f8a] shrink-0" />
              <span>{{ settingsStore.settings.contact_hours || 'Pelayanan: 24 Jam selama Muktamar' }}</span>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <!-- Bottom Copyright & Legal Links -->
    <div 
      class="border-t py-6 transition-colors duration-300"
      :style="{
        backgroundColor: settingsStore.settings.footer_bottom_bg_color || 'var(--site-footer-bottom-bg, #021a18)',
        borderColor: 'rgba(255, 255, 255, 0.08)'
      }"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <div>
          &copy; {{ new Date().getFullYear() }} <strong>{{ settingsStore.settings.footer_copyright || 'Perkumpulan Nahdlatul Ulama' }}</strong>. Seluruh Hak Cipta Dilindungi.
        </div>

        <div class="flex items-center gap-4 text-slate-400">
          <RouterLink to="/admin/content" class="hover:text-emerald-400 transition-colors flex items-center gap-1 text-[#008f8a]">
            <Shield class="w-3.5 h-3.5" />
            <span>Panel CMS</span>
          </RouterLink>
          <span>•</span>
          <a href="#" class="hover:text-slate-200 transition-colors">Kebijakan Privasi</a>
          <span>•</span>
          <a href="#" class="hover:text-slate-200 transition-colors">Syarat & Ketentuan</a>
        </div>
      </div>
    </div>
  </footer>
</template>
