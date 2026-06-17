const BASE_URL = 'https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon';

// Tipos ──────────────────────────────────────────────────────────────────

export type LoginResponse = {
    userId: string;
};

export type StatsData = {
    level: string;
    vitorias: string;
    derrotas: string;
};

export type PokemonAbility = {
    name: string;
    strength: number;
};

export type PokemonData = {
    index: string;
    name: string;
    image: string;
    types: string[];
    abilities: PokemonAbility[];
};

export type UserPokemonResponse = {
    id: string;
    userId: string;
    team: PokemonData[];
    capture: PokemonData[];
};

// A API salva o index como número puro "6", "25", "44"
function normalizeIndex(index: string): string {
    return String(parseInt(index, 10));
}

// Auth/cadasatro/login ───────────────────────────────────────────────────────────────────

export async function apiLogin(username: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${BASE_URL}/auth/v1/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    }); // vai autenticar o usuário e retornar o UUID, para ser usado em outras requisições
    if (!res.ok) throw new Error(`Login falhou: ${res.status}`);
    return res.json();
}

export async function apiRegister(username: string, password: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/auth/v1/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    }); //cria uma nova conta, se bem sucedida (201) e erro (409) se já existir usuário com esse nome
    if (res.status === 409) throw new Error('USUÁRIO JÁ EXISTE');
    if (!res.ok) throw new Error(`Registro falhou: ${res.status}`);
}

// Stats / Perfil ─────────────────────────────────────────────────────────

export async function getStats(userId: string): Promise<StatsData> {
    const res = await fetch(`${BASE_URL}/auth/v1/stats/${userId}`);
    if (!res.ok) throw new Error(`getStats falhou: ${res.status}`);
    const data = await res.json();
    return {
        level:    String(data.level    ?? 1),
        vitorias: String(data.vitorias ?? 0),
        derrotas: String(data.derrotas ?? 0),
    }; // A API retorna level, vitorias e derrotas como int e é convertido para string
}

export async function updateStats(userId: string, stats: StatsData): Promise<void> {
    const res = await fetch(`${BASE_URL}/auth/v1/stats/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            level:    Number(stats.level),
            vitorias: Number(stats.vitorias),
            derrotas: Number(stats.derrotas),
        }),
    }); // atualiza a quantidade de vitórias, derrotas e level ao fim de cada batalha
    if (!res.ok) throw new Error(`updateStats falhou: ${res.status}`);
}

// Time ───────────────────────────────────────────────────────────────────

export async function getTeam(userId: string): Promise<UserPokemonResponse> {
    const res = await fetch(`${BASE_URL}/pokemon/v1/team?user-id=${userId}`);
    if (!res.ok) throw new Error(`getTeam falhou: ${res.status}`);
    return res.json();// retorna os pokémons do time e da box(capturados) em arrays de PokemonData
}

export async function updateTeam(
    userId: string,
    removedPokemonIndex: string, // index do pokemon que sai do time
    newPokemonIndex: string       // index do pokemon que entra no time
): Promise<void> {
    const removed = normalizeIndex(removedPokemonIndex);
    const newPoke = normalizeIndex(newPokemonIndex);

    // O deploy da AWS espera body JSON com TeamUpdateRequest,
    const url = `${BASE_URL}/pokemon/v1/team?user-id=${userId}&removed-pokemon=${removed}&new-pokemon=${newPoke}`;
    console.log('[updateTeam] PUT', url); // teste para ver se tá pegando

    const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            removedPokemon: removed,
            newPokemon: newPoke,
        }),
    });

    if (!res.ok) {
        let body = '';
        try { body = await res.text(); } catch (_) {}
        console.error(`[updateTeam] ${res.status}:`, body);
        throw new Error(`updateTeam falhou: ${res.status} - ${body}`);
    }
}

// Pokémons Capturados ────────────────────────────────────────────────────

export async function capturePokemon(userId: string, pokemonId: number): Promise<void> {
    const url = `${BASE_URL}/pokemon/v1/captured?user-id=${userId}&pokemon-id=${pokemonId}`;
    console.log('[capturePokemon] PUT', url);
    const res = await fetch(url, { method: 'PUT' });
    if (!res.ok) {
        let body = '';
        try { body = await res.text(); } catch (_) {}
        throw new Error(`capturePokemon falhou: ${res.status} - ${body}`);
    } // adiciona um pokémon box de capturados
} 


// Soltar(Deletar) Pokémon (adendo: não foi implementado ainda perguntar para o prof) 
export async function releasePokemon(userId: string, pokemonIndex: string): Promise<void> {
    const url = `${BASE_URL}/pokemon/v1/captured?user-id=${userId}&pokemon-id=${normalizeIndex(pokemonIndex)}`;
    console.log('[releasePokemon] DELETE', url);
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) throw new Error(`releasePokemon falhou: ${res.status}`);
}
