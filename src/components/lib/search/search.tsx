'use client';

import { FC, KeyboardEvent, useEffect, useState } from 'react';
import { text } from '@utils';
import style from './search.module.css';

interface SearchProps {
  initialSearchValue: string;
  placeholder?: string;
  updateSearchValue: (value: string) => void;
}

export const Search: FC<SearchProps> = ({
  initialSearchValue,
  placeholder = text.search.placeholder,
  updateSearchValue,
}) => {
  const [currentValue, setCurrentValue] = useState<string>('');

  useEffect(() => {
    setCurrentValue(initialSearchValue);
  }, [initialSearchValue]);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    updateSearchValue(currentValue);
  };

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      updateSearchValue(currentValue);
    }
  };

  return (
    <div className={`${style.wrapper} d-flex`}>
      <div className={`${style['input-wrapper']} input-with-icons`}>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <i className="icon-search icon-left"></i>
        <i
          className={`icon-close pointer icon-right ${currentValue ? '' : 'invisible'}`}
          title="Clear"
          onClick={() => setCurrentValue('')}
        ></i>
      </div>
      <button
        type="submit"
        className="search-button"
        onClick={handleButtonClick}
      >
        {text.search.button}
      </button>
    </div>
  );
};
