import { Stack, Redirect } from 'expo-router';
import { Image, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';

export default function AppLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
              <Image source={require('../../../assets/images/redrunning.gif')}style={{ width: 256, height: 256 }}/>
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
