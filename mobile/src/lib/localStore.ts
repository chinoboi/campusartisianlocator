import * as FileSystem from 'expo-file-system';
const FILE_PATH = `${(FileSystem as any).documentDirectory}local_artisans_v1.json`;

export type LocalArtisan = {
  id: string;
  name: string;
  category?: string | null;
  phone?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  submitted_by_email?: string | null;
  available_hours?: string | null;
  bio?: string | null;
  created_at: string;
};

export type LocalReview = {
  id: string;
  artisan_id: string;
  author?: string | null;
  rating: number;
  text?: string | null;
  created_at: string;
};

const REVIEWS_FILE = `${(FileSystem as any).documentDirectory}local_reviews_v1.json`;

async function readReviewsFromFile(): Promise<LocalReview[] | null> {
  try {
    if (!(FileSystem as any).documentDirectory) return null;
    const exists = await FileSystem.getInfoAsync(REVIEWS_FILE);
    if (!exists.exists) return null;
    const raw = await FileSystem.readAsStringAsync(REVIEWS_FILE);
    return JSON.parse(raw) as LocalReview[];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error reading local reviews file', err);
    return null;
  }
}

async function writeReviewsToFile(list: LocalReview[]) {
  try {
    if (!(FileSystem as any).documentDirectory) throw new Error('FileSystem.documentDirectory unavailable');
    await FileSystem.writeAsStringAsync(REVIEWS_FILE, JSON.stringify(list));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error writing local reviews file', err);
    throw err;
  }
}

async function readFromFile(): Promise<LocalArtisan[] | null> {
  try {
    if (!(FileSystem as any).documentDirectory) return null;
    const exists = await FileSystem.getInfoAsync(FILE_PATH);
    if (!exists.exists) return null;
    const raw = await FileSystem.readAsStringAsync(FILE_PATH);
    return JSON.parse(raw) as LocalArtisan[];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error reading local artisans file', err);
    return null;
  }
}

async function writeToFile(list: LocalArtisan[]) {
  try {
    if (!(FileSystem as any).documentDirectory) throw new Error('FileSystem.documentDirectory unavailable');
    await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(list));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error writing local artisans file', err);
    throw err;
  }
}

export async function getLocalArtisans(): Promise<LocalArtisan[]> {
  // Use file-based JSON storage when available. On web (no documentDirectory) fall back to in-memory.
  try {
    const fileList = await readFromFile();
    if (fileList) return fileList;
  } catch (err) {
    // ignore and continue to fallback
  }

  // In-memory fallback (for web or environments without FileSystem.documentDirectory)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalAny: any = globalThis as any;
  if (!globalAny.__local_artisans_cache) globalAny.__local_artisans_cache = [];
  return globalAny.__local_artisans_cache as LocalArtisan[];
}

export async function getLocalReviews(artisanId?: string): Promise<LocalReview[]> {
  try {
    const fileList = await readReviewsFromFile();
    if (fileList) return artisanId ? fileList.filter((r) => r.artisan_id === artisanId) : fileList;
  } catch (err) {
    // ignore and continue to fallback
  }

  // In-memory fallback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalAny: any = globalThis as any;
  if (!globalAny.__local_reviews_cache) globalAny.__local_reviews_cache = [];
  return artisanId ? globalAny.__local_reviews_cache.filter((r: LocalReview) => r.artisan_id === artisanId) : globalAny.__local_reviews_cache;
}

export async function saveLocalReview(r: Omit<LocalReview, 'created_at' | 'id'>) {
  const id = `local-review-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const toSave: LocalReview = { ...r, id, created_at: new Date().toISOString() } as LocalReview;

  try {
    const fileList = (await readReviewsFromFile()) ?? [];
    fileList.unshift(toSave);
    await writeReviewsToFile(fileList);
    return toSave;
  } catch (err) {
    // fallback to in-memory
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalAny: any = globalThis as any;
    if (!globalAny.__local_reviews_cache) globalAny.__local_reviews_cache = [];
    globalAny.__local_reviews_cache.unshift(toSave);
    return toSave;
  }
}

export async function saveLocalArtisan(a: Omit<LocalArtisan, 'created_at'>) {
  const toSave: LocalArtisan = { ...a, created_at: new Date().toISOString() };
  // If FileSystem.documentDirectory is not available (web), skip file attempts and use in-memory fallback directly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalAny: any = globalThis as any;
  if (!(FileSystem as any).documentDirectory) {
    if (!globalAny.__local_artisans_cache) globalAny.__local_artisans_cache = [];
    globalAny.__local_artisans_cache.unshift(toSave);
    return toSave;
  }

  // try file storage
  try {
    const fileList = (await readFromFile()) ?? [];
    fileList.unshift(toSave);
    await writeToFile(fileList);
    return toSave;
  } catch (err) {
    // fallback to in-memory cache
    if (!globalAny.__local_artisans_cache) globalAny.__local_artisans_cache = [];
    globalAny.__local_artisans_cache.unshift(toSave);
    return toSave;
  }
}

export async function clearLocalArtisans() {
  try {
    // remove file if exists
    if ((FileSystem as any).documentDirectory) {
      const info = await FileSystem.getInfoAsync(FILE_PATH);
      if (info.exists) await FileSystem.deleteAsync(FILE_PATH);
    }
  } catch (err) {
    // ignore file errors
  }

  // clear in-memory cache as well
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalAny: any = globalThis as any;
  if (globalAny.__local_artisans_cache) globalAny.__local_artisans_cache = [];
}

export default { getLocalArtisans, saveLocalArtisan, clearLocalArtisans };
