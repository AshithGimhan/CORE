import { createCategory, addCategory, deleteCategoryById, getCategories } from '../../../scripts/categories.js'

describe('deleteCategoryById testing', function () {
    beforeEach(function () {
        localStorage.clear();
    })

    it('removes the category with the matching id', function () {
        const first = createCategory('SALARY', 'income', 'ff0000')

        addCategory(first);

        const second = createCategory('grocery', 'expense', '00ff00')

        addCategory(second);

        const categories = deleteCategoryById(2);

        expect(categories.length).toBe(1)

    })

})