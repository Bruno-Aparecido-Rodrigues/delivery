import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { getPokemon } from "@/integration/pokemonIntegration";
import { Pokemon } from "@/@types/pokemon";
import PokemonList from "@/components/pokemon-list";
import { Colors } from "@/constants/colors";

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
                <ActivityIndicator size="large" color={Colors.primary} />
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
        backgroundColor: Colors.background,
    },
    title: {
        color: Colors.white,
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
});
