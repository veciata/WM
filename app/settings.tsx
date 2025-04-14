import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useLocalization } from "@localization/i18n";

const SettingsScreen = () => {
  const { t } = useLocalization();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!name || !email) {
      setError(t('requiredFields'));
      return;
    }
    
    // API call to update profile
    setError("");
    setSuccess(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profileSettings')}</Text>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{t('profileUpdated')}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder={t('fullName')}
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder={t('nickname')}
        value={nickname}
        onChangeText={setNickname}
      />
      
      <TextInput
        style={styles.input}
        placeholder={t('email')}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        style={styles.input}
        placeholder={t('phoneNumber')}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{t('saveChanges')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3d6a70",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#e9ecef",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f8f9fa",
    color: "#333",
  },
  button: {
    backgroundColor: "#3d6a70",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "#dc3545",
    marginBottom: 15,
    textAlign: "center",
  },
  success: {
    color: "#28a745",
    marginBottom: 15,
    textAlign: "center",
  },
});

export default SettingsScreen;
