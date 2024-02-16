import { PhotographersRepository } from '../../../repositories/Photographers';
import { NewPhotographer } from '../../../db/schema/photographers';
import { ValidationError } from '../../../types/classes/Errors';
import { AlbumsRepository } from '../../../repositories/Albums';

class PhotographersService {
  constructor(private photographers: PhotographersRepository, private albums: AlbumsRepository) {}
  public getAll = async () => {
    return await this.photographers.getAll();
  };

  public insertOne = async (photographer: NewPhotographer) => {
    const { password, login } = photographer;

    if (password.length !== 8) {
      throw new ValidationError('password length is 8');
    }

    if (!/^[a-zA-Z_]+$/.test(login)) {
      throw new ValidationError('login contains symbols and _');
    }

    await this.photographers.insertOne(photographer);
  };

  public deleteOne = async (id: number) => {
    await this.photographers.deleteOne(id);
  };

  public getByLogin = async (login: string) => {
    return await this.photographers.getByLogin(login);
  };

  public getAllAlbums = async (photographerId: number) => {
    return await this.albums.getByPhotographer(photographerId);
  };
}

export default PhotographersService;
