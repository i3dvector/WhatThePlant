export type PlantOrgan = 'leaf' | 'flower' | 'fruit' | 'bark';

export type ScanStatus = 'pending' | 'identified' | 'failed';

export interface PlantResult {
  commonName: string;
  scientificName: string;
  family: string;
  confidence: number;
  wikiUrl?: string;
}

export interface SavedPlant {
  id: number;
  commonName: string;
  scientificName: string | null;
  family: string | null;
  confidence: number;
  organ: PlantOrgan;
  imageUri: string;
  apiResponse: string | null;
  createdAt: string;
}

export interface PendingScan {
  id: number;
  imageUri: string;
  organ: PlantOrgan;
  status: ScanStatus;
  createdAt: string;
}

export interface PlantNetResponse {
  results: PlantNetResult[];
  bestMatch: string;
}

export interface PlantNetResult {
  score: number;
  species: {
    scientificNameWithoutAuthor: string;
    scientificNameAuthorship: string;
    genus: { scientificNameWithoutAuthor: string };
    family: { scientificNameWithoutAuthor: string };
    commonNames: string[];
  };
  gbif?: { id: string };
}
