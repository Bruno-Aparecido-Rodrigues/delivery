import { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, TYPE_COLORS } from '@/constants/colors';
import AppHeader from '@/components/app-header';
import Drawer from '@/components/drawer';

const MY_TEAM = [
    { id: '006', name: 'Charizard',  type: 'fire',     sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png'   },
    { id: '025', name: 'Pikachu',    type: 'electric', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'  },
    { id: '131', name: 'Lapras',     type: 'water',    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png' },
    { id: '149', name: 'Dragonite',  type: 'dragon',   sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png' },
    { id: '143', name: 'Snorlax',    type: 'normal',   sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png' },
];

const ENEMY_TEAM = [
    { id: '094', name: 'Gengar',     type: 'ghost',    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png'  },
    { id: '130', name: 'Gyarados',   type: 'water',    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png' },
    { id: '065', name: 'Alakazam',   type: 'psychic',  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png'  },
    { id: '003', name: 'Venusaur',   type: 'grass',    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png'   },
    { id: '059', name: 'Arcanine',   type: 'fire',     sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png'  },
];

function PokemonSlot({ pokemon, flip = false }: { pokemon: typeof MY_TEAM[0]; flip?: boolean }) {
    const color = TYPE_COLORS[pokemon.type] ?? '#A8A878';
    return (
        <View style={[styles.slot, flip && styles.slotFlip]}>
            <Image
                source={{ uri: pokemon.sprite }}
                style={[styles.sprite, flip && { transform: [{ scaleX: -1 }] }]}
                resizeMode="contain"
            />
            <View style={[styles.typeBadge, { backgroundColor: color }]}>
                <Text style={styles.typeText}>{pokemon.name}</Text>
            </View>
        </View>
    );
}

export default function Battle() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <View style={styles.root}>
            <AppHeader onMenuPress={() => setDrawerOpen(true)} />

            <View style={styles.arena}>

                {/* Time inimigo */}
                <View style={styles.teamSection}>
                    <Text style={styles.teamLabel}>Inimigo</Text>
                    <View style={styles.teamRow}>
                        {ENEMY_TEAM.map(p => <PokemonSlot key={p.id} pokemon={p} flip />)}
                    </View>
                </View>

                {/* Botão batalhar */}
                <TouchableOpacity style={styles.battleButton} activeOpacity={0.8}>
                    <Text style={styles.battleButtonText}>⚔️  BATALHAR</Text>
                </TouchableOpacity>

                {/* Meu time */}
                <View style={styles.teamSection}>
                    <View style={styles.teamRow}>
                        {MY_TEAM.map(p => <PokemonSlot key={p.id} pokemon={p} />)}
                    </View>
                    <Text style={styles.teamLabel}>Meu time</Text>
                </View>

            </View>

            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                currentRoute="/(app)/battle"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.background },

    arena: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 12,
    },

    teamSection: {
        alignItems: 'center',
        gap: 10,
    },
    teamLabel: {
        fontFamily: 'PkmnRBYGSC',
        fontSize: 11,
        color: '#888',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    teamRow: {
        flexDirection: 'row',
        gap: 6,
    },

    slot: {
        alignItems: 'center',
        gap: 4,
    },
    slotFlip: {
        opacity: 0.9,
    },
    sprite: {
        width: 56,
        height: 56,
    },
    typeBadge: {
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 6,
    },
    typeText: {
        color: '#fff',
        fontSize: 8,
        fontWeight: '700',
        textTransform: 'capitalize',
    },

    battleButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 0,
        borderBottomWidth: 5,
        borderRightWidth: 4,
        borderBottomColor: Colors.black,
        borderRightColor: Colors.black,
    },
    battleButtonText: {
        fontFamily: 'PkmnRBYGSC',
        fontSize: 18,
        color: Colors.white,
        letterSpacing: 2,
    },
});