import React from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { samplePins } from '../data/samplePins';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { colors } from '../theme';

type Pin = { id: string; name?: string; latitude?: number; longitude?: number };

export function CampusMap({ pins, height = 420, showDemo = true }: { pins: Pin[]; height?: number; showDemo?: boolean }) {
  const validPins = pins.filter((p) => typeof p.latitude === 'number' && typeof p.longitude === 'number');
  // Default to Mkpatak, Akwa Ibom when no pins are available
  const defaultCenter: [number, number] = [5.052114, 7.67045];
  const center: [number, number] = validPins.length
    ? [validPins[0].latitude as number, validPins[0].longitude as number]
    : defaultCenter;

  // use our sample dataset when showing demo pins
  const demoPins = samplePins;

  const markers = !showDemo ? validPins : (validPins.length ? validPins : demoPins);

  // create a simple colored div icon for markers
  const createIcon = (color = colors.primary) =>
    L.divIcon({
      html: `<div style="background:${color}; width:20px; height:20px; border-radius:50%; box-shadow:0 1px 4px rgba(2,6,23,0.3); border:2px solid white"></div>`,
      className: '',
      iconSize: L.point(24, 24, true),
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });

  const clusterOptions = {
    chunkedLoading: true,
    iconCreateFunction: (cluster: any) => {
      const count = cluster.getChildCount();
      return L.divIcon({
        html: `<div style="background:${colors.primary}; border-radius:50%; width:44px; height:44px; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; box-shadow:0 2px 6px rgba(2,6,23,0.2)">${count}</div>`,
        className: 'custom-cluster-icon',
        iconSize: L.point(44, 44, true),
      });
    },
  };

  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <MapContainer center={center} zoom={15} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup {...clusterOptions}>
          {markers.map((pin, idx) => (
            <Marker
              key={pin.id}
              position={[pin.latitude as number, pin.longitude as number]}
              icon={createIcon(idx % 2 === 0 ? colors.primary : colors.accent)}
            >
                <Popup>
                <strong>{pin.name ?? 'Workshop'}</strong>
                <div style={{ marginTop: 6, color: colors.muted }}>{`${typeof pin.latitude === 'number' ? pin.latitude.toFixed(6) : ''} , ${typeof pin.longitude === 'number' ? pin.longitude.toFixed(6) : ''}`}</div>
              </Popup>
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9} permanent={false}>
                {pin.name ?? 'Workshop'}
              </Tooltip>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'rgba(255,255,255,0.95)',
          padding: '6px 10px',
          borderRadius: 8,
          border: `1px solid ${colors.border}`,
          fontSize: 13,
          color: colors.text,
          boxShadow: '0 2px 6px rgba(2,6,23,0.08)',
        }}
      >
        Demo pins — Mkpatak
      </div>
    </div>
  );
}

export default CampusMap;
