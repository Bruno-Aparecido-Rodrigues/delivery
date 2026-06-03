import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: 8,
        paddingBottom: 32,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 64,
    },
    emptyText: {
        color: '#aaa',
        fontSize: 16,
        fontWeight: '600',
    },
});
