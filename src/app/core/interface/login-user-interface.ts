import {Todo} from './todo';

export interface LoginUserInterface {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
  },
  todos: Todo[]
}
