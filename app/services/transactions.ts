interface Transaction {
  id: number;
  userId: string;
  type: 'mining' | 'transfer' | 'reward';
  amount: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
}

interface TransactionResponse {
  success: boolean;
  data?: Transaction[];
  message?: string;
}

class TransactionService {
  private static instance: TransactionService;
  private readonly API_URL = 'https://www.api.world-moneys.com/public/api';

  private constructor() {}

  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  public async getTransactions(userId: string, token: string): Promise<TransactionResponse> {
    try {
      const response = await fetch(`${this.API_URL}/transactions/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
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
        message: result.message || 'İşlem geçmişi alınamadı.',
      };
    } catch (error) {
      console.error('Get transactions error:', error);
      return {
        success: false,
        message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
      };
    }
  }
}

export default TransactionService;
export type { Transaction, TransactionResponse };
