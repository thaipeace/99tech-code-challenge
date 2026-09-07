import { getDatabase, closeDatabase } from './connection';

const sampleResources = [
  {
    title: 'Wireless Noise-Canceling Headphones',
    description: 'High-fidelity audio with active noise cancellation and 30-hour battery life.',
    category: 'Electronics',
    price: 199.99,
    status: 'active',
  },
  {
    title: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with hot-swappable tactile switches.',
    category: 'Electronics',
    price: 89.5,
    status: 'active',
  },
  {
    title: 'Ergonomic Mesh Office Chair',
    description: 'Breathable mesh back with adjustable lumbar support and 3D armrests.',
    category: 'Furniture',
    price: 249.0,
    status: 'active',
  },
  {
    title: 'Stainless Steel Water Bottle 1L',
    description: 'Double-walled vacuum insulated bottle keeps drinks cold for 24h.',
    category: 'Accessories',
    price: 24.99,
    status: 'active',
  },
  {
    title: 'Ultra-Wide 34-inch Monitor',
    description: '144Hz curved gaming and productivity monitor with HDR400.',
    category: 'Electronics',
    price: 499.0,
    status: 'draft',
  },
  {
    title: 'Standing Desk Converter',
    description: 'Dual-tier riser with pneumatic spring lift mechanism.',
    category: 'Furniture',
    price: 159.0,
    status: 'archived',
  },
  {
    title: 'Leather Desk Mat',
    description: 'Water-resistant PU leather mouse pad and desk blotter.',
    category: 'Accessories',
    price: 19.95,
    status: 'active',
  },
];

export function seed(): void {
  const db = getDatabase();
  const now = new Date().toISOString();

  console.log('🌱 Seeding database...');

  // Clear existing records
  db.exec('DELETE FROM resources;');
  db.exec("DELETE FROM sqlite_sequence WHERE name = 'resources';");

  const insertStmt = db.prepare(`
    INSERT INTO resources (title, description, category, price, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const item of sampleResources) {
    insertStmt.run(
      item.title,
      item.description,
      item.category,
      item.price,
      item.status,
      now,
      now
    );
  }

  const countRow = db.prepare('SELECT COUNT(*) as count FROM resources').get() as { count: number };
  console.log(`✅ Seeded ${countRow.count} sample resources successfully!`);
}

// Run if called directly
if (require.main === module) {
  try {
    seed();
    closeDatabase();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}
