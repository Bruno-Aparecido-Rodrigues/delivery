import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';
import AppHeader from '@/components/app-header';
import Drawer from '@/components/drawer';
import { getStats, StatsData } from '@/integration/authIntegration';

export default function Profile() {
    const { user, userId } = useAuth();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [stats, setStats]           = useState<StatsData | null>(null);
    const [loading, setLoading]       = useState(true);
    const [erro, setErro]             = useState('');

    useEffect(() => { // Carrega as estatísticas do usuário ao montar o perfil
        async function loadStats() {
            if (!userId) { setLoading(false); return; }
            try {
                const data = await getStats(userId);
                setStats(data);
            } catch (e) {
                setErro('Erro ao carregar perfil.');
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, [userId]);

    // Calcula vitórias, derrotas e total para exibir nas estatísticas
    const wins   = Number(stats?.vitorias ?? 0); 
    const losses = Number(stats?.derrotas ?? 0);
    const total  = wins + losses;

    return (
        <View style={styles.root}>
            <AppHeader onMenuPress={() => setDrawerOpen(true)} />

            <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Card do treinador */}
                <View style={styles.trainerCard}>
                    <Text style={styles.pageTitle}>Perfil</Text>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={require('../../../assets/images/trainer.png')}
                            style={styles.trainerSprite}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.trainerName}>{user ?? 'Treinador'}</Text>
                    {stats?.level && (
                        <View style={styles.regionBadge}>
                            <Text style={styles.regionText}>⭐ Level {stats.level}</Text>
                        </View>
                    )}
                </View>

                {/* Estatísticas de batalha */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Batalhas</Text>

                    {loading ? (
                        <ActivityIndicator color={Colors.primary} />
                    ) : erro ? (
                        <Text style={styles.erroText}>{erro}</Text>
                    ) : (
                        <View style={styles.statsRow}>
                            <View style={[styles.statCard, styles.statCardWin]}>
                                <Text style={styles.statValue}>{wins}</Text>
                                <Text style={styles.statLabel}>Vitórias</Text>
                            </View>
                            <View style={[styles.statCard, styles.statCardLoss]}>
                                <Text style={styles.statValue}>{losses}</Text>
                                <Text style={styles.statLabel}>Derrotas</Text>
                            </View>
                            <View style={[styles.statCard, styles.statCardTotal]}>
                                <Text style={styles.statValue}>{total}</Text>
                                <Text style={styles.statLabel}>Total</Text>
                            </View>
                        </View>
                    )}
                </View>

            </ScrollView>

            <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} currentRoute="/(app)/profile" />
        </View>
    );
}

const styles = StyleSheet.create({
    root:    { flex: 1, backgroundColor: Colors.background },
    scroll:  { flex: 1 },
    content: { padding: 16, gap: 16, paddingBottom: 40 },

    trainerCard: {
        backgroundColor: '#222',
        borderRadius: 16,
        alignItems: 'center',
        paddingVertical: 28,
        borderWidth: 1,
        borderColor: '#333',
    },
    pageTitle: {
        fontFamily: 'PkmnRBYGSC',
        fontSize: 14,
        color: Colors.white,
        letterSpacing: 1,
        marginBottom: 16,
        textTransform: 'uppercase',
    },
    avatarWrapper: {
        width: 120, height: 120,
        backgroundColor: '#2a2a2a',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#CC0000',
        marginBottom: 12,
        overflow: 'hidden',
    },
    trainerSprite: { width: 96, height: 96 },
    trainerName: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '800',
        textTransform: 'capitalize',
        letterSpacing: 0.5,
    },
    regionBadge: {
        marginTop: 6,
        backgroundColor: '#333',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    regionText: { color: '#ccc', fontSize: 13 },

    section: {
        backgroundColor: '#222',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: '#333',
        gap: 12,
    },
    sectionTitle: {
        color: '#CC0000',
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    statsRow:      { flexDirection: 'row', gap: 10 },
    statCard:      { flex: 1, borderRadius: 10, paddingVertical: 14, alignItems: 'center', borderWidth: 1 },
    statCardWin:   { backgroundColor: '#0a2a0a', borderColor: '#2a6a2a' },
    statCardLoss:  { backgroundColor: '#2a0a0a', borderColor: '#6a2a2a' },
    statCardTotal: { backgroundColor: '#1a1a2a', borderColor: '#3a3a6a' },
    statValue:     { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
    statLabel:     { color: '#999', fontSize: 12, marginTop: 2 },

    erroText: { color: '#ff525f', fontSize: 13, textAlign: 'center' },
});
