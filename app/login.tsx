import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter, Redirect } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import AuthService from './services/auth';
import { useLocalization } from './localization/i18n';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLocalization();
  const authService = AuthService.getInstance();

  const [, googleResponse, googleSignIn] = Google.useAuthRequest({
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
  });

  React.useEffect(() => {
    if (googleResponse?.type === 'success') {
      handleGoogleSignIn(googleResponse.authentication?.accessToken);
    }
  }, [googleResponse]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      if (response.success) {
        router.replace('/(tabs)');
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

  const handleGoogleSignIn = async (token?: string) => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await authService.googleSignIn(token);
      if (response.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Hata', response.message || 'Google ile giriş başarısız oldu.');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>World Moneys</Text>
      
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
        mode="outlined"
        onPress={() => googleSignIn()}
        style={styles.googleButton}
        disabled={loading}
      >
        Google ile Giriş Yap
      </Button>

      <Button
        mode="text"
        onPress={() => router.push('/register')}
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
  googleButton: {
    marginTop: 16,
    padding: 4,
    borderColor: '#daba71',
  },
  registerButton: {
    marginTop: 16,
  },
});

export default LoginScreen;
