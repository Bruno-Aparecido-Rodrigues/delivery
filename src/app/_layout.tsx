import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { AuthProvider } from "@/context/AuthContext";
import { Image, View } from 'react-native';

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        PkmnRBYGSC: require('../../assets/fonts/PKMN RBYGSC.ttf'),
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../assets/images/redrunning.gif')}style={{ width: 256, height: 256 }}/>
            </View>
        );
    }

    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
    );
}
