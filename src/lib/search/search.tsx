import { FC, KeyboardEvent, useState } from 'react';
import './search.css';

interface SearchProps {
  initialSearchValue: string;
  placeholder?: string;
  updateSearchValue: (value: string) => void;
}

export const Search: FC<SearchProps> = ({
  initialSearchValue,
  placeholder = 'Input Value',
  updateSearchValue,
}) => {
  const [currentValue, setCurrentValue] = useState<string>(initialSearchValue);

  const searchButtonText = 'Search';

  const handleButtonClick = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLButtonElement) {
      e.target.blur();
    }
    updateSearchValue(currentValue);
  };

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      updateSearchValue(currentValue);
    }
  };

  return (
    <div className="search-wrapper">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onKeyDown={handleInputKeyDown}
      />
      <button
        type="submit"
        className="search-button"
        onClick={handleButtonClick}
      >
        {searchButtonText}
      </button>
    </div>
  );
};
