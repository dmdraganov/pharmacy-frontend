import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, goToPage }: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className='mt-8 flex justify-center gap-2'>
      {pages.map((page) => (
        <Button
          key={page}
          variant='primary'
          onClick={() => goToPage(page)}
          disabled={currentPage === page}
        >
          {page}
        </Button>
      ))}
    </div>
  );
};

export default Pagination;
