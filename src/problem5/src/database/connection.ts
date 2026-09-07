import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { config } from '../config/env';

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = path.isAbsolute(config.databaseUrl)
    ? config.databaseUrl
    : path.resolve(__dirname, '../../', config.databaseUrl);

  // Ensure database directory exists
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  dbInstance = new DatabaseSync(dbPath);

  // Initialize schema
  initializeSchema(dbInstance);

  return dbInstance;
}

function initializeSchema(db: DatabaseSync): void {
  const schema = `
    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_resources_category ON resources (category);
    CREATE INDEX IF NOT EXISTS idx_resources_status ON resources (status);
    CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources (createdAt);
  `;

  db.exec(schema);
}

export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
