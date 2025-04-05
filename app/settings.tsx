import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useLocalization } from '@localization/i18n';

const SettingsScreen: React.FC = () => {
  const { t } = useLocalization();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings')}</Text>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Bildirimler</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notifications ? '#daba71' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Karanlık Mod</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={darkMode ? '#daba71' : '#f4f3f4'}
        />
      </View>

      <Text style={styles.version}>Versiyon 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  version: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    color: '#666',
    fontSize: 14,
  },
});

export default SettingsScreen; 