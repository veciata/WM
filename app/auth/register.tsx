import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AuthService from '../../components/services/auth';
import { useLocalization } from '../localization/i18n';

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLocalization();
  const authService = AuthService.getInstance();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !phone || !country || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi giriniz.');
      return;
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Hata', 'Geçerli bir telefon numarası giriniz.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        firstName,
        lastName,
        email,
        phone,
        country,
        password,
      });

      console.log('Register response:', response);

      if (response.success) {
        Alert.alert('Başarılı', 'Hesabınız oluşturuldu.', [
          {
            text: 'Tamam',
            onPress: () => router.replace('/drawer/home'),
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
      <Text style={styles.title}>Kayıt Ol</Text>


      <TextInput
        label={t('firstName')}
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <TextInput
        label={t('lastName')}
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <TextInput
        label={t('email')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label={t('tel')}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput
        label={t('country')}
        value={country}
        onChangeText={setCountry}
        style={styles.input}
      />

      <TextInput
        label={t('password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        label={t('passwordConfirm')}
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
        {loading ? <ActivityIndicator color="#fff" /> : t('registerNow')}
      </Button>

      <Button
        mode="text"
        onPress={() => router.back()}
        style={styles.loginButton}
        disabled={loading}
      >
        {t('alreadyHaveAccount')}
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
