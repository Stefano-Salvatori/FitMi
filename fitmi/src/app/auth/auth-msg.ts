import { HttpRequest, HttpResponse } from '../http-msg';

export interface AuthRequest extends HttpRequest {
  username: string;
  password: string;

}

export interface AuthResponse extends HttpResponse {
  accessToken: string;
  expirationTime: number;
}
