import config from "@/config";

interface Wallet {
  id: number;
  userId: string;
  balance: number;
  lastUpdated: string;
}

interface WalletResponse {
  success: boolean;
  data?: Wallet[];
  message?: string;
}

class WalletService {
  private static instance: WalletService;

  private constructor() {}

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  public async getWalletHistory(token: string): Promise<WalletResponse> {
    try {
      const response = await fetch(config.API_URL + `/wallet-history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: result.data,
        };
      }

      return {
        success: false,
        message: result.message || "Cüzdan geçmişi alınamadı.",
      };
    } catch (error) {
      console.error("Wallet get error:", error);
      return {
        success: false,
        message: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      };
    }
  }
}

export default WalletService;
export type { Wallet, WalletResponse };
