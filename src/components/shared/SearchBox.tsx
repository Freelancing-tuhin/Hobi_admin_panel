import { Icon } from '@iconify/react/dist/iconify.js';

const SearchBox = ({ searchText, setSearchText, getOrganizer, placeholder }: any) => {
  const handleSearch = () => {
    getOrganizer();
  };

  return (
    <div className="flex items-center gap-2 pb-4 w-full">
      <input
        type="text"
        placeholder={placeholder}
        className="border border-gray-300 rounded-md flex-1 min-w-0 px-3 sm:px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-[#b03052] flex items-center justify-center gap-1 text-white px-3 sm:px-4 py-2.5 rounded-md hover:bg-[#b03052] transition-all flex-shrink-0"
      >
        <Icon icon="solar:minimalistic-magnifer-linear" height="18" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </div>
  );
};

export default SearchBox;
