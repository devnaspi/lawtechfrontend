import React from 'react';
import { Button, Stack } from '@mui/material';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const Pagination = ({ data, limit, onPageChange }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { count, next, previous } = data;

    const totalPages = Math.ceil(count / limit);

    const currentPage = parseInt(searchParams.get('page')) || 1;

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        const url = `${pathname}?page=${page}`;
        router.push(url);
        onPageChange(page);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <Button
                        key={i}
                        variant={i === currentPage ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </Button>
                );
            }
        } else {
            // Always show the first page
            pages.push(
                <Button
                    key={1}
                    variant={1 === currentPage ? 'contained' : 'outlined'}
                    onClick={() => handlePageChange(1)}
                >
                    1
                </Button>                
            );

            if (currentPage > 3) {
                pages.push(<Button key="start-ellipsis" >...</Button>);
            }            

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(
                    <Button
                        key={i}
                        variant={i === currentPage ? 'contained' : 'outlined'}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </Button>
                );
            }
            
            if (currentPage < totalPages - 2) {
                pages.push(<Button key="end-ellipsis">...</Button>);
            }

            // Always show the last page
            pages.push(
                <Button
                    key={totalPages}
                    variant={totalPages === currentPage ? 'contained' : 'outlined'}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </Button>
            );
    
        }

        return pages;
    };

    return (
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center"
        sx={{
            flexWrap: 'wrap',
            gap: { xs: 1, sm: 2 },
            mt: { xs: 2, sm: 4 },
        }}>
            {previous && (
                <Button
                    variant="outlined"
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Prev
                </Button>
            )}

            {renderPageNumbers()}

            {next && (
                <Button
                    variant="outlined"
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </Button>
            )}
        </Stack>
    );
};

export default Pagination;
