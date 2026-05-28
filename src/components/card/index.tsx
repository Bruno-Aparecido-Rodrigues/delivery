import { View, ViewProps, StyleProp, ViewStyle } from "react-native";
import { Styles } from './style';

type Props = ViewProps & {
    style?: StyleProp<ViewStyle>;
};

export default function Card({ style, children, ...rest }: Props) {
    return (
        <View style={[Styles.card, style]} {...rest}>
            {children}
        </View>
    );
}
