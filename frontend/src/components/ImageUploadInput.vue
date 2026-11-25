<script setup lang="ts">
import { ref } from 'vue'
import { Upload, Image as ImageIcon, X, RefreshCw, Check, Link as LinkIcon } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    description?: string
    aspect?: 'banner' | 'square' | 'wide' | 'auto'
    maxDimension?: number
  }>(),
  {
    modelValue: '',
    label: 'Unggah Foto',
    description: 'Format JPG, PNG, atau WebP.',
    aspect: 'banner',
    maxDimension: 1000
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isProcessing = ref(false)
const showUrlInput = ref(false)
const errorMsg = ref<string | null>(null)

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processImageFile(file)
  }
  // Reset input value so re-selecting same file triggers change
  target.value = ''
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    processImageFile(file)
  }
}

function processImageFile(file: File) {
  errorMsg.value = null

  if (!file.type.startsWith('image/')) {
    errorMsg.value = 'Format file tidak didukung. Gunakan foto JPG, PNG, WebP, atau SVG.'
    return
  }

  const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
  if (file.size > MAX_SIZE_BYTES) {
    errorMsg.value = 'Ukuran foto terlalu besar (maksimal 10 MB). Pilih foto yang lebih kecil.'
    return
  }

  isProcessing.value = true

  const reader = new FileReader()
  reader.onload = (e) => {
    const rawDataUrl = e.target?.result as string
    
    // Compress and resize image using canvas to ensure fast loading and reasonable storage size
    const img = new Image()
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        const max = props.maxDimension

        if (width > max || height > max) {
          if (width > height) {
            height = Math.round((height * max) / width)
            width = max
          } else {
            width = Math.round((width * max) / height)
            height = max
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          // Untuk foto berita, banner, sampul (bukan SVG atau logo khusus), gunakan JPEG 0.82 agar sangat ringan (~35KB-50KB) dan tidak menghabiskan kuota
          const isLogoOrSvg = file.type === 'image/svg+xml' || (props.aspect === 'square' && file.type === 'image/png')
          const mime = isLogoOrSvg ? 'image/png' : 'image/jpeg'
          const compressedDataUrl = canvas.toDataURL(mime, isLogoOrSvg ? undefined : 0.82)
          emit('update:modelValue', compressedDataUrl)
        } else {
          emit('update:modelValue', rawDataUrl)
        }
      } catch (err) {
        emit('update:modelValue', rawDataUrl)
      } finally {
        isProcessing.value = false
      }
    }
    img.onerror = () => {
      isProcessing.value = false
      errorMsg.value = 'Gagal memproses file gambar.'
    }
    img.src = rawDataUrl
  }

  reader.onerror = () => {
    isProcessing.value = false
    errorMsg.value = 'Gagal membaca file dari komputer.'
  }

  reader.readAsDataURL(file)
}

function removeImage() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="space-y-2">
    <!-- Header Label -->
    <div v-if="label" class="flex items-center justify-between">
      <label class="block text-xs font-bold text-slate-200">
        {{ label }}
      </label>
      <button
        type="button"
        @click="showUrlInput = !showUrlInput"
        class="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
      >
        <LinkIcon class="w-3 h-3" />
        <span>{{ showUrlInput ? 'Sembunyikan URL' : 'Gunakan Link URL' }}</span>
      </button>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- When Image is Present: Preview Card -->
    <div
      v-if="modelValue"
      class="relative rounded-2xl overflow-hidden border border-[#143d30] bg-[#071913] p-3 flex flex-col sm:flex-row items-center gap-4 group"
    >
      <!-- Thumbnail Image -->
      <div 
        class="relative overflow-hidden rounded-xl border border-[#143d30] bg-[#04120e] shrink-0"
        :class="[
          aspect === 'square' ? 'w-20 h-20' : 'w-full sm:w-36 h-24'
        ]"
      >
        <img
          :src="modelValue"
          alt="Preview"
          class="w-full h-full object-contain p-1"
        />
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <ImageIcon class="w-5 h-5 text-white/90" />
        </div>
      </div>

      <!-- Action Info & Buttons -->
      <div class="flex-1 min-w-0 space-y-1.5 text-center sm:text-left">
        <div class="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-400 text-xs font-semibold">
          <Check class="w-3.5 h-3.5" />
          <span>Foto Siap Digunakan</span>
        </div>
        <p class="text-[11px] text-slate-400 truncate">
          {{ modelValue.startsWith('data:') ? 'Foto diunggah dari Komputer' : modelValue }}
        </p>

        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
          <button
            type="button"
            @click="triggerFileInput"
            class="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw class="w-3 h-3" />
            <span>Ganti Foto dari Komputer</span>
          </button>
          <button
            type="button"
            @click="removeImage"
            class="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X class="w-3 h-3" />
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>

    <!-- When No Image: Upload Dropzone Area -->
    <div
      v-else
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      class="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
      :class="[
        isDragging
          ? 'border-emerald-400 bg-emerald-500/10'
          : 'border-[#143d30] hover:border-emerald-500/60 bg-[#071913]/60 hover:bg-[#071913]'
      ]"
    >
      <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
        <Upload class="w-5 h-5" />
      </div>
      <div>
        <span class="text-xs font-bold text-white block">
          {{ isProcessing ? 'Sedang memproses & mengompres foto...' : 'Klik untuk Unggah Foto dari Komputer' }}
        </span>
        <span class="text-[11px] text-slate-400 block mt-0.5">
          atau seret dan lepaskan file gambar ke sini (JPG, PNG, WebP)
        </span>
        <span class="text-[10px] text-emerald-400/90 font-medium block mt-1.5">
          {{ description || 'Ukuran disarankan: minimal 100 KB – 2 MB (maks. 10 MB, otomatis dikompres).' }}
        </span>
      </div>
    </div>

    <!-- Info ukuran & deskripsi saat foto sudah terpasang -->
    <p v-if="modelValue && description" class="text-[10px] text-slate-400">
      {{ description }}
    </p>

    <!-- Optional URL input toggle -->
    <div v-if="showUrlInput" class="pt-1">
      <input
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="url"
        placeholder="Atau tempel tautan URL gambar (https://...)"
        class="w-full px-3.5 py-2 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
      />
    </div>

    <!-- Error message if any -->
    <p v-if="errorMsg" class="text-xs text-rose-400 font-medium">
      {{ errorMsg }}
    </p>
  </div>
</template>
