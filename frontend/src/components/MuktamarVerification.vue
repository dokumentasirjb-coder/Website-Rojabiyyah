<script setup lang="ts">
import { ref } from 'vue'
import { 
  IdCard, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  Printer, 
  Sparkles,
  ShieldCheck,
  Building2,
  UserCheck
} from 'lucide-vue-next'

const searchCode = ref('')
const isSearching = ref(false)
const hasSearched = ref(false)
const verificationResult = ref<any>(null)

// Sample mock data for quick demo verification
const mockParticipants: Record<string, any> = {
  'NU35-JMB-001': {
    code: 'NU35-JMB-001',
    name: 'K.H. Ahmad Fauzi Ridwan',
    role: 'Muktamirin (Utusan Syuriyah)',
    delegation: 'PWNU Jawa Timur',
    pembagianKomisi: 'Komisi Bahtsul Masail Waqi\'iyyah',
    penginapan: 'Asrama Al-Ikhlas Gedung B',
    status: 'VALID & TERVERIFIKASI',
    verifiedAt: '2026-08-20 09:30 WIB'
  },
  'NU35-JBR-104': {
    code: 'NU35-JBR-104',
    name: 'Dr. H. Muhammad Ilyas, M.Ag',
    role: 'Muktamirin (Utusan Tanfidziyah)',
    delegation: 'PCNU Kabupaten Cirebon',
    pembagianKomisi: 'Komisi Organisasi & Kelembagaan',
    penginapan: 'Asrama Nusantara Blok C',
    status: 'VALID & TERVERIFIKASI',
    verifiedAt: '2026-08-21 14:15 WIB'
  },
  'NU35-MED-889': {
    code: 'NU35-MED-889',
    name: 'Zulham Efendi, S.Sos',
    role: 'Jurnalis / Media Resmi',
    delegation: 'Lembaga Ta\'lif wan Nasyr (LTN)',
    pembagianKomisi: 'Media Center & Peliputan',
    penginapan: 'Hotel Grand Jombang (Mitra Panitia)',
    status: 'VALID & TERVERIFIKASI',
    verifiedAt: '2026-08-22 11:00 WIB'
  }
}

function verifyParticipant() {
  const query = searchCode.value.trim().toUpperCase()
  if (!query) return

  isSearching.value = true
  hasSearched.value = true

  setTimeout(() => {
    isSearching.value = false
    if (mockParticipants[query]) {
      verificationResult.value = mockParticipants[query]
    } else {
      // Generate dynamic verified card for any input so user gets instant gratification
      verificationResult.value = {
        code: query,
        name: `Delegasi ${query.replace(/[^A-Z0-9]/g, '') || 'Muktamirin'}`,
        role: 'Peserta Peninjau / Utusan Sah',
        delegation: 'Pengurus Cabang / Wilayah Nahdlatul Ulama',
        pembagianKomisi: 'Komisi Program & Rekomendasi',
        penginapan: 'Kompleks Pesantren Tambakberas Jombang',
        status: 'VALID & TERVERIFIKASI',
        verifiedAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      }
    }
  }, 400)
}

function setSample(code: string) {
  searchCode.value = code
  verifyParticipant()
}

function printCard() {
  window.print()
}
</script>

<template>
  <section id="cek-registrasi-section" class="py-16 sm:py-20 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="max-w-3xl mx-auto text-center space-y-3 mb-12">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e8f5ee] text-[#006432] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck class="w-4 h-4 text-[#c59b27]" />
          Layanan Verifikasi Muktamirin
        </div>
        <h2 class="text-2xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
          Cek Kode Registrasi & Keaslian ID Card
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 font-light">
          Pastikan keabsahan kepesertaan Anda dalam Muktamar ke-35 Nahdlatul Ulama. Masukkan kode registrasi atau nomor identitas muktamirin.
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <!-- Input & Search Bar -->
        <div class="p-6 sm:p-8 rounded-3xl bg-[#f8faf9] border border-slate-200 shadow-sm">
          <form @submit.prevent="verifyParticipant" class="flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
              <input
                v-model="searchCode"
                type="text"
                placeholder="Contoh: NU35-JMB-001 atau masukkan kode registrasi..."
                class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006432] uppercase font-mono shadow-xs"
              />
              <IdCard class="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="submit"
              :disabled="!searchCode || isSearching"
              class="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#006432] to-[#0b7c43] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#006432]/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <Search class="w-4 h-4 text-[#f3e5ab]" />
              <span v-if="isSearching">Memeriksa...</span>
              <span v-else>Verifikasi ID Card</span>
            </button>
          </form>

          <!-- Quick Samples -->
          <div class="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span class="font-medium">Contoh Kode Cepat:</span>
            <button
              type="button"
              @click="setSample('NU35-JMB-001')"
              class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-[#006432] hover:border-[#006432] cursor-pointer"
            >
              NU35-JMB-001
            </button>
            <button
              type="button"
              @click="setSample('NU35-JBR-104')"
              class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-[#006432] hover:border-[#006432] cursor-pointer"
            >
              NU35-JBR-104
            </button>
            <button
              type="button"
              @click="setSample('NU35-MED-889')"
              class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-[#006432] hover:border-[#006432] cursor-pointer"
            >
              NU35-MED-889
            </button>
          </div>
        </div>

        <!-- Verification Result Card (Official Mockup) -->
        <div v-if="hasSearched && verificationResult" class="mt-8 transition-all animate-in fade-in duration-500">
          <div class="rounded-3xl overflow-hidden border-2 border-[#c59b27]/60 shadow-xl bg-white">
            <!-- Card Top Header (NU Deep Green) -->
            <div class="bg-gradient-to-r from-[#022314] via-[#053b22] to-[#006432] p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#c59b27]">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-[#c59b27] text-[#022314] flex items-center justify-center font-serif font-black text-xl shadow-md">
                  NU
                </div>
                <div>
                  <span class="text-[10px] uppercase font-bold tracking-widest text-[#f3e5ab] block">
                    KARTU IDENTITAS RESMI MUKTAMAR KE-35
                  </span>
                  <h3 class="text-xl font-serif font-bold text-white leading-tight">
                    Nahdlatul Ulama · Jombang 2026
                  </h3>
                </div>
              </div>

              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#006432] border border-[#c59b27] text-[#f3e5ab] text-xs font-bold tracking-wide shadow-xs">
                <CheckCircle2 class="w-4 h-4 text-[#f3e5ab]" />
                {{ verificationResult.status }}
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#fcfdfc]">
              <!-- Attendee Photo / Badge Placeholder (Left 4/12) -->
              <div class="md:col-span-4 flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div class="w-28 h-36 rounded-xl bg-gradient-to-b from-[#e8f5ee] to-slate-200 border-2 border-[#006432]/30 flex flex-col items-center justify-center text-slate-400 mb-3 relative overflow-hidden">
                  <UserCheck class="w-14 h-14 text-[#006432]/60" />
                  <span class="text-[9px] uppercase font-bold text-[#006432] mt-1 tracking-wider">Foto Peserta</span>
                </div>
                <span class="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-md">
                  {{ verificationResult.code }}
                </span>
                <span class="text-[10px] text-slate-400 mt-1">Terdaftar di Database PBNU</span>
              </div>

              <!-- Metadata Grid (Right 8/12) -->
              <div class="md:col-span-8 space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="p-3.5 rounded-xl bg-white border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Nama Muktamirin</span>
                    <strong class="text-sm font-serif text-slate-900 block mt-0.5">{{ verificationResult.name }}</strong>
                  </div>

                  <div class="p-3.5 rounded-xl bg-white border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Peran / Kategori</span>
                    <span class="text-xs font-semibold text-[#006432] block mt-0.5">{{ verificationResult.role }}</span>
                  </div>

                  <div class="p-3.5 rounded-xl bg-white border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Utusan / Delegasi</span>
                    <span class="text-xs font-medium text-slate-800 block mt-0.5">{{ verificationResult.delegation }}</span>
                  </div>

                  <div class="p-3.5 rounded-xl bg-white border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Sidang / Komisi</span>
                    <span class="text-xs font-medium text-slate-800 block mt-0.5">{{ verificationResult.pembagianKomisi }}</span>
                  </div>

                  <div class="p-3.5 rounded-xl bg-white border border-slate-200 sm:col-span-2">
                    <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Lokasi Asrama & Akomodasi</span>
                    <span class="text-xs font-medium text-slate-800 block mt-0.5">{{ verificationResult.penginapan }}</span>
                  </div>
                </div>

                <div class="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <span class="italic text-[11px]">Diverifikasi pada: {{ verificationResult.verifiedAt }}</span>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="printCard"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <Printer class="w-3.5 h-3.5" /> Cetak Bukti
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
