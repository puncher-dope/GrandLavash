import { Button, Card, Input } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { CardEditProps } from "../mainCardEdit/mainCardEdit";
import { useProducts } from "@/app/admin/context/productContext/productsContext";

const RemovableCardEdit = ({ handleInputChange}: CardEditProps) => {
  const {editedData} = useProducts()
  
    // Функции для работы с удаляемыми ингредиентами
  const handleAddRemovableIngredient = () => {
    const newIngredient = { name: "" };
    const updatedIngredients = [
      ...editedData.removableIngredients,
      newIngredient,
    ];

    handleInputChange("removableIngredients", updatedIngredients);
  };


  const handleRemoveRemovableIngredient = (index: number) => {
    const updatedIngredients = editedData.removableIngredients.filter(
      (_, i) => i !== index
    );
    handleInputChange("removableIngredients", updatedIngredients);
  };

  const handleRemovableIngredientChange = (index: number, value: string) => {
    const updatedIngredients = editedData.removableIngredients.map(
      (ingredient, i) =>
        i === index ? { ...ingredient, name: value } : ingredient
    );
    handleInputChange("removableIngredients", updatedIngredients);
  };

  return (
    <Card
      title="Удаляемые ингредиенты"
      size="small"
      className="markdown-edit__section"
      extra={
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAddRemovableIngredient}
          size="small"
        >
          Добавить ингредиент
        </Button>
      }
    >
      {editedData.removableIngredients.length === 0 ? (
        <p className="markdown-edit__empty">Ингредиенты не добавлены</p>
      ) : (
        editedData.removableIngredients.map((ingredient, index) => (
          <div key={index} className="markdown-edit__ingredient-item">
            <Input
              placeholder="Название ингредиента"
              value={ingredient.name}
              onChange={(e) =>
                handleRemovableIngredientChange(index, e.target.value)
              }
              addonAfter={
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveRemovableIngredient(index)}
                  size="small"
                />
              }
            />
          </div>
        ))
      )}
    </Card>
  );
};

export default RemovableCardEdit;
