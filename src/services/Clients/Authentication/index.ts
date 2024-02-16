import Telegram from '../../Telegram';
import { ClientsRepository } from '../../../repositories/Clients';
import { AuthorizationError } from '../../../types/classes/Errors';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { SECRET_JWT_KEY } = process.env;

if (!SECRET_JWT_KEY) {
  throw new Error('check .env for secret key');
}

class ClientAuthenticationService {
  constructor(private telegram: Telegram, private clients: ClientsRepository) {}

  public sendCode = async (number: string) => {
    const code = Math.floor(100000 + Math.random() * 900000);
    const message = `${number}/${code}`;
    await this.telegram.sendMessage(message);
  };

  public getClientMessagesNumber = (number: string) => {
    const messages = this.telegram.getMessages();
    return messages.filter((message) => message.startsWith(`${number}/`)).length;
  };

  public verifyCode = (number: string, code: string) => {
    const messages = this.telegram.getValidMessages();
    const lastClientMessage = messages
      .slice()
      .reverse()
      .find((message) => message.startsWith(`${number}/`));
    return lastClientMessage === `${number}/${code}`;
  };

  public issueToken = async (number: string) => {
    const client = await this.clients.getByNumber(number);

    if (!client) {
      throw new AuthorizationError('not valid number');
    }

    const { id: clientId } = client;

    const payload = {
      id: clientId,
      role: 'client',
    };

    const options = {
      expiresIn: '24h',
    };

    const token = jwt.sign(payload, SECRET_JWT_KEY!, options);

    return token;
  };

  public insertClient = async (number: string) => {
    const client = { number };
    return await this.clients.insertOne(client);
  };

  public getClient = async (number: string) => {
    return await this.clients.getByNumber(number);
  };
}

export default ClientAuthenticationService;
