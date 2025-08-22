{ NextResponse, NextRequest } from 'next/server';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs'; // เพิ่มสำหรับ hash password

export async function GET(req: NextRequest){
    try {
        const allusers = await db.select().from(users);
        return NextResponse.json(allusers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, password, email, email_verified, phone, role_permission } = body;

        // Validation
        if (!name || !password || !email) {
            return NextResponse.json(
                { error: 'Name, email and password are required' }, 
                { status: 400 }
            );
        }

        // ตรวจสอบว่ามี email นี้อยู่แล้วหรือไม่
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser.length > 0) {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 409 }
            );
        }

        // Hash password ก่อนเก็บ
        const hashedPassword = await bcrypt.hash(password, 12);

        // สร้าง user ใหม่ (ไม่ต้องส่ง user_id เพราะเป็น serial)
        const newUser = await db
            .insert(users)
            .values({ 
                name, 
                password: hashedPassword, 
                email,
                email_verified: email_verified || null,
                phone: phone || null,
                role_permission: role_permission || 'user' // กำหนด default role
            })
            .returning();

        return NextResponse.json(newUser[0], { status: 201 });

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}