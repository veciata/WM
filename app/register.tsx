import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AuthService from './services/auth';
import { useLocalization } from './localization/i18n';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLocalization();
  const authService = AuthService.getInstance();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        username,
        email,
        password,
      });

      if (response.success) {
        Alert.alert('Başarılı', 'Hesabınız oluşturuldu.', [
          {
            text: 'Tamam',
            onPress: () => router.replace('/(tabs)'),
          },
        ]);
      } else {
        Alert.alert('Hata', response.message || 'Kayıt başarısız oldu.');
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hesap Oluştur</Text>

      <TextInput
        label="Kullanıcı Adı"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />

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

      <TextInput
        label="Şifre Tekrar"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : 'Kayıt Ol'}
      </Button>

      <Button
        mode="text"
        onPress={() => router.push('/login')}
        style={styles.loginButton}
        disabled={loading}
      >
        Zaten hesabın var mı? Giriş yap
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
  loginButton: {
    marginTop: 16,
  },
});

export default RegisterScreen;
