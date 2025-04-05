import { useState } from 'react';
import { Alert } from 'react-native';
import AdsService from '@services/ads';

interface UseMiningWithAdsResult {
  startMiningWithAd: () => Promise<void>;
  isLoading: boolean;
}

export const useMiningWithAds = (userId: string): UseMiningWithAdsResult => {
  const [isLoading, setIsLoading] = useState(false);
  const adsService = AdsService.getInstance();

  const startMiningWithAd = async () => {
    setIsLoading(true);
    try {
      if (!adsService.isAvailable()) {
        Alert.alert(
          'Bilgi',
          'Madenciliğe başlamak için reklam izleme özelliği henüz hazır değil. Lütfen daha sonra tekrar deneyin.'
        );
        return;
      }

      const adWatched = await adsService.showRewardedAd();

      if (adWatched) {
        const response = await adsService.notifyAdCompletion(userId);

        if (response.success) {
          Alert.alert('Başarılı', 'Madencilik başlatıldı!');
        } else {
          Alert.alert('Hata', response.message);
        }
      } else {
        Alert.alert(
          'Bilgi',
          'Madenciliğe başlamak için reklamı sonuna kadar izlemelisiniz.'
        );
      }
    } catch (error) {
      console.error('Error in startMiningWithAd:', error);
      Alert.alert(
        'Hata',
        'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    startMiningWithAd,
    isLoading,
  };
};

export default useMiningWithAds;
