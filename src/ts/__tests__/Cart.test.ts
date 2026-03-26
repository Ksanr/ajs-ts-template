import Cart from '../service/Cart';
import Book from '../domain/Book';
import Phone from '../domain/Phone';
import MusicAlbum from '../domain/MusicAlbum';
import Movie from '../domain/Movie';

describe('Корзина с товарами, имеющими количество', () => {
  let cart: Cart;
  const phone = new Phone(4, 'iPhone', 1000, 2);
  const book = new Book(1, 'Book', 'Author', 100, 300);
  const music = new MusicAlbum(2, 'Album', 'Artist', 200);
  const movie = new Movie(3, 'Movie', 150, 2020, 'USA', 'Slogan', ['Action'], 120);

  beforeEach(() => {
    cart = new Cart();
    cart.add(book);
    cart.add(phone);
    cart.add(music);
    cart.add(movie);
  });

  test('добавляем физический товар - увеличивается количество', () => {
    cart.add(phone); // добавляем ещё 2 телефона
    expect(cart.totalCost()).toBe(book.price + phone.price * (phone.quantity + 2) + music.price + movie.price);
    // Проверяем, что в items отображается 4 экземпляра телефона (2+2) и 1 книга
    const items = cart.items;
    expect(items.filter(i => i.id === phone.id).length).toBe(4);
    expect(items.filter(i => i.id === book.id).length).toBe(1);
    expect(items.filter(i => i.id === music.id).length).toBe(1);
    expect(items.filter(i => i.id === movie.id).length).toBe(1);
  });

  test('увеличение количества работает', () => {
    cart.increaseQuantity(phone.id);
    expect(cart.totalCost()).toBe(book.price + phone.price * (phone.quantity + 1) + music.price + movie.price);
  });

  test('уменьшение количества до 0', () => {
    cart.decreaseQuantity(phone.id); // было 2 -> станет 1
    expect(cart.totalCost()).toBe(book.price + phone.price * 1 + music.price + movie.price);
    cart.decreaseQuantity(phone.id); // стало 0
    expect(cart.totalCost()).toBe(book.price + music.price + movie.price);
  });

  test('уменьшение количества не влияет на цифровые товары', () => {
    cart.decreaseQuantity(book.id);
    expect(cart.totalCost()).toBe(book.price + phone.price * phone.quantity + music.price + movie.price);
  });

  test('подсчёт суммы со скидкой корректно применяет скидку', () => {
    expect(cart.discountedCost(10)).toBeCloseTo((2000 + 100 + 200 + 150) * 0.9);
  });
});

describe('Особые случаи', () => {
  test('добавление цифрового товара не увеличивает количество', () => {
    const cart = new Cart();
    const book = new Book(1, 'Book', 'Author', 100, 300);
    cart.add(book);
    cart.add(book);
    expect(cart.totalCost()).toBe(100);
    expect(cart.items.length).toBe(1);
  });

  test('увеличение количества не влияет на цифровые товары', () => {
    const cart = new Cart();
    const music = new MusicAlbum(2, 'Album', 'Artist', 200);
    cart.add(music);
    cart.increaseQuantity(music.id);
    expect(cart.totalCost()).toBe(200);
  });

  test('уменьшение количества не влияет на цифровые товары', () => {
    const cart = new Cart();
    const movie = new Movie(3, 'Movie', 150, 2020, 'USA', 'Slogan', ['Action'], 120);
    cart.add(movie);
    cart.decreaseQuantity(movie.id);
    expect(cart.totalCost()).toBe(150);
  });

  test('увеличение количества не влияет на несуществующие товары', () => {
    const cart = new Cart();
    cart.increaseQuantity(999);
    expect(cart.totalCost()).toBe(0);
  });

  test('уменьшение количества не влияет на несуществующие товары', () => {
    const cart = new Cart();
    cart.decreaseQuantity(999);
    expect(cart.totalCost()).toBe(0);
  });

  test('увеличение количества товаров, если их уже > 1', () => {
    const cart = new Cart();
    const phone = new Phone(4, 'iPhone', 1000, 2);
    cart.add(phone);
    cart.increaseQuantity(phone.id);
    expect(cart.totalCost()).toBe(phone.price * 3);
  });

  test('уменьшение количества товаров, когда их количество = 1', () => {
    const cart = new Cart();
    const phone = new Phone(4, 'iPhone', 1000, 1);
    cart.add(phone);
    cart.decreaseQuantity(phone.id);
    expect(cart.totalCost()).toBe(0);
  });

  test('удаление для несуществующего id ничего не удаляет', () => {
    const cart = new Cart();
    const book = new Book(1, 'Book', 'Author', 100, 300);
    cart.add(book);
    cart.removeById(999);
    expect(cart.totalCost()).toBe(100);
  });

});
