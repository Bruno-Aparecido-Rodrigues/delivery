import { View, Text, ViewStyle, StyleProp } from 'react-native';
import { Styles } from './style';

type Props = {
    title: string;
    tagline?: string;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    width?: number | string;
};

export default function PixelCard({ title, tagline, children, style, width = 340 }: Props) {
    return (
        <View style={[{ width }, style]}>
            {/* Header */}
            <View style={Styles.header}>
               <Text style={Styles.title}>{title}</Text>
                <View style={Styles.divider} />
            </View>

            {/* Conteúdo */}
            <View style={Styles.body}>
                {children}
            </View>

            {/* Tagline */}
            {tagline && (
                <View style={Styles.taglineRow}>
                    <View style={Styles.taglineDot} />
                    <Text style={Styles.taglineText}>{tagline}</Text>
                    <View style={Styles.taglineDot} />
                </View>
            )}
        </View>
    );
}
