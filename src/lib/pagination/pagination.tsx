import React, { FC } from 'react';
import './pagination.css';

interface PaginationProps {
  pagesNumber: number | null;
  currentPage?: string;
  onClick: (page: string, e: React.MouseEvent) => void;
}

const getPagesArray = (pagesNumber: number | null): string[] => {
  if (pagesNumber === null) return [];
  return Array.from({ length: pagesNumber || 1 }, (_, i) => (i + 1).toString());
};

export const Pagination: FC<PaginationProps> = ({
  pagesNumber,
  currentPage,
  onClick,
}) => {
  const pagesArray = getPagesArray(pagesNumber);

  if (!currentPage) {
    currentPage = pagesArray[0];
  }

  return (
    <div className="pagination">
      {pagesArray.map((page) => (
        <button
          key={page}
          onClick={(e) => onClick(page, e)}
          className={`pagination-button button-icon state ${currentPage === page ? 'active' : ''}`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};
