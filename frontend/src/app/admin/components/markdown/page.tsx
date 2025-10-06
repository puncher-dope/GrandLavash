// markdown.tsx - исправленная версия
import { MarkDownEditProps } from "@/app/lib/types/markdownPropsType";
import ReactMarkdown from "react-markdown";
import React from "react";
import { Button } from "antd";

const Markdown = ({
  selectedProduct,
  setIsEditing,
  handleDelete,
}: MarkDownEditProps) => {
  return (
    <div className="markdown">
      <h1 className="markdown__title">{selectedProduct.name}</h1>
      
      {/* Добавьте блок с описанием */}
      {selectedProduct.description && (
        <div className="markdown__description">
          <h3>Описание:</h3>
          <ReactMarkdown>{selectedProduct.description}</ReactMarkdown>
        </div>
      )}
      
      <div className="markdown__content">
        <ReactMarkdown>{selectedProduct.categories}</ReactMarkdown>
      </div>
      
      <div className="markdown__actions">
        <Button
          type="primary"
          onClick={() => setIsEditing(true)}
          className="markdown__button markdown__button--change"
        >
          Редактировать
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

export default Markdown;