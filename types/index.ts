export type UserRole = 'ADMIN' | 'USER';

export interface Blog {
  id: string;
  title: string;
  featuredImage: string;
  content: string;
  category: string;
  author: string;
  authorId: string;
  createdAt: any;
  updatedAt?: any;
  commentsEnabled: boolean;
  slug: string;
}

export interface Comment {
  id: string;
  blogId: string;
  userId: string;
  userEmail: string;
  userName: string;
  content: string;
  createdAt: any;
  approved?: boolean;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  image: string;
  pdfUrl: string;
  createdAt: any;
  updatedAt?: any;
}

export interface YouTubeContent {
  id: string;
  title: string;
  description: string;
  url: string;
  createdAt: any;
  updatedAt?: any;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  createdAt: any;
  updatedAt?: any;
}

export interface UserData {
  uid: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  createdAt?: any;
}
