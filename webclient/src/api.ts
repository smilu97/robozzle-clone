import { apiHost } from './constant';

export async function myFetchGet(path: string) {
    const response = await fetch(apiHost + path);
    const body = response.json();
    return body;
}

export async function fetchPuzzleList() {
    return myFetchGet('puzzles');   
}

export async function fetchPuzzle(puzzleName: string) {
    return myFetchGet(`puzzle/${puzzleName}`);
}
