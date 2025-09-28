// Компонент модального окна
import './index.scss'


export const ProductEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="product-editor-modal">
      <div 
        className="product-editor-modal__overlay" 
        onClick={onClose}
      >
        <div 
          className="product-editor-modal__content" 
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="product-editor-modal__close"
            onClick={onClose}
          >
            ×
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};