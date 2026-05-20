import { View, Text, TextInput, StyleSheet } from 'react-native';
import Button from '../../componet/button';

export default function Index() {
    return (
        <View style={styles.container}>
            <View style={styles.formWrapper}>
                <Text style={styles.label}>Texto</Text>
                <TextInput style={styles.input} />
                <Button title="Click me"/>
            </View>
        </View>
    )
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
    label: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#555',
        borderRadius: 8,
        color: '#FFF',
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#666',
    },
});