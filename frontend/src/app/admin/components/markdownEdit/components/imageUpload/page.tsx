// components/ImageUpload.tsx
import { useState } from 'react';
import { Upload, Button, message, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type {  UploadProps } from 'antd';
import { compressImage } from '@/app/lib/utils/compressImage';

interface ImageUploadProps {
  value?: string;
  onChange?: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);

  const handleCustomRequest: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    
    setLoading(true);
    
    try {
      const compressBase64 = await compressImage(file as File, 0.7)
      onChange?.(compressBase64)
      onSuccess?.(compressBase64)
      setLoading(false)
      message.success('Изображение загружено и сжато')
    } catch (error) {
      onError?.(error as Error);
      setLoading(false);
      message.error('Ошибка загрузки изображения');
    }
  };

  const handleRemove = () => {
    onChange?.('');
    message.info('Изображение удалено');
  };

  const uploadProps: UploadProps = {
    name: 'image',
    listType: 'picture',
    showUploadList: false,
    customRequest: handleCustomRequest,
    accept: 'image/jpeg,image/jpg,image/png,image/webp,image/gif',
    beforeUpload: (file) => {
      const allowedTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/webp',
        'image/gif'
      ];
      
      const isValidType = allowedTypes.includes(file.type);
      if (!isValidType) {
        message.error('Можно загружать только JPG, PNG, WebP или GIF файлы!');
        return false;
      }
      
      const isLt5M = file.size / 1024 / 1024 < 10;
      if (!isLt5M) {
        message.error('Изображение должно быть меньше 5MB!');
        return false;
      }
      
      return true;
    }
  }

  return (
    <div className="image-upload">
      {value ? (
        <div className="image-upload__preview">
          <div className="image-upload__image-container">
            <Image
              src={value}
              alt="Preview"
              width={200}
              height={200}
              className="image-upload__image"
            />
          </div>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleRemove}
            className="image-upload__remove-btn"
            size="small"
          >
            Удалить
          </Button>
        </div>
      ) : (
        <Upload {...uploadProps}>
          <Button 
            icon={<UploadOutlined />} 
            loading={loading}
            size="large"
            className="image-upload__upload-btn"
          >
            Выбрать из галереи
          </Button>
        </Upload>
      )}
      
      <div className="image-upload__help-text">
        {value ? 'Изображение загружено' : 'Нажмите чтобы выбрать фото из галереи'}
      </div>
    </div>
  );
};

export default ImageUpload;