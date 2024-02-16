import { ClientsRepository } from '../../../repositories/Clients';

class EditProfileService {
  constructor(private clients: ClientsRepository) {}

  public updateName = async (clientId: number, name: string) => {
    await this.clients.updateName(clientId, name);
  };
  public updateEmail = async (clientId: number, email: string) => {
    await this.clients.updateEmail(clientId, email);
  };
}

export default EditProfileService;
