import { atom } from 'jotai';

export interface LocationInfo {
  latitude: number;
  longitude: number;
  country: string;
  province: string;
  city: string;
  district: string;
}

export const locationAtom = atom<LocationInfo | null>(null); 