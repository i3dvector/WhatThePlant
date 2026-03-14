import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('whattheplant.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS plants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      common_name TEXT NOT NULL,
      scientific_name TEXT,
      family TEXT,
      confidence REAL,
      organ TEXT DEFAULT 'leaf',
      image_uri TEXT NOT NULL,
      api_response TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pending_scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_uri TEXT NOT NULL,
      organ TEXT DEFAULT 'leaf',
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  return db;
}
