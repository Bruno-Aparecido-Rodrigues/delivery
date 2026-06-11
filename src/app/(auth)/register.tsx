import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, Animated, ImageBackground, Text, TouchableOpacity } from 'react-native';
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

export default function Register() {
    const [usuario, setUsuario]           = useState('');
    const [senha, setSenha]               = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const [erro, setErro]                 = useState('');
    const { signUp } = useAuth();
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

    async function handleRegister() {
        if (!usuario.trim() || !senha.trim() || !confirmSenha.trim()) {
            setErro('► PREENCHA TODOS OS CAMPOS');
            return;
        }
        if (senha !== confirmSenha) {
            setErro('► AS SENHAS NÃO COINCIDEM');
            return;
        }
        if (senha.length < 6) {
            setErro('► SENHA MUITO CURTA (MÍN. 6)');
            return;
        }

        const result = await signUp(usuario, senha);
        if (result.ok) {
            router.replace('/(app)/profile');
        } else {
            setErro(result.error ?? '► ERRO AO CRIAR CONTA');
        }
    }

    return (
        <ImageBackground source={FOREST_BG} style={styles.bg} resizeMode="cover">
            <View style={styles.overlay} />

            <View style={[styles.content, isWide ? styles.contentWide : styles.contentNarrow]}>

                <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
                    <BattleFrame source={BATTLE_SCENE} size={CARD_SIZE} accentColor="#0061a4" />
                </Animated.View>

                <PixelCard
                    title={'NOVO TREINADOR'}
                    tagline="BEM-VINDO AO MUNDO POKÉMON"
                    width={CARD_SIZE}
                >
                    <Input
                        label="USUÁRIO"
                        value={usuario}
                        onChangeText={(v) => { setUsuario(v); setErro(''); }}
                        autoCapitalize="none"
                        placeholder="ESCOLHA UM NOME"
                        placeholderTextColor="#666"
                    />
                    <Input
                        label="SENHA"
                        value={senha}
                        onChangeText={(v) => { setSenha(v); setErro(''); }}
                        secureTextEntry
                        autoCapitalize="none"
                        placeholder="••••••••"
                        placeholderTextColor="#666"
                    />
                    <Input
                        label="CONFIRMAR SENHA"
                        value={confirmSenha}
                        onChangeText={(v) => { setConfirmSenha(v); setErro(''); }}
                        secureTextEntry
                        autoCapitalize="none"
                        placeholder="••••••••"
                        placeholderTextColor="#666"
                    />
                    <Button title="CRIAR CONTA  ►" onPress={handleRegister} style={styles.btn} />
                    {erro ? <Text style={styles.erro}>{erro}</Text> : null}

                    <TouchableOpacity onPress={() => router.replace('/(auth)/')} style={styles.backBtn}>
                        <Text style={styles.backText}>◄ JÁ TENHO CONTA</Text>
                    </TouchableOpacity>
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
    erro: {
        fontFamily: 'PkmnRBYGSC',
        fontSize: 11,
        color: Colors.primaryAlt,
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    backBtn: {
        alignSelf: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#555',
    },
    backText: {
        fontFamily: 'PkmnRBYGSC',
        fontSize: 10,
        color: '#888',
        letterSpacing: 1,
    },

    header: {
        position: 'absolute', top: 0, left: 0, right: 0, height: 56,
        backgroundColor: Colors.white,
        borderBottomWidth: 5,  borderBottomColor: '#0061a4',
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
});
