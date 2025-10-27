import { api, tokenManager } from './config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export const authService = {
  /**
   * Faz login e armazena o token
   */
  async login(email: string, password: string): Promise<User> {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    const { access_token } = response.data;

    // Armazenar token
    await tokenManager.setToken(access_token);

    // Buscar dados do usuário
    const user = await this.getCurrentUser();
    await tokenManager.setUser(user);

    return user;
  },

  /**
   * Busca dados do usuário autenticado
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Faz logout
   */
  async logout(): Promise<void> {
    await tokenManager.removeToken();
    await tokenManager.removeUser();
  },

  /**
   * Verifica se há um usuário autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await tokenManager.getToken();
    return !!token;
  },

  /**
   * Retorna o usuário armazenado localmente
   */
  async getStoredUser(): Promise<User | null> {
    return await tokenManager.getUser();
  },
};
