import { registerRootComponent } from 'expo';

import App from './App';

// Global error handlers to surface runtime errors in console (web and native)
try {
	if (typeof global !== 'undefined' && (global as any).ErrorUtils) {
		(global as any).ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
			console.error('Global Error:', error, 'isFatal:', isFatal);
			throw error;
		});
	}
} catch (e) {
	// ignore if ErrorUtils not present
}

if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('error', (e) => {
    console.error('Window error', e);
  });
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection', e);
  });
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
