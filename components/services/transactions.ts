import config from "@/config";

interface Transaction {
  id: number;
  userId: string;
  type: "mining" | "transfer" | "reward";
  amount: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  description?: string;
}

interface TransactionResponse {
  success: boolean;
  data?: Transaction[];
  message?: string;
}

class TransactionService {
  private static instance: TransactionService;

  private constructor() {}

  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  public async getTransactions(token: string): Promise<TransactionResponse> {
    try {
      const response = await fetch(config.API_URL + `/transactions`, {
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
        message: result.message || "İşlem geçmişi alınamadı.",
      };
    } catch (error) {
      console.error("Transaction get error:", error);
      return {
        success: false,
        message: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      };
    }
  }
}

export default TransactionService;
export type { Transaction, TransactionResponse };
