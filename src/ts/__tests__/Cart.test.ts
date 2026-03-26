import Cart from '../service/Cart';
import Book from '../domain/Book';
import MusicAlbum from '../domain/MusicAlbum';
import Movie from '../domain/Movie';

describe('Cart', () => {
  let cart: Cart;
  const book = new Book(1, 'Book', 'Author', 100, 300);
  const music = new MusicAlbum(2, 'Album', 'Artist', 200);
  const movie = new Movie(3, 'Movie', 150, 2020, 'USA', 'Slogan', ['Action'], 120);

  beforeEach(() => {
    cart = new Cart();
    cart.add(book);
    cart.add(music);
    cart.add(movie);
  });

  test('totalCost should return sum of all items', () => {
    expect(cart.totalCost()).toBe(100 + 200 + 150);
  });

  test('discountedCost should apply discount correctly', () => {
    const total = cart.totalCost();
    const discount = 10;
    expect(cart.discountedCost(discount)).toBeCloseTo(total * (1 - discount / 100));
  });

  test('removeById should remove item with given id', () => {
    cart.removeById(2);
    expect(cart.items).toEqual([book, movie]);
    expect(cart.items.length).toBe(2);
  });

  test('removeById should do nothing if id not found', () => {
    cart.removeById(999);
    expect(cart.items.length).toBe(3);
  });

  test('items getter returns a copy', () => {
    const items = cart.items;
    items.pop();
    expect(cart.items.length).toBe(3);
  });
});
