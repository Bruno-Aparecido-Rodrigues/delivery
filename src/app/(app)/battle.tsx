import { useState, useEffect } from 'react';
import {
    View, Text, Image, StyleSheet,
    TouchableOpacity, ActivityIndicator, Modal
} from 'react-native';
import { Colors, TYPE_COLORS } from '@/constants/colors';
import AppHeader from '@/components/app-header';
import Drawer from '@/components/drawer';
import { useAuth } from '@/context/AuthContext';
import { getTeam, capturePokemon, getStats, updateStats, PokemonData } from '@/integration/authIntegration';

const ENEMY_POOL = [
    { index: '94',  name: 'Gengar',    type: 'ghost',    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png'  },
    { index: '130', name: 'Gyarados',  type: 'water',    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png' },
    { index: '65',  name: 'Alakazam',  type: 'psychic',  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png'  },
    { index: '3',   name: 'Venusaur',  type: 'grass',    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png'   },
    { index: '59',  name: 'Arcanine',  type: 'fire',     sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png'  },
    { index: '6',   name: 'Charizard', type: 'fire',     sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png'   },
    { index: '149', name: 'Dragonite', type: 'dragon',   sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png' },
    { index: '143', name: 'Snorlax',   type: 'normal',   sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png' },
    { index: '131', name: 'Lapras',    type: 'water',    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png' },
    { index: '103', name: 'Exeggutor', type: 'grass',    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/103.png' },
    { index: '112', name: 'Rhydon',    type: 'ground',   sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/112.png' },
    { index: '76',  name: 'Golem',     type: 'rock',     sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/76.png'  },
    { index: '68',  name: 'Machamp',   type: 'fighting',  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png'  },
    { index: '34',  name: 'Nidoking',  type: 'poison',   sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/34.png'  },
    { index: '62',  name: 'Poliwrath', type: 'water',    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/62.png'  },
    { index: '151', name: 'Mew',       type: 'psychic',  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png' },
];

function pickEnemyTeam(ownedIndexes: string[]) {
    const available = ENEMY_POOL.filter(e => !ownedIndexes.includes(e.index));
    return [...available].sort(() => Math.random() - 0.5).slice(0, 5);
}

function PokemonSlot({ name, sprite, type, flip = false }: {
    name: string; sprite: string; type: string; flip?: boolean;
}) {
    const color = TYPE_COLORS[type] ?? '#A8A878';
    return (
        <View style={[styles.slot, flip && styles.slotFlip]}>
            <Image
                source={{ uri: sprite }}
                style={[styles.sprite, flip && { transform: [{ scaleX: -1 }] }]}
                resizeMode="contain"
            />
            <View style={[styles.typeBadge, { backgroundColor: color }]}>
                <Text style={styles.typeText}>{name}</Text>
            </View>
        </View>
    );
}

export default function Battle() {
    const { userId } = useAuth();
    const [drawerOpen, setDrawerOpen]           = useState(false);
    const [loading, setLoading]                 = useState(true);
    const [battling, setBattling]               = useState(false);
    const [myTeam, setMyTeam]                   = useState<PokemonData[]>([]);
    const [ownedIndexes, setOwnedIndexes]       = useState<string[]>([]);
    const [enemyTeam, setEnemyTeam]             = useState(pickEnemyTeam([]));
    const [result, setResult]                   = useState<'vitoria' | 'derrota' | null>(null);
    const [placar, setPlacar]                   = useState('');
    const [capturedPokemon, setCapturedPokemon] = useState<typeof ENEMY_POOL[0] | null>(null);
    const [modalVisible, setModalVisible]       = useState(false);
    const [erro, setErro]                       = useState('');

    async function loadMyTeam() {
        if (!userId) return;
        try {
            const data    = await getTeam(userId);
            const team    = data.team    ?? [];
            const capture = data.capture ?? [];
            const allOwned = [...team, ...capture].map(p => p.index);
            setMyTeam(team);
            setOwnedIndexes(allOwned);
            setEnemyTeam(pickEnemyTeam(allOwned));
        } catch (e) {
            console.error('[loadMyTeam]', e);
            setErro('Erro ao carregar time.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadMyTeam(); }, [userId]);

    function pokemonPower(p: PokemonData) {
        return (p.abilities ?? []).reduce((s, a) => s + a.strength, 0);
    }

    function simulateBattles(): { venceu: boolean; placar: string } {
        // Cada pokémon do meu time enfrenta o correspondente do inimigo
        // Melhor de 5 — quem ganhar 3 vence
        let vitoriasMinha = 0;
        let vitoriasInimigo = 0;

        for (let i = 0; i < 5; i++) {
            const meu    = myTeam[i];
            const inimigo = enemyTeam[i];

            const meuPoder     = (meu ? pokemonPower(meu) : 0)  * (0.8 + Math.random() * 0.4);
            const inimigosPoder = 300 * (0.8 + Math.random() * 0.4);

            if (meuPoder >= inimigosPoder) vitoriasMinha++;
            else vitoriasInimigo++;
        }

        return {
            venceu: vitoriasMinha >= 3,
            placar: `${vitoriasMinha} - ${vitoriasInimigo}`,
        };
    }

    async function handleBattle() {
        if (!userId || battling || myTeam.length === 0) return;
        setBattling(true);
        setErro('');
        setResult(null);
        setCapturedPokemon(null);

        try {
            await new Promise(res => setTimeout(res, 1500));

            const { venceu, placar } = simulateBattles();
            setResult(venceu ? 'vitoria' : 'derrota');
            setPlacar(placar);

            // Atualiza stats
            try {
                const stats = await getStats(userId);
                await updateStats(userId, {
                    level:    String(Number(stats.level)    + (venceu ? 1 : 0)),
                    vitorias: String(Number(stats.vitorias) + (venceu ? 1 : 0)),
                    derrotas: String(Number(stats.derrotas) + (venceu ? 0 : 1)),
                });
            } catch (e) {
                console.warn('[battle] updateStats falhou:', e);
            }

            // Se venceu, captura um inimigo que ainda não possui
            if (venceu) {
                const candidates = enemyTeam.filter(e => !ownedIndexes.includes(e.index));
                if (candidates.length > 0) {
                    const alvo = candidates[Math.floor(Math.random() * candidates.length)];
                    try {
                        await capturePokemon(userId, parseInt(alvo.index, 10));
                        setCapturedPokemon(alvo);
                        setOwnedIndexes(prev => [...prev, alvo.index]);
                    } catch (e) {
                        console.warn('[battle] capturePokemon falhou:', e);
                    }
                }
            }

            setModalVisible(true);
        } catch (e) {
            console.error('[handleBattle]', e);
            setErro('Erro durante a batalha. Tente novamente.');
        } finally {
            setBattling(false);
        }
    }

    function handleCloseModal() {
        setModalVisible(false);
        loadMyTeam();
    }

    if (loading) {
        return (
            <View style={styles.loadingWrapper}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Carregando time...</Text>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <AppHeader onMenuPress={() => setDrawerOpen(true)} />

            <View style={styles.arena}>

                {/* Time inimigo */}
                <View style={styles.teamSection}>
                    <Text style={styles.teamLabel}>Inimigo</Text>
                    <View style={styles.teamRow}>
                        {enemyTeam.map(p => (
                            <PokemonSlot key={p.index} name={p.name} sprite={p.sprite} type={p.type} flip />
                        ))}
                    </View>
                </View>

                {/* Botão */}
                <View style={styles.centerBlock}>
                    {erro ? <Text style={styles.erroText}>{erro}</Text> : null}
                    {myTeam.length === 0 ? (
                        <Text style={styles.semTimeText}>Monte seu time na aba Time!</Text>
                    ) : (
                        <TouchableOpacity
                            style={[styles.battleButton, battling && styles.battleButtonDisabled]}
                            activeOpacity={0.8}
                            onPress={handleBattle}
                            disabled={battling}
                        >
                            {battling
                                ? <ActivityIndicator color={Colors.white} />
                                : <Text style={styles.battleButtonText}>⚔️  BATALHAR</Text>
                            }
                        </TouchableOpacity>
                    )}
                </View>

                {/* Meu time */}
                <View style={styles.teamSection}>
                    <View style={styles.teamRow}>
                        {myTeam.map(p => (
                            <PokemonSlot key={p.index} name={p.name} sprite={p.image} type={p.types?.[0] ?? 'normal'} />
                        ))}
                    </View>
                    <Text style={styles.teamLabel}>Meu time</Text>
                </View>

            </View>

            {/* Modal resultado */}
            <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={handleCloseModal}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalEmoji}>{result === 'vitoria' ? '🏆' : '💀'}</Text>
                        <Text style={[styles.modalTitle, { color: result === 'vitoria' ? Colors.primary : '#ff525f' }]}>
                            {result === 'vitoria' ? 'VITÓRIA!' : 'DERROTA!'}
                        </Text>
                        <Text style={styles.placarText}>{placar}</Text>

                        {result === 'vitoria' && capturedPokemon && (
                            <View style={styles.captureBox}>
                                <Image source={{ uri: capturedPokemon.sprite }} style={styles.captureSprite} resizeMode="contain" />
                                <Text style={styles.captureText}>
                                    Você capturou{' '}
                                    <Text style={{ color: Colors.primary, fontWeight: '700' }}>{capturedPokemon.name}</Text>!
                                </Text>
                                <Text style={styles.captureHint}>Confira na aba Time → Box</Text>
                            </View>
                        )}
                        {result === 'vitoria' && !capturedPokemon && (
                            <Text style={styles.captureText}>Nenhum Pokémon novo desta vez.</Text>
                        )}
                        {result === 'derrota' && (
                            <Text style={styles.captureText}>Treine mais e volte mais forte!</Text>
                        )}

                        <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
                            <Text style={styles.modalButtonText}>Continuar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} currentRoute="/(app)/battle" />
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.background },

    loadingWrapper: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText:    { color: Colors.white, fontSize: 14 },

    arena: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 12,
    },

    teamSection: { alignItems: 'center', gap: 10 },
    teamLabel: {
        fontFamily: 'PkmnRBYGSC',
        fontSize: 11,
        color: '#888',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    teamRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center' },

    slot:      { alignItems: 'center', gap: 4 },
    slotFlip:  { opacity: 0.9 },
    sprite:    { width: 56, height: 56 },
    typeBadge: { paddingHorizontal: 4, paddingVertical: 2, borderRadius: 6 },
    typeText:  { color: '#fff', fontSize: 8, fontWeight: '700', textTransform: 'capitalize' },

    centerBlock:  { alignItems: 'center', gap: 12 },
    semTimeText:  { color: '#888', fontSize: 14, fontStyle: 'italic' },
    erroText:     { color: Colors.primaryAlt, fontSize: 13 },

    battleButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderBottomWidth: 5,
        borderRightWidth: 4,
        borderBottomColor: Colors.black,
        borderRightColor: Colors.black,
        minWidth: 180,
        alignItems: 'center',
    },
    battleButtonDisabled: { opacity: 0.5 },
    battleButtonText: {
        fontFamily: 'PkmnRBYGSC',
        fontSize: 18,
        color: Colors.white,
        letterSpacing: 2,
    },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
    modalBox: {
        backgroundColor: '#1e1e1e',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        gap: 16,
        width: '80%',
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    modalEmoji:    { fontSize: 48 },
    modalTitle:    { fontFamily: 'PkmnRBYGSC', fontSize: 22, letterSpacing: 2 },
    placarText:    { color: '#888', fontSize: 13, letterSpacing: 2 },
    captureBox:    { alignItems: 'center', gap: 8 },
    captureSprite: { width: 80, height: 80 },
    captureText:   { color: '#ccc', fontSize: 14, textAlign: 'center' },
    captureHint:   { color: '#666', fontSize: 11, fontStyle: 'italic' },
    modalButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginTop: 8,
    },
    modalButtonText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
});
