import { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';
import AppHeader from '@/components/app-header';
import Drawer from '@/components/drawer';

const TRAINER_DATA = {
    wins: 142,
    losses: 27,
    region: 'Kanto',
};

export default function Profile() {
    const { user } = useAuth();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const totalBattles = TRAINER_DATA.wins + TRAINER_DATA.losses;
    const winRate = Math.round((TRAINER_DATA.wins / totalBattles) * 100);

    return (
        <View style={styles.root}>
            <AppHeader onMenuPress={() => setDrawerOpen(true)} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
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
                    <View style={styles.regionBadge}>
                        <Text style={styles.regionText}>📍 Região {TRAINER_DATA.region}</Text>
                    </View>
                </View>

                {/* Estatísticas de batalha */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Batalhas</Text>

                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, styles.statCardWin]}>
                            <Text style={styles.statValue}>{TRAINER_DATA.wins}</Text>
                            <Text style={styles.statLabel}>Vitórias</Text>
                        </View>
                        <View style={[styles.statCard, styles.statCardLoss]}>
                            <Text style={styles.statValue}>{TRAINER_DATA.losses}</Text>
                            <Text style={styles.statLabel}>Derrotas</Text>
                        </View>
                        <View style={[styles.statCard, styles.statCardTotal]}>
                            <Text style={styles.statValue}>{totalBattles}</Text>
                            <Text style={styles.statLabel}>Total</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <Drawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                currentRoute="/(app)/profile"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.background },
    scroll: { flex: 1 },
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
        width: 120,
        height: 120,
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

    statsRow: { flexDirection: 'row', gap: 10 },
    statCard: { flex: 1, borderRadius: 10, paddingVertical: 14, alignItems: 'center', borderWidth: 1 },
    statCardWin:   { backgroundColor: '#0a2a0a', borderColor: '#2a6a2a' },
    statCardLoss:  { backgroundColor: '#2a0a0a', borderColor: '#6a2a2a' },
    statCardTotal: { backgroundColor: '#1a1a2a', borderColor: '#3a3a6a' },
    statValue: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
    statLabel: { color: '#999', fontSize: 12, marginTop: 2 },

    winRateContainer: { gap: 6 },
    winRateHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    winRateLabel: { color: '#999', fontSize: 13 },
    winRateValue: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
    winRateBar: { height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden' },
    winRateFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 4 },
});
