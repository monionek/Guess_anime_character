import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Generate a random number between 1 and 100 (reduced to avoid missing data)
        const randomAnimeId = Math.floor(Math.random() * 100) + 1;

        // Fetch characters for the random anime ID
        const response = await fetch(`https://api.jikan.moe/v4/anime/${randomAnimeId}/characters`);

        if (!response.ok) {
            console.error("Failed to fetch characters:", response.status, response.statusText);
            return NextResponse.json({ message: 'Failed to fetch characters from Jikan API' }, { status: response.status });
        }

        const result = await response.json();
        const characters = result.data;

        if (!Array.isArray(characters) || characters.length === 0) {
            return NextResponse.json({ message: 'No characters found' }, { status: 404 });
        }

        // Filter out main characters
        const mainCharacters = characters.filter(character => character.role === "Main");

        if (mainCharacters.length === 0) {
            return NextResponse.json({ message: 'No main characters found for this anime' }, { status: 404 });
        }

        // Pick a random main character
        const randomCharacter = mainCharacters[Math.floor(Math.random() * mainCharacters.length)];
        const characterId = randomCharacter.character?.mal_id;

        if (!characterId) {
            return NextResponse.json({ message: 'Invalid character ID' }, { status: 500 });
        }

        // Fetch full character details
        const characterResponse = await fetch(`https://api.jikan.moe/v4/characters/${characterId}/full`);
        if (!characterResponse.ok) {
            console.error("Failed to fetch character details:", characterResponse.status, characterResponse.statusText);
            return NextResponse.json({ message: 'Failed to fetch character details' }, { status: characterResponse.status });
        }

        const characterData = await characterResponse.json();
        const characterDetails = characterData.data;

        // Process character name
        let characterName = characterDetails.name || "Unknown";
        if (characterName.includes(',')) {
            characterName = characterName.split(',')[0].trim(); // Take only the first part before the comma
        }

        // Fetch anime details to get the anime title
        const animeResponse = await fetch(`https://api.jikan.moe/v4/anime/${randomAnimeId}`);
        let animeTitle = "Unknown Anime";

        if (animeResponse.ok) {
            const animeData = await animeResponse.json();
            animeTitle = animeData.data?.title || "Unknown Anime";
        }

        // Prepare final response
        return NextResponse.json({
            name: characterName,
            image_url: characterDetails.images?.jpg?.image_url || "",
            about: characterDetails.about || "No description available",
            animeTitle, // Anime title associated with the character
        }, { status: 200 });

    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ message: 'Failed to fetch character data' }, { status: 500 });
    }
}