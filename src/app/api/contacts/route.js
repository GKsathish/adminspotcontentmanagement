import { NextResponse } from 'next/server';
import { db } from '@/app/api/db';
export async function POST(req) {
  const { name, email, phone, address, timezone } = await req.json();

  try {
    await db.query(
      'INSERT INTO contacts (name, email, phone, address, timezone) VALUES (?, ?, ?, ?, ?)', 
      [name, email, phone, address, timezone]
    );
    return NextResponse.json({ message: 'Contact added successfully' }, { status: 201 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ message: 'Error adding contact', error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const [rows] = await db.query('SELECT * FROM contacts'); // Assuming you want to fetch only active contacts

    return NextResponse.json(rows, { status: 200 }); // Use NextResponse for consistency
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ message: 'Failed to fetch contacts', error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  const { id, name, email, phone, address, timezone } = await req.json();

  try {
    const result = await db.query(
      'UPDATE contacts SET name = ?, email = ?, phone = ?, address = ?, timezone = ? WHERE id = ?', 
      [name, email, phone, address, timezone, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contact updated successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ message: 'Error updating contact', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    const result = await db.query('UPDATE contacts SET deleted_at = NOW() WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ message: 'Error deleting contact', error: error.message }, { status: 500 });
  }
}
