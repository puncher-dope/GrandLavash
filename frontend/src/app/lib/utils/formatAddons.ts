import { SelectedAddonWithQuantity } from "../types/cartTypes";


  // Функция для форматирования допов с правильной типизацией
 export const formatAddons = (selectedAddons: SelectedAddonWithQuantity | undefined): string[] | null => {
    if (!selectedAddons || Object.keys(selectedAddons).length === 0) {
      return null;
    }

    const addonsList: string[] = [];

    Object.entries(selectedAddons).forEach(([addonId, addonItems]) => {
      // Проверяем что addonItems существует и является массивом
      if (addonItems && Array.isArray(addonItems)) {
        addonItems.forEach((addonItem) => {
          // Проверяем что addonItem существует и имеет quantity
          if (addonItem && addonItem.quantity > 0) {
            const addonText = addonItem.quantity > 1 
              ? `${addonItem.optionName} (${addonItem.quantity} шт)`
              : addonItem.optionName;
            addonsList.push(addonText);
          }
        });
      }
    });

    return addonsList.length > 0 ? addonsList : null;
  };