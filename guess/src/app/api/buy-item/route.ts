import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { userData, shopItem } from '@/utils/interfaces';

const dbFilePath = path.join(process.cwd(), 'src/dbs/users.json');

export async function PATCH(request: Request) {
    try {
        const data = await request.json();
        const { userName, shopItem } = data;
        const { itemType } = shopItem;
        if (!fs.existsSync(dbFilePath)) {
            console.error('users.json file does not exist');
            return NextResponse.json({ message: 'Database file not found' }, { status: 500 });
        }
        const users: userData[] = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
        const findUser = users.find((user) => user.userName === userName);
        if (!findUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        switch (itemType) {
            case 'profile':
                if (findUser.profileIcon === shopItem.emoji) {
                    return NextResponse.json({ message: 'Profile icon taken' }, { status: 400 });
                }
                findUser.profileIcon = shopItem.emoji;
                break;
            case 'badge':
                if (!findUser.badges.some((badge) => badge.id === shopItem.id)) {
                    findUser.badges.push(shopItem);
                } else {
                    return NextResponse.json({ message: 'Badge already owned' }, { status: 400 });
                }
                break;
            default:
                return NextResponse.json({ message: 'Invalid item type' }, { status: 400 });
        }
        fs.writeFileSync(dbFilePath, JSON.stringify(users, null, 2));

        return NextResponse.json({ message: 'Item purchased successfully', user: findUser }, { status: 200 });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ message: 'Failed to buy item' }, { status: 500 });
    }
}
