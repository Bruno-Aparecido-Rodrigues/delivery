import { View, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Button from '../components/button';

export default function Dashboard() {
    return (
        <View style={styles.container}>
           <View style={styles.formWrapper}>
                <Image
                    source={require('../../assets/neyma.jpg')}
                    style={styles.image}
                    resizeMode="contain"
                 />
                 <Button title='Voltar' onPress={() => router.back()} />
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
        gap: 32,
    },
    image: {
        width: 500,
        height: 500,
   },
    formWrapper: {
        gap: 8,
        marginBottom: 80,
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
    },
});