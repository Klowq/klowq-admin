import { promises as fs } from 'fs';
import path from 'path';
import { Preference } from '@/types/preference';

const dataDir = path.join(process.cwd(), 'data');
const preferencesFile = path.join(dataDir, 'preferences.json');

// Default preferences list
const DEFAULT_PREFERENCES = [
  "Cardiology",
  "Mental Health & Wellness",
  "Nutrition & Diet",
  "Fitness & Physical Therapy",
  "Women's Health",
  "Men's Health",
  "Pediatrics & Child Care",
  "Pregnancy & Maternal Health",
  "Chronic Illness Management",
  "Health Technology & Telemedicine",
  "Medical Research & Innovations",
  "Surgery & Surgical Procedures",
  "Skin Care & Dermatology",
  "Dental & Oral Health",
  "Alternative Medicine",
  "Emergency Medicine & First Aid",
  "Vaccinations & Immunization",
  "Cancer Awareness & Oncology",
  "Mental Disorders & Therapy Support",
  "Public Health & Disease Prevention",
  "Medication Guides & Drug Awareness",
  "Medical Career & Education",
  "Patient Care & Hospital Experience",
  "Health Insurance & Medical Finance",
  "Rehabilitation & Recovery",
  "AI in Healthcare",
  "Medical Robotics",
  "Digital Health Records (EHR)",
  "Gut Health & Microbiome",
  "Sleep Disorders & Insomnia",
  "Autoimmune Diseases",
  "COVID-19 & Infectious Diseases",
  "Rare Diseases & Genetic Disorders",
  "Plastic & Reconstructive Surgery",
  "Physiotherapy & Sports Medicine",
  "Hormonal Health & Endocrinology",
  "Blood Donation & Organ Transplant",
  "Health & Wellness Coaching",
  "Medical Ethics & Law",
  "Healthcare Startups & Innovations",
  "Sexual & Reproductive Health",
  "Contraception & Family Planning",
  "Menstrual Health & PMS",
  "PCOS & Hormonal Disorders",
  "Endometriosis Awareness",
  "Fertility & IVF Support",
  "Maternal Mental Health",
  "Breastfeeding & Postpartum Care",
  "Cervical & Breast Cancer Awareness",
  "Body Positivity & Women's Wellness",
  "Sexually Transmitted Infections (STIs)",
  "Safe Sex Education",
  "Intimate Hygiene & Care",
  "Menopause & Perimenopause Health",
  "Relationship & Emotional Well-being",
  "Sexual Consent & Safety"
];

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// Initialize preferences with default list if file doesn't exist
async function initializePreferences(): Promise<Preference[]> {
  await ensureDataDir();
  try {
    await fs.access(preferencesFile);
    // File exists, read it
    const data = await fs.readFile(preferencesFile, 'utf-8');
    const preferences = JSON.parse(data);
    if (Array.isArray(preferences) && preferences.length > 0) {
      return preferences;
    }
  } catch (error) {
    // File doesn't exist, create with defaults
  }
  
  // Create default preferences
  const defaultPrefs: Preference[] = DEFAULT_PREFERENCES.map((name, index) => ({
    id: `pref-${Date.now()}-${index}`,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  
  await fs.writeFile(preferencesFile, JSON.stringify(defaultPrefs, null, 2), 'utf-8');
  return defaultPrefs;
}

// Read preferences from file
export async function getPreferences(): Promise<Preference[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(preferencesFile, 'utf-8');
    const preferences = JSON.parse(data);
    if (Array.isArray(preferences) && preferences.length > 0) {
      return preferences;
    }
  } catch (error) {
    // File doesn't exist, initialize with defaults
  }
  
  return initializePreferences();
}

// Write preferences to file
async function savePreferences(preferences: Preference[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(preferencesFile, JSON.stringify(preferences, null, 2), 'utf-8');
}

// Get a single preference by ID
export async function getPreferenceById(id: string): Promise<Preference | null> {
  const preferences = await getPreferences();
  return preferences.find(pref => pref.id === id) || null;
}

// Create a new preference
export async function createPreference(preferenceData: Omit<Preference, 'id' | 'createdAt' | 'updatedAt'>): Promise<Preference> {
  const preferences = await getPreferences();
  
  // Check if preference with same name already exists
  const exists = preferences.some(p => p.name.toLowerCase() === preferenceData.name.toLowerCase());
  if (exists) {
    throw new Error('Preference with this name already exists');
  }
  
  const newPreference: Preference = {
    ...preferenceData,
    id: `pref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  preferences.push(newPreference);
  await savePreferences(preferences);
  return newPreference;
}

// Update a preference
export async function updatePreference(id: string, updates: Partial<Omit<Preference, 'id' | 'createdAt'>>): Promise<Preference | null> {
  const preferences = await getPreferences();
  const index = preferences.findIndex(pref => pref.id === id);
  if (index === -1) {
    return null;
  }
  
  // Check if updated name conflicts with existing preference
  if (updates.name) {
    const exists = preferences.some((p, i) => 
      i !== index && p.name.toLowerCase() === updates.name!.toLowerCase()
    );
    if (exists) {
      throw new Error('Preference with this name already exists');
    }
  }
  
  preferences[index] = {
    ...preferences[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await savePreferences(preferences);
  return preferences[index];
}

// Delete a preference
export async function deletePreference(id: string): Promise<boolean> {
  const preferences = await getPreferences();
  const filteredPreferences = preferences.filter(pref => pref.id !== id);
  if (filteredPreferences.length === preferences.length) {
    return false; // Preference not found
  }
  await savePreferences(filteredPreferences);
  return true;
}

