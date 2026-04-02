import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { PhoneInput } from '@/types/phone';

// GET single phone
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM phones WHERE id = ?',
      [params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Data tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data' },
      { status: 500 }
    );
  }
}

// PUT update phone
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      'UPDATE phones SET name = ?, phone = ? WHERE id = ?',
      [name.trim(), phone.trim(), params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Data tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Data berhasil diperbarui',
      data: { id: Number(params.id), name: name.trim(), phone: phone.trim() },
    });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui data' },
      { status: 500 }
    );
  }
}

// DELETE phone
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [result]: any = await pool.query(
      'DELETE FROM phones WHERE id = ?',
      [params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Data tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Data berhasil dihapus',
    });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus data' },
      { status: 500 }
    );
  }
}
