export interface PersonalInfo {
  name: string;
  roles: string[];
  introduction: string;
  aboutText: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  instagram: string;
  avatar: string;
  resumeUrl?: string;
  heroImageLight?: string;
  heroImageDark?: string;
  logo?: string;
  logoLight?: string;
  logoDark?: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  type: 'Experience' | 'Education' | 'Training';
  organization: string;
  location: string;
  period: string;
  cgpa?: string;
  certificateUrl?: string;
  highlights?: string[];
  description?: string;
  order?: number;
}

export interface EducationItem {
  degree: string;
  cgpa?: string;
  institution: string;
  period: string;
  description?: string;
}

export interface SkillItem {
  id?: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Languages' | 'Tools';
  order?: number;
}

export interface ServiceItem {
  id?: string;
  title: string;
  description: string;
  iconName: string;
  tags?: string[];
  order?: number;
}

export interface ProjectItem {
  id?: string;
  title: string;
  category: string;
  description: string;
  stack: string[];
  github: string;
  live: string;
  image: string;
  featured?: boolean;
  order?: number;
  status?: 'published' | 'draft';
}

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface SettingsItem {
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  openGraphImage: string;
  favicon: string;
  googleAnalyticsId: string;
  themeAccent: string;
  footerText: string;
  initialized?: boolean;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  timeline: TimelineItem[];
  education: EducationItem[];
  skills: SkillItem[];
  services: ServiceItem[];
  projects: ProjectItem[];
  settings?: SettingsItem;
}
