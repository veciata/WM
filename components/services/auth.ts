import AsyncStorage from '@react-native-async-storage/async-storage';

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

  public async login(data: { email: string; password: string }) {
    try {
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.access_token) {
        await this.saveAuthData(result.access_token, result.user);
        return {
          success: true,
          token: result.access_token,
          user: result.user,
        };
      }

      return {
        success: false,
        message: result.message || 'Login failed',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred. Please try again later.',
      };
    }
  }

  private async saveAuthData(token: string, user: any) {
    try {
      await AsyncStorage.multiSet([
        ['token', token],
        ['user', JSON.stringify(user)],
      ]);
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  }

  public async logout() {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
    } catch (error) {
      console.error('Error removing auth data:', error);
    }
  }

  public async isAuthenticated() {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  }
}

export default AuthService;
