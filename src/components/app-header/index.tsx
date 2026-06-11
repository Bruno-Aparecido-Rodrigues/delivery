import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
            <Text style={styles.title}>PokeBattle</Text>
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
    title: {
        flex: 1,
        fontFamily: 'PkmnRBYGSC',
        fontSize: 18,
        color: Colors.black,
        textAlign: 'center',
        letterSpacing: 1,
    },
    spacer: {
        width: 36,
    },
});
