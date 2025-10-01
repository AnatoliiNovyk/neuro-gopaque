export interface Artist {
  id: string;
  name: string;
  bio: string;
  image_url: string;
  logo_url: string;
  soundcloud_username: string;
  social_links: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  title: string;
  soundcloud_url: string;
  soundcloud_id: string;
  image_url?: string;
  description?: string;
  order_index: number;
  audio_url?: string;
  file_path?: string;
  file_size?: number;
  duration?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SiteStats {
  id: string;
  label: string;
  value: string;
  icon_name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}