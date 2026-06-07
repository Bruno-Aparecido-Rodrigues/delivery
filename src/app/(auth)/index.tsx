import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, Animated, ImageBackground, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/button';
import Input from '@/components/input';
import BattleFrame from '@/components/battle-frame';
import PixelCard from '@/components/pixel-card';
import { Colors } from '@/constants/colors';

const FOREST_BG    = require('../../../assets/images/forest_bg.png');
const BATTLE_SCENE = require('../../../assets/images/battle_scene.png');

const CARD_SIZE = 408;

export default function Index() {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha]     = useState('');
    const [erro, setErro]       = useState('');
    const { signIn } = useAuth();
    const { width: W } = useWindowDimensions();
    const isWide = W > 700;

    const floatAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: -10, duration: 2000, useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0,   duration: 2000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    function handleLogin() {
        const success = signIn(usuario, senha);
        if (success) {
            setErro('');
            router.replace('/pokedex');
        } else {
            setErro('► USUÁRIO OU SENHA INCORRETOS');
        }
    }

    return (
        <ImageBackground source={FOREST_BG} style={styles.bg} resizeMode="cover">
            <View style={styles.overlay} />

            <View style={[styles.content, isWide ? styles.contentWide : styles.contentNarrow]}>

                <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
                    <BattleFrame source={BATTLE_SCENE} size={CARD_SIZE} />
                </Animated.View>

                <PixelCard
                    title={'LOGIN DO TREINADOR'}
                    tagline="PREPARE-SE PARA DUELAR"
                    width={CARD_SIZE}
                >
                    <Input
                        label="USUÁRIO"
                        value={usuario}
                        onChangeText={setUsuario}
                        autoCapitalize="none"
                        placeholder="NOME DO TREINADOR"
                        placeholderTextColor="#666"
                    />
                    <Input
                        label="SENHA"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                        autoCapitalize="none"
                        placeholder="••••••••"
                        placeholderTextColor="#666"
                    />
                    <Button
                        title="ENTRAR  ►"
                        onPress={handleLogin}
                        style={styles.btn}
                    />
                    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
                </PixelCard>

            </View>

            <View style={styles.header}>
                <Text style={styles.headerTitle}>PokeBattle</Text>
                <Text style={styles.headerVersion}>V. 1.0.4</Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>© 1996-2024 POKÉMON. TODOS OS DIREITOS RESERVADOS.</Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg:      { flex: 1, backgroundColor: '#000', width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.72)' },

    content:       { flex: 1, paddingTop: 72, paddingBottom: 56, paddingHorizontal: 16 },
    contentWide:   { flexDirection: 'row',    alignItems: 'center', justifyContent: 'center', gap: 32 },
    contentNarrow: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 },

    btn: {
        backgroundColor: Colors.primaryAlt,
        borderRadius: 0,
        borderBottomWidth: 5,
        borderRightWidth: 4,
        borderBottomColor: Colors.black,
        borderRightColor: Colors.black,
    },

    header: {
        position: 'absolute', top: 0, left: 0, right: 0, height: 56,
        backgroundColor: Colors.white,
        borderBottomWidth: 5, borderBottomColor: Colors.primary,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, zIndex: 50,
    },
    headerTitle:   { fontFamily: 'PkmnRBYGSC', fontSize: 18, color: Colors.black, letterSpacing: 1 },
    headerVersion: { fontFamily: 'PkmnRBYGSC', fontSize: 12, color: Colors.black },

    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(19,19,19,0.95)',
        borderTopWidth: 3, borderTopColor: Colors.black,
        paddingVertical: 12, paddingHorizontal: 20,
        alignItems: 'center', zIndex: 50,
    },
    footerText: { fontFamily: 'PkmnRBYGSC', fontSize: 9, color: '#888', letterSpacing: 0.5 },

    erro: {
        fontFamily: 'PkmnRBYGSC',
        fontSize: 11,
        color: Colors.primaryAlt,
        letterSpacing: 0.5,
        textAlign: 'center',
    },
});
