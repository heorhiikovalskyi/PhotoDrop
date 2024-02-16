export class Message {
  private _date: Date;
  private _text: string;
  constructor(date: Date = new Date(), text: string) {
    this._date = date;
    this._text = text;
  }
  get text(): string {
    return this._text;
  }
  get date(): Date {
    return this._date;
  }

  isOld = (minutes: number) => {
    const differenceInMilliseconds = new Date().getTime() - this.date.getTime();
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    return differenceInMinutes >= minutes;
  };
}

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
