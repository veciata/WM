import { Platform } from 'react-native';

interface AdResponse {
  success: boolean;
  message: string;
}

class AdsService {
  private static instance: AdsService;
  private isAdServiceAvailable: boolean = false;
  private readonly API_URL = 'https://www.api.world-moneys.com/public/api';

  private constructor() {
    // Initialize ad service availability check
    this.checkAdServiceAvailability();
  }

  public static getInstance(): AdsService {
    if (!AdsService.instance) {
      AdsService.instance = new AdsService();
    }
    return AdsService.instance;
  }

  private async checkAdServiceAvailability(): Promise<void> {
    try {
      // Here you would typically check if Google Ads SDK is available
      // This is a placeholder - replace with actual Google Ads SDK check
      this.isAdServiceAvailable = Platform.OS !== 'web';
    } catch (error) {
      console.error('Error checking ad service availability:', error);
      this.isAdServiceAvailable = false;
    }
  }

  public isAvailable(): boolean {
    return this.isAdServiceAvailable;
  }

  public async showRewardedAd(): Promise<boolean> {
    if (!this.isAdServiceAvailable) {
      return false;
    }

    try {
      // Here you would implement the actual Google Ads rewarded video logic
      // This is a placeholder - replace with actual Google Ads implementation
      return new Promise((resolve) => {
        // Simulating ad watch completion
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      return false;
    }
  }

  public async notifyAdCompletion(userId: string): Promise<AdResponse> {
    try {
      const response = await fetch(`${this.API_URL}/mining/ad-completed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          platform: Platform.OS,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Error notifying ad completion:', error);
      return {
        success: false,
        message: 'Reklam tamamlama bildirimi gönderilemedi.',
      };
    }
  }
}

export default AdsService;
