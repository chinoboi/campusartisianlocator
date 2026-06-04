import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
    initGoogleMapGlobal?: () => void;
  }
}


type Pin = {
  id: string;
  name: string;
  profession: string;
  latitude: number | null;
  longitude: number | null;
  map_x?: number | null;
  map_y?: number | null;
};

// Global script loading state to prevent duplicate script tags and race conditions
let googleMapsLoading = false;
let googleMapsLoaded = false;
const callbacks: (() => void)[] = [];

function loadGoogleMapsScript(callback: () => void) {
  if (googleMapsLoaded || (window as any).google) {
    callback();
    return;
  }

  callbacks.push(callback);

  if (googleMapsLoading) return;

  googleMapsLoading = true;

  const script = document.createElement("script");
  script.id = "google-maps-script";
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
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

export function CampusMap({ pins, height = 520 }: { pins: Pin[]; height?: number }) {
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

      // Add pins
      pins.forEach((pin) => {
        let lat = pin.latitude;
        let lng = pin.longitude;

        // Fallback for visual map coordinate conversion if geo coordinates are missing
        if (lat === null || lat === undefined || lng === null || lng === undefined) {
          const mapX = pin.map_x ?? 50;
          const mapY = pin.map_y ?? 50;
          lat = 5.052114 + (mapX - 50) * 0.0001;
          lng = 7.67045 + (mapY - 50) * 0.0001;
        }

        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map,
          title: pin.name,
          animation: window.google.maps.Animation.DROP,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="color: #0f172a; padding: 6px; font-family: system-ui, -apple-system, sans-serif; max-width: 200px;">
              <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #1e1b4b;">${pin.name}</h3>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #475569; font-weight: 500;">${pin.profession}</p>
              <a href="/artisans/${pin.id}" style="display: inline-flex; font-size: 11px; color: #4f46e5; font-weight: 700; text-decoration: none; border-bottom: 1.5px solid #4f46e5; padding-bottom: 1px;">View Profile &rarr;</a>
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
      className="w-full rounded-2xl border border-border shadow-elegant bg-secondary"
      style={{ height }}
    />
  );
}

export default CampusMap;
