import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

import { getPokemon } from "@/integration/pokemonIntegration";
import { Pokemon } from "@/@types/pokemon";
import PokemonList from "@/components/pokemon-list";

export default function Pokedex() {
    const [loading, setLoading] = useState(true);
    const [pokemons, setPokemon] = useState<Pokemon[]>([]);

    const [fontsLoaded] = useFonts({
        PkmnRBYGSC: require('../../assets/fonts/PKMN RBYGSC.ttf'),
    });

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

    if (loading || !fontsLoaded) {
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
            <PokemonList pokemons={pokemons} />
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
        fontFamily: 'PkmnRBYGSC',
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
