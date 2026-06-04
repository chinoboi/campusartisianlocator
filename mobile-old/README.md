# Campus Artisan Locator Mobile

This folder contains the React Native mobile app scaffold for Campus Artisan Locator.

## Getting started

1. Open a terminal in `mobile/`.
2. Run `npm install`.
3. Set your Supabase config and school logo values:
   - Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` to your environment.
   - Optionally set `EXPO_PUBLIC_SCHOOL_LOGO_URI` to a remote image URL for your school logo.
4. Start the app:
   - `npm start`
   - then choose `Run on Android device/emulator` or `Run on iOS simulator`.

## Logo support

The app header supports a school logo in multiple ways:

### Option 1: Remote URI (recommended)
Set `SCHOOL_LOGO_URI` in `app.json` extra config or as an environment variable `EXPO_PUBLIC_SCHOOL_LOGO_URI`.

### Option 2: Local asset
1. Add your logo file to `assets/` (e.g., `school-logo.png`)
2. Import it in `App.tsx`: `import schoolLogo from './assets/school-logo.png';`
3. Pass it to `SchoolLogo`: `<SchoolLogo source={schoolLogo} />`

If no logo is provided, the header falls back gracefully to a placeholder.

## What’s implemented

- `App.tsx`: Expo + React Navigation stack with 5 screens
- `src/screens/HomeScreen.tsx`: hero search, category preview, featured artisans
- `src/screens/CategoriesScreen.tsx`: grid view of all artisan categories
- `src/screens/CampusMapScreen.tsx`: campus map placeholder with artisan list
- `src/screens/ArtisansScreen.tsx`: searchable artisan directory and category filters
- `src/screens/ArtisanDetailScreen.tsx`: artisan profile with call/SMS actions
- `src/lib/supabase.ts`: Supabase client using Expo SecureStore
- `src/components/ArtisanCard.tsx`: reusable artisan list card
- `src/components/SchoolLogo.tsx`: header logo component with URI/local asset support
