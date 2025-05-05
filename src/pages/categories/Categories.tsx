import React, { useEffect } from 'react';
import { useCategoryStore } from '../../stores/categoryStore';
import { Plus, Edit, Trash2 } from 'lucide-react';
import CategoryForm from './CategoryForm';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import toast from 'react-hot-toast';

const MySwal = withReactContent(Swal);

const Categories: React.FC = () => {
  const {
    categories,
    currentPage,
    totalPages,
    fetchCategories,
    deleteCategory,
    isLoading,
  } = useCategoryStore();

  const [isAdding, setIsAdding] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<number | null>(null);

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const handleDeleteClick = async (id: number) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const handlePageChange = (page: number) => {
    fetchCategories(page);
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
          <CategoryForm categoryId={editingCategory} onClose={() => {
            setIsAdding(false);
            setEditingCategory(null);
          }} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            No Categories. Please click add to create.
          </div>
        ) : (
          categories.map(category => (
            <div key={category.id} className="card border-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCategory(category.id)}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(category.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Categories;