import { View, Image, ImageSourcePropType } from 'react-native';
import { Styles } from './style';

type Props = {
    source: ImageSourcePropType;
    size?: number;
};

export default function BattleFrame({ source, size = 340 }: Props) {
    return (
        <View style={[Styles.frameOuter, { width: size }]}>
            <View style={Styles.frameRed}>
                <View style={Styles.frameInner}>
                    <Image
                        source={source}
                        style={{ width: '100%', height: size }}
                        resizeMode="cover"
                    />
                </View>
            </View>
        </View>
    );
}
