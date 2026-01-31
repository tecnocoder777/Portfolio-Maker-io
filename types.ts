export interface SocialLink {
  id: string;
  platform: 'github' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'email' | 'website';
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  tags: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface PortfolioState {
  meta: {
    title: string;
    description: string;
    favicon: string;
    ogImage: string;
  };
  theme: {
    layout: 'modern' | 'minimal' | 'bold';
    font: 'Inter' | 'Playfair Display' | 'Space Grotesk';
    primaryColor: string;
    backgroundColor: string;
    backgroundImage: string;
    backgroundOverlay: number;
    textColor: string;
  };
  profile: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
    location: string;
    resumeUrl: string;
  };
  skills: string[];
  experiences: Experience[];
  socials: SocialLink[];
  projects: Project[];
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}