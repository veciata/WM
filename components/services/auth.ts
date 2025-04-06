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
  private readonly API_URL = 'http://localhost:80/api';

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
        await this.saveAuthData(result.access_token, result.user.id.toString(), result.user);
        return {
          success: true,
          token: result.access_token,
          userId: result.user.id.toString(),
        };
      }

      console.error('API Response:', result); // API yanıtını burada daha detaylı logluyoruz.
      return {
        success: false,
        message: result.message || 'Giriş başarısız oldu.',
      };
    } catch (error) {
      console.error('Login error:', error); // Hata detayları burada loglanır.
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
        await this.saveAuthData(result.token, result.userId, result.user);
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

  public async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  }

  private async saveAuthData(token: string, userId: string, user: any): Promise<void> {
    await AsyncStorage.multiSet([
      ['token', token],
      ['userId', userId],
      ['user', JSON.stringify(user)],
    ]);
  }

  public async getAuthToken(): Promise<string | null> {
    return AsyncStorage.getItem('token');
  }

  public async getUser(): Promise<any> {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  public async logout(): Promise<void> {
    await AsyncStorage.multiRemove(['token', 'userId', 'user']);
  }
}

export default AuthService;
