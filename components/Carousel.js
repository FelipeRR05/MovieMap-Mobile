import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function Carousel({
  title = "",
  items = [],
  emptyMessage = "Nenhum item encontrado",
  onFavoriteChange,
  component: Component,
}) {
  if (!Component) {
    console.error("Componente não fornecido para o Carousel");
    return <Text style={styles.errorText}>Erro: Componente inválido.</Text>;
  }

  const determineMediaType = (item) => {
    if (item.media_type) return item.media_type;
    return title.toLowerCase().includes("série") ? "tv" : "movie";
  };

  return (
    <View style={styles.carouselContainer}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal contentContainerStyle={styles.carousel} showsHorizontalScrollIndicator={false}>
        {items.length === 0 ? (
          <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        ) : (
          items.map((item) => (
            <Component
              key={item.id}
              movieId={item.id}
              mediaType={determineMediaType(item)}
              actor={item}
              onFavoriteChange={onFavoriteChange}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  carousel: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
  },
});
