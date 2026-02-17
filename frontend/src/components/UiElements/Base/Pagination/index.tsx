import React, { useMemo } from 'react';
// Ensure you have react-bootstrap installed: npm install react-bootstrap bootstrap
import { Pagination } from 'react-bootstrap';

/**
 * Generates a range of numbers to use in pagination.
 * @param {number} from - The start number.
 * @param {number} to - The end number.
 * @returns {number[]} - An array of numbers.
 */
const range = (from: number, to: number): number[] => {
    let i = from;
    const rangeArr: number[] = [];
    while (i <= to) {
        rangeArr.push(i);
        i += 1;
    }
    return rangeArr;
};

// Define the types for the component's props
interface ControlledPaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    pageNeighbours?: number;
}

/**
 * A controlled pagination component that only shows a limited number of pages.
 */
const ControlledPagination: React.FC<ControlledPaginationProps> = ({ 
    totalPages, 
    currentPage, 
    onPageChange, 
    pageNeighbours = 1 
}) => {

    const paginationRange = useMemo((): (number | '...')[] => {
        // The total number of page numbers to be displayed.
        // pageNeighbours (left) + pageNeighbours (right) + first page + last page + current page + 2 ellipses
        const totalNumbers = (pageNeighbours * 2) + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages <= totalBlocks) {
            return range(1, totalPages);
        }

        const leftSiblingIndex = Math.max(currentPage - pageNeighbours, 1);
        const rightSiblingIndex = Math.min(currentPage + pageNeighbours, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            // We are near the beginning: [1, 2, 3, 4, ..., 10]
            const leftItemCount = 3 + 2 * pageNeighbours;
            const leftRange = range(1, leftItemCount);
            return [...leftRange, '...', lastPageIndex];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            // We are near the end: [1, ..., 7, 8, 9, 10]
            const rightItemCount = 3 + 2 * pageNeighbours;
            const rightRange = range(totalPages - rightItemCount + 1, totalPages);
            return [firstPageIndex, '...', ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            // We are in the middle: [1, ..., 4, 5, 6, ..., 10]
            const middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
        }

        return []; // Fallback in case something goes wrong

    }, [totalPages, currentPage, pageNeighbours]);

    if (totalPages <= 1) {
        return null; // Don't show pagination if there's only one page or less.
    }
    
    return (
        <Pagination className="mb-0">
            {/* Previous Button */}
            <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            />

            {/* Page Numbers */}
            {paginationRange.map((page, index) => {
                if (page === '...') {
                    return <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />;
                }

                return (
                    <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => onPageChange(page as number)}
                    >
                        {page}
                    </Pagination.Item>
                );
            })}

            {/* Next Button */}
            <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            />
        </Pagination>
    );
};

export default ControlledPagination