import Constants from 'expo-constants';
import * as ImageManipulator from 'expo-image-manipulator';
import type { PlantOrgan, PlantResult, PlantNetResult } from '../types';

const API_KEY = Constants.expoConfig?.extra?.plantNetApiKey || 'YOUR_API_KEY';
const BASE_URL = 'https://my-api.plantnet.org/v2/identify/all';

export async function compressImage(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1024 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}

export async function identifyPlant(
  imageUri: string,
  organ: PlantOrgan
): Promise<PlantResult[]> {
  const compressedUri = await compressImage(imageUri);

  const formData = new FormData();
  formData.append('images', {
    uri: compressedUri,
    type: 'image/jpeg',
    name: 'plant.jpg',
  } as any);
  formData.append('organs', organ);

  const response = await fetch(`${BASE_URL}?api-key=${API_KEY}&lang=en`, {
    method: 'POST',
    body: formData,
  });

  if (response.status === 429) {
    throw new Error('RATE_LIMIT');
  }

  if (!response.ok) {
    throw new Error(`API_ERROR_${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('NO_RESULTS');
  }

  // Map top 3 results
  const results: PlantResult[] = data.results
    .slice(0, 3)
    .map((r: PlantNetResult) => ({
      commonName:
        r.species.commonNames?.[0] ||
        r.species.scientificNameWithoutAuthor,
      scientificName: r.species.scientificNameWithoutAuthor,
      family: r.species.family.scientificNameWithoutAuthor,
      confidence: Math.round(r.score * 100),
      wikiUrl: r.gbif
        ? `https://www.gbif.org/species/${r.gbif.id}`
        : undefined,
    }));

  // Check if top result confidence is too low
  if (results[0].confidence < 20) {
    throw new Error('LOW_CONFIDENCE');
  }

  return results;
}
