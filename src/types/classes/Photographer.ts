import { NewPhotographer } from '../types/Photographer';

export class Photographer {
  login: string;
  password: string;
  id?: number;
  fullname?: string | null;
  email?: string | null;

  constructor(photographer: NewPhotographer) {
    this.login = photographer.login;
    this.password = photographer.password;
    this.id = photographer.id;
    this.fullname = photographer.fullname;
    this.email = photographer.email;
  }
}
