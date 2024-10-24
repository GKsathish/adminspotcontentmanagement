

import { NextResponse } from 'next/server';
import { db } from '@/app/api/db';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { token } = await req.json();
  
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    await db.query('UPDATE users SET verified = TRUE WHERE id = ?', [decoded.id]);

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
  }
}
