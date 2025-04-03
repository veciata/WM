import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthResponse {
  success: boolean;
  token?: string;
  userId?: string;
  message?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  username: string;
}

class AuthService {
  private static instance: AuthService;
  private readonly API_URL = 'https://www.api.world-moneys.com/public/api';

  private constructor() {}

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

      if (response.ok && result.token) {
        await this.saveAuthData(result.token, result.userId);
        return {
          success: true,
          token: result.token,
          userId: result.userId,
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

  public async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        await this.saveAuthData(result.token, result.userId);
        return {
          success: true,
          token: result.token,
          userId: result.userId,
        };
      }

      return {
        success: false,
        message: result.message || 'Kayıt başarısız oldu.',
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
      };
    }
  }

  public async googleSignIn(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        await this.saveAuthData(result.token, result.userId);
        return {
          success: true,
          token: result.token,
          userId: result.userId,
        };
      }

      return {
        success: false,
        message: result.message || 'Google ile giriş başarısız oldu.',
      };
    } catch (error) {
      console.error('Google sign in error:', error);
      return {
        success: false,
        message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
      };
    }
  }

  public async logout(): Promise<void> {
    await AsyncStorage.multiRemove(['token', 'userId']);
  }

  public async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  }

  private async saveAuthData(token: string, userId: string): Promise<void> {
    await AsyncStorage.multiSet([
      ['token', token],
      ['userId', userId],
    ]);
  }

  public async getAuthToken(): Promise<string | null> {
    return AsyncStorage.getItem('token');
  }
}

export default AuthService;
