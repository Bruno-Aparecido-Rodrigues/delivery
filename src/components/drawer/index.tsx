import { useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    TouchableWithoutFeedback,
    StyleSheet,
    Dimensions,
    Image,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.72;

type Props = {
    isOpen: boolean;
    onClose: () => void;
    currentRoute: string;
};

type NavItem = {
    label: string;
    route: '/(app)/profile' | '/(app)/pokedex' | '/(app)/team' | '/(app)battle';
    emoji: string;
};

const NAV_ITEMS: NavItem[] = [
    { label: 'Perfil', route: '/(app)/profile', emoji: '👤' },
    { label: 'Pokédex', route: '/(app)/pokedex', emoji: '📖' },
    { label: 'Time', route: '/(app)/team', emoji: '⚔️' },
    { label: 'Batalha',  route: '/(app)/battle',  emoji: '🥊'  }
];

export default function Drawer({ isOpen, onClose, currentRoute }: Props) {
    const { signOut, user } = useAuth();
    const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    // Anima abertura/fechamento
    if (isOpen) {
        Animated.parallel([
            Animated.timing(translateX, { toValue: 0, duration: 260, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.55, duration: 260, useNativeDriver: true }),
        ]).start();
    } else {
        Animated.parallel([
            Animated.timing(translateX, { toValue: -DRAWER_WIDTH, duration: 220, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
        ]).start();
    }

    function handleNavigate(route: NavItem['route']) {
        onClose();
        setTimeout(() => router.replace(route), 230);
    }

    function handleSignOut() {
        onClose();
        setTimeout(() => signOut(), 230);
    }

    if (!isOpen && translateX) {
        // mantém montado para animação de saída
    }

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents={isOpen ? 'auto' : 'none'}>
            {/* Overlay escuro */}
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View style={[styles.overlay, { opacity }]} />
            </TouchableWithoutFeedback>

            {/* Painel do drawer */}
            <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
                {/* Header do drawer */}
                <View style={styles.drawerHeader}>
                    <Image
                        source={require('../../../assets/images/trainer.png')}
                        style={styles.trainerAvatar}
                        resizeMode="contain"
                    />
                    <Text style={styles.drawerUsername}>{user ?? 'Treinador'}</Text>
                    <Text style={styles.drawerSubtitle}>Treinador Pokémon</Text>
                </View>

                <View style={styles.divider} />

                {/* Itens de navegação */}
                <View style={styles.navItems}>
                    {NAV_ITEMS.map((item) => {
                        const isActive = currentRoute === item.route;
                        return (
                            <TouchableOpacity
                                key={item.route}
                                style={[styles.navItem, isActive && styles.navItemActive]}
                                onPress={() => handleNavigate(item.route)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.navEmoji}>{item.emoji}</Text>
                                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                                    {item.label}
                                </Text>
                                {isActive && <View style={styles.activeIndicator} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.divider} />

                {/* Botão sair */}
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.7}>
                    <Text style={styles.signOutEmoji}>🚪</Text>
                    <Text style={styles.signOutLabel}>Sair</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: '#1a1a1a',
        borderRightWidth: 2,
        borderRightColor: '#CC0000',
        paddingTop: 56,
        paddingBottom: 32,
    },
    drawerHeader: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    trainerAvatar: {
        width: 80,
        height: 80,
        marginBottom: 8,
    },
    drawerUsername: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        textTransform: 'capitalize',
        letterSpacing: 0.5,
    },
    drawerSubtitle: {
        color: '#999',
        fontSize: 12,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginHorizontal: 16,
        marginVertical: 8,
    },
    navItems: {
        flex: 1,
        paddingTop: 8,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        gap: 14,
        position: 'relative',
    },
    navItemActive: {
        backgroundColor: '#2a2a2a',
    },
    activeIndicator: {
        position: 'absolute',
        right: 0,
        top: '20%',
        bottom: '20%',
        width: 3,
        backgroundColor: '#CC0000',
        borderRadius: 2,
    },
    navEmoji: {
        fontSize: 20,
    },
    navLabel: {
        color: '#ccc',
        fontSize: 16,
        fontWeight: '500',
    },
    navLabelActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        gap: 14,
        marginTop: 8,
    },
    signOutEmoji: {
        fontSize: 20,
    },
    signOutLabel: {
        color: '#CC0000',
        fontSize: 16,
        fontWeight: '600',
    },
});
