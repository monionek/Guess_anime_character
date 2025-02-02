import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'src/dbs/leaderboard.json');

export async function POST(request: Request) {
    try {
        const gameData = await request.json();
        console.log('Received new login request:', gameData);

        if (!fs.existsSync(usersFilePath)) {
            console.error('leaderboard.json file does not exist');
            return NextResponse.json({ message: 'Database file not found' }, { status: 500 });
        }

        const leaderboard = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
        leaderboard.push(gameData);

        fs.writeFileSync(usersFilePath, JSON.stringify(leaderboard, null, 2));

        console.log('Leaderboard updated successfully:', gameData);

        return NextResponse.json({ message: 'Leaderboard updated successfully', data: gameData }, { status: 200 });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ message: 'Failed to register user' }, { status: 500 });
    }
}
