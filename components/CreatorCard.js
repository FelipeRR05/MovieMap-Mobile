import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CreatorCard({ person }) {
  const navigation = useNavigation();
  const { profile_path, name, job } = person;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PersonDetails', { id: person.id })}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w200${profile_path}` }}
        style={styles.image}
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.job}>{job}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    margin: 10,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  job: {
    fontSize: 12,
    color: '#666',
  },
});
