import React from 'react';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by name or email',
}) => {
  return (
    <div className="search-bar">
      <span className="search-bar__icon material-symbols-outlined">search</span>
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="search-bar__clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </div>
  );
};
