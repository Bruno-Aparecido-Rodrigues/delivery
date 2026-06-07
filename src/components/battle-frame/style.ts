import { StyleSheet } from 'react-native';
import { Colors, BorderWidth } from '@/constants/colors';

export const Styles = StyleSheet.create({
    frameOuter: {
        padding: BorderWidth.black,
        backgroundColor: Colors.black,
    },
    frameRed: {
        padding: BorderWidth.red,
        backgroundColor: Colors.primary,
    },
    frameInner: {
        padding: BorderWidth.black,
        backgroundColor: Colors.black,
        overflow: 'hidden',
    },
});
