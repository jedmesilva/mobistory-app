import { api, tokenManager } from '../config';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authService = {
  /**
   * Registrar novo usuário
   */
  async register(data: RegisterRequest): Promise<User> {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  /**
   * Fazer login
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);

    // Salvar token
    await tokenManager.setToken(response.data.access_token);

    // Buscar dados do usuário
    const user = await this.getCurrentUser();
    await tokenManager.setUser(user);

    return response.data;
  },

  /**
   * Obter usuário atual
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Fazer logout
   */
  async logout(): Promise<void> {
    await tokenManager.removeToken();
    await tokenManager.removeUser();
  },

  /**
   * Verificar se usuário está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await tokenManager.getToken();
    return !!token;
  },

  /**
   * Obter dados do usuário do storage
   */
  async getStoredUser(): Promise<User | null> {
    return await tokenManager.getUser();
  },
};
