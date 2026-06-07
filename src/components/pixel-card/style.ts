import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

const BORDER = { borderWidth: 4, borderColor: Colors.black };

export const Styles = StyleSheet.create({
    header: {
        backgroundColor: Colors.surface,
        ...BORDER,
        borderBottomWidth: 0,
        padding: 16,
        alignItems: 'center',
        gap: 16,
    },
    title: {
        fontFamily: 'PkmnRBYGSC',
        fontSize: 16,
        color: Colors.primary,
        textAlign: 'center',
        letterSpacing: 1,
        lineHeight: 28,
    },
    divider: {
    height: 3,
    backgroundColor: '#444',
    width: '100%',
    },
    body: {
        backgroundColor: Colors.surface,
        ...BORDER,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        paddingHorizontal: 24,
        paddingVertical: 8,
        gap: 16,
    },
    taglineRow: {
        backgroundColor: Colors.surface,
        ...BORDER,
        borderTopWidth: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
    },
    taglineDot: {
        width: 8,
        height: 8,
        backgroundColor: Colors.primary,
    },
    taglineText: {
        fontFamily: 'PkmnRBYGSC',
        fontSize: 8,
        color: '#888',
        letterSpacing: 1,
    },
});
