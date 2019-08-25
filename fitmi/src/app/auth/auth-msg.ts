import { HttpRequest, HttpResponse } from '../../http-msg';
import { User } from 'src/model/user';

export interface AuthRequest extends HttpRequest {
  username: string;
  password: string;

}

export interface AuthResponse extends HttpResponse, User { }
