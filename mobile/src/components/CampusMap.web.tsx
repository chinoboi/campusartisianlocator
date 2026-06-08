import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
    initGoogleMapGlobal?: () => void;
  }
}

type Pin = { id: string; name?: string; latitude?: number; longitude?: number; profession?: string };

let googleMapsLoading = false;
let googleMapsLoaded = false;
const callbacks: (() => void)[] = [];

function loadGoogleMapsScript(callback: () => void) {
  if (typeof window === 'undefined') return;
  if (googleMapsLoaded || (window as any).google) {
    callback();
    return;
  }

  callbacks.push(callback);

  if (googleMapsLoading) return;

  googleMapsLoading = true;

  const script = document.createElement("script");
  script.id = "google-maps-script";
  // Support both Expo and Vite environment variables
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMapGlobal`;
  script.async = true;
  script.defer = true;

  (window as any).initGoogleMapGlobal = () => {
    googleMapsLoaded = true;
    googleMapsLoading = false;
    callbacks.forEach((cb) => cb());
  };

  document.head.appendChild(script);
}

export function CampusMap({ pins, height = 420, showDemo = true }: { pins: Pin[]; height?: number; showDemo?: boolean }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (!mapRef.current || !window.google) return;

      // Center at Topfaith University (Mkpatak, Essien Udim, Akwa Ibom, Nigeria)
      const center = { lat: 5.052114, lng: 7.67045 };

      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 17,
        mapTypeId: "hybrid",
        disableDefaultUI: false,
        zoomControl: true,
        styles: [
          {
            featureType: "poi.school",
            elementType: "labels.text.fill",
            stylers: [{ color: "#4f46e5" }],
          },
        ],
      });

      // Filter pins with valid latitude and longitude
      const validPins = pins.filter((p) => typeof p.latitude === 'number' && typeof p.longitude === 'number');

      validPins.forEach((pin) => {
        const marker = new window.google.maps.Marker({
          position: { lat: pin.latitude, lng: pin.longitude },
          map,
          title: pin.name,
          animation: window.google.maps.Animation.DROP,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="color: #0f172a; padding: 6px; font-family: system-ui, -apple-system, sans-serif; max-width: 200px;">
              <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #4F46E5;">${pin.name || 'Artisan'}</h3>
              ${pin.profession ? `<p style="margin: 0; font-size: 12px; color: #64748B; font-weight: 500;">${pin.profession}</p>` : ''}
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });
    });
  }, [pins]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height,
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 6px 30px -10px rgba(15, 23, 42, 0.08)',
        backgroundColor: '#F8FAFC',
        position: 'relative',
        overflow: 'hidden',
      }}
    />
  );
}

export default CampusMap;
