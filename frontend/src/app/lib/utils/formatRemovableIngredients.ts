import { RemovableIngredientsType } from "../types/productsContextType";

// Функция для форматирования удаленных ингредиентов
export const formatRemovedIngredients = (removedIngredients: RemovableIngredientsType[] | undefined): string[] | null => {
  if (!removedIngredients || removedIngredients.length === 0) {
    return null;
  }

  // Просто возвращаем массив названий ингредиентов
  const removedIngredientsList = removedIngredients.map(item => item.name);

  return removedIngredientsList.length > 0 ? removedIngredientsList : null;
};