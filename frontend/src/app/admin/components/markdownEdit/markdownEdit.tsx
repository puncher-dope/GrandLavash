import { MarkDownProps } from "@/app/lib/types/markdownPropsType";
import React from "react";
import "./index.scss";
import { useProducts } from "@/app/admin/context/productContext/productsContext";
import MainCardEdit from "./components/mainCardEdit/mainCardEdit";
import { Button } from "antd";

const MarkdownEdit = ({
  handleInputChange,
  handleSave,
  setIsEditing,
}: MarkDownProps) => {
  const { deleteProduct } = useProducts();

  const handleDelete = async () => {
    try {
      await deleteProduct();
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при сохранении продукта:", error);
    }
  };

  return (
    <div className="markdown-edit">
      <h3 className="markdown-edit__title">Редактирование продукта</h3>

      {/* Основная информация о продукте */}
      <MainCardEdit handleInputChange={handleInputChange}/>


      {/* Кнопки действий */}
      <div className="markdown-edit__buttons">
        <Button
          type="primary"
          onClick={handleSave}
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
        <Button
          danger
          onClick={handleDelete}
          className="markdown__button markdown__button--delete"
        >
          Удалить
        </Button>
      </div>
    </div>
  );
};

export default MarkdownEdit;