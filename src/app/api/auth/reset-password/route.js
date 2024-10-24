
import { NextResponse } from 'next/server';
import { db } from '@/app/api/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { token, newPassword } = await req.json();

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, decoded.id]);

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
  }
}
