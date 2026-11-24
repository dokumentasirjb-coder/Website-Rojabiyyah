// ============================================================
// TypeScript Definitions for Rojabiyyah
// ============================================================

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'editor'
  avatar: string | null
  bio: string | null
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  color: string | null
  icon: string | null
  parent_id: number | null
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
  cover_image: string | null
  cover_image_url?: string
  category_id: number
  user_id: number
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  is_published?: boolean
  published_at: string | null
  view_count: number
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  category?: Category
  author?: User
}

export interface Announcement {
  id: number
  title: string
  content: string
  event_date: string | null
  event_time: string | null
  location: string | null
  type: 'announcement' | 'event' | 'agenda'
  type_label?: string
  is_active: boolean
  is_pinned: boolean
  expires_at: string | null
  created_at: string
  author?: User
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}
