import React, { useState } from 'react';
import { useCategoryStore } from '../../stores/categoryStore';
import { Plus, Edit, Trash2 } from 'lucide-react';
import CategoryForm from './CategoryForm';

const Categories: React.FC = () => {
  const { categories, deleteCategory, isLoading } = useCategoryStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleEditClick = (id: number) => {
    setEditingCategory(id);
    setIsAdding(false);
  };

  const handleDeleteClick = async (id: number) => {
    if (deleteConfirm === id) {
      try {
        // Optimistic UI update: Remove the category immediately
        const updatedCategories = categories.filter(category => category.id !== id);
        // Update the categories after deletion
        await deleteCategory(id);
      } catch (error) {
        console.error("Error deleting category:", error);
        // Optionally, revert the optimistic update if deletion fails
      } finally {
        // Reset delete confirmation
        setDeleteConfirm(null);
      }
    } else {
      setDeleteConfirm(id);
    }
  };

  const handleFormClose = () => {
    setIsAdding(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h2>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingCategory(null);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>

      {(isAdding || editingCategory !== null) && (
        <div className="card">
          <CategoryForm 
            categoryId={editingCategory} 
            onClose={handleFormClose} 
          />
        </div>
      )}

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Check if categories is an array */}
    {Array.isArray(categories) && categories.length === 0 ? (
      <div className="text-center text-gray-500 dark:text-gray-400">
        No Categories. Please click add to create.
      </div>
    ) : (
      // Ensure categories is always an array for mapping
      (Array.isArray(categories) ? categories : []).map(category => (
        <div 
          key={category.id} 
          className="card hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-200 border-2 border-transparent"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {category.name}
            </h3>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEditClick(category.id)}
                className="p-1.5 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={`Edit ${category.name}`}
              >
                <Edit className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleDeleteClick(category.id)}
                className={`p-1.5 ${
                  deleteConfirm === category.id
                    ? 'text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-900/20'
                    : 'text-gray-500 hover:text-error-600 dark:text-gray-400 dark:hover:text-error-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                } rounded-full transition-colors`}
                aria-label={deleteConfirm === category.id ? `Confirm delete ${category.name}` : `Delete ${category.name}`}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))
    )}

    {/* Show add category button if no categories */}
    {Array.isArray(categories) && categories.length === 0 && !isLoading && (
      <div className="col-span-full card bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700">
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400">No categories found. Create your first category.</p>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingCategory(null);
            }}
            className="mt-4 btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>
      </div>
    )}
  </div>

    </div>
  );
};

export default Categories;
