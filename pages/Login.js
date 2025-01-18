import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { fetchFromApi } from '../services/api';
import * as Updates from 'expo-updates';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const { request_token } = await fetchFromApi('/authentication/token/new');

      const validateTokenResponse = await fetchFromApi(
        '/authentication/token/validate_with_login',
        'POST',
        {
          username,
          password,
          request_token,
        }
      );

      if (!validateTokenResponse.success) {
        setErrorMessage('Credenciais inválidas.');
        return;
      }

      const { session_id } = await fetchFromApi(
        '/authentication/session/new',
        'POST',
        { request_token }
      );

      if (!session_id) {
        setErrorMessage('Erro ao criar sessão.');
        return;
      }

      login(session_id);

      if (Updates?.reloadAsync) {
        await Updates.reloadAsync();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro durante login:', error);
      setErrorMessage('Erro ao realizar login. Verifique suas credenciais.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário TMDB"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#1a2585',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
