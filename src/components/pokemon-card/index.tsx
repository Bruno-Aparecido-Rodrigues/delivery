import { View, Text, Image } from 'react-native';
import { Pokemon } from '@/@types/pokemon';
import { Styles, TYPE_COLORS, TYPE_TEXT_COLORS } from './style';

type Props = {
    pokemon: Pokemon;
};

export default function PokemonCard({ pokemon }: Props) {
    const primaryType = pokemon.tipos[0] ?? 'normal';
    const cardColor = TYPE_COLORS[primaryType] ?? '#A8A878';

    return (
        <View style={[Styles.card, { backgroundColor: cardColor }]}>
            <Text style={Styles.index}>#{pokemon.index}</Text>

            <Image
                source={{ uri: pokemon.imagem }}
                style={Styles.image}
                resizeMode="contain"
            />

            <Text style={Styles.name}>{pokemon.nome}</Text>

            <View style={Styles.typesRow}>
                {pokemon.tipos.map((tipo) => (
                    <View key={tipo} style={Styles.typeBadge}>
                        <Text style={Styles.typeText}>{tipo}</Text>
                    </View>
                ))}
            </View>

            <View style={Styles.divider} />

            <View style={Styles.powersContainer}>
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
    );
}
