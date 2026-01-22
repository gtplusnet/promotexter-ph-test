import React from 'react';
import { IconButton } from '../Common/IconButton';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="pagination">
      <IconButton
        icon="chevron_left"
        label="Previous page"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
      />

      <div className="pagination__info">
        <span className="pagination__label">Page</span>
        <input
          type="number"
          className="pagination__input"
          value={currentPage}
          onChange={(e) => {
            const page = parseInt(e.target.value, 10);
            if (page >= 1 && page <= totalPages) {
              onPageChange(page);
            }
          }}
          min={1}
          max={totalPages}
        />
        <span className="pagination__label">of {totalPages}</span>
      </div>

      <IconButton
        icon="chevron_right"
        label="Next page"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
      />
    </div>
  );
};
