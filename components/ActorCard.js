import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ActorCard({ actor }) {
  const navigation = useNavigation();
  const { profile_path, name, character } = actor;

  const handleCardPress = () => {
    navigation.navigate('PersonDetails', { id: actor.id });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCardPress}>
      <View style={styles.imageContainer}>
        {!profile_path ? (
          <View style={styles.placeholder}>
            <Icon name="image" size={48} color="#888" />
          </View>
        ) : (
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w200${profile_path}` }}
            style={styles.image}
          />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.character}>{character}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  info: {
    paddingTop: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 8,
  },
  character: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});
