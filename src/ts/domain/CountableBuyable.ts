import Buyable from './Buyable';

export default interface CountableBuyable extends Buyable {
  quantity: number;
}
