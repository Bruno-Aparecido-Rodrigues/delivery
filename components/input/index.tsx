import { View, Text, TextInput, TextInputProps, StyleProp, ViewStyle } from "react-native";
import { Styles } from './style';

type Props = TextInputProps & {
    label: string;
    style?: StyleProp<ViewStyle>;
};

export default function Input({ label, style, ...rest }: Props) {
    return (
        <View style={[Styles.wrapper, style]}>
            <Text style={Styles.label}>{label}</Text>
            <TextInput style={Styles.input} {...rest} />
        </View>
    );
}
