type IPagination = {
  name?: string;
  size: number;
  totalItems: number;
  nextPage: number;
  previousPage: number;
};

/**
 * Do pagination ops
 *
 * @param totalItems
 * @param page
 * @param size
 */
export const paginate = (totalItems: number, resultTotal: number, page: number, size: number): IPagination => {
  const nextPage = page + 1;
  const pages = Math.ceil(totalItems / size);

  return {
    size: resultTotal,
    totalItems,
    nextPage: (nextPage > pages ? pages : nextPage) || 1,
    previousPage: Number(page - 1 || page),
  };
};
