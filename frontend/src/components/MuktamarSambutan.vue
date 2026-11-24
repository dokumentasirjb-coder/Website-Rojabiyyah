<script setup lang="ts">
import { Quote, Sparkles, BookOpen, HeartHandshake } from 'lucide-vue-next'
</script>

<template>
  <section id="sambutan-section" class="py-16 sm:py-20 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <!-- Visual Portrait / Ornaments (Left 5/12) -->
        <div class="lg:col-span-5 relative flex justify-center">
          <div class="relative w-full max-w-md">
            <!-- Decorative Frames -->
            <div class="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#006432] to-[#c59b27] opacity-20 blur-lg transform -rotate-1"></div>
            <div class="relative rounded-3xl overflow-hidden border-2 border-[#c59b27]/40 shadow-xl bg-[#022314]">
              <div class="h-96 sm:h-[420px] w-full bg-gradient-to-t from-[#022314] via-[#053b22]/70 to-[#006432]/40 flex flex-col items-center justify-end p-6 text-center relative">
                <!-- Islamic Minaret Emblem Watermark -->
                <div class="absolute top-10 inset-x-0 flex justify-center opacity-10">
                  <svg viewBox="0 0 100 100" class="w-48 h-48 fill-white">
                    <circle cx="50" cy="50" r="45" />
                  </svg>
                </div>

                <div class="w-24 h-24 rounded-full border-4 border-[#c59b27] bg-[#006432] text-white flex items-center justify-center font-serif text-3xl font-black mb-4 shadow-lg">
                  NU
                </div>

                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c59b27] text-[#022314] text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Sparkles class="w-3 h-3" /> Maklumat Akbar
                </span>

                <h3 class="text-xl font-serif font-bold text-white leading-tight">
                  K.H. Miftachul Akhyar
                </h3>
                <span class="text-xs text-[#f3e5ab] font-medium tracking-wide">
                  Rais 'Aam Pengurus Besar Nahdlatul Ulama
                </span>
                <p class="text-[11px] text-emerald-200 mt-2 font-light italic">
                  "Meneguhkan kemandirian jam'iyah, merawat peradaban semesta dengan hikmah ahlussunnah wal jama'ah."
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Text Commentary & Principles (Right 7/12) -->
        <div class="lg:col-span-7 space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e8f5ee] text-[#006432] text-xs font-bold uppercase tracking-wider">
            <Quote class="w-3.5 h-3.5 text-[#c59b27]" />
            Khutbah Iftitah & Sambutan Resmi
          </div>

          <h2 class="text-2xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
            Memperkokoh Ukhuwah, Mengawal Kemaslahatan Bangsa Menuju Satu Abad Kedua
          </h2>

          <div class="space-y-4 text-sm text-slate-600 leading-relaxed font-light">
            <p>
              Muktamar ke-35 Nahdlatul Ulama di Pondok Pesantren Bahrul Ulum Tambakberas, Jombang, menjadi momentum bersejarah bagi warga Nahdliyin untuk bermuhasabah dan menata langkah strategis khidmah jam'iyah. Kembali ke bumi Jombang adalah napak tilas atas spirit perjuangan para muassis NU.
            </p>
            <p>
              Dengan mengusung tema <em>“Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa”</em>, muktamar ini menegaskan komitmen NU untuk tidak hanya hadir dalam ranah keagamaan, tetapi juga memimpin dalam pemberdayaan ekonomi umat, pendidikan pesantren, sains, dan diplomasi perdamaian global.
            </p>
          </div>

          <!-- 3 Nilai Pilar Muktamar -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#006432]/40 transition-colors">
              <div class="w-8 h-8 rounded-xl bg-[#006432]/10 text-[#006432] flex items-center justify-center mb-2 font-bold text-sm">
                01
              </div>
              <h4 class="font-serif font-bold text-sm text-slate-900">Menjaga Marwah</h4>
              <p class="text-[11px] text-slate-500 mt-1">Menjaga integritas akhlak, keteladanan ulama, dan marwah institusi keagamaan.</p>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#006432]/40 transition-colors">
              <div class="w-8 h-8 rounded-xl bg-[#c59b27]/15 text-[#916f12] flex items-center justify-center mb-2 font-bold text-sm">
                02
              </div>
              <h4 class="font-serif font-bold text-sm text-slate-900">Memperkaya Khidmah</h4>
              <p class="text-[11px] text-slate-500 mt-1">Mengoptimalkan pelayanan sosial, kesehatan, pendidikan, dan advokasi kemaslahatan warga.</p>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#006432]/40 transition-colors">
              <div class="w-8 h-8 rounded-xl bg-[#006432]/10 text-[#006432] flex items-center justify-center mb-2 font-bold text-sm">
                03
              </div>
              <h4 class="font-serif font-bold text-sm text-slate-900">Kemaslahatan Bangsa</h4>
              <p class="text-[11px] text-slate-500 mt-1">Memperkuat persatuan kebangsaan, perdamaian, dan martabat kedaulatan Indonesia.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
