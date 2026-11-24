<script setup lang="ts">
import { ref } from 'vue'
import { Calendar, Clock, MapPin, CheckCircle, Bell, ArrowRight, Bookmark } from 'lucide-vue-next'
import { useNewsStore } from '@/stores/newsStore'

const newsStore = useNewsStore()
const activeDay = ref(1)

const daysSchedule = [
  {
    day: 1,
    date: 'Kamis, 27 Agustus 2026',
    title: 'Kedatangan & Upacara Pembukaan Akbar',
    sessions: [
      {
        time: '08:00 - 12:00 WIB',
        title: 'Registrasi Ulang Muktamirin & Penyerahan Perlengkapan',
        venue: 'Gedung Serbaguna KH. Wahab Chasbullah',
        speaker: 'Sekretariat Panitia Pusat',
        category: 'Registrasi'
      },
      {
        time: '13:30 - 16:30 WIB',
        title: 'Upacara Pembukaan Akbar Muktamar ke-35 Nahdlatul Ulama',
        venue: 'Stadion Utama Tambakberas',
        speaker: 'Presiden RI & Rais \'Aam PBNU',
        category: 'Pembukaan'
      },
      {
        time: '19:30 - 22:00 WIB',
        title: 'Gala Dinner & Silaturahmi Alim Ulama Nusantara',
        venue: 'Aula Induk Pesantren Bahrul Ulum',
        speaker: 'Pengurus Harian Syuriyah & Tanfidziyah',
        category: 'Silaturahmi'
      }
    ]
  },
  {
    day: 2,
    date: 'Jumat, 28 Agustus 2026',
    title: 'Sidang Pleno I & II (LPJ dan Tanggapan)',
    sessions: [
      {
        time: '08:30 - 11:30 WIB',
        title: 'Sidang Pleno I: Pengesahan Tatib & Jadwal Persidangan Muktamar',
        venue: 'Aula Muktamar Utama',
        speaker: 'Presidium Sidang Sementara',
        category: 'Sidang Pleno'
      },
      {
        time: '14:00 - 17:30 WIB',
        title: 'Sidang Pleno II: Laporan Pertanggungjawaban (LPJ) PBNU Masa Khidmah 2021-2026',
        venue: 'Aula Muktamar Utama',
        speaker: 'Ketua Umum PBNU & Jajaran Tanfidziyah',
        category: 'Sidang Pleno'
      },
      {
        time: '19:30 - 23:00 WIB',
        title: 'Pandangan Umum PWNU se-Indonesia & PCINU Mancanegara',
        venue: 'Aula Muktamar Utama',
        speaker: 'Perwakilan Delegasi Wilayah',
        category: 'Pandangan Umum'
      }
    ]
  },
  {
    day: 3,
    date: 'Sabtu, 29 Agustus 2026',
    title: 'Sidang Komisi (Bahtsul Masail & Program)',
    sessions: [
      {
        time: '08:30 - 12:00 WIB',
        title: 'Komisi Bahtsul Masail Waqi\'iyyah (Isu Fiqih Kontemporer)',
        venue: 'Gedung Tahfidz Ma\'had Aly',
        speaker: 'Ulama & Masyayikh Syuriyah',
        category: 'Bahtsul Masail'
      },
      {
        time: '08:30 - 12:00 WIB',
        title: 'Komisi Bahtsul Masail Maudhu\'iyyah & Qanuniyyah',
        venue: 'Auditorium Syari\'ah',
        speaker: 'Pakar Hukum Islam & Komisi Perundang-undangan',
        category: 'Bahtsul Masail'
      },
      {
        time: '13:30 - 17:30 WIB',
        title: 'Komisi Program & Pengembangan Ekonomi Umat 2026-2031',
        venue: 'Gedung Pusat Bisnis Santri',
        speaker: 'Lembaga Perekonomian & Komisi Terkait',
        category: 'Komisi Program'
      },
      {
        time: '19:30 - 22:30 WIB',
        title: 'Sidang Pleno III: Laporan Hasil Sidang Tiap Komisi',
        venue: 'Aula Muktamar Utama',
        speaker: 'Ketua-ketua Komisi Muktamar',
        category: 'Sidang Pleno'
      }
    ]
  },
  {
    day: 4,
    date: 'Minggu, 30 Agustus 2026',
    title: 'Musyawarah AHWA & Pemilihan Ketua Umum',
    sessions: [
      {
        time: '09:00 - 12:00 WIB',
        title: 'Sidang Pleno IV: Musyawarah Ahlul Halli wal \'Aqdi (AHWA)',
        venue: 'Ruang Khusus Syuriyah Masyayikh',
        speaker: '9 Anggota AHWA Terpilih',
        category: 'Pemilihan Rais \'Aam'
      },
      {
        time: '14:00 - 17:00 WIB',
        title: 'Penetapan Rais \'Aam Terpilih Masa Khidmah 2026-2031',
        venue: 'Aula Muktamar Utama',
        speaker: 'Pimpinan Sidang Pleno',
        category: 'Penetapan'
      },
      {
        time: '19:30 - Selesai WIB',
        title: 'Pemilihan Ketua Umum Pengurus Besar Nahdlatul Ulama',
        venue: 'Aula Muktamar Utama',
        speaker: 'Muktamirin Utusan Sah PCNU/PWNU',
        category: 'Pemilihan'
      }
    ]
  },
  {
    day: 5,
    date: 'Senin, 31 Agustus 2026',
    title: 'Penutupan Resmi & Doa Bersama untuk Bangsa',
    sessions: [
      {
        time: '09:00 - 12:00 WIB',
        title: 'Upacara Penutupan Muktamar ke-35 Nahdlatul Ulama',
        venue: 'Stadion Utama Tambakberas',
        speaker: 'Wakil Presiden RI & Rais \'Aam Terpilih',
        category: 'Penutupan'
      },
      {
        time: '13:00 - 15:00 WIB',
        title: 'Press Conference Rilis Hasil Muktamar untuk Media',
        venue: 'Media Center Utama',
        speaker: 'PBNU Terpilih & Panitia Nasional',
        category: 'Media Release'
      }
    ]
  }
]
</script>

<template>
  <section id="agenda-section" class="py-16 sm:py-20 bg-[#f8faf9] border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5ee] text-[#006432] text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar class="w-3.5 h-3.5 text-[#c59b27]" />
            Jadwal & Rangkaian Agenda
          </div>
          <h2 class="text-2xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
            Agenda Kegiatan Muktamar ke-35 NU
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-light">
            Susunan jadwal sidang pleno, sidang komisi, bahtsul masail, dan upacara penutupan di Jombang.
          </p>
        </div>

        <!-- Day Selector Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            v-for="d in daysSchedule"
            :key="d.day"
            type="button"
            @click="activeDay = d.day"
            class="px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-2 border"
            :class="[
              activeDay === d.day
                ? 'bg-[#006432] text-white border-[#006432] shadow-md shadow-[#006432]/20'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            ]"
          >
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px]" :class="activeDay === d.day ? 'bg-[#c59b27] text-[#022314]' : 'bg-slate-100 text-slate-600'">
              {{ d.day }}
            </span>
            <span>Hari ke-{{ d.day }}</span>
          </button>
        </div>
      </div>

      <!-- Selected Day Details & Schedule List -->
      <div class="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Sessions List (Left 8/12) -->
        <div class="lg:col-span-8 space-y-4">
          <div class="p-4 rounded-2xl bg-white border border-[#c59b27]/30 shadow-xs flex items-center justify-between">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#c59b27]">
                {{ daysSchedule[activeDay - 1].date }}
              </span>
              <h3 class="font-serif text-lg font-bold text-slate-900">
                {{ daysSchedule[activeDay - 1].title }}
              </h3>
            </div>
            <span class="px-3 py-1 rounded-full bg-[#006432]/10 text-[#006432] font-semibold text-xs">
              {{ daysSchedule[activeDay - 1].sessions.length }} Sesi
            </span>
          </div>

          <div
            v-for="(session, idx) in daysSchedule[activeDay - 1].sessions"
            :key="idx"
            class="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#006432]/50 hover:shadow-md transition-all duration-300"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#e8f5ee] text-[#006432]">
                <Bookmark class="w-3 h-3 text-[#c59b27]" />
                {{ session.category }}
              </span>
              <span class="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                <Clock class="w-3.5 h-3.5 text-[#c59b27]" />
                {{ session.time }}
              </span>
            </div>

            <h4 class="font-serif text-base sm:text-lg font-bold text-slate-900 mt-3">
              {{ session.title }}
            </h4>

            <div class="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-light">
              <span class="flex items-center gap-1 text-slate-600">
                <MapPin class="w-3.5 h-3.5 text-[#006432]" />
                {{ session.venue }}
              </span>
              <span>•</span>
              <span class="text-slate-600">
                Narasumber/Pelaksana: <strong>{{ session.speaker }}</strong>
              </span>
            </div>
          </div>
        </div>

        <!-- Right Side: Warta & Pengumuman Panitia (4/12) -->
        <div class="lg:col-span-4 space-y-5">
          <div class="p-6 rounded-2xl bg-gradient-to-br from-[#022314] to-[#053b22] text-white shadow-lg border border-[#c59b27]/40">
            <div class="flex items-center gap-2 text-[#f3e5ab] text-xs font-bold uppercase tracking-wider mb-2">
              <Bell class="w-4 h-4 text-[#c59b27]" />
              Pengumuman Panitia Pelaksana
            </div>
            <h4 class="font-serif text-xl font-bold text-white mb-3">
              Maklumat Resmi Muktamirin
            </h4>
            <p class="text-xs text-emerald-100 leading-relaxed font-light mb-4">
              Semua peserta diwajibkan melakukan scan barcode ID Card di pintu masuk arena sidang paling lambat 15 menit sebelum acara dimulai.
            </p>

            <!-- Real announcements from backend if available -->
            <div v-if="newsStore.homeData.announcements && newsStore.homeData.announcements.length > 0" class="space-y-3 pt-3 border-t border-white/10">
              <div
                v-for="item in newsStore.homeData.announcements.slice(0, 3)"
                :key="item.id"
                class="p-3 rounded-xl bg-white/10 border border-white/10 text-xs"
              >
                <div class="flex items-center justify-between text-[10px] text-[#f3e5ab] mb-1">
                  <span>{{ item.type_label }}</span>
                  <span>{{ item.event_date_formatted }}</span>
                </div>
                <h5 class="font-semibold text-white leading-snug">{{ item.title }}</h5>
              </div>
            </div>

            <div class="mt-5 pt-4 border-t border-white/15">
              <a
                href="#cek-registrasi-section"
                class="w-full py-2.5 px-4 rounded-xl bg-[#c59b27] text-[#022314] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all"
              >
                Cek Status Registrasi <ArrowRight class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2">
            <span class="font-bold text-slate-800 block text-sm">Butuh Bantuan Jadwal?</span>
            <p class="text-slate-500 font-light leading-relaxed">
              Tim Helpdesk Kesekretariatan siap melayani akomodasi dan perubahan jadwal komisi selama 24 jam di Posko Utama.
            </p>
            <div class="pt-2 text-[#006432] font-semibold flex items-center gap-1">
              <span>Hotline Muktamar:</span>
              <a href="tel:0321889977" class="underline">+62 (0321) 8899-7700</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
