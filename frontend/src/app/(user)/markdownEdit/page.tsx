import React from "react";
import MainCardAdd from "./components/mainCardAdd/page";
import AddonCardAdd from "./components/addonCardAdd/page";
import RemovableCardAdd from "./components/removableCardAdd/page";
import { Button } from "antd";
import { useUser } from "@/app/lib/api/store/useUser";

const MarkdownEdit = () => {
  const { setIsEditing } = useUser();

  return (
    <div className="markdown-edit">
      <h3 className="markdown-edit__title">Добавьте продукт</h3>

      {/* Основная информация о продукте */}
      <MainCardAdd />

      {/* Дополнения */}
      <AddonCardAdd />

      {/* Удаляемые ингредиенты */}
      <RemovableCardAdd/>

      {/* Кнопки действий */}
      <div className="markdown-edit__buttons">
        <Button
          type="primary"
          className="markdown-edit__button markdown-edit__button--save"
        >
          Сохранить
        </Button>
        <Button
          onClick={() => setIsEditing(false)}
          className="markdown-edit__button markdown-edit__button--cancel"
        >
          Отмена
        </Button>
      </div>
    </div>
  );
};

export default MarkdownEdit;