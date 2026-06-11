// In-browser mock database using LocalStorage.
// Allows the Campus Artisan Locator to be 100% functional offline without Supabase.

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface Artisan {
  id: string;
  name: string;
  profession: string;
  category_id: string | null;
  phone: string;
  phone_verified: boolean;
  phone_verified_at: string | null;
  workshop_location: string;
  map_x: number;
  map_y: number;
  latitude: number | null;
  longitude: number | null;
  available_hours: string | null;
  bio: string | null;
  photo_url: string | null;
  rating: number;
  is_available: boolean;
  is_approved: boolean;
  submitted_by_email: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  artisan_id: string;
  rating: number;
  text: string | null;
  author: string | null;
  created_at: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "c-1",
    name: "Electricals",
    slug: "electricals",
    description: "Hostel wiring, fans, hotplates, light fixtures, and sockets.",
    icon: "zap",
  },
  {
    id: "c-2",
    name: "Plumbing",
    slug: "plumbing",
    description: "Leaking hostel pipes, taps, sinks, and borehole issues.",
    icon: "droplet",
  },
  {
    id: "c-3",
    name: "Tailoring & Fashion",
    slug: "tailoring",
    description: "Clothing repairs, custom fitting, patching, and designer wears.",
    icon: "scissors",
  },
  {
    id: "c-4",
    name: "Cobblers (Shoemaking)",
    slug: "cobbler",
    description: "Shoe mending, stitching, sole gluing, and leather repairs.",
    icon: "footprints",
  },
  {
    id: "c-5",
    name: "Carpentry & Woodwork",
    slug: "carpentry",
    description: "Furniture repairs, locker keys, study desks, and doors.",
    icon: "hammer",
  },
];

const DEFAULT_ARTISANS: Artisan[] = [
  {
    id: "art-1",
    name: "Baba Jide (Jide Wire)",
    profession: "Senior Electrician",
    category_id: "c-1",
    phone: "+234 803 123 4567",
    phone_verified: true,
    phone_verified_at: new Date().toISOString(),
    workshop_location: "Behind Hostel Hall 3, opposite the laundry stand",
    map_x: 75,
    map_y: 65,
    latitude: 5.052714,
    longitude: 7.66885,
    available_hours: "Mon–Sat, 8am–7pm",
    bio: "Over 10 years fixing electrical issues for students. Specializes in repairing hotplates, extension cords, fans, and socket wiring.",
    photo_url: null,
    rating: 4.8,
    is_available: true,
    is_approved: true,
    submitted_by_email: "jide.wire@gmail.com",
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "art-2",
    name: "Emeka Uzo",
    profession: "Plumbing Specialist",
    category_id: "c-2",
    phone: "+234 809 987 6543",
    phone_verified: true,
    phone_verified_at: new Date().toISOString(),
    workshop_location: "Maintenance Yard, adjacent to Engineering Block B",
    map_x: 48,
    map_y: 20,
    latitude: 5.052814,
    longitude: 7.67215,
    available_hours: "Mon–Sun, 24/7 (Emergency calls allowed)",
    bio: "Fast response for pipe leaks, blocked toilets, and taps. Available for emergency hostel repairs at any time.",
    photo_url: null,
    rating: 4.5,
    is_available: true,
    is_approved: true,
    submitted_by_email: "emeka.plumbing@yahoo.com",
    created_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "art-3",
    name: "Aisha Ibrahim",
    profession: "Fashion Designer & Tailor",
    category_id: "c-3",
    phone: "+234 812 345 6789",
    phone_verified: true,
    phone_verified_at: new Date().toISOString(),
    workshop_location: "Student Plaza, Shop 14",
    map_x: 42,
    map_y: 64,
    latitude: 5.051014,
    longitude: 7.66925,
    available_hours: "Mon–Fri, 9am–6pm",
    bio: "Specialist in native wears, custom corporate sizing, shirt patching, and zipper repairs. Fast turnaround time.",
    photo_url: null,
    rating: 4.9,
    is_available: true,
    is_approved: true,
    submitted_by_email: "aisha.threads@gmail.com",
    created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "art-4",
    name: "Uncle Chinedu",
    profession: "Leather Cobbler",
    category_id: "c-4",
    phone: "+234 905 444 3322",
    phone_verified: true,
    phone_verified_at: new Date().toISOString(),
    workshop_location: "Under the shade near Hall 1 Common Room",
    map_x: 18,
    map_y: 58,
    latitude: 5.053314,
    longitude: 7.67195,
    available_hours: "Mon–Sat, 8am–6pm",
    bio: "Sole stitching, heel replacement, gluing, and polishing. Bring your sneakers, sandals, or formal shoes.",
    photo_url: null,
    rating: 4.7,
    is_available: true,
    is_approved: true,
    submitted_by_email: "chinedu.shoes@gmail.com",
    created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "art-5",
    name: "Brother Ebenezer",
    profession: "Woodworker & Locksmith",
    category_id: "c-5",
    phone: "+234 816 777 8899",
    phone_verified: true,
    phone_verified_at: new Date().toISOString(),
    workshop_location: "Behind the Library Building, Woodshop Shed",
    map_x: 74,
    map_y: 28,
    latitude: 5.050914,
    longitude: 7.66865,
    available_hours: "Mon–Fri, 8am–5pm",
    bio: "Repairs hostel wardrobes, bed frames, study desks, and installs new locks. Call for wood or lock mending.",
    photo_url: null,
    rating: 4.3,
    is_available: false,
    is_approved: true,
    submitted_by_email: "ebenezer.wood@outlook.com",
    created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
  },
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "rev-1",
    artisan_id: "art-1",
    rating: 5,
    text: "Fixed my hotplate in under 15 minutes! Very friendly and affordable.",
    author: "Tolu O.",
    created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "rev-2",
    artisan_id: "art-1",
    rating: 4,
    text: "Good electrician but gets busy, had to wait 30 minutes. The fix is perfect though.",
    author: "Segun A.",
    created_at: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "rev-3",
    artisan_id: "art-3",
    rating: 5,
    text: "Best tailor on campus! She fixed my lecture trousers in 5 mins and tailored my matriculation gown perfectly.",
    author: "Chioma N.",
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },
];

function getStored<T>(key: string, defaults: T[]): T[] {
  if (typeof window === "undefined") return defaults;
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(data);
}

function setStored<T>(key: string, value: T[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export const mockDb = {
  getCategories(): Category[] {
    return getStored("mock_categories", DEFAULT_CATEGORIES);
  },

  getArtisans(includeUnapproved = false): Artisan[] {
    const list = getStored("mock_artisans", DEFAULT_ARTISANS);
    if (includeUnapproved) return list;
    return list.filter((a) => a.is_approved && a.phone_verified);
  },

  getArtisan(id: string): Artisan | null {
    const list = this.getArtisans(true);
    return list.find((a) => a.id === id) ?? null;
  },

  insertArtisan(a: Omit<Artisan, "id" | "created_at" | "rating">): Artisan {
    const list = this.getArtisans(true);
    const newArtisan: Artisan = {
      ...a,
      id: `art-${Date.now()}`,
      rating: 0,
      created_at: new Date().toISOString(),
    };
    list.unshift(newArtisan);
    setStored("mock_artisans", list);
    return newArtisan;
  },

  updateArtisan(id: string, updates: Partial<Artisan>): Artisan | null {
    const list = this.getArtisans(true);
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    setStored("mock_artisans", list);
    return updated;
  },

  deleteArtisan(id: string): boolean {
    const list = this.getArtisans(true);
    const filtered = list.filter((a) => a.id !== id);
    if (filtered.length === list.length) return false;
    setStored("mock_artisans", filtered);
    return true;
  },

  getReviews(artisanId: string): Review[] {
    const list = getStored("mock_reviews", DEFAULT_REVIEWS);
    return list.filter((r) => r.artisan_id === artisanId);
  },

  insertReview(artisanId: string, rating: number, text: string | null, author: string | null): Review {
    const list = getStored("mock_reviews", DEFAULT_REVIEWS);
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      artisan_id: artisanId,
      rating,
      text,
      author: author || "Anonymous Student",
      created_at: new Date().toISOString(),
    };
    list.unshift(newReview);
    setStored("mock_reviews", list);

    // Recalculate artisan rating
    const artisanReviews = list.filter((r) => r.artisan_id === artisanId);
    const avg = artisanReviews.reduce((sum, r) => sum + r.rating, 0) / artisanReviews.length;
    this.updateArtisan(artisanId, { rating: Number(avg.toFixed(1)) });

    return newReview;
  },

  // Mock Authentication State
  getCurrentUser(): { id: string; email: string } | null {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("mock_auth_user");
    return user ? JSON.parse(user) : null;
  },

  signIn(email: string): { id: string; email: string } {
    const user = { id: `usr-${Date.now()}`, email };
    if (typeof window !== "undefined") {
      localStorage.setItem("mock_auth_user", JSON.stringify(user));
    }
    return user;
  },

  signOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mock_auth_user");
    }
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    // For demo/development purposes, any signed-in user or a specific admin email is considered admin
    // If signed in, return true to make the admin page easily accessible
    return !!user;
  },
};
