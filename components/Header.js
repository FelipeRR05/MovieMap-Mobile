import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import LogoBlack from '../assets/images/logo-black.png';
import SearchBar from './SearchBar';

export default function Header() {
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const navigation = useNavigation();

  const handleSearchToggle = () => {
    setSearchBarOpen(!searchBarOpen);
  };

  const handleNavigateClick = (path) => {
    navigation.navigate(path);
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleNavigateClick('Home')}>
          <Image source={LogoBlack} style={styles.logo} />
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchToggle} onPress={handleSearchToggle}>
            <FontAwesome name="search" size={25} color={Platform.OS === 'ios' ? '#1a2585' : '#007bff'} />
          </TouchableOpacity>
        </View>
      </View>

      {searchBarOpen && <SearchBar />}

    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    backgroundColor: '#dee2e6',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain', 
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchToggle: {
    padding: 11,
    marginRight: 10,
  },
});