export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  bannerImage?: string;
  featured: boolean;
  featuredDoctorId?: string;
  preferences?: string[]; // Array of preference tags/categories
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogDto {
  title: string;
  content: string;
  author: string;
  bannerImage?: string;
  featured?: boolean;
  featuredDoctorId?: string;
  preferences: string[];
}

export interface UpdateBlogDto {
  title?: string;
  content?: string;
  author?: string;
  bannerImage?: string;
  featured?: boolean;
  featuredDoctorId?: string;
  preferences?: string[];
}

