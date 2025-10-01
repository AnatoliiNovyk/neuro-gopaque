export interface Artist {
  id: string;
  name: string;
  bio: string;
  image_url: string;
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
  created_at: string;
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