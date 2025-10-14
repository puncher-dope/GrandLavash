import { Button, Card, Input, InputNumber, Space, Switch } from "antd";

import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { CardEditProps } from "../mainCardEdit/mainCardEdit";
import { useProducts } from "@/app/admin/context/productContext/productsContext";



const AddonCardEdit = ({ handleInputChange}: CardEditProps) => {

  const {editedData} = useProducts()

      // Функции для работы с дополнениями
  const handleAddAddon = () => {
    const newAddon = {
      name: "",
      price: 0,
      required: false,
      maxQuantity: 1,
    };
    const updatedAddons = [...editedData.addons, newAddon];
    handleInputChange("addons", updatedAddons);
  };

  const handleRemoveAddon = (index: number) => {
    const updatedAddons = editedData.addons.filter((_, i) => i !== index);
    handleInputChange("addons", updatedAddons);
  };

  const handleAddonChange = (
    index: number,
    field: keyof (typeof editedData.addons)[0],
    value: string | number | boolean
  ) => {
    const updatedAddons = editedData.addons.map((addon, i) =>
      i === index ? { ...addon, [field]: value } : addon
    );
    handleInputChange("addons", updatedAddons);
  };


  return (
    <Card
      title="Дополнения"
      size="small"
      className="markdown-edit__section"
      extra={
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAddAddon}
          size="small"
        >
          Добавить дополнение
        </Button>
      }
    >
      {editedData.addons.length === 0 ? (
        <p className="markdown-edit__empty">Дополнения не добавлены</p>
      ) : (
        editedData.addons.map((addon, index) => (
          <Card
            key={index}
            size="small"
            className="markdown-edit__subcard"
            title={`Дополнение ${index + 1}`}
            extra={
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveAddon(index)}
                size="small"
              />
            }
          >
            <Space direction="vertical" style={{ width: "100%" }} size="small">
              <Input
                placeholder="Название дополнения"
                value={addon.name}
                onChange={(e) =>
                  handleAddonChange(index, "name", e.target.value)
                }
              />
              <InputNumber
                placeholder="Цена дополнения"
                value={addon.price}
                onChange={(value) =>
                  handleAddonChange(index, "price", value || 0)
                }
                style={{ width: "100%" }}
                min={0}
              />
              <div className="markdown-edit__switch">
                <span>Обязательное:</span>
                <Switch
                  checked={addon.required}
                  onChange={(checked) =>
                    handleAddonChange(index, "required", checked)
                  }
                />
              </div>
              <InputNumber
                placeholder="Максимальное количество"
                value={addon.maxQuantity}
                onChange={(value) =>
                  handleAddonChange(index, "maxQuantity", value || 1)
                }
                style={{ width: "100%" }}
                min={1}
              />
            </Space>
          </Card>
        ))
      )}
    </Card>
  );
};

export default AddonCardEdit;
