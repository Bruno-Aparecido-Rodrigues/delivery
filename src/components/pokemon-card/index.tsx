import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pokemon } from '@/@types/pokemon';
import { Styles, TYPE_COLORS, TYPE_TEXT_COLORS } from './style';

type Props = {
    pokemon: Pokemon;
};

export default function PokemonCard({ pokemon }: Props) {
    const primaryType = pokemon.tipos[0] ?? 'normal';
    const cardColor = TYPE_COLORS[primaryType] ?? '#A8A878';

    return (
        <View style={Styles.shadowWrapper}>
            <LinearGradient
                colors={['#CC0000', '#CC0000', '#1a1a1a', '#FFFFFF', '#FFFFFF']}
                locations={[0, 0.46, 0.5, 0.54, 1]}
                style={Styles.border}
            >
                <View style={[Styles.card, { backgroundColor: cardColor }]}>

                    <View style={Styles.topSection}>
                        <Text style={Styles.index}>#{pokemon.index}</Text>

                        <Image
                            source={{ uri: pokemon.imagem }}
                            style={Styles.image}
                            resizeMode="contain"
                        />

                        <Text style={Styles.name}>{pokemon.nome}</Text>

                        <View style={Styles.typesRow}>
                            {pokemon.tipos.map((tipo) => {
                                const bgColor = TYPE_COLORS[tipo] ?? '#A8A878';
                                const textColor = TYPE_TEXT_COLORS[tipo] ?? '#ffffff';
                                return (
                                    <View
                                        key={tipo}
                                        style={[Styles.typeBadge, { backgroundColor: bgColor }]}
                                    >
                                        <Text style={[Styles.typeText, { color: textColor }]}>
                                            {tipo}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    <View style={Styles.powersContainer}>
                        <View style={Styles.divider} />
                        {pokemon.poderes.map((poder) => {
                            const fillWidth = Math.min((poder.forca / 255) * 100, 100);
                            return (
                                <View key={poder.nome} style={Styles.powerRow}>
                                    <Text style={Styles.powerName}>{poder.nome}</Text>
                                    <View style={Styles.powerBarBackground}>
                                        <View
                                            style={[
                                                Styles.powerBarFill,
                                                { width: `${fillWidth}%` },
                                            ]}
                                        />
                                    </View>
                                    <Text style={Styles.powerValue}>{poder.forca}</Text>
                                </View>
                            );
                        })}
                    </View>

                </View>
            </LinearGradient>
        </View>
    );
}
