import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type Artisan = {
  id: string;
  name: string;
  profession: string;
  phone: string;
  workshop_location: string;
  bio?: string | null;
  available_hours?: string | null;
  rating?: number | null;
  is_available?: boolean;
  photo_url?: string | null;
  phone_verified?: boolean;
  categories?: {
    name?: string;
    slug?: string;
  };
};

export type Review = {
  id: string;
  artisan_id: string;
  author?: string | null;
  rating: number; // 1-5
  text?: string | null;
  created_at?: string | null;
};

export type RootStackParamList = {
  Home: undefined;
  Categories: undefined;
  CampusMap: undefined;
  Artisans: {
    initialQuery?: string;
    initialCategory?: string;
  } | undefined;
  ArtisanDetail: { id: string };
  Register: undefined;
  RegisterSuccess: { name: string; id?: string | null } | undefined;
  Admin: undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type ArtisansScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Artisans'>;
export type ArtisanDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ArtisanDetail'>;
