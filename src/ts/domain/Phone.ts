import CountableBuyable from './CountableBuyable';

export default class Phone implements CountableBuyable {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly price: number,
    public quantity: number = 1,
  ) {}
}
