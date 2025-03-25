import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalization } from './localization/i18n';

const ChatScreen: React.FC = () => {
  const { t } = useLocalization();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('chat')}</Text>
      <Text style={styles.subtitle}>Yakında burada sohbet özelliği olacak</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ChatScreen; 