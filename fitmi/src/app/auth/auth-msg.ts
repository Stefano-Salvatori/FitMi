export interface AuthRequest {
  username: string;
  password: string;

}

export interface AuthResponse {
  accessToken: string;
  expirationTime: number;
}
