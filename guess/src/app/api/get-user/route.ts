import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { userData } from '@/utils/interfaces';

const dbFilePath = path.join(process.cwd(), 'src/dbs/users.json');

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const userName = data.userName
        if (!fs.existsSync(dbFilePath)) {
            console.error('users.json file does not exist');
            return NextResponse.json({ message: 'Database file not found' }, { status: 500 });
        }

        const users = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
        const findUser = users.find((el: userData) => el.userName === userName)
        if (findUser) {
            return NextResponse.json(findUser, { status: 200 });
        }
        return NextResponse.json({ message: 'Invalid userName' }, { status: 401 });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ message: 'Failed to register user' }, { status: 500 });
    }
}