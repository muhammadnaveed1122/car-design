import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Flex, Button } from '@mantine/core';
import React from 'react';
const Pagination = ({ totalPages, currentloadPage, setCurrentPage }) => {

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (totalPages === 0) {
        return (
            <div>
            </div>
        );
    }

    let isPageNumberOutOfRange;
    const pageNumbers = [...new Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        const isPageNumberFirst = pageNumber === 1;
        const isPageNumberLast = pageNumber === totalPages;
        const isCurrentPageWithinTwoPageNumbers =
            Math.abs(pageNumber - currentloadPage) <= 1;

        if (isPageNumberFirst || isPageNumberLast || isCurrentPageWithinTwoPageNumbers) {
            isPageNumberOutOfRange = false;
            return (
                <Button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={pageNumber === currentloadPage}
                >
                    {pageNumber}
                </Button>
            );
        }

        if (!isPageNumberOutOfRange) {
            isPageNumberOutOfRange = true;
            return <Button key={pageNumber} disabled>...</Button>;
        }

        return null;
    });

    return (
        <Flex gap={6} my={15} justify={'center'}>
            <Button
                disabled={currentloadPage === 1}
                onClick={() => handlePageChange(currentloadPage - 1)}
            >
                <IconChevronLeft />
            </Button>
            {pageNumbers}
            <Button
                disabled={currentloadPage === totalPages}
                onClick={() => handlePageChange(currentloadPage + 1)}
            >
                <IconChevronRight />
            </Button>
        </Flex>
    );
};

export default Pagination;
