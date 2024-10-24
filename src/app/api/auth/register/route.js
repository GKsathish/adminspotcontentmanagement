

import { NextResponse } from 'next/server';
import { db } from '@/app/api/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { username, email, password } = await req.json();
  
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    // Send verification email logic here...
    
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error registering user', error }, { status: 500 });
  }
}
