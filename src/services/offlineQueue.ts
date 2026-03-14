import { getDatabase } from './database';
import { identifyPlant } from './plantnet';
import type { PlantOrgan, PendingScan, PlantResult } from '../types';

export async function queueScan(imageUri: string, organ: PlantOrgan): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO pending_scans (image_uri, organ, status) VALUES (?, ?, ?)',
    [imageUri, organ, 'pending']
  );
}

export async function getPendingScans(): Promise<PendingScan[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>(
    "SELECT * FROM pending_scans WHERE status = 'pending' ORDER BY created_at ASC"
  );
  return rows.map((row) => ({
    id: row.id,
    imageUri: row.image_uri,
    organ: row.organ as PlantOrgan,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export async function processPendingScans(): Promise<
  { scan: PendingScan; results: PlantResult[] }[]
> {
  const scans = await getPendingScans();
  if (scans.length === 0) return [];

  const db = await getDatabase();
  const processed: { scan: PendingScan; results: PlantResult[] }[] = [];

  for (const scan of scans) {
    try {
      const results = await identifyPlant(scan.imageUri, scan.organ);
      await db.runAsync(
        "UPDATE pending_scans SET status = 'identified' WHERE id = ?",
        [scan.id]
      );
      processed.push({ scan, results });
    } catch {
      await db.runAsync(
        "UPDATE pending_scans SET status = 'failed' WHERE id = ?",
        [scan.id]
      );
    }
  }

  return processed;
}
