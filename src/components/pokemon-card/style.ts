import { StyleSheet } from 'react-native';

export { TYPE_COLORS, TYPE_TEXT_COLORS } from '@/constants/colors';

export const BORDER_WIDTH = 4;
export const CARD_HEIGHT = 300;

export const Styles = StyleSheet.create({
    shadowWrapper: {
        flex: 1,
        margin: 8,
        height: CARD_HEIGHT,
        borderRadius: 18,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
    },
    border: {
        flex: 1,
        borderRadius: 18,
        padding: BORDER_WIDTH,
        overflow: 'hidden',
    },
    card: {
        flex: 1,
        borderRadius: 14,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    topSection: {
        width: '100%',
        alignItems: 'center',
    },
    index: {
        alignSelf: 'flex-start',
        fontSize: 11,
        fontWeight: '700',
        opacity: 0.6,
        color: '#fff',
        letterSpacing: 0.5,
        fontFamily: 'PkmnRBYGSC',
    },
    image: {
        width: 90,
        height: 90,
    },
    name: {
        fontSize: 14,
        fontWeight: '800',
        color: '#fff',
        textTransform: 'capitalize',
        marginTop: 4,
        textAlign: 'center',
        letterSpacing: 0.3,
        fontFamily: 'PkmnRBYGSC',
    },
    typesRow: {
        flexDirection: 'row',
        gap: 4,
        marginTop: 6,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 2,
        borderBottomWidth: 3,
        borderColor: 'rgba(0,0,0,0.35)',
    },
    typeText: {
        fontSize: 9,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        fontFamily: 'PkmnRBYGSC',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: '100%',
        marginVertical: 8,
    },
    powersContainer: {
        width: '100%',
        gap: 4,
    },
    powerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
    },
    powerName: {
        width: 88,
        flexShrink: 0,
        fontSize: 10,
        color: 'rgba(255,255,255,0.85)',
        textTransform: 'capitalize',
        letterSpacing: 0.2,
        fontFamily: 'PkmnRBYGSC',
    },
    powerBarBackground: {
        flex: 1,
        height: 5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 10,
        marginHorizontal: 6,
        overflow: 'hidden',
    },
    powerBarFill: {
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.75)',
        borderRadius: 10,
    },
    powerValue: {
        width: 28,
        flexShrink: 0,
        fontSize: 10,
        color: '#fff',
        fontWeight: '700',
        textAlign: 'right',
        fontFamily: 'PkmnRBYGSC',
    },
});
