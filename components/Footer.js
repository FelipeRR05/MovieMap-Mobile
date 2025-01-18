import { View, Text, Image, Linking, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; 
import LogoBlack from '../assets/images/logo-black.png';

export default function Footer() {
  const navigation = useNavigation();

  const socialLinks = [
    { href: 'https://www.linkedin.com/in/feliperrocha/', label: 'LinkedIn', icon: 'linkedin' },
    { href: 'https://github.com/FelipeRR05', label: 'GitHub', icon: 'github' },
  ];

  const handleNavigateClick = () => {
    navigation.navigate('Home'); 
  };

  return (
    <View style={styles.footer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateClick} style={styles.logo}>
          <Image source={LogoBlack} style={styles.logoImage} />
        </TouchableOpacity>

        <View style={styles.informations}>
          <View style={styles.contact}>
            <Text style={styles.header}>Contato</Text>
            <Text style={styles.text}>E-mail: feliperrocha2005@gmail.com</Text>
            <Text style={styles.text}>Redes Sociais:</Text>
            <View style={styles.socialIcons}>
              {socialLinks.map((link, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => Linking.openURL(link.href)}
                  accessibilityLabel={link.label}
                >
                  <FontAwesome name={link.icon} style={styles.socialIcon} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.credits}>
            <Text style={styles.header}>Créditos</Text>
            <Text style={styles.text}>Desenvolvedor: Felipe Roberto Rocha</Text>
            <Text style={styles.text}>Tecnologias Usadas: React Native, TMDB API</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#dee2e6',
    color: '#212529',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  logo: {
    marginBottom: 10,
    cursor: 'pointer',
  },
  logoImage: {
    width: 60,
    height: 40,
    resizeMode: 'contain', 
  },
  informations: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contact: {
    marginBottom: 10,
    alignItems: 'center',
  },
  credits: {
    marginBottom: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    marginBottom: 5,
    color: '#212529',
  },
  text: {
    fontSize: 14,
    marginBottom: 0,
    color: '#212529',
  },
  socialIcons: {
    flexDirection: 'row',
    marginTop: 5,
  },
  socialIcon: {
    color: '#1a2585',
    marginLeft: 10,
    fontSize: 24,
  },
});
