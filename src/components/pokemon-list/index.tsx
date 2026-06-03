import { FlatList, View, Text } from 'react-native';
import { Pokemon } from '@/@types/pokemon';
import PokemonCard from '@/components/pokemon-card';
import { Styles } from './style';

type Props = {
    pokemons: Pokemon[];
};

export default function PokemonList({ pokemons }: Props) {
    return (
        <FlatList
            data={pokemons}
            keyExtractor={(item) => item.index}
            numColumns={3}
            contentContainerStyle={Styles.listContent}
            columnWrapperStyle={Styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                <View style={Styles.emptyContainer}>
                    <Text style={Styles.emptyText}>Nenhum Pokémon encontrado.</Text>
                </View>
            }
            renderItem={({ item }) => <PokemonCard pokemon={item} />}
        />
    );
}
