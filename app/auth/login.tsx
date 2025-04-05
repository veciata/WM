import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AuthService from '@services/auth';
import { useLocalization } from '@localization/i18n';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLocalization();
  const authService = AuthService.getInstance();



  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      console.log("API Response:", response);
      if (response.token) {
        router.replace('/drawer/home');
      } else {
        Alert.alert('Hata', response.message || 'Giriş başarısız oldu.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>World Money</Text>

      <TextInput
        label="E-posta"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        label="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : 'Giriş Yap'}
      </Button>



      <Button
        mode="text"
        onPress={() => router.push('/auth/register')}
        style={styles.registerButton}
        disabled={loading}
      >
        Hesabın yok mu? Kayıt ol
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#000',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
    padding: 4,
    backgroundColor: '#daba71',
  },

  registerButton: {
    marginTop: 16,
  },
});

export default LoginScreen;
