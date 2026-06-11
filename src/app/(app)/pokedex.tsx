import { useState } from 'react';
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { getPokemon } from '@/integration/pokemonIntegration';
import { Pokemon } from '@/@types/pokemon';
import PokemonList from '@/components/pokemon-list';
import { Colors } from '@/constants/colors';
import AppHeader from '@/components/app-header';
import Drawer from '@/components/drawer';

export default function Pokedex() {
    const [loading, setLoading] = useState(true);
    const [pokemons, setPokemon] = useState<Pokemon[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getPokemon(151);
                setPokemon(data);
            } catch (e) {
                console.error('Erro ao carregar pokemons:', e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Carregando Pokédex...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader onMenuPress={() => setDrawerOpen(true)} />
            <Text style={styles.pageTitle}>Pokedex</Text>
            <PokemonList pokemons={pokemons} />
            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                currentRoute="/(app)/pokedex"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    pageTitle: {
        fontFamily: 'PkmnRBYGSC',
        fontSize: 14,
        color: Colors.white,
        letterSpacing: 1,
        textTransform: 'uppercase',
        textAlign: 'center',
        paddingVertical: 12,
        backgroundColor: Colors.background,
    },
});
