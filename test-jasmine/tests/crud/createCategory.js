import { addCategory, createCategory, getCategories } from '../../../scripts/categories.js'

describe('createCategory testing', function () {
    beforeEach(function () {
        localStorage.clear();
    })

    it('creates a category with the correct properties', function () {
        const result = createCategory('salary', 'income', 'ff0000')

        expect(result.id).toBe(1);
        expect(result.category).toBe('salary');
        expect(result.type).toBe('income');
        expect(result.color).toBe('ff0000');
        expect(result.transactions).toBe(0);
        expect(result.amount).toBe(0);

    })

    it('converts result to lowercase', function () {
        const result = createCategory('SALARY', 'income', 'ff0000')

        expect(result.category).toBe('salary');

    })

    it('adds category to storage', function () {
        const result = createCategory('SALARY', 'income', 'ff0000')

        addCategory(result)

        const categories = getCategories();

        expect(categories.length).toBe(1);

    })

    it('correctly assigns the next id', function () {
        const first = createCategory('SALARY', 'income', 'ff0000')

        addCategory(first)

        const second = createCategory('grocery', 'expense', '00ff00')

        expect(second.id).toBe(2);
  

    })

})