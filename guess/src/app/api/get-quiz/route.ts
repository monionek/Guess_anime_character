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

        const url = new URL(request.url);
        const title = url.searchParams.get('title');

        const quizes = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));

        if (title) {
            const quiz = quizes.find((q: { quizTitle: string }) => q.quizTitle.toLowerCase() === title.toLowerCase());

            if (!quiz) {
                return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
            }

            return NextResponse.json(quiz, { status: 200 });
        }

        return NextResponse.json(quizes, { status: 200 });

    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ message: 'Failed to fetch quiz data' }, { status: 500 });
    }
}