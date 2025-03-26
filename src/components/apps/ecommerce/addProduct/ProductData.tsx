import { Label, Select } from 'flowbite-react';
import CardBox from 'src/components/shared/CardBox';

const ProductData = ({ eventData, setEventData }: any) => {
  const catOptions = [
    'Music',
    'Concerts',
    'Festivals',
    'Comedy',
    'Theater',
    'Parties',
    'Workshops',
    'Sports',
    'Food & Drinks',
    'Tech',
  ];

  const handleCategoryChange = (e: any) => {
    setEventData((prevData: any) => ({ ...prevData, category: e.target.value }));
  };

  return (
    <CardBox>
      <h5 className="card-title mb-4">Product Details</h5>
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
          {catOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
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
