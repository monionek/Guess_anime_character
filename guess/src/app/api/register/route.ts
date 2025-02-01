import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { userData } from '@/utils/interfaces';

const usersFilePath = path.join(process.cwd(), 'src/dbs/users.json');

export async function POST(request: Request) {
    try {
        const newUser = await request.json();
        console.log('Received new user:', newUser);

        if (!fs.existsSync(usersFilePath)) {
            console.error('users.json file does not exist');
            return NextResponse.json({ message: 'Database file not found' }, { status: 500 });
        }

        const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
        const findUser = users.find((el: userData) => el.email === newUser.email || el.userName === newUser.userName)
        if (findUser) {
            console.log("userName or email already taken")
            return NextResponse.json({ message: 'userName or email already taken' }, { status: 400 });
        }
        users.push(newUser);

        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        console.log('User added successfully:', newUser);

        return NextResponse.json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ message: 'Failed to register user' }, { status: 500 });
    }
}