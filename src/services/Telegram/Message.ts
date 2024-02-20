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
