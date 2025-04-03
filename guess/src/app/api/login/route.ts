import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { userData } from '@/utils/interfaces';
import { jwtGeneration } from '@/utils/jwt';

const dbFilePath = path.join(process.cwd(), 'src/dbs/users.json');

export async function POST(request: Request) {
    try {
        const loginData = await request.json();
        console.log('Received new login request:', loginData);

        if (!fs.existsSync(dbFilePath)) {
            console.error('users.json file does not exist');
            return NextResponse.json({ message: 'Database file not found' }, { status: 500 });
        }

        const users = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
        const findUser = users.find((el: userData) => el.email === loginData.email || el.userName === loginData.userName)
        if (findUser) {
            console.log("User Logged in:", loginData.userName)
            const token = jwtGeneration(loginData.username)
            return NextResponse.json({ message: token }, { status: 200 });
        }
        return NextResponse.json({ message: 'Invalid userName or password' }, { status: 401 });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ message: 'Failed to register user' }, { status: 500 });
    }
}