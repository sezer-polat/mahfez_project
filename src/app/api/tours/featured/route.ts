import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const dynamic = 'force-dynamic';

// GET /api/tours/featured - Öne çıkan turları getir
export async function GET() {
  // Kategori adıyla birlikte öne çıkan turları çek
  const result = await pool.query(`
    SELECT t.*, c.name as category_name
    FROM "Tour" t
    LEFT JOIN "Category" c ON t."categoryId" = c.id
    WHERE t."isActive" = true
    ORDER BY t."createdAt" DESC
    LIMIT 3
  `);
  const data = result.rows.map(row => ({
    ...row,
    category: row.category_name ? { name: row.category_name } : null,
  }));

  return NextResponse.json(data);
} 