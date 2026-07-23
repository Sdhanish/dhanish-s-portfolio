import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from './config';
import {
  PersonalInfo,
  ProjectItem,
  SkillItem,
  ServiceItem,
  TimelineItem,
  SettingsItem,
  MessageItem
} from '../types';
import { portfolioData } from '../data';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn(`[Firestore ${operationType} on ${path || 'unknown'} Failed]: Operating with local fallback. Details:`, errInfo.error, error);
  return errInfo;
}

// Timeout helper for Firestore queries with 15000ms limit and detailed logging
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 15000, label: string = 'Firestore query'): Promise<T> {
  const startTime = Date.now();
  console.log(`[${label}] Request started (timeout set to ${timeoutMs}ms)...`);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const elapsed = Date.now() - startTime;
      const timeoutErr = new Error(`[${label}] Timed out after ${elapsed}ms`);
      console.warn(`[${label}] TIMEOUT EXCEEDED after ${elapsed}ms`);
      reject(timeoutErr);
    }, timeoutMs);
    promise
      .then((res) => {
        clearTimeout(timer);
        const elapsed = Date.now() - startTime;
        console.log(`[${label}] Succeeded in ${elapsed}ms`);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        const elapsed = Date.now() - startTime;
        console.error(`[${label}] Failed after ${elapsed}ms:`, err);
        reject(err);
      });
  });
}

// Helper for default settings
export const defaultSettings: SettingsItem = {
  seoTitle: "DHANISH S | Frontend & MERN Stack Developer Portfolio",
  metaDescription: "Frontend-focused MERN Stack Developer passionate about creating responsive, user-friendly, and performant web applications.",
  keywords: "Dhanish, Developer, React, MERN, Frontend, Portfolio, TypeScript, Web Development",
  openGraphImage: "https://picsum.photos/seed/dhanish-og/1200/630",
  favicon: "/favicon.ico",
  googleAnalyticsId: "",
  themeAccent: "#6C8E12",
  footerText: "Designed & Built with passion by DHANISH S.",
  initialized: true
};

// --- ONE-TIME INITIALIZATION FUNCTION ---
export async function initializeFirestoreData(force: boolean = false): Promise<{ initialized: boolean; seededCount: number }> {
  try {
    const settingsRef = doc(db, 'settings', 'main');
    let settingsSnap;
    try {
      settingsSnap = await withTimeout(getDoc(settingsRef), 15000, 'Init Settings Check');
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'settings/main');
      console.warn('[initializeFirestoreData] Firestore access limited or permission denied. Operating with local fallbacks.');
      return { initialized: false, seededCount: 0 };
    }

    const isAlreadyInitialized = settingsSnap.exists() && settingsSnap.data()?.initialized === true;

    if (!force && isAlreadyInitialized) {
      return { initialized: true, seededCount: 0 };
    }

    console.log('[initializeFirestoreData] One-time database initialization from src/data.ts starting...');
    let seededCount = 0;

    // 1. Personal Info
    await savePersonalInfo(portfolioData.personalInfo);

    // 2. Settings with initialized flag
    await saveSettings({
      ...defaultSettings,
      ...(settingsSnap.exists() ? settingsSnap.data() : {}),
      initialized: true
    });

    // 3. Projects
    try {
      const existingProjects = await withTimeout(getDocs(collection(db, 'projects')), 15000, 'Init Projects Check');
      if (existingProjects.empty || force) {
        if (force && !existingProjects.empty) {
          for (const docSnap of existingProjects.docs) {
            await deleteDoc(doc(db, 'projects', docSnap.id));
          }
        }
        for (let i = 0; i < portfolioData.projects.length; i++) {
          const p = portfolioData.projects[i];
          await createProject({ ...p, featured: true, status: 'published', order: i + 1 });
          seededCount++;
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'projects');
    }

    // 4. Skills
    try {
      const existingSkills = await withTimeout(getDocs(collection(db, 'skills')), 15000, 'Init Skills Check');
      if (existingSkills.empty || force) {
        if (force && !existingSkills.empty) {
          for (const docSnap of existingSkills.docs) {
            await deleteDoc(doc(db, 'skills', docSnap.id));
          }
        }
        for (let i = 0; i < portfolioData.skills.length; i++) {
          const s = portfolioData.skills[i];
          await createSkill({ ...s, order: i + 1 });
          seededCount++;
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'skills');
    }

    // 5. Services
    try {
      const existingServices = await withTimeout(getDocs(collection(db, 'services')), 15000, 'Init Services Check');
      if (existingServices.empty || force) {
        if (force && !existingServices.empty) {
          for (const docSnap of existingServices.docs) {
            await deleteDoc(doc(db, 'services', docSnap.id));
          }
        }
        for (let i = 0; i < portfolioData.services.length; i++) {
          const s = portfolioData.services[i];
          await createService({ ...s, order: i + 1 });
          seededCount++;
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'services');
    }

    // 6. Timeline
    try {
      const existingTimeline = await withTimeout(getDocs(collection(db, 'timeline')), 15000, 'Init Timeline Check');
      if (existingTimeline.empty || force) {
        if (force && !existingTimeline.empty) {
          for (const docSnap of existingTimeline.docs) {
            await deleteDoc(doc(db, 'timeline', docSnap.id));
          }
        }
        for (let i = 0; i < portfolioData.timeline.length; i++) {
          const t = portfolioData.timeline[i];
          await createTimeline({ ...t, order: i + 1 });
          seededCount++;
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'timeline');
    }

    console.log('[initializeFirestoreData] Initialization finished successfully. Items seeded:', seededCount);
    return { initialized: true, seededCount };
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'initialization');
    console.warn('[initializeFirestoreData] Caught initialization error gracefully:', err);
    return { initialized: false, seededCount: 0 };
  }
}

// --- PERSONAL INFO ---
export async function fetchPersonalInfo(): Promise<PersonalInfo> {
  try {
    const docRef = doc(db, 'personalInfo', 'main');
    const snap = await withTimeout(getDoc(docRef), 15000, 'Fetch PersonalInfo');
    if (snap.exists()) {
      return snap.data() as PersonalInfo;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'personalInfo/main');
    console.warn('Using local fallback for personalInfo');
  }
  return portfolioData.personalInfo;
}

export async function savePersonalInfo(data: PersonalInfo): Promise<void> {
  try {
    console.log('[savePersonalInfo] Request started...');
    const docRef = doc(db, 'personalInfo', 'main');
    await setDoc(docRef, data, { merge: true });
    console.log('[savePersonalInfo] Succeeded');
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'personalInfo/main');
    throw err;
  }
}

// --- PROJECTS ---
export async function fetchProjects(): Promise<ProjectItem[]> {
  try {
    const colRef = collection(db, 'projects');
    const q = query(colRef, orderBy('order', 'asc'));
    const snap = await withTimeout(getDocs(q), 15000, 'Fetch Projects');

    if (snap.empty) {
      return portfolioData.projects.map((p, i) => ({ ...p, id: `default-proj-${i}` }));
    }

    return snap.docs.map(docSnap => ({
      ...docSnap.data(),
      id: docSnap.id
    })) as ProjectItem[];
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'projects');
    return portfolioData.projects.map((p, i) => ({ ...p, id: `default-proj-${i}` }));
  }
}

export async function createProject(data: Omit<ProjectItem, 'id'>): Promise<string> {
  try {
    const colRef = collection(db, 'projects');
    const docRef = await addDoc(colRef, {
      ...data,
      featured: data.featured ?? true,
      status: data.status || 'published',
      order: data.order ?? Date.now(),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'projects');
    throw err;
  }
}

export async function updateProject(id: string, data: Partial<ProjectItem>): Promise<void> {
  try {
    const docRef = doc(db, 'projects', id);
    await updateDoc(docRef, data);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `projects/${id}`);
    throw err;
  }
}

// --- SINGLE UNIFIED DELETE FUNCTION FOR ALL PORTFOLIO SECTIONS ---
export type PortfolioCollectionName = 'projects' | 'skills' | 'services' | 'timeline' | 'messages';

export async function deletePortfolioItem(collectionName: PortfolioCollectionName, id: string): Promise<void> {
  if (!id) {
    console.warn(`[deletePortfolioItem] Skipped: No ID provided for collection "${collectionName}"`);
    return;
  }
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${id}`);
    throw err;
  }
}

export async function deleteProject(id: string): Promise<void> {
  return deletePortfolioItem('projects', id);
}

// --- SKILLS ---
export async function fetchSkills(): Promise<SkillItem[]> {
  try {
    const colRef = collection(db, 'skills');
    const q = query(colRef, orderBy('order', 'asc'));
    const snap = await withTimeout(getDocs(q), 15000, 'Fetch Skills');

    if (snap.empty) {
      return portfolioData.skills.map((s, i) => ({ ...s, id: `default-skill-${i}` }));
    }

    return snap.docs.map(docSnap => ({
      ...docSnap.data(),
      id: docSnap.id
    })) as SkillItem[];
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'skills');
    return portfolioData.skills.map((s, i) => ({ ...s, id: `default-skill-${i}` }));
  }
}

export async function createSkill(data: Omit<SkillItem, 'id'>): Promise<string> {
  try {
    const colRef = collection(db, 'skills');
    const docRef = await addDoc(colRef, {
      ...data,
      order: data.order ?? Date.now()
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'skills');
    throw err;
  }
}

export async function updateSkill(id: string, data: Partial<SkillItem>): Promise<void> {
  try {
    const docRef = doc(db, 'skills', id);
    await updateDoc(docRef, data);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `skills/${id}`);
    throw err;
  }
}

export async function deleteSkill(id: string): Promise<void> {
  return deletePortfolioItem('skills', id);
}

// --- SERVICES ---
export async function fetchServices(): Promise<ServiceItem[]> {
  try {
    const colRef = collection(db, 'services');
    const q = query(colRef, orderBy('order', 'asc'));
    const snap = await withTimeout(getDocs(q), 15000, 'Fetch Services');

    if (snap.empty) {
      return portfolioData.services.map((s, i) => ({ ...s, id: `default-service-${i}` }));
    }

    return snap.docs.map(docSnap => ({
      ...docSnap.data(),
      id: docSnap.id
    })) as ServiceItem[];
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'services');
    return portfolioData.services.map((s, i) => ({ ...s, id: `default-service-${i}` }));
  }
}

export async function createService(data: Omit<ServiceItem, 'id'>): Promise<string> {
  try {
    const colRef = collection(db, 'services');
    const docRef = await addDoc(colRef, {
      ...data,
      order: data.order ?? Date.now()
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'services');
    throw err;
  }
}

export async function updateService(id: string, data: Partial<ServiceItem>): Promise<void> {
  try {
    const docRef = doc(db, 'services', id);
    await updateDoc(docRef, data);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `services/${id}`);
    throw err;
  }
}

export async function deleteService(id: string): Promise<void> {
  return deletePortfolioItem('services', id);
}

// --- TIMELINE / EDUCATION ---
export async function fetchTimeline(): Promise<TimelineItem[]> {
  try {
    const colRef = collection(db, 'timeline');
    const q = query(colRef, orderBy('order', 'asc'));
    const snap = await withTimeout(getDocs(q), 15000, 'Fetch Timeline');

    if (snap.empty) {
      return portfolioData.timeline.map((t, i) => ({ ...t, id: t.id || `default-time-${i}` }));
    }

    return snap.docs.map(docSnap => ({
      ...docSnap.data(),
      id: docSnap.id
    })) as TimelineItem[];
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'timeline');
    return portfolioData.timeline.map((t, i) => ({ ...t, id: t.id || `default-time-${i}` }));
  }
}

export async function createTimeline(data: Omit<TimelineItem, 'id'>): Promise<string> {
  try {
    const colRef = collection(db, 'timeline');
    const docRef = await addDoc(colRef, {
      ...data,
      order: data.order ?? Date.now()
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'timeline');
    throw err;
  }
}

export async function updateTimeline(id: string, data: Partial<TimelineItem>): Promise<void> {
  try {
    const docRef = doc(db, 'timeline', id);
    await updateDoc(docRef, data);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `timeline/${id}`);
    throw err;
  }
}

export async function deleteTimeline(id: string): Promise<void> {
  return deletePortfolioItem('timeline', id);
}

// --- MESSAGES ---
export async function fetchMessages(): Promise<MessageItem[]> {
  try {
    const colRef = collection(db, 'messages');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snap = await withTimeout(getDocs(q), 15000, 'Fetch Messages');
    return snap.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || 'Anonymous',
        email: data.email || 'No email',
        subject: data.subject || 'Portfolio Contact Form',
        message: data.message || '',
        createdAt: data.createdAt ? (typeof data.createdAt === 'string' ? data.createdAt : new Date(data.createdAt.seconds * 1000).toISOString()) : new Date().toISOString(),
        read: !!data.read
      };
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'messages');
    return [];
  }
}

export async function submitContactMessage(msg: { name: string; email: string; subject?: string; message: string }): Promise<string> {
  try {
    const colRef = collection(db, 'messages');
    const docRef = await addDoc(colRef, {
      ...msg,
      read: false,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'messages');
    throw err;
  }
}

export const addMessage = submitContactMessage;

export async function markMessageRead(id: string, read = true): Promise<void> {
  try {
    const docRef = doc(db, 'messages', id);
    await updateDoc(docRef, { read });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `messages/${id}`);
    throw err;
  }
}

export async function deleteMessage(id: string): Promise<void> {
  return deletePortfolioItem('messages', id);
}

// --- SETTINGS ---
export async function fetchSettings(): Promise<SettingsItem> {
  try {
    const docRef = doc(db, 'settings', 'main');
    const snap = await withTimeout(getDoc(docRef), 15000, 'Fetch Settings');
    if (snap.exists()) {
      return { ...defaultSettings, ...(snap.data() as Partial<SettingsItem>) };
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'settings/main');
  }
  return defaultSettings;
}

export async function saveSettings(data: SettingsItem): Promise<void> {
  try {
    const docRef = doc(db, 'settings', 'main');
    await setDoc(docRef, data, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/main');
    throw err;
  }
}

// --- FILE UPLOAD (Firebase Storage strictly without Base64/DataURL fallbacks) ---
export async function uploadMediaFile(path: string, file: File): Promise<string> {
  try {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageRef = ref(storage, `${path}/${Date.now()}_${sanitizedName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    if (!downloadUrl || downloadUrl.startsWith('data:')) {
      throw new Error('Received invalid download URL from Firebase Storage');
    }

    return downloadUrl;
  } catch (err: any) {
    console.error(`[Firebase Storage Upload Failed] Path: "${path}", File: "${file?.name}":`, err);

    let userFacingMessage = err?.message || 'Firebase Storage upload failed.';

    if (err?.code === 'storage/unauthorized') {
      userFacingMessage = 'Firebase Storage permission denied (storage/unauthorized). Please verify your Firebase Storage Security Rules in the Firebase Console.';
    } else if (err?.code === 'storage/bucket-not-found') {
      userFacingMessage = 'Firebase Storage bucket not found (storage/bucket-not-found). Please check storageBucket in firebase-applet-config.json.';
    } else if (err?.code === 'storage/quota-exceeded') {
      userFacingMessage = 'Firebase Storage quota exceeded.';
    } else if (
      err?.message?.includes('CORS') ||
      err?.message?.includes('NetworkError') ||
      err?.message?.includes('Failed to fetch') ||
      err?.name === 'TypeError'
    ) {
      userFacingMessage = 'Firebase Storage request was blocked by CORS or Network Policy. Google Cloud Storage buckets require CORS configuration for direct browser uploads. To resolve: set CORS on your Firebase Storage bucket via gsutil/GCP console.';
    } else if (err?.code) {
      userFacingMessage = `Firebase Storage Error [${err.code}]: ${err.message}`;
    }

    // Absolutely NO Base64 or DataURL fallback - abort the save operation and rethrow
    throw new Error(userFacingMessage);
  }
}

