import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface GuideInfoItem {
  id: number
  title: string
  category: string
  description: string
  location_note?: string
  contact_wa?: string
  image_url?: string
  is_active: boolean
  created_at: string
}

export interface TabarukanItem {
  id: number
  title: string
  category: string
  description: string
  image_url: string
  price_info?: string
  contact_wa?: string
  is_available: boolean
  created_at: string
}

export interface SecretariatContact {
  id: number
  name: string
  role: string
  division: string
  phone: string
  whatsapp: string
  email?: string
  is_active: boolean
}

const GUIDE_STORAGE_KEY = 'rojabiyyah_guide_items'
const TABARUKAN_STORAGE_KEY = 'rojabiyyah_tabarukan_items'
const CP_STORAGE_KEY = 'rojabiyyah_secretariat_cp'
const GUIDE_CATEGORIES_STORAGE_KEY = 'rojabiyyah_guide_categories'

export const DEFAULT_GUIDE_CATEGORIES: string[] = [
  'Penginapan',
  'Transportasi',
  'Lokasi Acara',
  'Konsumsi',
  'Layanan Medis'
]

export const DEFAULT_GUIDE_ITEMS: GuideInfoItem[] = [
  {
    id: 1,
    title: 'Asrama Santri & Wisma Transit Jamaah',
    category: 'Penginapan',
    description: 'Panitia menyiapkan fasilitas asrama transit gratis di kompleks pesantren untuk jamaah luar kota dan alumni. Tersedia juga informasi homestay dan penginapan keluarga di sekitar Tambakberas.',
    location_note: 'Kompleks Asrama Pondok Pesantren Bahrul Ulum',
    contact_wa: '6282198765432',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: '2026-08-19'
  },
  {
    id: 2,
    title: 'Rute Armada & Shuttle Penjemputan',
    category: 'Transportasi',
    description: 'Layanan armada jemputan disiapkan dari Stasiun Kereta Api Jombang dan Terminal Kepuhsari. Rombongan bus jamaah diarahkan ke kantong parkir resmi dengan pengawalan Banser.',
    location_note: 'Stasiun KA Jombang & Terminal Kepuhsari',
    contact_wa: '6281234567890',
    image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: '2026-08-19'
  },
  {
    id: 3,
    title: 'Posko Kesehatan & Pertolongan Pertama',
    category: 'Layanan Medis',
    description: 'Pelayanan medis siaga 24 jam dengan tim dokter, perawat, ambulans darurat, dan obat-obatan gratis untuk jamaah selama rangkaian acara Haul & Rojabiyyah berlangsung.',
    location_note: 'Gedung Serbaguna Pesantren & Pos Lapangan',
    contact_wa: '6281234567890',
    image_url: '',
    is_active: true,
    created_at: '2026-08-20'
  },
  {
    id: 4,
    title: 'Dapur Umum & Pos Hidangan Jamaah',
    category: 'Konsumsi',
    description: 'Penyediaan konsumsi berkah dan air minum untuk seluruh jamaah dan santri di posko konsumsi utama.',
    location_note: 'Dapur Umum Bahrul Ulum',
    contact_wa: '6281234567890',
    image_url: '',
    is_active: true,
    created_at: '2026-08-20'
  }
]

export const DEFAULT_TABARUKAN_ITEMS: TabarukanItem[] = [
  {
    id: 1,
    title: 'Kaos Resmi Haul Abah & Rojabiyyah 2026',
    category: 'Kaos & Pakaian',
    description: 'Bahan Cotton Combed 24s premium, sablon discharge adem dan awet. Logo bordir emblem resmi Haul Abah & Rojabiyyah.',
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    price_info: 'Infaq Tabarukan: Rp 85.000',
    contact_wa: '6281234567890',
    is_available: true,
    created_at: '2026-08-20'
  },
  {
    id: 2,
    title: 'Buku Manakib & Mauidhoh Abah KH. Moch. Djamaluddin Ahmad',
    category: 'Kitab & Buku',
    description: 'Kumpulan nasihat, rekam jejak perjuangan dakwah, dan untaian mutiara hikmah Almaghfurlah Abah KH. Moch. Djamaluddin Ahmad.',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    price_info: 'Infaq Tabarukan: Rp 50.000',
    contact_wa: '6281234567890',
    is_available: true,
    created_at: '2026-08-21'
  },
  {
    id: 3,
    title: 'Kopiah Hitam & Sorban Khidmah Rojabiyyah',
    category: 'Atribut Santri',
    description: 'Peci beludru istimewa berlogo emas resmi Haul dan sorban tenun halus lambang mahabbah dan khidmah santri.',
    image_url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    price_info: 'Infaq Tabarukan: Rp 65.000',
    contact_wa: '6281234567890',
    is_available: true,
    created_at: '2026-08-22'
  },
  {
    id: 4,
    title: 'Minyak Wangi Non-Alkohol Khidmah Aroma Nabawi',
    category: 'Wewangian',
    description: 'Minyak wangi murni non-alkohol ramuan khas aroma kasturi dan oud segar, sangat cocok untuk menghadiri majelis dzikir & sholawat.',
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    price_info: 'Infaq Tabarukan: Rp 35.000',
    contact_wa: '6281234567890',
    is_available: true,
    created_at: '2026-08-23'
  }
]

export const DEFAULT_CP_ITEMS: SecretariatContact[] = [
  {
    id: 1,
    name: 'Ustadz Ahmad Fauzi, S.Pd.I',
    role: 'Koordinator Kesekretariatan',
    division: 'Sekretariat Utama',
    phone: '+62 812-3456-7890',
    whatsapp: '6281234567890',
    email: 'sekretariat@rojabiyyah.id',
    is_active: true
  },
  {
    id: 2,
    name: 'H. Muhammad Ridwan',
    role: 'Penanggung Jawab Akomodasi & Transit',
    division: 'Akomodasi Santri & Alumni',
    phone: '+62 821-9876-5432',
    whatsapp: '6282198765432',
    email: 'akomodasi@rojabiyyah.id',
    is_active: true
  },
  {
    id: 3,
    name: 'Ustadz Nurul Huda',
    role: 'Layanan Tabarukan & Logistik Acara',
    division: 'Divisi Tabarukan & Perlengkapan',
    phone: '+62 857-1122-3344',
    whatsapp: '6285711223344',
    email: 'tabarukan@rojabiyyah.id',
    is_active: true
  },
  {
    id: 4,
    name: 'Gus Zaimuddin',
    role: 'Humas & Informasi Tamu Undangan',
    division: 'Humas & Keprotokolan',
    phone: '+62 813-5566-7788',
    whatsapp: '6281355667788',
    email: 'humas@rojabiyyah.id',
    is_active: true
  }
]

export const useTabarukanStore = defineStore('tabarukan', () => {
  const guideItems = ref<GuideInfoItem[]>([])
  const tabarukanItems = ref<TabarukanItem[]>([])
  const cpList = ref<SecretariatContact[]>([])
  const guideCategories = ref<string[]>([])

  // Load Guide Categories
  const savedGuideCats = typeof window !== 'undefined' ? localStorage.getItem(GUIDE_CATEGORIES_STORAGE_KEY) : null
  if (savedGuideCats) {
    try {
      const parsed = JSON.parse(savedGuideCats)
      const legacy = ['merchandise', 'kitab & buku', 'atribut santri', 'wewangian']
      const filtered = Array.isArray(parsed) ? parsed.filter((c: string) => !legacy.includes(c.toLowerCase())) : []
      guideCategories.value = filtered.length > 0 ? filtered : [...DEFAULT_GUIDE_CATEGORIES]
    } catch {
      guideCategories.value = [...DEFAULT_GUIDE_CATEGORIES]
    }
  } else {
    guideCategories.value = [...DEFAULT_GUIDE_CATEGORIES]
  }

  function persistGuideCategories() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(GUIDE_CATEGORIES_STORAGE_KEY, JSON.stringify(guideCategories.value))
      } catch (e) {
        console.warn('LocalStorage error saving guide categories:', e)
      }
    }
  }

  function addGuideCategory(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return false
    const exists = guideCategories.value.some(c => c.toLowerCase() === trimmed.toLowerCase())
    if (!exists) {
      guideCategories.value.push(trimmed)
      persistGuideCategories()
      return true
    }
    return false
  }

  function deleteGuideCategory(name: string) {
    guideCategories.value = guideCategories.value.filter(c => c.toLowerCase() !== name.toLowerCase())
    guideItems.value.forEach(item => {
      if (item.category && item.category.toLowerCase() === name.toLowerCase()) {
        item.category = guideCategories.value[0] || 'Umum'
      }
    })
    persistGuideCategories()
    persistGuideItems()
    return true
  }

  function resetGuideCategories() {
    guideCategories.value = [...DEFAULT_GUIDE_CATEGORIES]
    persistGuideCategories()
  }

  // Load Guide Items
  const savedGuides = typeof window !== 'undefined' ? localStorage.getItem(GUIDE_STORAGE_KEY) : null
  if (savedGuides) {
    try {
      const parsed = JSON.parse(savedGuides)
      guideItems.value = Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_GUIDE_ITEMS
    } catch {
      guideItems.value = DEFAULT_GUIDE_ITEMS
    }
  } else {
    guideItems.value = DEFAULT_GUIDE_ITEMS
  }

  function persistGuideItems() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(guideItems.value))
      } catch (e) {
        console.warn('LocalStorage error saving guide items:', e)
      }
    }
  }

  function saveGuideItem(item: Partial<GuideInfoItem>) {
    if (item.category && item.category.trim()) {
      addGuideCategory(item.category.trim())
    }
    if (item.id) {
      const idx = guideItems.value.findIndex(g => g.id === item.id)
      if (idx !== -1) {
        guideItems.value[idx] = { ...guideItems.value[idx], ...item }
      }
    } else {
      const newItem: GuideInfoItem = {
        id: Date.now(),
        title: item.title || 'Panduan Informasi',
        category: item.category || guideCategories.value[0] || 'Penginapan',
        description: item.description || '',
        location_note: item.location_note || '',
        contact_wa: item.contact_wa || '6281234567890',
        image_url: item.image_url || '',
        is_active: item.is_active !== undefined ? item.is_active : true,
        created_at: new Date().toISOString().split('T')[0]
      }
      guideItems.value.unshift(newItem)
    }
    persistGuideItems()
    return true
  }

  function deleteGuideItem(id: number) {
    guideItems.value = guideItems.value.filter(g => g.id !== id)
    persistGuideItems()
  }

  // Load Tabarukan Items
  const savedTabarukan = typeof window !== 'undefined' ? localStorage.getItem(TABARUKAN_STORAGE_KEY) : null
  if (savedTabarukan) {
    try {
      const parsed = JSON.parse(savedTabarukan)
      tabarukanItems.value = Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TABARUKAN_ITEMS
    } catch {
      tabarukanItems.value = DEFAULT_TABARUKAN_ITEMS
    }
  } else {
    tabarukanItems.value = DEFAULT_TABARUKAN_ITEMS
  }

  function persistTabarukan() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(TABARUKAN_STORAGE_KEY, JSON.stringify(tabarukanItems.value))
      } catch (e) {
        console.warn('LocalStorage error saving tabarukan items:', e)
      }
    }
  }

  function saveTabarukanItem(item: Partial<TabarukanItem>) {
    if (item.id) {
      const idx = tabarukanItems.value.findIndex(t => t.id === item.id)
      if (idx !== -1) {
        tabarukanItems.value[idx] = { ...tabarukanItems.value[idx], ...item }
      }
    } else {
      const newItem: TabarukanItem = {
        id: Date.now(),
        title: item.title || 'Tabarukan Khidmah',
        category: item.category || 'Kaos & Pakaian',
        description: item.description || '',
        image_url: item.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        price_info: item.price_info || '',
        contact_wa: item.contact_wa || '6281234567890',
        is_available: item.is_available !== undefined ? item.is_available : true,
        created_at: new Date().toISOString().split('T')[0]
      }
      tabarukanItems.value.unshift(newItem)
    }
    persistTabarukan()
    return true
  }

  function deleteTabarukanItem(id: number) {
    tabarukanItems.value = tabarukanItems.value.filter(t => t.id !== id)
    persistTabarukan()
  }

  // Load CP List
  const savedCP = typeof window !== 'undefined' ? localStorage.getItem(CP_STORAGE_KEY) : null
  if (savedCP) {
    try {
      const parsed = JSON.parse(savedCP)
      cpList.value = Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CP_ITEMS
    } catch {
      cpList.value = DEFAULT_CP_ITEMS
    }
  } else {
    cpList.value = DEFAULT_CP_ITEMS
  }

  function persistCP() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CP_STORAGE_KEY, JSON.stringify(cpList.value))
      } catch (e) {
        console.warn('LocalStorage error saving CP items:', e)
      }
    }
  }

  function saveCP(cp: Partial<SecretariatContact>) {
    if (cp.id) {
      const idx = cpList.value.findIndex(c => c.id === cp.id)
      if (idx !== -1) {
        cpList.value[idx] = { ...cpList.value[idx], ...cp }
      }
    } else {
      const newCP: SecretariatContact = {
        id: Date.now(),
        name: cp.name || 'Panitia Sekretariat',
        role: cp.role || 'Staf Kesekretariatan',
        division: cp.division || 'Sekretariat',
        phone: cp.phone || '+62 812-3456-7890',
        whatsapp: (cp.whatsapp || cp.phone || '6281234567890').replace(/[^0-9]/g, ''),
        email: cp.email || '',
        is_active: cp.is_active !== undefined ? cp.is_active : true
      }
      cpList.value.push(newCP)
    }
    persistCP()
    return true
  }

  function deleteCP(id: number) {
    cpList.value = cpList.value.filter(c => c.id !== id)
    persistCP()
  }

  // Aliases for compatibility
  const customCategories = guideCategories
  const allCategories = guideCategories
  const addCategory = addGuideCategory
  const deleteCategory = deleteGuideCategory
  const resetCategories = resetGuideCategories

  return {
    guideItems,
    tabarukanItems,
    cpList,
    guideCategories,
    customCategories,
    allCategories,
    addGuideCategory,
    deleteGuideCategory,
    resetGuideCategories,
    addCategory,
    deleteCategory,
    resetCategories,
    saveGuideItem,
    deleteGuideItem,
    saveTabarukanItem,
    deleteTabarukanItem,
    saveCP,
    deleteCP
  }
})
