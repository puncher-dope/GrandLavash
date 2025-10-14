  // Функция для форматирования удаленных ингредиентов
  export const formatRemovedIngredients = (removedIngredients: string[] = []) => {
    if (!removedIngredients || removedIngredients.length === 0) {
      return null;
    }

    return removedIngredients.map((ingredient) => `Без ${ingredient}`);
  };