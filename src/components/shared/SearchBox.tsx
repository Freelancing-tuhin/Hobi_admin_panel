import { Icon } from '@iconify/react/dist/iconify.js';

const SearchBox = ({ searchText, setSearchText, getOrganizer, placeholder }: any) => {
  const handleSearch = () => {
    getOrganizer();
  };

  return (
    <div className="flex items-center space-x-2 pb-4">
      <input
        type="text"
        placeholder={placeholder}
        className="border border-gray-300 rounded-md w-72 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-[#b03052] flex items-center gap-1  text-white px-4 py-2.5 rounded-md hover:bg-[#b03052] transition-all"
      >
        <Icon icon="solar:minimalistic-magnifer-linear" height="18" />
        Search
      </button>
    </div>
  );
};

export default SearchBox;
