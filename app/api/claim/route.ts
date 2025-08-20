// app/api/claim/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { claims } from '@/db/schema'
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Schema สำหรับ validation
const claimSchema = z.object({
  company: z.string().min(1),
  model: z.string().min(1),
  serial_number: z.string().min(1),
  status_id: z.number().optional(),
  action: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
});

export async function GET() {
  try {
    const result = await db.select().from(claims);
    return NextResponse.json(result);
  } catch (err) {
    console.error('GET all error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ถ้า body มี id → ค้นหาข้อมูล
    if (body.id && typeof body.id === 'number') {
      const result = await db.select().from(claims).where(eq(claims.id, body.id));
      if (result.length === 0) {
        return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
      }
      return NextResponse.json(result[0]);
    }

    // Validate input
    const validation = claimSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', validationErrors: validation },
        { status: 400 }
      );
    }

    const { company, model, serial_number, status_id, action, time, date } = validation.data;

    // สร้าง record ใหม่ (ไม่ต้องระบุ id เพราะเป็น serial)
    const inserted = await db
      .insert(claims)
      .values({
        company,
        model,
        serial_number,
        status_id: status_id || 1, // กำหนด default status
        action: action || null,
        time: time || null,
        date: date ? new Date(date) : new Date(),})
      .returning();

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (err) {
    console.error('POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id || typeof id !== 'number') {
      return NextResponse.json({ error: 'Invalid or missing id' }, { status: 400 });
    }

    // ตรวจสอบว่ามี field ที่จะ update หรือไม่
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // อัปเดต last_update อัตโนมัติ
    const updateData = {
      ...updates,
      last_update: new Date()
    };

    const updated = await db
      .update(claims)
      .set(updateData)
      .where(eq(claims.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Claim not found or not updated' }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (err) {
    console.error('PATCH error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id || typeof id !== 'number') {
      return NextResponse.json({ error: 'Invalid or missing id' }, { status: 400 });
    }

    const deleted = await db
      .delete(claims)
      .where(eq(claims.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Claim not found or not deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}