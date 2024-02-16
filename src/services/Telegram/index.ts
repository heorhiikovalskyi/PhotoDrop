import TelegramBot from 'node-telegram-bot-api';
import { Storage } from './types';

const { TELEGRAM_API_TOKEN } = process.env;

export const bot = new TelegramBot(TELEGRAM_API_TOKEN!, {
  polling: true,
});

class Telegram {
  bot: TelegramBot;
  chatId: string;
  storage: Storage;
  constructor(storage: Storage) {
    this.bot = bot;
    this.chatId = '462675613';
    this.storage = storage;
  }

  public sendMessage = async (message: string) => {
    await this.bot.sendMessage(this.chatId, message);
    this.storage.insertMessage(message);
  };

  public getMessages = () => {
    return this.storage.messages.map((message) => message.text);
  };

  public getValidMessages = () => {
    return this.storage.getValidMessages().map((message) => message.text);
  };
}

export default Telegram;
