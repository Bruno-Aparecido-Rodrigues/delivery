import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

import { getPokemon } from "@/integration/pokemonIntegration";
import { Pokemon } from "@/@types/pokemon";
import PokemonCard from "@/components/pokemon-card";

export default function Pokedex() {
    const [loading, setLoading] = useState(true);
    const [pokemons, setPokemon] = useState<Pokemon[]>([]);

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
                <ActivityIndicator size="large" color="#EE4444" />
                <Text style={styles.loadingText}>Carregando Pokédex...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pokédex</Text>
            <FlatList
                data={pokemons}
                keyExtractor={(item) => item.index}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => <PokemonCard pokemon={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2a2a2a',
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
        paddingHorizontal: 16,
        paddingTop: 48,
        paddingBottom: 8,
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    listContent: {
        paddingHorizontal: 8,
        paddingBottom: 32,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#2a2a2a',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
