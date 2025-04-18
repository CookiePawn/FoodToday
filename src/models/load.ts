export interface Position {
    coords: {
        latitude: number;
        longitude: number;
        accuracy: number;
        altitude: number | null;
        altitudeAccuracy: number | null;
        heading: number | null;
        speed: number | null;
    };
    timestamp: number;
}

export interface PositionError {
    code: number;
    message: string;
}

export interface GeocodingResponse {
    countryName: string;
    principalSubdivision: string;
    city: string;
    locality: string;
    latitude: number;
    longitude: number;
}