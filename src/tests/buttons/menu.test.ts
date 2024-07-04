import { ProductRepository } from '../../DB/requestsToDB';
import { MenuButtons } from '../../buttons/buttonsMenu';

describe('MenuButtons', () => {
  let productRepository: Partial<ProductRepository>;
  let menuButtons: MenuButtons;

  describe("creatingMenuListProductNameIdButtons()", () => {
    beforeEach(() => {
      productRepository = {
        respondsToMenuListProductNameId: jest.fn().mockResolvedValue([
          { product_name: "Product A", product_id: "1" },
          { product_name: "Product B", product_id: "2" },
          { product_name: "Product D", product_id: "4" },
        ]),
      };
      menuButtons = new MenuButtons(productRepository as ProductRepository);
    });

    it("создать клавиатуру из результата запроса продуктов", async () => {
      const result = await menuButtons.creatingMenuListProductNameIdButtons();
      expect(result).toBeDefined();
      expect(result.reply_markup.inline_keyboard).toHaveLength(3);//проверка того что есть длинна и она равно 3
      expect(result.reply_markup.inline_keyboard[0][0]).toEqual({//рекурсивное сравнение всех обьектов
        text: "Product A",
        callback_data: "1",
      });
      expect(result.reply_markup.inline_keyboard[1][0]).toEqual({
        text: "Product B",
        callback_data: "2",
      });
      expect(result.reply_markup.inline_keyboard[2][0]).toEqual({
        text: "Product D",
        callback_data: "4",
      });
    });
  });

  describe('creatingMenuListCategoryNameLeftButtons()', () => {
    beforeEach(() => {
      productRepository = {
        respondsToMenuListCategoryNameLeft: jest.fn().mockResolvedValue([
          { category_name_left: "Category A" },
          { category_name_left: "Другое" },
          { category_name_left: "Category D" },
        ]),
      };
      menuButtons = new MenuButtons(productRepository as ProductRepository);
    });

    it("создать клавиатуру из результата запроса продуктов", async () => {
      const result = await menuButtons.creatingMenuListCategoryNameLeftButtons();
      expect(result).toBeDefined();
      expect(result.reply_markup.inline_keyboard).toHaveLength(3);//проверка того что есть длинна и она равно 3
      expect(result.reply_markup.inline_keyboard[0][0]).toEqual({//рекурсивное сравнение всех обьектов
        text: "Category A",
        callback_data: "menuCategoriesOpen//Category A",
      });
      expect(result.reply_markup.inline_keyboard[1][0]).toEqual({
        text: "Category D",
        callback_data: "menuCategoriesOpen//Category D",
      });
      expect(result.reply_markup.inline_keyboard[2][0]).toEqual({
        text: "Другое",
        callback_data: "menuCategoriesOpen//Другое",
      });
    })
  });

  describe("selectionRandomProduct()", () => {
    beforeEach(() => {
      productRepository = {
        respondsToMenuListProductNameId: jest.fn().mockResolvedValue([
          { product_name: "Product A", product_id: "1" },
          { product_name: "Product B", product_id: "2" },
          { product_name: "Product D", product_id: "4" },
        ]),
      };
      menuButtons = new MenuButtons(productRepository as ProductRepository);
    });

    it("выбор случайного товара", async () => {
      const result = await menuButtons.selectionRandomProduct();
      expect(result).toBeDefined();
      expect(["1", "2", "4"]).toContain(result);
    });
  });

  describe("creatingMenuListByCategoryButtons()", () => {
    beforeEach(() => {
      productRepository = {
        respondsToMenuListByCategory: jest.fn().mockResolvedValue([
          { product_id: "1", product_name: "Product A", category_name_left: "Category_left A", category_name: "Category A" },
          { product_id: "2", product_name: "Product B", category_name_left: "Category_left A", category_name: "Category B" },
          { product_id: "3", product_name: "Product C", category_name_left: "Category_left A", category_name: "Category C" },
        ]),
      };
      menuButtons = new MenuButtons(productRepository as ProductRepository);
    });

    it("создать клавиатуру из результата запроса категории", async () => {
      const result = await menuButtons.creatingMenuListByCategoryButtons("Category_left A");
      expect(result).toBeDefined();
      expect(result.reply_markup.inline_keyboard).toHaveLength(4);//проверка того что есть длинна и она равно 3
      expect(result.reply_markup.inline_keyboard[0][0]).toEqual({//рекурсивное сравнение всех обьектов
        text: `Раскрыть категорию *Category_left A*`,
        callback_data: "subcategories//Category_left A",
      });
      expect(result.reply_markup.inline_keyboard[1][0]).toEqual({
        text: "Product A",
        callback_data: "1",
      });
      expect(result.reply_markup.inline_keyboard[2][0]).toEqual({
        text: "Product B",
        callback_data: "2",
      });
      expect(result.reply_markup.inline_keyboard[3][0]).toEqual({
        text: "Product C",
        callback_data: "3",
      });
    });
  });

  describe("creatingMenuListCategoryNameButtons()", () => {
    beforeEach(() => {
      productRepository = {
        respondsToMenuListCategoryName: jest.fn().mockResolvedValue([
          { category_name: "Category A" },
          { category_name: "Category B" },
          { category_name: "Category C" },
        ]),
      };
      menuButtons = new MenuButtons(productRepository as ProductRepository);
    });

    it("создать клавиатуру из результата запроса подкатегорий", async () => {
      const result = await menuButtons.creatingMenuListCategoryNameButtons('Category_left A');
      expect(result).toBeDefined();
      expect(result.reply_markup.inline_keyboard).toHaveLength(3);//проверка того что есть длинна и она равно 3
      expect(result.reply_markup.inline_keyboard[0][0]).toEqual({//рекурсивное сравнение всех обьектов
        text: "Category A",
        callback_data: "menuCategoriesTwo//Category A",
      });
      expect(result.reply_markup.inline_keyboard[1][0]).toEqual({//рекурсивное сравнение всех обьектов
        text: "Category B",
        callback_data: "menuCategoriesTwo//Category B",
      });
      expect(result.reply_markup.inline_keyboard[2][0]).toEqual({//рекурсивное сравнение всех обьектов
        text: "Category C",
        callback_data: "menuCategoriesTwo//Category C",
      });
    });
  });

  describe("creatingMenuListProductNameIdSubcategoryButtons()", () => {
    beforeEach(() => {
      productRepository = {
        respondsToMenuListProductNameIdSubcategory: jest.fn().mockResolvedValue([
          { product_id: "1", product_name: "Product A" },
          { product_id: "2", product_name: "Product B" },
          { product_id: "4", product_name: "Product D" },
        ]),
      };
      menuButtons = new MenuButtons(productRepository as ProductRepository);
    });

    it("создать клавиатуру из результата запроса открытой подкатегории", async () => {
      const result = await menuButtons.creatingMenuListProductNameIdSubcategoryButtons('Category A');
      expect(result).toBeDefined();
      expect(result.reply_markup.inline_keyboard).toHaveLength(3);//проверка того что есть длинна и она равно 3
      expect(result.reply_markup.inline_keyboard[0][0]).toEqual({//рекурсивное сравнение всех обьектов
        text: "Product A",
        callback_data: "1",
      });
      expect(result.reply_markup.inline_keyboard[1][0]).toEqual({
        text: "Product B",
        callback_data: "2",
      });
      expect(result.reply_markup.inline_keyboard[2][0]).toEqual({
        text: "Product D",
        callback_data: "4",
      });
    });
  });
});