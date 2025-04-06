import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthResponse {
  success: boolean;
  token?: string;
  userId?: string;
  message?: string;
  user?: any;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
}

class AuthService {
  private static instance: AuthService;
  private readonly API_URL = 'http://192.168.1.102/api';

  private constructor() { }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.access_token && result.user?.id) {
        await this.saveAuthData(result.access_token, result.user);
        return {
          success: true,
          token: result.access_token,
          userId: result.user.id.toString(),
          user: result.user,
        };
      }

      return {
        success: false,
        message: result.message || 'Giriş başarısız oldu.',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
      };
    }
  }

  private async saveAuthData(token: string, user: any): Promise<void> {
    await AsyncStorage.multiSet([
      ['token', token],
      ['user', JSON.stringify(user)],  // User bilgilerini JSON string olarak kaydediyoruz
    ]);
  }

  public async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  }

  public async getUserData(): Promise<any> {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  public async getAuthToken(): Promise<string | null> {
    return AsyncStorage.getItem('token');
  }
}

export default AuthService;
