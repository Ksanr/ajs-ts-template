import Buyable from '../domain/Buyable';
import CountableBuyable from '../domain/CountableBuyable';

type CartItem = {
  item: Buyable;
  quantity: number;
};

export default class Cart {
  private _items: CartItem[] = [];

  add(item: Buyable): void {
    const existing = this._items.find(i => i.item.id === item.id);
    if (existing) {
      // Если товар уже есть и он поддерживает количество – увеличиваем количество
      if ((item as CountableBuyable).quantity !== undefined) {
        existing.quantity += (item as CountableBuyable).quantity;
      }
      // Для обычных товаров (не CountableBuyable) повторное добавление игнорируем
    } else {
      // Товара нет в корзине – добавляем
      const isCountable = (item as CountableBuyable).quantity !== undefined;
      const quantity = isCountable ? (item as CountableBuyable).quantity : 1;
      this._items.push({ item, quantity });
    }
  }

  get items(): Buyable[] {
    return this._items.flatMap(cartItem =>
      Array(cartItem.quantity).fill(cartItem.item)
    );
  }

  totalCost(): number {
    return this._items.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
  }

  discountedCost(discount: number): number {
    return this.totalCost() * (1 - discount / 100);
  }

  removeById(id: number): void {
    const index = this._items.findIndex(i => i.item.id === id);
    if (index !== -1) {
      this._items.splice(index, 1);
    }
  }

  increaseQuantity(id: number): void {
    const entry = this._items.find(i => i.item.id === id);
    if (entry && (entry.item as CountableBuyable).quantity !== undefined) {
      entry.quantity++;
    }
  }

  decreaseQuantity(id: number): void {
    const entry = this._items.find(i => i.item.id === id);
    if (entry && (entry.item as CountableBuyable).quantity !== undefined) {
      if (entry.quantity > 1) {
        entry.quantity--;
      } else {
        this.removeById(id);
      }
    }
  }
}
