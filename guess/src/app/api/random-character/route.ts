import { NextResponse } from 'next/server';

const fetchWithRetry = async (url: string, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    throw new Error('Failed to fetch data after retries');
};

export async function GET(request: Request) {
    try {
        // Fetch top anime list
        const topAnimeResponse = await fetchWithRetry('https://api.jikan.moe/v4/top/anime');
        if (!topAnimeResponse.ok) {
            console.error("Failed to fetch top anime:", topAnimeResponse.status, topAnimeResponse.statusText);
            return NextResponse.json({ message: 'Failed to fetch top anime from Jikan API' }, { status: topAnimeResponse.status });
        }

        const topAnimeData = await topAnimeResponse.json();
        const topAnimeList = topAnimeData.data;

        if (!Array.isArray(topAnimeList) || topAnimeList.length === 0) {
            return NextResponse.json({ message: 'No top anime found' }, { status: 404 });
        }

        // Select a random anime from the top anime list
        const randomAnime = topAnimeList[Math.floor(Math.random() * topAnimeList.length)];
        const randomAnimeId = randomAnime.mal_id;

        if (!randomAnimeId) {
            return NextResponse.json({ message: 'Invalid anime data' }, { status: 500 });
        }

        // Fetch characters and anime details in parallel
        const [charactersResponse, animeResponse] = await Promise.all([
            fetchWithRetry(`https://api.jikan.moe/v4/anime/${randomAnimeId}/characters`),
            fetchWithRetry(`https://api.jikan.moe/v4/anime/${randomAnimeId}`)
        ]);

        if (!charactersResponse.ok) {
            console.error("Failed to fetch characters:", charactersResponse.status, charactersResponse.statusText);
            return NextResponse.json({ message: 'Failed to fetch characters from Jikan API' }, { status: charactersResponse.status });
        }

        if (!animeResponse.ok) {
            console.error("Failed to fetch anime details:", animeResponse.status, animeResponse.statusText);
            return NextResponse.json({ message: 'Failed to fetch anime details' }, { status: animeResponse.status });
        }

        const charactersData = await charactersResponse.json();
        const characters = charactersData.data;

        if (!Array.isArray(characters) || characters.length === 0) {
            return NextResponse.json({ message: 'No characters found' }, { status: 404 });
        }

        // Filter main characters
        const mainCharacters = characters.filter(character => character.role === "Main");

        if (mainCharacters.length === 0) {
            return NextResponse.json({ message: 'No main characters found for this anime' }, { status: 404 });
        }

        // Select a random main character
        const randomCharacter = mainCharacters[Math.floor(Math.random() * mainCharacters.length)];
        const characterId = randomCharacter.character?.mal_id;

        if (!characterId) {
            return NextResponse.json({ message: 'Invalid character ID' }, { status: 500 });
        }

        // Fetch character details
        const characterResponse = await fetchWithRetry(`https://api.jikan.moe/v4/characters/${characterId}/full`);
        if (!characterResponse.ok) {
            console.error("Failed to fetch character details:", characterResponse.status, characterResponse.statusText);
            return NextResponse.json({ message: 'Failed to fetch character details' }, { status: characterResponse.status });
        }

        // Parse character and anime details
        const characterData = await characterResponse.json();
        const characterDetails = characterData.data;

        const animeDataDetails = await animeResponse.json();
        const animeTitle = animeDataDetails.data?.title || "Unknown Anime";

        // Format character name
        let characterName = characterDetails.name || "Unknown";
        if (characterName.includes(',')) {
            characterName = characterName.split(',')[0].trim();
        }

        // Format character description
        const aboutText = characterDetails.about && characterDetails.about.trim()
            ? characterDetails.about
            : "No description available";

        const cleanAbout = aboutText.replace(/\(.*?\)/g, '') // Remove text in parentheses
            .replace(/\[.*?\]/g, '') // Remove text in square brackets
            .replace(/<.*?>/g, '')  // Remove HTML tags
            .trim();

        // Return the response
        return NextResponse.json({
            name: characterName,
            image_url: characterDetails.images?.jpg?.image_url || "",
            about: cleanAbout,
            animeTitle
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error in API route:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        return NextResponse.json({ message: 'Failed to fetch character data' }, { status: 500 });
    }
}