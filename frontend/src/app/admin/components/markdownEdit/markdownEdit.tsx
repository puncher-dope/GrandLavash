import { MarkDownProps } from "@/app/shared/types/markdownPropsType";
import { Button, Input } from "antd";
import React from "react";
import './index.scss'

const MarkdownEdit = ({
  editedData,
  handleInputChange,
  handleSave,
  setIsEditing,
}: MarkDownProps) => {
  return (
    <div className="markdownEdit">
      <Input
        className="markdownEdit__input"
        value={editedData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
      />
      <textarea
        className="markdownEdit__textarea"
        value={editedData.categories}
        onChange={(e) => handleInputChange("categories", e.target.value)}
      />
      <div className="markdownEdit__buttons">
        <Button
          type="primary"
          onClick={handleSave}
          className="markdownEdit__button markdownEdit__button--save"
        >
          Сохранить
        </Button>
        <Button
          onClick={() => setIsEditing(false)}
          className="markdownEdit__button markdownEdit__button--cancel"
        >
          Отмена
        </Button>
      </div>
    </div>
  );
};

export default MarkdownEdit;
