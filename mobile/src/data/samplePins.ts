export type Pin = { id: string; name?: string; latitude?: number; longitude?: number; category?: string; address?: string };

// Realistic demo pins centered around Mkpatak campus (small offsets)
export const samplePins: Pin[] = [
  { id: 's-1', name: 'Mkpatak Main Gate', latitude: 5.052114, longitude: 7.67045, category: 'entrance', address: 'Main Gate' },
  { id: 's-2', name: 'Carpentry Workshop', latitude: 5.053314, longitude: 7.67195, category: 'workshop', address: 'Block A' },
  { id: 's-3', name: 'Tailoring Workshop', latitude: 5.051014, longitude: 7.66925, category: 'workshop', address: 'Block B' },
  { id: 's-4', name: 'Welding Workshop', latitude: 5.052714, longitude: 7.66885, category: 'workshop', address: 'Block C' },
  { id: 's-5', name: 'Electronics Lab', latitude: 5.052814, longitude: 7.67215, category: 'lab', address: 'Tech Building' },
  { id: 's-6', name: 'Student Centre', latitude: 5.054214, longitude: 7.67095, category: 'facility', address: 'Student Centre' },
  { id: 's-7', name: 'Library', latitude: 5.050914, longitude: 7.66865, category: 'facility', address: 'Library Rd' },
  { id: 's-8', name: 'Cafeteria', latitude: 5.052414, longitude: 7.66725, category: 'facility', address: 'Near Sports Ground' },
  { id: 's-9', name: 'Computer Lab', latitude: 5.053014, longitude: 7.66975, category: 'lab', address: 'Block D' },
  { id: 's-10', name: 'Textile Workshop', latitude: 5.051614, longitude: 7.67105, category: 'workshop', address: 'Block E' },
  { id: 's-11', name: 'Printing Shop', latitude: 5.052314, longitude: 7.67305, category: 'shop', address: 'Market Row' },
  { id: 's-12', name: 'Annex Building', latitude: 5.050514, longitude: 7.67155, category: 'building', address: 'Annex Rd' },
];

export default samplePins;
