import { View, Text, Image as RNImage, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

type Props = {
    onMenuPress: () => void;
};

export default function AppHeader({ onMenuPress }: Props) {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onMenuPress} style={styles.menuButton} activeOpacity={0.7}>
                <View style={styles.bar} />
                <View style={styles.bar} />
                <View style={styles.bar} />
            </TouchableOpacity>

            <View style={styles.titleGroup}>
                <RNImage source={require('../../../assets/images/pokebola.png')} style={styles.logo} />
                <Text style={styles.title}>PokeBattle</Text>
            </View>

            <View style={styles.spacer} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 52,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: Colors.white,
        borderBottomWidth: 5,
        borderBottomColor: Colors.primary,
    },
    menuButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        gap: 5,
    },
    bar: {
        height: 3,
        width: 24,
        backgroundColor: Colors.black,
        borderRadius: 2,
    },
    titleGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    logo: {
        width: 24,
        height: 24,
    },
    title: {
        fontFamily: 'PkmnRBYGSC',
        fontSize: 18,
        color: Colors.black,
        letterSpacing: 1,
    },
    spacer: {
        width: 36,
    },
});