import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { quizData } from '@/utils/interfaces';

const dbFilePath = path.join(process.cwd(), 'src/dbs/quizes.json');

export async function POST(request: Request) {
    try {
        const quizData = await request.json();
        console.log('Received new login request:', quizData);

        if (!fs.existsSync(dbFilePath)) {
            console.error('quizes.json file does not exist');
            return NextResponse.json({ message: 'Database file not found' }, { status: 500 });
        }

        const quizes = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
        const findQuiz = quizes.find((el: quizData) => el.quizTitle === quizData.quizTitle)
        if (findQuiz) {
            return NextResponse.json({ message: 'QuizTiitle Taken' }, { status: 401 });
        }
        quizes.push(quizData);

        fs.writeFileSync(dbFilePath, JSON.stringify(quizes, null, 2));

        console.log('Quizes updated successfully:', quizData);

        return NextResponse.json({ message: 'Quizes updated successfully', data: quizData }, { status: 200 });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ message: 'Failed to register quiz' }, { status: 500 });
    }
}
