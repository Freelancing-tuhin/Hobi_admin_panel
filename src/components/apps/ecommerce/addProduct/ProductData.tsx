import { useEffect, useState } from 'react';
import { Label, Select } from 'flowbite-react';
import CardBox from 'src/components/shared/CardBox';
import axios from 'axios';
import { API_BASE_URL } from 'src/config';

const ProductData = ({ eventData, setEventData }: any) => {
  const [categories, setCategories] = useState<{ _id: string; service_name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/services/get-all`);
        setCategories(response.data.result || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEventData((prevData: any) => ({ ...prevData, category: e.target.value }));
  };

  return (
    <CardBox>
      <h5 className="card-title mb-4">Event Details</h5>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="category" value="Category" />
          <span className="text-error ms-1">*</span>
        </div>
        <Select
          id="category"
          value={eventData?.category || ''}
          onChange={handleCategoryChange}
          required
          className="select-md"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.service_name}
            </option>
          ))}
        </Select>
        <small className="text-xs text-darklink dark:text-bodytext">
          Select a product category.
        </small>
      </div>
    </CardBox>
  );
};

export default ProductData;

