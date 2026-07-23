import { createContext, useContext, useEffect, useState, useMemo, useCallback, ReactNode } from 'react';
import defaultLogoAsset from '../assets/images/dhanish-logo-light.png';
import {
  PersonalInfo,
  ProjectItem,
  SkillItem,
  ServiceItem,
  TimelineItem,
  SettingsItem
} from '../types';
import {
  fetchPersonalInfo,
  fetchProjects,
  fetchSkills,
  fetchServices,
  fetchTimeline,
  fetchSettings,
  defaultSettings,
  initializeFirestoreData
} from '../firebase/services';
import { portfolioData } from '../data';

interface PortfolioContextType {
  personalInfo: PersonalInfo;
  logoUrl: string;
  projects: ProjectItem[];
  skills: SkillItem[];
  services: ServiceItem[];
  timeline: TimelineItem[];
  settings: SettingsItem;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Cache keys for instant load
const CACHE_KEY = 'portfolio-data-cache-v1';

export function PortfolioProvider({ children }: { children: ReactNode }) {
  // Read initial state from cache if available
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(() => {
    try {
      const cached = sessionStorage.getItem(`${CACHE_KEY}-info`);
      if (cached) return JSON.parse(cached);
    } catch { /* ignore */ }
    return portfolioData.personalInfo;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const cached = sessionStorage.getItem(`${CACHE_KEY}-projects`);
      if (cached) return JSON.parse(cached);
    } catch { /* ignore */ }
    return portfolioData.projects.map((p, index) => ({ ...p, id: `default-proj-${index}` }));
  });

  const [skills, setSkills] = useState<SkillItem[]>(() => {
    try {
      const cached = sessionStorage.getItem(`${CACHE_KEY}-skills`);
      if (cached) return JSON.parse(cached);
    } catch { /* ignore */ }
    return portfolioData.skills.map((s, index) => ({ ...s, id: `default-skill-${index}` }));
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const cached = sessionStorage.getItem(`${CACHE_KEY}-services`);
      if (cached) return JSON.parse(cached);
    } catch { /* ignore */ }
    return portfolioData.services.map((s, index) => ({ ...s, id: `default-service-${index}` }));
  });

  const [timeline, setTimeline] = useState<TimelineItem[]>(() => {
    try {
      const cached = sessionStorage.getItem(`${CACHE_KEY}-timeline`);
      if (cached) return JSON.parse(cached);
    } catch { /* ignore */ }
    return portfolioData.timeline;
  });

  const [settings, setSettings] = useState<SettingsItem>(() => {
    try {
      const cached = sessionStorage.getItem(`${CACHE_KEY}-settings`);
      if (cached) return JSON.parse(cached);
    } catch { /* ignore */ }
    return defaultSettings;
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [logoUrl, setLogoUrl] = useState<string>(defaultLogoAsset);

  // Asset-first, Database-second single logo resolution
  useEffect(() => {
    const remoteLogo = (personalInfo.logo || personalInfo.logoDark || personalInfo.logoLight)?.trim();

    // If no custom remote logo or if it points to a local asset path, use instant default asset
    if (!remoteLogo || remoteLogo.includes('/src/assets/images/') || remoteLogo === defaultLogoAsset) {
      setLogoUrl(defaultLogoAsset);
      return;
    }

    // Preload background database image to verify it loads before replacing local asset
    let isMounted = true;
    const img = new Image();
    img.src = remoteLogo;
    img.onload = () => {
      if (isMounted) setLogoUrl(remoteLogo);
    };
    img.onerror = () => {
      console.warn('[PortfolioContext] Remote database logo failed to load, preserving local asset logo.');
      if (isMounted) setLogoUrl(defaultLogoAsset);
    };

    return () => {
      isMounted = false;
    };
  }, [personalInfo]);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    
    // Background async initialization check
    initializeFirestoreData().catch((initErr) => {
      console.warn('Initialization notice in PortfolioContext:', initErr);
    });

    try {
      const [infoRes, projRes, skillRes, servRes, timeRes, setRes] = await Promise.all([
        fetchPersonalInfo(),
        fetchProjects(),
        fetchSkills(),
        fetchServices(),
        fetchTimeline(),
        fetchSettings()
      ]);

      if (infoRes) {
        setPersonalInfo(infoRes);
        sessionStorage.setItem(`${CACHE_KEY}-info`, JSON.stringify(infoRes));
      }
      if (projRes && projRes.length > 0) {
        setProjects(projRes);
        sessionStorage.setItem(`${CACHE_KEY}-projects`, JSON.stringify(projRes));
      }
      if (skillRes && skillRes.length > 0) {
        setSkills(skillRes);
        sessionStorage.setItem(`${CACHE_KEY}-skills`, JSON.stringify(skillRes));
      }
      if (servRes && servRes.length > 0) {
        setServices(servRes);
        sessionStorage.setItem(`${CACHE_KEY}-services`, JSON.stringify(servRes));
      }
      if (timeRes && timeRes.length > 0) {
        setTimeline(timeRes);
        sessionStorage.setItem(`${CACHE_KEY}-timeline`, JSON.stringify(timeRes));
      }
      if (setRes) {
        setSettings(setRes);
        sessionStorage.setItem(`${CACHE_KEY}-settings`, JSON.stringify(setRes));
      }
    } catch (err) {
      console.warn('Error loading portfolio data from Firestore in PortfolioContext, using fallback/cache:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const value = useMemo(() => ({
    personalInfo,
    logoUrl,
    projects,
    skills,
    services,
    timeline,
    settings,
    loading,
    refreshData: loadAllData
  }), [personalInfo, logoUrl, projects, skills, services, timeline, settings, loading, loadAllData]);

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
