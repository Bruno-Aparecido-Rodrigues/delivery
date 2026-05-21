import { TouchableOpacity, Text, TouchableOpacityProps, StyleProp, ViewStyle } from "react-native"
import { Styles } from './style';

type Props = TouchableOpacityProps & {
    title: string;
    style?: StyleProp<ViewStyle>;
}   

export default function Button({ title, style, onPress, ...rest }: Props) {
    return (
        <TouchableOpacity 
            activeOpacity={0.5} 
            style={[Styles.button, style]}
            onPress={onPress}
            {...rest}>
            <Text style={Styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}
