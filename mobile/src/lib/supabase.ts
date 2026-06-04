import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? Constants.expoConfig?.extra?.SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? Constants.expoConfig?.extra?.SUPABASE_ANON_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️  Missing Supabase config. Set environment variables or app.json extra.SUPABASE_URL/SUPABASE_ANON_KEY');
}

// Provide a safe storage adapter that works across native (expo-secure-store)
// and web (localStorage) or when the SecureStore API shape varies.
const storage = (() => {
  try {
    // Some bundlers/platforms export the module as the default export
    // (SecureStore.default.getItemAsync) while others use named exports.
    const ssAny = (SecureStore as any);
    const ss = ssAny?.default ?? ssAny;

    const getAsync = typeof ss?.getItemAsync === 'function'
      ? ss.getItemAsync.bind(ss)
      : typeof ss?.getValueWithKeyAsync === 'function'
      ? ss.getValueWithKeyAsync.bind(ss)
      : null;

    const setAsync = typeof ss?.setItemAsync === 'function'
      ? ss.setItemAsync.bind(ss)
      : typeof ss?.setValueWithKeyAsync === 'function'
      ? ss.setValueWithKeyAsync.bind(ss)
      : null;

    const deleteAsync = typeof ss?.deleteItemAsync === 'function'
      ? ss.deleteItemAsync.bind(ss)
      : typeof ss?.deleteValueWithKeyAsync === 'function'
      ? ss.deleteValueWithKeyAsync.bind(ss)
      : null;

    if (getAsync && setAsync && deleteAsync) {
      return {
        getItem: async (key: string) => {
          try {
            return await getAsync(key);
          } catch (e) {
            console.warn('SecureStore.getItem failed', e);
            return null;
          }
        },
        setItem: async (key: string, value: string) => {
          try {
            return await setAsync(key, value);
          } catch (e) {
            console.warn('SecureStore.setItem failed', e);
            return null;
          }
        },
        removeItem: async (key: string) => {
          try {
            return await deleteAsync(key);
          } catch (e) {
            console.warn('SecureStore.removeItem failed', e);
            return null;
          }
        },
      };
    }
  } catch (e) {
    console.warn('SecureStore adapter detection error', e);
    // fallthrough to web/local fallback
  }

  // Web or fallback: use localStorage when available, otherwise an in-memory map.
  if (typeof globalThis?.localStorage !== 'undefined') {
    return {
      getItem: async (key: string) => Promise.resolve(globalThis.localStorage.getItem(key)),
      setItem: async (key: string, value: string) => Promise.resolve(globalThis.localStorage.setItem(key, value)),
      removeItem: async (key: string) => Promise.resolve(globalThis.localStorage.removeItem(key)),
    };
  }

  const memStore: Record<string, string> = {};
  return {
    getItem: async (key: string) => Promise.resolve(memStore[key] ?? null),
    setItem: async (key: string, value: string) => Promise.resolve((memStore[key] = value)),
    removeItem: async (key: string) => Promise.resolve(delete memStore[key]),
  };
})();

let supabaseClient: any = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
} else {
  // Provide a minimal stub so importing modules don't crash at load time.
  // This lets the app run (showing empty states) while the developer supplies real keys.
  console.warn('⚠️  Supabase keys missing — exporting a stubbed client. Provide SUPABASE_URL and SUPABASE_ANON_KEY to enable data.');

  const noopAsync = async () => ({ data: null, error: null });
  const makeBuilder = () => {
    const builder: any = {
      select: () => builder,
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
      eq: () => builder,
      maybeSingle: async () => ({ data: null, error: null }),
      match: () => builder,
      order: () => builder,
      limit: () => builder,
      single: async () => ({ data: null, error: null }),
      then(onFulfilled: any, onRejected: any) {
        return Promise.resolve({ data: [], error: null }).then(onFulfilled, onRejected);
      },
      catch(onRejected: any) {
        return Promise.resolve({ data: [], error: null }).catch(onRejected);
      },
    };

    return builder;
  };

  supabaseClient = {
    from: () => makeBuilder(),
    auth: {
      signInWithPassword: noopAsync,
      signOut: noopAsync,
      getUser: noopAsync,
    },
    storage: {
      from: () => ({
        getPublicUrl: (path: string) => ({ publicURL: '' }),
        download: noopAsync,
      }),
    },
  };
}

export const supabase = supabaseClient;
export const isSupabaseStub = !(SUPABASE_URL && SUPABASE_ANON_KEY);
