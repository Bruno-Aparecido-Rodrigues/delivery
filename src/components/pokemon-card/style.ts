import { StyleSheet } from 'react-native';

export const TYPE_COLORS: Record<string, string> = {
    fire:     '#F08030',
    water:    '#6890F0',
    grass:    '#78C850',
    electric: '#F8D030',
    psychic:  '#F85888',
    ice:      '#98D8D8',
    dragon:   '#7038F8',
    dark:     '#705848',
    normal:   '#A8A878',
    fighting: '#C03028',
    flying:   '#A890F0',
    poison:   '#A040A0',
    ground:   '#E0C068',
    rock:     '#B8A038',
    bug:      '#A8B820',
    ghost:    '#705898',
    steel:    '#B8B8D0',
    fairy:    '#EE99AC',
};

// Cor do texto por tipo (escuro para tipos claros, branco para escuros)
export const TYPE_TEXT_COLORS: Record<string, string> = {
    electric: '#5a4a00',
    normal:   '#3a3a2a',
    ground:   '#5a4a00',
    rock:     '#3a3200',
    bug:      '#3a4000',
    ice:      '#1a4a4a',
    steel:    '#2a2a40',
    fairy:    '#7a2040',
};

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
    // Badge estilo jogo — fundo sólido da cor do tipo com borda escura
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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    powerName: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.85)',
        textTransform: 'capitalize',
        flex: 1,
        letterSpacing: 0.2,
        fontFamily: 'PkmnRBYGSC',
    },
    powerBarBackground: {
        flex: 2,
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
        fontSize: 10,
        color: '#fff',
        fontWeight: '700',
        width: 30,
        textAlign: 'right',
        fontFamily: 'PkmnRBYGSC',
    },
});
