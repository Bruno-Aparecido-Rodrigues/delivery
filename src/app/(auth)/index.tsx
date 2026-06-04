import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/button';
import Card from '@/components/card';
import Input from '@/components/input';

export default function Index() {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const { signIn } = useAuth();

    function handleLogin() {
        const success = signIn(usuario, senha);
        if (success) {
            router.replace('/pokedex');
        } else {
            alert('Usuário ou senha incorretos.');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.formWrapper}>
                <Card>
                    <Input
                        label="Usuário"
                        value={usuario}
                        onChangeText={setUsuario}
                        autoCapitalize="none"
                    />
                    <Input
                        label="Senha"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    <Button title="Logar" onPress={handleLogin} />
                </Card>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#444',
        flex: 1,
        padding: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formWrapper: {
        gap: 8,
        marginBottom: 80,
        width: '100%',
        maxWidth: 320,
    },
});
