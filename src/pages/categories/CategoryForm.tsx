import React, { useState, useEffect } from 'react';
import { useCategoryStore } from '../../stores/categoryStore';
import { X } from 'lucide-react';

interface CategoryFormProps {
  categoryId: number | null;
  onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryId, onClose }) => {
  const { categories, addCategory, updateCategory, isLoading } = useCategoryStore();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const isEditing = categoryId !== null;
  
  useEffect(() => {
    if (isEditing) {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        setName(category.name);
      }
    } else {
      setName('');
    }
  }, [categoryId, categories, isEditing]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }
    
    try {
      if (isEditing && categoryId !== null) {
        await updateCategory(categoryId, name);
      } else {
        await addCategory(name);
      }
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred');
      }
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Category' : 'Add New Category'}
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 text-sm rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="category-name" className="form-label">
            Category Name
          </label>
          <input
            type="text"
            id="category-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="e.g., Entertainment, Food, Transport"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update Category' : 'Add Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;