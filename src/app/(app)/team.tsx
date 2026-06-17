import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors, TYPE_COLORS } from '@/constants/colors';
import AppHeader from '@/components/app-header';
import Drawer from '@/components/drawer';
import { useAuth } from '@/context/AuthContext';
import { getTeam, updateTeam, PokemonData } from '@/integration/authIntegration';

function typeColor(types: string[]): string { 
    return TYPE_COLORS[types?.[0]] ?? '#A8A878';
}

function PokemonSlot({ pokemon, isSelected, onPress, showDot, disabled }: { // Componente de slot de Pokémon
    pokemon: PokemonData;
    isSelected: boolean;
    showDot?: boolean;
    disabled?: boolean;
    onPress: () => void;
}) {
    const color = typeColor(pokemon.types);
    return (
        <TouchableOpacity // Pressiona para selecionar o Pokémon, desabilitado durante a troca
            onPress={onPress}
            activeOpacity={disabled ? 1 : 0.75}
            style={[
                styles.slot,
                { borderColor: isSelected ? '#fff' : color },
                isSelected && styles.slotSelected,
                disabled && styles.slotDisabled,
            ]}
        >
            {showDot && <View style={styles.teamDot} />}
            <Image source={{ uri: pokemon.image }} style={styles.sprite} resizeMode="contain" />
            <Text style={styles.slotName} numberOfLines={1}>{pokemon.name}</Text>
            <View style={[styles.typeBadge, { backgroundColor: color }]}>
                <Text style={styles.typeText}>{pokemon.types?.[0]}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default function Team() {
    const { userId } = useAuth();
    const [drawerOpen, setDrawerOpen]           = useState(false);
    const [loading, setLoading]                 = useState(true);
    const [swapping, setSwapping]               = useState(false);
    const [team, setTeam]                       = useState<PokemonData[]>([]);
    const [captured, setCaptured]               = useState<PokemonData[]>([]);
    const [selected, setSelected]               = useState<PokemonData | null>(null);
    const [selectedSection, setSelectedSection] = useState<'team' | 'box' | null>(null);
    const [erro, setErro]                       = useState('');

    async function loadTeam() { // Carrega o time e os pokémons capturados do usuário
        if (!userId) return;
        try {
            const data = await getTeam(userId);
            console.log('[getTeam] data:', JSON.stringify(data));
            const teamList = data.team ?? [];
            setTeam(teamList);
           
            const teamIndexes = new Set(teamList.map(p => p.index));  // Remove da box pokémons que já estão no time
            setCaptured((data.capture ?? []).filter(p => !teamIndexes.has(p.index)));
        } catch (e) {
            console.error('[loadTeam]', e);
            setErro('Erro ao carregar time.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadTeam(); }, [userId]); // Recarrega o time sempre que o userId mudar

    function clearSelection() { // Limpa a seleção atual
        setSelected(null);
        setSelectedSection(null);
    }

    async function handlePress(pokemon: PokemonData, section: 'team' | 'box') {
        if (!userId || swapping) return;
        setErro('');

        // Nenhum selecionado,  seleciona
        if (!selected) {
            setSelected(pokemon);
            setSelectedSection(section);
            return;
        }

        // Clicou no mesmo, deseleciona
        if (selected.index === pokemon.index) {
            clearSelection();
            return;
        }

        // Dois do time ou dois da box,  apenas muda seleção
        if (selectedSection === section) {
            setSelected(pokemon);
            setSelectedSection(section);
            return;
        }

        // Realiza a troca do time com a box,  chama API
        // removed-pokemon = quem sai do time   new-pokemon = quem entra no time
        const teamPokemon     = selectedSection === 'team' ? selected : pokemon;
        const capturedPokemon = selectedSection === 'team' ? pokemon  : selected;

        setSwapping(true);
        // Atualiza o time localmente mantendo a posição do pokémon trocado
        const teamIndex = team.findIndex(p => p.index === teamPokemon.index);
        setTeam(prev => {
            const next = [...prev];
            next[teamIndex] = capturedPokemon;
            return next;
        });
        setCaptured(prev => prev.map(p => p.index === capturedPokemon.index ? teamPokemon : p));
        try {
            await updateTeam(userId, teamPokemon.index, capturedPokemon.index);
        } catch (e) {
            // Reverte em caso de erro
            await loadTeam();
            console.error('[handlePress] updateTeam error:', e);
            setErro('Erro ao trocar Pokémon. Tente novamente.');
        } finally {
            setSwapping(false);
            clearSelection();
        }
    }

    if (loading) { // Tela de loading enquanto o time é carregado
        return (
            <View style={styles.loadingWrapper}>
                <Image source={require('../../../assets/images/redrunning.gif')}style={{ width: 256, height: 256 }}/>
                <Text style={styles.loadingText}>Carregando time...</Text>
            </View>
        );
    }

    const hintMessage = selected // Se um Pokémon está clickado, mostra a dica de onde ele pode ser trocado
        ? selectedSection === 'team'
            ? `Toque em um Pokémon da Box para trocar com `
            : `Toque em um Pokémon do Time para trocar com `
        : null;

    return (// Tela principal do time, exibe o time, a box de capturados, mensagens de erro e a drawer
        <View style={styles.root}>
            <AppHeader onMenuPress={() => setDrawerOpen(true)} />

            {swapping && (
                <View style={styles.swapOverlay}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                    <Text style={styles.swapText}>Trocando Pokémon...</Text>
                </View>
            )}

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Time */}
                <View style={styles.partySection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.pageTitle}>Time</Text>
                        <Text style={styles.sectionCount}>{team.length}/5</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.partyScroll}>
                        {team.map(p => (
                            <PokemonSlot
                                key={p.index}
                                pokemon={p}
                                isSelected={selected?.index === p.index}
                                showDot
                                disabled={swapping}
                                onPress={() => handlePress(p, 'team')}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Box */}
                <View style={styles.boxSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>📦 Box</Text>
                        <Text style={styles.sectionCount}>{captured.length} capturados</Text>
                    </View>

                    {captured.length === 0 ? (
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyBoxText}>Nenhum Pokémon na box ainda.</Text>
                            <Text style={styles.emptyBoxSub}>Vença batalhas para capturar Pokémons e trocar com seu time!</Text>
                        </View>
                    ) : (
                        <View style={styles.boxGrid}>
                            {captured.map(p => (
                                <PokemonSlot
                                    key={p.index}
                                    pokemon={p}
                                    isSelected={selected?.index === p.index}
                                    disabled={swapping}
                                    onPress={() => handlePress(p, 'box')}
                                />
                            ))}
                        </View>
                    )}

                    {selected && hintMessage && (
                        <View style={[
                            styles.hint,
                            selectedSection === 'team' ? styles.hintTeam : styles.hintBox
                        ]}>
                            <Text style={styles.hintText}>
                                {hintMessage}
                                <Text style={{ color: '#fff', fontWeight: '700' }}>{selected.name}</Text>
                            </Text>
                        </View>
                    )}

                    {erro ? <Text style={styles.erroText}>{erro}</Text> : null}
                </View>

            </ScrollView>

            <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} currentRoute="/(app)/team" />
        </View>
    );
}

const styles = StyleSheet.create({
    root:   { flex: 1, backgroundColor: Colors.background },
    scroll: { flex: 1 },

    loadingWrapper: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontFamily: 'PkmnRBYGSC', color: Colors.white,  fontSize: 16},

    swapOverlay: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1a1a1a', paddingVertical: 6 },
    swapText:    { color: Colors.primary, fontSize: 12 },

    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    pageTitle:    { fontFamily: 'PkmnRBYGSC', fontSize: 14, color: Colors.white, letterSpacing: 1, textTransform: 'uppercase' },
    sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
    sectionCount: { color: '#999', fontSize: 13 },

    partySection: {
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#1e1e1e',
        borderBottomWidth: 2,
        borderBottomColor: Colors.primary,
    },
    partyScroll: { gap: 10, paddingRight: 8 },

    boxSection: { flex: 1, padding: 16, paddingBottom: 40, gap: 12 },
    boxGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

    slot: {
        width: 100,
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        borderWidth: 1.5,
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 6,
        gap: 4,
        position: 'relative',
    },
    slotSelected: { backgroundColor: '#3a3a3a', elevation: 8 },
    slotDisabled: { opacity: 0.5 },
    teamDot: {
        position: 'absolute',
        top: 6, right: 6,
        width: 7, height: 7,
        borderRadius: 4,
        backgroundColor: Colors.primary,
    },
    sprite:    { width: 72, height: 72 },
    slotName:  { color: '#FFFFFF', fontSize: 11, fontWeight: '600', textTransform: 'capitalize', textAlign: 'center' },
    typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    typeText:  { color: '#fff', fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },

    emptyBox:     { paddingVertical: 32, alignItems: 'center', gap: 8 },
    emptyBoxText: { color: '#555', fontSize: 14, fontStyle: 'italic' },
    emptyBoxSub:  { color: '#444', fontSize: 12, textAlign: 'center', paddingHorizontal: 24 },

    hint:     { backgroundColor: '#2a2a2a', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 8, borderWidth: 1 },
    hintTeam: { borderColor: Colors.primary },
    hintBox:  { borderColor: '#888' },
    hintText: { color: '#aaa', fontSize: 12, textAlign: 'center' },
    erroText: { color: '#ff525f', fontSize: 13, textAlign: 'center' },
});
