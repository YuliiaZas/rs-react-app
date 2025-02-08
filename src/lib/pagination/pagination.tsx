import { FC } from 'react';
import './pagination.css';

interface PaginationProps {
  pagesNumber: number;
  currentPage?: string;
  onClick: (page: string) => void;
}

const getPagesArray = (pagesNumber: number): string[] => {
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
          onClick={() => onClick(page)}
          className={`pagination-button ${currentPage === page ? 'active' : ''}`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};
