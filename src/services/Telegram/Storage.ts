import { Message } from './Message';

export class Storage {
  private _messages: Message[];
  private lifeTime: number;
  private validTime: number;

  constructor(lifeTime: number, validTime: number) {
    this._messages = [];
    this.lifeTime = lifeTime;
    this.validTime = validTime;
  }

  clear = () => {
    this._messages = this._messages.filter((message) => !message.isOld(this.lifeTime));
  };

  insertMessage = (message: string) => {
    this._messages.push(new Message(undefined, message));
  };

  get messages(): Message[] {
    this.clear();
    return this._messages;
  }

  getValidMessages(): Message[] {
    return this._messages.filter((message) => !message.isOld(this.validTime));
  }
}
