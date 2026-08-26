export interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  languages: string[];
  updated_at: string;
  homepage?: string;
}

export interface SkillItem {
  name: string;
  category: 'frontend' | 'backend' | 'tools' | '3d';
  icon: string; // lucide icon name
  level: number; // 0-100 percentage
  description: string;
}

export interface SectionState {
  id: string;
  label: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
