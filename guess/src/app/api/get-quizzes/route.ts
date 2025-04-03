import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbFilePath = path.join(process.cwd(), 'src/dbs/quizes.json');

export async function GET(request: Request) {
    try {
        if (!fs.existsSync(dbFilePath)) {
            console.error('quizes.json file does not exist');
            return NextResponse.json({ message: 'Database file not found' }, { status: 500 });
        }

        const quizes = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));

        return NextResponse.json(quizes, { status: 200 });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ message: 'Failed to register quiz' }, { status: 500 });
    }
}
