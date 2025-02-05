import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { userData } from '@/utils/interfaces';

const dbFilePath = path.join(process.cwd(), 'src/dbs/users.json');

export async function PATCH(request: Request) {
    try {
        const data = await request.json();
        const userName = data.userName;
        const pointsValue = data.points;
        console.log(data)

        if (!userName || typeof pointsValue !== 'number') {
            return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
        }

        if (!fs.existsSync(dbFilePath)) {
            console.error('users.json file does not exist');
            return NextResponse.json({ message: 'Database file not found' }, { status: 500 });
        }

        const users: userData[] = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));

        const findUser = users.find((el: userData) => el.userName === userName);
        if (!findUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        findUser.points = pointsValue;

        fs.writeFileSync(dbFilePath, JSON.stringify(users, null, 2));

        return NextResponse.json({ message: "Points updated" }, { status: 200 });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ message: 'Failed to update user points' }, { status: 500 });
    }
}