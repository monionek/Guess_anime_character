import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { userData } from '@/utils/interfaces';

const dbFilePath = path.join(process.cwd(), 'src/dbs/users.json');

export async function DELETE(request: Request) {
    try {
        const data = await request.json();
        const userName = data.userName;

        if (!userName) {
            return NextResponse.json({ message: 'userName is required' }, { status: 400 });
        }

        if (!fs.existsSync(dbFilePath)) {
            console.error('users.json file does not exist');
            return NextResponse.json({ message: 'Database file not found' }, { status: 500 });
        }

        const users: userData[] = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));

        const userToDelete = users.find((el: userData) => el.userName === userName);

        if (!userToDelete) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const indexToDelete = users.indexOf(userToDelete);
        if (indexToDelete !== -1) {
            users.splice(indexToDelete, 1);

            fs.writeFileSync(dbFilePath, JSON.stringify(users, null, 2));

            return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
        }

        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
    }
}