import { useEffect, useState } from 'react';
// import { Label } from 'flowbite-react';
import { Icon } from '@iconify/react';
import CardBox from 'src/components/shared/CardBox';
import axios from 'axios';
import { API_BASE_URL } from 'src/config';

const ProductData = ({ eventData, setEventData }: any) => {
  const [categories, setCategories] = useState<{ _id: string; service_name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/v1/services/get-all`);
        setCategories(response.data.result || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setEventData((prevData: any) => ({ ...prevData, category: categoryId }));
  };

  // const selectedCategory = categories.find((cat) => cat._id === eventData?.category);

  return (
    <CardBox>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#f8e8ec] flex items-center justify-center">
          <Icon icon="tabler:category" className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h5 className="text-lg font-semibold text-dark dark:text-white">Event Category</h5>
          <p className="text-xs text-gray-500 dark:text-gray-400">What type of event is this?</p>
        </div>
      </div>



      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {categories.map((category) => {
            const isSelected = eventData?.category === category._id;
            return (
              <button
                key={category._id}
                type="button"
                onClick={() => handleCategorySelect(category._id)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                      }`}
                  >
                    <Icon icon="tabler:tag" className="w-6 h-6" />
                  </div>
                  <p className={`font-medium text-sm flex-1 ${isSelected ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                    {category.service_name}
                  </p>
                  {isSelected && (
                    <Icon icon="tabler:circle-check-filled" className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && categories.length === 0 && (
        <div className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center">
          <Icon icon="tabler:category-off" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No categories available</p>
        </div>
      )}


    </CardBox>
  );
};

export default ProductData;
