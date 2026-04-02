import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { PhoneInput } from '@/types/phone';

// GET all phones
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM phones ORDER BY id DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data' },
      { status: 500 }
    );
  }
}

// POST create new phone
export async function POST(request: NextRequest) {
  try {
    const body: PhoneInput = await request.json();
    const { name, phone } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: 'Nama dan nomor telepon wajib diisi' },
        { status: 400 }
      );
    }

    const [result]: any = await pool.query(
      'INSERT INTO phones (name, phone) VALUES (?, ?)',
      [name.trim(), phone.trim()]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Data berhasil ditambahkan',
        data: { id: result.insertId, name: name.trim(), phone: phone.trim() },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan data' },
      { status: 500 }
    );
  }
}
