import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdMobRewarded, setTestDeviceIDAsync } from "expo-ads-admob";

interface AdResponse {
  success: boolean;
  message: string;
}

const REWARDED_AD_UNIT_ID = __DEV__
  ? Platform.select({
      ios: "ca-app-pub-3940256099942544/1712485313",
      android: "ca-app-pub-3940256099942544/5224354917",
    })
  : Platform.select({
      ios: "YOUR_IOS_REWARDED_AD_ID",
      android: "YOUR_ANDROID_REWARDED_AD_ID",
    });

class AdsService {
  private static instance: AdsService;
  private isAdServiceAvailable: boolean = false;
  private readonly API_URL = "https://www.api.world-moneys.com/public/api";

  private constructor() {
    this.checkAdServiceAvailability();
  }

  public static getInstance(): AdsService {
    if (!AdsService.instance) {
      AdsService.instance = new AdsService();
    }
    return AdsService.instance;
  }

  public async init(): Promise<void> {
    await setTestDeviceIDAsync("EMULATOR");
    await this.checkAdServiceAvailability();
  }

  private async checkAdServiceAvailability(): Promise<void> {
    try {
      this.isAdServiceAvailable = Platform.OS !== "web";
    } catch {
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
      await AdMobRewarded.setAdUnitID(REWARDED_AD_UNIT_ID!);
      await AdMobRewarded.requestAdAsync({ servePersonalizedAds: true });

      return new Promise((resolve) => {
        const onReward = () => {
          AdMobRewarded.removeAllListeners();
          resolve(true);
        };

        const onClose = () => {
          AdMobRewarded.removeAllListeners();
          resolve(false);
        };

        AdMobRewarded.addEventListener(
          "rewardedVideoUserDidEarnReward",
          onReward,
        );
        AdMobRewarded.addEventListener("rewardedVideoDidDismiss", onClose);

        AdMobRewarded.showAdAsync();
      });
    } catch {
      return false;
    }
  }

  public async notifyAdCompletion(userId: string): Promise<AdResponse> {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return {
          success: false,
          message: "Token bulunamadı.",
        };
      }

      const response = await fetch(`${this.API_URL}/mining/ad-completed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          platform: Platform.OS,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch {
      return {
        success: false,
        message: "Reklam tamamlama bildirimi gönderilemedi.",
      };
    }
  }
}

export default AdsService;
