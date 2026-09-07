import { getDatabase } from '../database/connection';
import {
  CreateResourceDTO,
  PaginatedResult,
  Resource,
  ResourceFilterQuery,
  UpdateResourceDTO,
} from '../models/resource.model';

export class ResourceRepository {
  create(data: CreateResourceDTO): Resource {
    const db = getDatabase();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO resources (title, description, category, price, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.title,
      data.description ?? null,
      data.category,
      data.price,
      data.status ?? 'active',
      now,
      now
    );

    return this.findById(Number(result.lastInsertRowid))!;
  }

  findAll(query: ResourceFilterQuery): PaginatedResult<Resource> {
    const db = getDatabase();
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (query.search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${query.search}%`, `%${query.search}%`);
    }

    if (query.category) {
      conditions.push('category = ?');
      params.push(query.category);
    }

    if (query.status) {
      conditions.push('status = ?');
      params.push(query.status);
    }

    if (query.minPrice !== undefined) {
      conditions.push('price >= ?');
      params.push(query.minPrice);
    }

    if (query.maxPrice !== undefined) {
      conditions.push('price <= ?');
      params.push(query.maxPrice);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total matching items
    const countSql = `SELECT COUNT(*) as count FROM resources ${whereClause}`;
    const countStmt = db.prepare(countSql);
    const totalRow = countStmt.get(...params) as { count: number | bigint } | undefined;
    const total = Number(totalRow?.count ?? 0);

    // Sorting & Pagination
    const allowedSortFields = ['price', 'createdAt', 'title'];
    const sortBy = allowedSortFields.includes(query.sortBy || '') ? query.sortBy : 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 'ASC' : 'DESC';

    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const offset = (page - 1) * limit;

    const dataSql = `
      SELECT * FROM resources
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const dataStmt = db.prepare(dataSql);
    const rawRows = dataStmt.all(...params, limit, offset) as unknown as Resource[];

    return {
      data: rawRows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  findById(id: number): Resource | null {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM resources WHERE id = ?');
    const row = stmt.get(id) as unknown as Resource | undefined;
    return row ?? null;
  }

  update(id: number, data: UpdateResourceDTO): Resource | null {
    const db = getDatabase();
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }
    if (data.category !== undefined) {
      fields.push('category = ?');
      values.push(data.category);
    }
    if (data.price !== undefined) {
      fields.push('price = ?');
      values.push(data.price);
    }
    if (data.status !== undefined) {
      fields.push('status = ?');
      values.push(data.status);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    const now = new Date().toISOString();
    fields.push('updatedAt = ?');
    values.push(now);

    values.push(id);

    const sql = `UPDATE resources SET ${fields.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(sql);
    const result = stmt.run(...values);

    if (Number(result.changes) === 0) {
      return null;
    }

    return this.findById(id);
  }

  delete(id: number): boolean {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM resources WHERE id = ?');
    const result = stmt.run(id);
    return Number(result.changes) > 0;
  }
}
