export interface Author {
  id: number
  name: string
  role: string
  avatar: string | null
  bio: string | null
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  color: string | null
  icon: string | null
  sort_order: number
  is_active: boolean
  articles_count?: number
}

export interface Article {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string
  cover_image_url: string
  is_featured: boolean
  status: 'draft' | 'published' | 'archived'
  view_count: number
  reading_time: string
  reading_time_minutes: number
  published_at: string | null
  published_at_formatted: string | null
  published_at_human: string | null
  created_at: string | null
  created_at_formatted: string | null
  category?: Category
  author?: Author
  author_name?: string | null
  author_role?: string | null
  tags?: string[] | string
  metaTitle?: string
  metaDescription?: string
  mediaMap?: Record<string, string>
}

export interface Announcement {
  id: number
  title: string
  content: string
  event_date: string | null
  event_date_formatted: string | null
  event_time: string | null
  event_time_formatted: string | null
  location: string | null
  type: 'announcement' | 'event' | 'agenda'
  type_label: string
  is_active: boolean
  is_pinned: boolean
  is_expired: boolean
  is_event_past: boolean
  expires_at: string | null
  created_at: string | null
  created_at_formatted: string | null
  author?: Author
}

export interface HomeData {
  hero: Article | null
  highlights: Article[]
  latest: Article[]
  categories: Category[]
  announcements: Announcement[]
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface AboutStructureItem {
  id: string
  title: string
  subtitle?: string
  description: string
}

export interface AboutParagraphItem {
  id: string
  text: string
}

export interface GalleryPhotoItem {
  id: number | string
  albumId: number | string
  title: string
  description?: string
  src: string
  sort_order: number
  status: 'published' | 'draft'
  created_at?: string
}

export interface GalleryAlbum {
  id: number | string
  title: string
  slug: string
  description?: string
  cover_image?: string
  sort_order: number
  status: 'published' | 'draft'
  photos: GalleryPhotoItem[]
}

export interface GalleryPhoto {
  id: number | string
  title: string
  category: string
  categoryLabel: string
  date: string
  src: string
}

export interface ScheduleSubItem {
  time: string
  title: string
  sub?: string
}

export interface ScheduleItem {
  id?: string | number
  time: string
  title: string
  venue?: string
  leader?: string
  isOpen?: boolean
  subItems?: ScheduleSubItem[]
}

export interface ScheduleDay {
  id: string
  dayName: string
  dayDate: string
  fullDate: string
  theme: string
  items: ScheduleItem[]
}

export interface SiteSettings {
  site_title: string
  site_subtitle: string
  navbar_badge: string
  favicon_url: string
  logo_image_url: string
  topbar_date: string
  topbar_location: string
  banner_beranda_url: string
  banner_tentang_url: string
  banner_agenda_url: string
  banner_berita_url: string
  banner_galeri_url: string
  banner_informasi_url?: string
  hero_headline_1: string
  hero_headline_2: string
  hero_headline_3: string
  hero_tagline: string
  about_tag: string
  about_title: string
  about_subtitle: string
  about_section_label: string
  about_section_title?: string
  about_paragraph_1: string
  about_row_1_title?: string
  about_row_1_subtitle?: string
  about_row_1_desc?: string
  about_row_2_title?: string
  about_row_2_subtitle?: string
  about_row_2_desc?: string
  about_row_3_title?: string
  about_row_3_subtitle?: string
  about_row_3_desc?: string
  about_history_label?: string
  about_history_title?: string
  about_paragraph_2: string
  about_paragraph_3: string
  about_quote_label?: string
  about_quote_text?: string
  about_quote_location?: string
  about_structure_items_json?: AboutStructureItem[]
  about_history_paragraphs_json?: AboutParagraphItem[]
  about_section_enabled?: boolean
  about_history_enabled?: boolean
  about_quote_enabled?: boolean
  agenda_tag?: string
  agenda_title?: string
  agenda_subtitle?: string
  news_tag?: string
  news_title?: string
  news_subtitle?: string
  gallery_tag?: string
  gallery_title?: string
  gallery_subtitle?: string
  footer_description: string
  footer_quote: string
  footer_copyright: string
  contact_address: string
  contact_email: string
  contact_phone: string
  contact_hours: string
  social_instagram: string
  social_youtube: string
  social_facebook: string
  social_twitter: string
  social_tiktok: string
  social_whatsapp: string
  theme_preset?: string
  primary_color?: string
  primary_hover_color?: string
  secondary_color?: string
  accent_color?: string
  navbar_bg_color?: string
  navbar_style?: 'white' | 'primary' | 'dark'
  footer_bg_color?: string
  footer_bottom_bg_color?: string
  agenda_schedules_json?: any[]
  gallery_items_json?: GalleryPhoto[]
  gallery_albums_json?: GalleryAlbum[]
  informasi_data_json?: any
}
