import { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Colors, TYPE_COLORS } from '@/constants/colors';
import AppHeader from '@/components/app-header';
import Drawer from '@/components/drawer';

const PARTY = [
    { id: '006', name: 'Charizard',  type: 'fire',     sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',   level: 72 },
    { id: '025', name: 'Pikachu',    type: 'electric', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',  level: 65 },
    { id: '131', name: 'Lapras',     type: 'water',    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png', level: 60 },
    { id: '149', name: 'Dragonite',  type: 'dragon',   sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png', level: 68 },
    { id: '143', name: 'Snorlax',    type: 'normal',   sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png', level: 55 },
];

const BOX: typeof PARTY = [];

type PokemonSlot = typeof PARTY[0];

function PartySlot({ pokemon }: { pokemon: PokemonSlot }) {
    const color = TYPE_COLORS[pokemon.type] ?? '#A8A878';
    return (
        <View style={[styles.partySlot, { borderColor: color }]}>
            <Image source={{ uri: pokemon.sprite }} style={styles.partySprite} resizeMode="contain" />
            <Text style={styles.partyName} numberOfLines={1}>{pokemon.name}</Text>
            <View style={[styles.partyTypeBadge, { backgroundColor: color }]}>
                <Text style={styles.partyTypeText}>{pokemon.type}</Text>
            </View>
            <Text style={styles.partyLevel}>Lv.{pokemon.level}</Text>
        </View>
    );
}

export default function Team() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <View style={styles.root}>
            <AppHeader onMenuPress={() => setDrawerOpen(true)} />

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Party */}
                <View style={styles.partySection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.pageTitle}>Time</Text>
                        <Text style={styles.sectionCount}>{PARTY.length}/5</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.partyScroll}
                    >
                        {PARTY.map((p) => <PartySlot key={p.id} pokemon={p} />)}
                    </ScrollView>
                </View>

                {/* Box */}
                <View style={styles.boxSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>📦 Box</Text>
                        <Text style={styles.sectionCount}>{BOX.length} capturados</Text>
                    </View>
                    {BOX.length === 0 && (
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyBoxText}>Nenhum Pokémon na box ainda.</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                currentRoute="/(app)/team"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.background },
    scroll: { flex: 1 },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    pageTitle: {
        fontFamily: 'PkmnRBYGSC',
        fontSize: 14,
        color: Colors.white,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    sectionCount: {
        color: '#999',
        fontSize: 13,
    },

    partySection: {
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#1e1e1e',
        borderBottomWidth: 2,
        borderBottomColor: '#CC0000',
    },
    partyScroll: {
        gap: 10,
        paddingRight: 8,
    },
    partySlot: {
        width: 100,
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        borderWidth: 1.5,
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 6,
        gap: 4,
    },
    partySprite: { width: 64, height: 64 },
    partyName: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'capitalize',
        textAlign: 'center',
    },
    partyTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    partyTypeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    partyLevel: {
        color: '#aaa',
        fontSize: 11,
    },

    boxSection: {
        flex: 1,
        padding: 16,
        paddingBottom: 40,
    },
    emptyBox: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    emptyBoxText: {
        color: '#555',
        fontSize: 14,
        fontStyle: 'italic',
    },
});
