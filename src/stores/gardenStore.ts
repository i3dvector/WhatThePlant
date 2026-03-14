import { create } from 'zustand';
import type { SavedPlant, PlantResult, PlantOrgan } from '../types';
import { getDatabase } from '../services/database';
import { File, Directory, Paths } from 'expo-file-system';

interface GardenStore {
  plants: SavedPlant[];
  isLoading: boolean;
  loadPlants: () => Promise<void>;
  savePlant: (
    result: PlantResult,
    imageUri: string,
    organ: PlantOrgan,
    apiResponse?: string
  ) => Promise<void>;
  deletePlant: (id: number) => Promise<void>;
}

export const useGardenStore = create<GardenStore>((set, get) => ({
  plants: [],
  isLoading: false,

  loadPlants: async () => {
    set({ isLoading: true });
    try {
      const db = await getDatabase();
      const rows = await db.getAllAsync<SavedPlant>(
        'SELECT * FROM plants ORDER BY created_at DESC'
      );
      // Map snake_case DB columns to camelCase
      const plants = rows.map((row: any) => ({
        id: row.id,
        commonName: row.common_name,
        scientificName: row.scientific_name,
        family: row.family,
        confidence: row.confidence,
        organ: row.organ,
        imageUri: row.image_uri,
        apiResponse: row.api_response,
        createdAt: row.created_at,
      }));
      set({ plants, isLoading: false });
    } catch (error) {
      console.error('Failed to load plants:', error);
      set({ isLoading: false });
    }
  },

  savePlant: async (result, imageUri, organ, apiResponse) => {
    try {
      // Copy image to permanent storage
      const filename = `plant_${Date.now()}.jpg`;
      const gardenDir = new Directory(Paths.document, 'garden');
      if (!gardenDir.exists) {
        gardenDir.create();
      }
      const sourceFile = new File(imageUri);
      const destFile = new File(gardenDir, filename);
      sourceFile.copy(destFile);
      const destUri = destFile.uri;

      const db = await getDatabase();
      await db.runAsync(
        `INSERT INTO plants (common_name, scientific_name, family, confidence, organ, image_uri, api_response)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          result.commonName,
          result.scientificName,
          result.family,
          result.confidence,
          organ,
          destUri,
          apiResponse || null,
        ]
      );

      await get().loadPlants();
    } catch (error) {
      console.error('Failed to save plant:', error);
    }
  },

  deletePlant: async (id) => {
    try {
      const plant = get().plants.find((p) => p.id === id);
      if (plant) {
        const file = new File(plant.imageUri);
        if (file.exists) file.delete();
      }
      const db = await getDatabase();
      await db.runAsync('DELETE FROM plants WHERE id = ?', [id]);
      await get().loadPlants();
    } catch (error) {
      console.error('Failed to delete plant:', error);
    }
  },
}));
