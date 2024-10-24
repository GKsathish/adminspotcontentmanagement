import { NextResponse } from 'next/server';
import { db } from '@/app/api/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Query the user based on the email provided
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    // Check if the user exists and validate the password
    if (!users || users.length === 0 || !(await bcrypt.compare(password, users[0].password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate a JWT token with a secret key and set its expiration
    const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token as JSON
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
