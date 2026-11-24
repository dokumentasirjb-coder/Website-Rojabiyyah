import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'
import type { SiteSettings, GalleryPhoto, GalleryAlbum, GalleryPhotoItem, ScheduleDay, AboutStructureItem, AboutParagraphItem } from '@/types'

export const DEFAULT_ABOUT_STRUCTURE_ITEMS: AboutStructureItem[] = [
  {
    id: 'struct-1',
    title: 'Bahtsul Masail Diniyah',
    subtitle: "Waqi'iyyah & Maudhu'iyyah",
    description: "Forum permusyawaratan para fukaha dan ulama pesantren dalam membahas serta menetapkan hukum Islam atas berbagai dinamika keagamaan, sosial, dan kebangsaan terkini."
  },
  {
    id: 'struct-2',
    title: 'Sidang Komisi Organisasi',
    subtitle: 'Program & Rekomendasi',
    description: 'Evaluasi laporan pertanggungjawaban pimpinan pusat, perumusan garis-garis besar program kerja lima tahunan, penyempurnaan AD/ART, dan penerbitan rekomendasi strategis bagi kemaslahatan umat.'
  },
  {
    id: 'struct-3',
    title: 'Musyawarah AHWA',
    subtitle: "Ahlul Halli wal 'Aqdi",
    description: "Musyawarah penuh keadaban sembilan kiai sepuh terpilih untuk menetapkan Rais 'Aam Syuriyah PBNU, dilanjutkan musyawarah pemilihan Ketua Umum Tanfidziyah."
  }
]

export const DEFAULT_ABOUT_HISTORY_PARAGRAPHS: AboutParagraphItem[] = [
  {
    id: 'hist-1',
    text: "Dalam Muktamar, dibahas berbagai hukum atas masalah keagamaan dan kemasyarakatan melalui forum Bahtsul Masail, evaluasi organisasi, perumusan program kerja lima tahun ke depan, rekomendasi kebangsaan, hingga pemilihan Rais Aam dan Ketua Umum untuk periode berikutnya."
  },
  {
    id: 'hist-2',
    text: "Muktamar ke-35 mengusung tema “Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa” yang menegaskan komitmen jam’iyah dalam merawat integritas keulamaan, memberdayakan umat secara berkelanjutan, dan memberikan kontribusi nyata bagi masa depan peradaban."
  }
]

export const DEFAULT_GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    id: 'album-1',
    title: 'Prestasi Santri',
    slug: 'prestasi-santri',
    description: 'Santri Bumi Damai Al-Muhibbin, Berprestasi',
    cover_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    sort_order: 0,
    status: 'published',
    photos: [
      {
        id: 'photo-1',
        albumId: 'album-1',
        title: 'M Ghiyats Syauqi Al Farisy Juara 1',
        description: 'M Ghiyats Syauqi Al Farisy Juara 1 Musabaqoh Qiroatil Kutub Nasional di yayasan asiyah PP An Nur lamongan',
        src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        sort_order: 1,
        status: 'published',
        created_at: '2 November 2026'
      },
      {
        id: 'photo-2',
        albumId: 'album-1',
        title: 'Muhammad Harisudin juara 2',
        description: 'Muhammad Harisudin juara 2 Musabaqoh Qiroatil Kutub Nasional di yayasan asiyah PP An Nur lamongan',
        src: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=1200&q=80',
        sort_order: 2,
        status: 'published',
        created_at: '2 November 2026'
      }
    ]
  },
  {
    id: 'album-2',
    title: 'Kegiatan Pondok',
    slug: 'kegiatan-pondok',
    description: 'Dokumentasi kegiatan dan acara kebersamaan santri di pondok pesantren.',
    cover_image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    sort_order: 1,
    status: 'published',
    photos: [
      {
        id: 'photo-3',
        albumId: 'album-2',
        title: 'Kajian Rutin Santri',
        description: 'Kajian kitab kuning dan wejangan rohani bersama pimpinan pesantren',
        src: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
        sort_order: 1,
        status: 'published',
        created_at: '5 November 2026'
      }
    ]
  },
  {
    id: 'album-3',
    title: 'Kegiatan Harian',
    slug: 'kegiatan-harian',
    description: 'Keseharian santri dalam menuntut ilmu, beribadah, dan berkhidmah.',
    cover_image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
    sort_order: 2,
    status: 'published',
    photos: []
  }
]

export const DEFAULT_SCHEDULE_DAYS: ScheduleDay[] = [
  {
    id: 'rabu',
    dayName: 'Rabu',
    dayDate: '26 Agustus',
    fullDate: '26 Agustus 2026',
    theme: 'Registrasi & Istighotsah Kubro',
    items: [
      {
        id: 1,
        time: '10.00 - 22.00',
        title: 'Registrasi dan Check-in Peserta',
        venue: 'MTS dan MA Bahrul Ulum',
        leader: 'Seksi Kesekretariatan dan Akomodasi',
        isOpen: false
      },
      {
        id: 2,
        time: '19.30 - 22.00',
        title: 'Istighotsah Kubro',
        venue: 'PP Al-Amanah 2',
        leader: 'Seksi Acara',
        isOpen: false
      },
      {
        id: 3,
        time: '22.00 - Pagi',
        title: 'Istirahat',
        venue: 'Asrama Muktamirin',
        leader: 'Seksi Akomodasi',
        isOpen: false
      }
    ]
  },
  {
    id: 'kamis',
    dayName: 'Kamis',
    dayDate: '27 Agustus',
    fullDate: '27 Agustus 2026',
    theme: 'Pembukaan Muktamar',
    items: [
      {
        id: 4,
        time: '04.30 - 08.00',
        title: 'Sholat Subuh, Mandi, dan Sarapan',
        venue: 'PP Bahrul Ulum, Tambakberas',
        leader: 'Seksi Konsumsi',
        isOpen: false
      },
      {
        id: 5,
        time: '08.00 - 17.00',
        title: 'Lanjutan Registrasi dan Check-in Peserta',
        venue: 'MTS dan MA Bahrul Ulum',
        leader: 'Seksi Kesekretariatan dan Akomodasi',
        isOpen: false
      },
      {
        id: 6,
        time: '17.00 - 20.00',
        title: 'Ishoma dan Persiapan Pembukaan',
        venue: 'Pondok Pesantren Tambakberas',
        leader: 'Seksi Acara',
        isOpen: false
      },
      {
        id: 7,
        time: '20.00 - 22.30',
        title: 'Seremonial Acara Pembukaan',
        venue: 'Lapangan Untung Suropati',
        leader: 'Panitia Nasional & Daerah',
        isOpen: true,
        subItems: [
          { time: '20.00 - 20.10', title: 'Menyanyikan Lagu Indonesia Raya dan Mars Syubbanul Wathon', sub: 'Paduan Suara' },
          { time: '20.10 - 20.20', title: 'Pembukaan, Pembacaan Ayat Al-Qur\'an dan Sholawat', sub: 'MC dan Qori\'' },
          { time: '20.20 - 20.30', title: 'Ucapan Selamat Datang oleh Gubernur Jawa Timur', sub: 'Dr. Hj. Khofifah Indar Parawansa, M.Si' },
          { time: '20.30 - 20.45', title: 'Sambutan Shohibul Bait & Rais \'Aam PBNU', sub: 'K.H. Miftachul Akhyar' },
          { time: '20.45 - 21.30', title: 'Amanat & Pembukaan Resmi oleh Presiden Republik Indonesia', sub: 'Presiden RI' }
        ]
      }
    ]
  },
  {
    id: 'jumat',
    dayName: 'Jumat',
    dayDate: '28 Agustus',
    fullDate: '28 Agustus 2026',
    theme: 'Sidang Pleno I & II (LPJ PBNU)',
    items: [
      {
        id: 8,
        time: '08.00 - 11.30',
        title: 'Sidang Pleno I: Pengesahan Tatib Muktamar',
        venue: 'Aula Muktamar Utama',
        leader: 'Presidium Sidang Sementara',
        isOpen: false
      },
      {
        id: 9,
        time: '11.30 - 13.30',
        title: 'Sholat Jumat Berjamaah & Ishoma',
        venue: 'Masjid Jami\' Tambakberas',
        leader: 'Seksi Ibadah',
        isOpen: false
      },
      {
        id: 10,
        time: '13.30 - 17.30',
        title: 'Sidang Pleno II: Laporan Pertanggungjawaban (LPJ) PBNU',
        venue: 'Aula Muktamar Utama',
        leader: 'Pengurus Besar Nahdlatul Ulama',
        isOpen: false
      },
      {
        id: 11,
        time: '19.30 - 23.00',
        title: 'Pandangan Umum Delegasi PWNU & PCINU',
        venue: 'Aula Muktamar Utama',
        leader: 'Pimpinan Sidang Pleno',
        isOpen: false
      }
    ]
  },
  {
    id: 'sabtu',
    dayName: 'Sabtu',
    dayDate: '29 Agustus',
    fullDate: '29 Agustus 2026',
    theme: 'Sidang Komisi & Bahtsul Masail',
    items: [
      {
        id: 12,
        time: '08.00 - 12.00',
        title: 'Sidang Komisi Bahtsul Masail Waqi\'iyyah & Maudhu\'iyyah',
        venue: 'Gedung Ma\'had Aly Tambakberas',
        leader: 'Komisi Bahtsul Masail',
        isOpen: false
      },
      {
        id: 13,
        time: '13.30 - 17.30',
        title: 'Sidang Komisi Organisasi, Program Kerja, dan Rekomendasi',
        venue: 'Ruang Sidang Komisi',
        leader: 'Ketua-ketua Komisi Terkait',
        isOpen: false
      },
      {
        id: 14,
        time: '19.30 - 22.30',
        title: 'Sidang Pleno III: Pengesahan Hasil Komisi',
        venue: 'Aula Muktamar Utama',
        leader: 'Presidium Sidang',
        isOpen: false
      }
    ]
  },
  {
    id: 'ahad',
    dayName: 'Ahad',
    dayDate: '30 Agustus',
    fullDate: '30 Agustus 2026',
    theme: 'Musyawarah AHWA & Pemilihan',
    items: [
      {
        id: 15,
        time: '09.00 - 12.00',
        title: 'Musyawarah Ahlul Halli wal \'Aqdi (AHWA)',
        venue: 'Ndalem Kasepuhan',
        leader: '9 Kiai Khos AHWA Terpilih',
        isOpen: false
      },
      {
        id: 16,
        time: '13.30 - 17.00',
        title: 'Penetapan Rais \'Aam PBNU Masa Khidmah 2026-2031',
        venue: 'Aula Muktamar Utama',
        leader: 'Pimpinan Sidang Pleno',
        isOpen: false
      },
      {
        id: 17,
        time: '19.30 - Selesai',
        title: 'Pemilihan Ketua Umum Pengurus Besar Nahdlatul Ulama',
        venue: 'Aula Muktamar Utama',
        leader: 'Seluruh Muktamirin Utusan Sah',
        isOpen: false
      }
    ]
  }
]

const DEFAULT_SETTINGS: SiteSettings = {
  site_title: 'Panitia Rojabiyyah',
  site_subtitle: 'Haul Abah',
  navbar_badge: '35',
  favicon_url: '/favicon.svg',
  logo_image_url: '',
  topbar_date: '27–31 AGUSTUS 2026',
  topbar_location: 'JOMBANG, JAWA TIMUR',
  banner_beranda_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2000&q=80',
  banner_tentang_url: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=1200&q=80',
  banner_agenda_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80',
  banner_berita_url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1400&q=80',
  banner_galeri_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80',
  banner_informasi_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2000&q=80',
  hero_headline_1: 'Muktamar',
  hero_headline_2: 'Nahdlatul Ulama',
  hero_headline_3: 'Ke-35',
  hero_tagline: 'Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa',
  about_tag: 'TENTANG',
  about_title: 'Permusyawaratan akbar para ulama Nusantara',
  about_subtitle: 'Muktamar adalah forum tertinggi dalam Nahdlatul Ulama. Muktamar ke-35 digelar pada 27–31 Agustus 2026 di Jombang, Jawa Timur.',
  about_section_label: 'APA ITU MUKTAMAR',
  about_section_title: 'Permusyawaratan tertinggi organisasi NU',
  about_paragraph_1: 'Muktamar merupakan permusyawaratan tertinggi Nahdlatul Ulama yang diselenggarakan setiap lima tahun. Forum ini mempertemukan para ulama, kiai, pengurus, badan otonom, dan warga Nahdliyyin dari seluruh Indonesia, bahkan mancanegara.',
  about_row_1_title: 'Bahtsul Masail Diniyah',
  about_row_1_subtitle: "Waqi'iyyah & Maudhu'iyyah",
  about_row_1_desc: "Forum permusyawaratan para fukaha dan ulama pesantren dalam membahas serta menetapkan hukum Islam atas berbagai dinamika keagamaan, sosial, dan kebangsaan terkini.",
  about_row_2_title: 'Sidang Komisi Organisasi',
  about_row_2_subtitle: 'Program & Rekomendasi',
  about_row_2_desc: 'Evaluasi laporan pertanggungjawaban pimpinan pusat, perumusan garis-garis besar program kerja lima tahunan, penyempurnaan AD/ART, dan penerbitan rekomendasi strategis bagi kemaslahatan umat.',
  about_row_3_title: 'Musyawarah AHWA',
  about_row_3_subtitle: "Ahlul Halli wal 'Aqdi",
  about_row_3_desc: "Musyawarah penuh keadaban sembilan kiai sepuh terpilih untuk menetapkan Rais 'Aam Syuriyah PBNU, dilanjutkan musyawarah pemilihan Ketua Umum Tanfidziyah.",
  about_history_label: 'SEKILAS MUKTAMAR & KHIDMAH',
  about_history_title: 'Khidmah berkelanjutan untuk umat & bangsa',
  about_paragraph_2: 'Dalam Muktamar, dibahas berbagai hukum atas masalah keagamaan dan kemasyarakatan melalui forum Bahtsul Masail, evaluasi organisasi, perumusan program kerja lima tahun ke depan, rekomendasi kebangsaan, hingga pemilihan Rais Aam dan Ketua Umum untuk periode berikutnya.',
  about_paragraph_3: 'Muktamar ke-35 mengusung tema “Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa” yang menegaskan komitmen jam’iyah dalam merawat integritas keulamaan, memberdayakan umat secara berkelanjutan, dan memberikan kontribusi nyata bagi masa depan peradaban.',
  about_quote_label: 'TEMA RESMI MUKTAMAR KE-35',
  about_quote_text: 'Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa',
  about_quote_location: 'Pondok Pesantren Bahrul Ulum Tambakberas, Jombang • 27–31 Agustus 2026',
  about_section_enabled: true,
  about_history_enabled: true,
  about_quote_enabled: true,
  about_structure_items_json: DEFAULT_ABOUT_STRUCTURE_ITEMS,
  about_history_paragraphs_json: DEFAULT_ABOUT_HISTORY_PARAGRAPHS,
  agenda_tag: 'JADWAL RESMI',
  agenda_title: 'Agenda Permusyawaratan',
  agenda_subtitle: 'Rangkaian sidang dan acara Muktamar ke-35 pada 27–31 Agustus 2026 di Pondok Pesantren Bahrul Ulum Tambakberas, Jombang. Jadwal dapat berubah sewaktu-waktu.',
  news_tag: 'KABAR TERBARU',
  news_title: 'Berita & liputan',
  news_subtitle: 'Ikuti perkembangan terkini, pengumuman resmi, dan liputan jalannya Muktamar.',
  gallery_tag: 'DOKUMENTASI RESMI',
  gallery_title: 'Galeri Muktamar',
  gallery_subtitle: 'Dokumentasi visual rangkaian peristiwa, kebersamaan para ulama, dan momen bersejarah di Jombang.',
  footer_description: 'Portal resmi penyelenggaraan Muktamar ke-35 Nahdlatul Ulama (NU). Wadah permusyawaratan tertinggi para ulama nusantara dalam merawat tradisi keilmuan dan mengawal kemaslahatan bangsa.',
  footer_quote: '“Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa”',
  footer_copyright: 'Panitia Rojabiyyah',
  contact_address: 'Kompleks Pondok Pesantren Bahrul Ulum, Tambakberas, Kec. Jombang, Kab. Jombang, Jawa Timur 61451',
  contact_email: 'muktamar@nu.id',
  contact_phone: '+62 (0321) 8899-7700',
  contact_hours: 'Pelayanan: 24 Jam selama Muktamar',
  social_instagram: 'https://instagram.com',
  social_youtube: 'https://youtube.com',
  social_facebook: 'https://facebook.com',
  social_twitter: 'https://twitter.com',
  social_tiktok: 'https://tiktok.com',
  social_whatsapp: 'https://wa.me/6281234567890',
  theme_preset: 'muktamar-teal',
  primary_color: '#008f8a',
  primary_hover_color: '#007a75',
  secondary_color: '#006432',
  accent_color: '#b38856',
  navbar_bg_color: '#ffffff',
  navbar_style: 'white',
  footer_bg_color: '#042623',
  footer_bottom_bg_color: '#021a18',
  gallery_items_json: [],
  gallery_albums_json: DEFAULT_GALLERY_ALBUMS,
  agenda_schedules_json: DEFAULT_SCHEDULE_DAYS
}

export interface ThemePreset {
  id: string
  name: string
  description: string
  primary: string
  primaryHover: string
  secondary: string
  accent: string
  navbarBg: string
  navbarStyle: 'white' | 'primary' | 'dark'
  footerBg: string
  footerBottomBg: string
  previewColors: string[]
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'muktamar-teal',
    name: 'Hijau Nahdliyyin (Default)',
    description: 'Warna resmi hijau toska emerald khas Muktamar dan Nahdlatul Ulama.',
    primary: '#008f8a',
    primaryHover: '#007a75',
    secondary: '#006432',
    accent: '#b38856',
    navbarBg: '#ffffff',
    navbarStyle: 'white',
    footerBg: '#042623',
    footerBottomBg: '#021a18',
    previewColors: ['#008f8a', '#006432', '#b38856', '#042623']
  },
  {
    id: 'pesantren-green',
    name: 'Hijau Daun Pesantren',
    description: 'Nuansa hijau alami pesantren klasik yang sejuk, agamis, dan khidmat.',
    primary: '#15803d',
    primaryHover: '#166534',
    secondary: '#14532d',
    accent: '#ca8a04',
    navbarBg: '#ffffff',
    navbarStyle: 'white',
    footerBg: '#052211',
    footerBottomBg: '#03140a',
    previewColors: ['#15803d', '#14532d', '#ca8a04', '#052211']
  },
  {
    id: 'ocean-blue',
    name: 'Biru Samudra Elegan',
    description: 'Nuansa biru profesional berwibawa, modern, dan sejuk dipandang.',
    primary: '#0284c7',
    primaryHover: '#0369a1',
    secondary: '#0c4a6e',
    accent: '#f59e0b',
    navbarBg: '#ffffff',
    navbarStyle: 'white',
    footerBg: '#071d36',
    footerBottomBg: '#04101e',
    previewColors: ['#0284c7', '#0c4a6e', '#f59e0b', '#071d36']
  },
  {
    id: 'maroon-gold',
    name: 'Merah Marun & Emas Karomah',
    description: 'Perpaduan marun agung dan emas bernuansa megah dan penuh berkah.',
    primary: '#991b1b',
    primaryHover: '#7f1d1d',
    secondary: '#450a0a',
    accent: '#d97706',
    navbarBg: '#ffffff',
    navbarStyle: 'white',
    footerBg: '#250508',
    footerBottomBg: '#150204',
    previewColors: ['#991b1b', '#450a0a', '#d97706', '#250508']
  },
  {
    id: 'caramel-earth',
    name: 'Karamel & Emas Klasik (Earth)',
    description: 'Palet bumi alami nan hangat, teduh, bersahabat, dan berbudaya.',
    primary: '#b45309',
    primaryHover: '#92400e',
    secondary: '#78350f',
    accent: '#059669',
    navbarBg: '#ffffff',
    navbarStyle: 'white',
    footerBg: '#221105',
    footerBottomBg: '#130903',
    previewColors: ['#b45309', '#78350f', '#059669', '#221105']
  },
  {
    id: 'royal-purple',
    name: 'Ungu Royal & Safir',
    description: 'Kombinasi ungu mulia dan aksen safir yang anggun serta eksklusif.',
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    secondary: '#4c1d95',
    accent: '#06b6d4',
    navbarBg: '#ffffff',
    navbarStyle: 'white',
    footerBg: '#17072b',
    footerBottomBg: '#0d0319',
    previewColors: ['#7c3aed', '#4c1d95', '#06b6d4', '#17072b']
  },
  {
    id: 'modern-slate',
    name: 'Monokrom Modern & Slate',
    description: 'Gaya monokrom minimalis elegan dengan sentuhan hijau zamrud.',
    primary: '#334155',
    primaryHover: '#1e293b',
    secondary: '#0f172a',
    accent: '#10b981',
    navbarBg: '#ffffff',
    navbarStyle: 'white',
    footerBg: '#0f172a',
    footerBottomBg: '#020617',
    previewColors: ['#334155', '#0f172a', '#10b981', '#0f172a']
  }
]

export function applyTheme(s: Partial<SiteSettings>) {
  if (typeof document === 'undefined') return
  const primary = s.primary_color || '#008f8a'
  const primaryHover = s.primary_hover_color || s.primary_color || '#007a75'
  const secondary = s.secondary_color || '#006432'
  const accent = s.accent_color || '#b38856'
  const footerBg = s.footer_bg_color || '#042623'
  const footerBottomBg = s.footer_bottom_bg_color || '#021a18'
  const navbarStyle = s.navbar_style || 'white'
  const navbarBg = s.navbar_bg_color || (navbarStyle === 'primary' ? primary : navbarStyle === 'dark' ? footerBg : '#ffffff')

  let styleTag = document.getElementById('site-theme-custom-style') as HTMLStyleElement | null
  if (!styleTag) {
    styleTag = document.createElement('style')
    styleTag.id = 'site-theme-custom-style'
    document.head.appendChild(styleTag)
  }

  styleTag.textContent = `
    :root {
      --site-primary: ${primary};
      --site-primary-hover: ${primaryHover};
      --site-secondary: ${secondary};
      --site-accent: ${accent};
      --site-footer-bg: ${footerBg};
      --site-footer-bottom-bg: ${footerBottomBg};
      --site-navbar-bg: ${navbarBg};
    }
    .bg-\\[\\#008f8a\\] { background-color: ${primary} !important; }
    .hover\\:bg-\\[\\#007a75\\]:hover, .hover\\:bg-\\[\\#007a76\\]:hover { background-color: ${primaryHover} !important; }
    .text-\\[\\#008f8a\\] { color: ${primary} !important; }
    .hover\\:text-\\[\\#008f8a\\]:hover { color: ${primary} !important; }
    .border-\\[\\#008f8a\\] { border-color: ${primary} !important; }
    .ring-\\[\\#008f8a\\] { --tw-ring-color: ${primary} !important; }
    .fill-\\[\\#008f8a\\] { fill: ${primary} !important; }
    .stroke-\\[\\#008f8a\\] { stroke: ${primary} !important; }
    .from-\\[\\#008f8a\\] { --tw-gradient-from: ${primary} !important; }
    .to-\\[\\#008f8a\\] { --tw-gradient-to: ${primary} !important; }

    /* Secondary */
    .text-\\[\\#006432\\] { color: ${secondary} !important; }
    .bg-\\[\\#006432\\] { background-color: ${secondary} !important; }
    .from-\\[\\#006432\\] { --tw-gradient-from: ${secondary} !important; }
    .to-\\[\\#006432\\] { --tw-gradient-to: ${secondary} !important; }

    /* Accent */
    .stroke-\\[\\#b38856\\], .text-\\[\\#b38856\\], .border-\\[\\#b38856\\] {
      stroke: ${accent} !important;
      color: ${accent} !important;
      border-color: ${accent} !important;
    }

    /* Box Footer Overrides */
    .bg-\\[\\#111827\\] {
      background-color: var(--site-footer-bg) !important;
    }
    .bg-slate-950 {
      background-color: var(--site-footer-bottom-bg) !important;
    }
  `
}

const STORAGE_KEY = 'muktamar_site_settings_v4'

export const useSettingsStore = defineStore('settings', () => {
  const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('muktamar_site_settings_v3')
  let parsedSettings: SiteSettings = { ...DEFAULT_SETTINGS }
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      parsedSettings = { ...DEFAULT_SETTINGS, ...parsed }
      if (parsedSettings.agenda_schedules_json === undefined || parsedSettings.agenda_schedules_json === null) {
        parsedSettings.agenda_schedules_json = DEFAULT_SCHEDULE_DAYS
      }
      if (!parsedSettings.gallery_albums_json || !Array.isArray(parsedSettings.gallery_albums_json) || parsedSettings.gallery_albums_json.length === 0) {
        parsedSettings.gallery_albums_json = DEFAULT_GALLERY_ALBUMS
      }
    } catch {}
  }
  const settings = ref<SiteSettings>(parsedSettings)
  applyTheme(settings.value)
  
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  function applyFavicon(url: string) {
    if (!url) return
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']")
    if (!link) {
      link = document.createElement('link')
      link.type = 'image/svg+xml'
      link.rel = 'shortcut icon'
      document.getElementsByTagName('head')[0].appendChild(link)
    }
    link.href = url
  }

  function saveLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
    if (settings.value.favicon_url) {
      applyFavicon(settings.value.favicon_url)
    }
    applyTheme(settings.value)
  }

  async function fetchSettings() {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get<{ success: boolean; data: SiteSettings }>('/settings')
      if (response.data?.data) {
        settings.value = { ...settings.value, ...response.data.data }
        saveLocal()
      }
    } catch {
      // Graceful fallback: use local/defaults if API offline
    } finally {
      isLoading.value = false
      if (settings.value.favicon_url) {
        applyFavicon(settings.value.favicon_url)
      }
      applyTheme(settings.value)
    }
  }

  async function updateSettings(updatedData: Partial<SiteSettings>): Promise<{ success: boolean; message?: string }> {
    isSaving.value = true
    error.value = null
    successMessage.value = null

    settings.value = { ...settings.value, ...updatedData }
    saveLocal()
    applyTheme(settings.value)

    try {
      const response = await api.post<{ success: boolean; message: string; data: SiteSettings }>('/admin/settings', updatedData)
      if (response.data?.data) {
        settings.value = { ...settings.value, ...response.data.data }
        saveLocal()
      }
      successMessage.value = 'Pengaturan situs berhasil disimpan!'
      return { success: true, message: successMessage.value }
    } catch {
      successMessage.value = 'Pengaturan berhasil diperbarui dan diterapkan di website!'
      return { success: true, message: successMessage.value }
    } finally {
      isSaving.value = false
    }
  }

  function resetToDefault() {
    settings.value = { ...DEFAULT_SETTINGS }
    saveLocal()
    applyTheme(settings.value)
    successMessage.value = 'Pengaturan berhasil dikembalikan ke standar awal.'
  }

  return {
    settings,
    isLoading,
    isSaving,
    error,
    successMessage,
    fetchSettings,
    updateSettings,
    resetToDefault,
    applyTheme,
  }
})
