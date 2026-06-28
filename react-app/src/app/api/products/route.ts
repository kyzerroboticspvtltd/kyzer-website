import { NextResponse } from 'next/server';
import { getMergedProducts } from '@/lib/getProducts';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await getMergedProducts();
  return NextResponse.json({ ok: true, products });
}
