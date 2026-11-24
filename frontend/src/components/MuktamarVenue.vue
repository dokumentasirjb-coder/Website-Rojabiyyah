<script setup lang="ts">
import { MapPin, Navigation, Bus, Hospital, Bed, ShieldCheck, ExternalLink } from 'lucide-vue-next'
</script>

<template>
  <section id="lokasi-section" class="py-16 sm:py-20 bg-[#f8faf9] border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
        <div>
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e8f5ee] text-[#006432] text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin class="w-3.5 h-3.5 text-[#c59b27]" />
            Lokasi & Peta Penyelenggaraan
          </div>
          <h2 class="text-2xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
            Denah Kompleks Pesantren Tambakberas
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-light">
            Panduan lokasi arena utama, posko kesehatan, asrama muktamirin, dan shuttle bus transportasi.
          </p>
        </div>

        <a
          href="https://maps.google.com/?q=Pondok+Pesantren+Bahrul+Ulum+Tambakberas+Jombang"
          target="_blank"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#006432] hover:border-[#006432] font-semibold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Navigation class="w-4 h-4 text-[#c59b27]" />
          Buka Google Maps <ExternalLink class="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      <div class="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Interactive Venue Map Graphic Card (7/12) -->
        <div class="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm p-6 space-y-6">
          <div class="relative h-72 sm:h-84 rounded-2xl bg-gradient-to-br from-[#022314] via-[#053b22] to-[#0b7c43] p-6 text-white flex flex-col justify-between overflow-hidden shadow-inner">
            <div class="absolute inset-0 opacity-15 islamic-pattern pointer-events-none"></div>

            <div class="relative z-10 flex items-center justify-between">
              <span class="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#f3e5ab] border border-white/20">
                Pusat Arena Muktamar ke-35
              </span>
              <span class="text-xs text-emerald-200 font-mono">Tambakberas, Jombang</span>
            </div>

            <!-- Simulated Visual Layout Diagram -->
            <div class="relative z-10 grid grid-cols-3 gap-3 my-auto">
              <div class="p-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
                <span class="block text-[11px] font-bold text-[#f3e5ab]">Zona A</span>
                <span class="text-[10px] text-white">Stadion & Pleno</span>
              </div>
              <div class="p-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
                <span class="block text-[11px] font-bold text-[#f3e5ab]">Zona B</span>
                <span class="text-[10px] text-white">Sidang Komisi</span>
              </div>
              <div class="p-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
                <span class="block text-[11px] font-bold text-[#f3e5ab]">Zona C</span>
                <span class="text-[10px] text-white">Media Center</span>
              </div>
            </div>

            <div class="relative z-10 flex items-center justify-between text-xs text-emerald-100">
              <span class="flex items-center gap-1.5">
                <MapPin class="w-4 h-4 text-[#c59b27]" /> Jl. KH. Wahab Chasbullah, Tambakrejo, Jombang
              </span>
              <span class="text-[#f3e5ab] font-semibold">Jawa Timur 61451</span>
            </div>
          </div>

          <!-- Transport & Arrival Points -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div class="flex items-center gap-2 font-bold text-xs text-slate-800 mb-1">
                <Bus class="w-4 h-4 text-[#006432]" />
                Shuttle Stasiun Jombang
              </div>
              <p class="text-[11px] text-slate-500 font-light">
                Armada bus antar-jemput beroperasi setiap 20 menit dari Stasiun Kereta Api Jombang ke Kompleks Tambakberas.
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div class="flex items-center gap-2 font-bold text-xs text-slate-800 mb-1">
                <Bus class="w-4 h-4 text-[#006432]" />
                Shuttle Bandara Juanda (SUB)
              </div>
              <p class="text-[11px] text-slate-500 font-light">
                Titik kumpul terminal 1 & 2 Juanda Surabaya disiapkan bagi rombongan luar pulau menuju lokasi muktamar.
              </p>
            </div>
          </div>
        </div>

        <!-- Venue Facilities List (5/12) -->
        <div class="lg:col-span-5 space-y-4">
          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-[#e8f5ee] text-[#006432] flex items-center justify-center shrink-0">
                <Bed class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-serif font-bold text-sm text-slate-900">Akomodasi & Asrama Peserta</h4>
                <p class="text-[11px] text-slate-500">Kapasitas 5.000+ muktamirin di asrama pesantren dan hotel mitra.</p>
              </div>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Hospital class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-serif font-bold text-sm text-slate-900">Posko Layanan Kesehatan 24 Jam</h4>
                <p class="text-[11px] text-slate-500">Didukung oleh Rumah Sakit Nahdlatul Ulama (RSNU) & Tim LK PBNU.</p>
              </div>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-amber-50 text-[#c59b27] flex items-center justify-center shrink-0">
                <ShieldCheck class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-serif font-bold text-sm text-slate-900">Pengamanan & Posko BANSER</h4>
                <p class="text-[11px] text-slate-500">2.500 personil Satkornas Banser dan aparat gabungan TNI-Polri.</p>
              </div>
            </div>
          </div>

          <!-- Fast Contact Box -->
          <div class="p-5 rounded-2xl bg-[#022314] text-white">
            <span class="text-xs font-bold text-[#f3e5ab] block mb-1">Sekretariat Panitia Daerah Jombang</span>
            <p class="text-[11px] text-emerald-100 font-light">
              Gedung Utama Yayasan PP. Bahrul Ulum Tambakberas, Jombang.<br />
              Email: <strong>muktamar@nu.id</strong> | Telp: <strong>+62 (0321) 8899-7700</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
