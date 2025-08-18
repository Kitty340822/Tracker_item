// app/api/claim/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {pool} from '@/components/bd/db'

export async function GET(req: NextRequest) {
  try {
    const result = await pool.query('SELECT * FROM claims ORDER BY id DESC');
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('GET all error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.id && typeof body.id === 'number') {
      const result = await pool.query('SELECT * FROM claims WHERE id = $1', [body.id]);
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
      }
      return NextResponse.json(result.rows[0]);
    }
    // ถ้าไม่มี id แปลว่าเป็นการสร้างใหม่
    const { company, model, serialNumber, statusId, action, time, date } = body;
    if (!company || !model || !serialNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
   const insert = await pool.query(
  'INSERT INTO claims (company, model, serial_number, status_id, action, time, date, last_update) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
  [company, model, serialNumber, statusId, action, time, date]
);
    return NextResponse.json(insert.rows[0]);
  } catch (err) {
    console.error('POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH  (req: NextRequest) {
  try {
    const { id, status_id, note, ...rest } = await req.json();
    if (!id || typeof id !== 'number') {
      return NextResponse.json({ error: 'Invalid or missing id' }, { status: 400 });
    }
    // รองรับการอัปเดต field อื่น ๆ ด้วย (เช่น action, time, date, lastUpdate)
    const fields = [];
    const values = [];
    let idx = 1;
    if (status_id !== undefined) { fields.push(`status = $${idx++}`); values.push(status_id); }
    if (note !== undefined) { fields.push(`note = $${idx++}`); values.push(note); }
    if (rest.action !== undefined) { fields.push(`action = $${idx++}`); values.push(rest.action); }
    if (rest.time !== undefined) { fields.push(`time = $${idx++}`); values.push(rest.time); }
    if (rest.date !== undefined) { fields.push(`date = $${idx++}`); values.push(rest.date); }
    if (rest.last_update !== undefined) { fields.push(`lastUpdate = $${idx++}`); values.push(rest.last_update); }
    if (fields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    values.push(id);
    const update = await pool.query(
      `UPDATE claims SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (update.rowCount === 0) {
      return NextResponse.json({ error: 'Claim not found or not updated' }, { status: 404 });
    }
    return NextResponse.json(update.rows[0]);
  } catch (err) {
    console.error('PUT error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id || typeof id !== 'number') {
      return NextResponse.json({ error: 'Invalid or missing id' }, { status: 400 });
    }
    const del = await pool.query('DELETE FROM claims WHERE id = $1 RETURNING *', [id]);
    if (del.rowCount === 0) {
      return NextResponse.json({ error: 'Claim not found or not deleted' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
