import { apiHandler, usersRepo } from '@/helpers/api';

export default apiHandler({
  get: getRemote
});

async function getRemote(req, res) {
  let dbData = await usersRepo.getAll();

  const { start, size, filters, filterModes, sorting, globalFilter } = req.query;

  const parsedFilterModes = JSON.parse(filterModes ?? '{}');

  const parsedColumnFilters = JSON.parse(filters);
  if (parsedColumnFilters?.length) {
    parsedColumnFilters.map((filter) => {
      const { id: columnId, value: filterValue } = filter;
      const filterMode = parsedFilterModes?.[columnId] ?? 'contains';
      dbData = dbData.filter((row) => {
        const rowValue = row[columnId]?.toString()?.toLowerCase();
        if (filterMode === 'contains') {
          return rowValue.includes?.((filterValue).toLowerCase());
        } else if (filterMode === 'startsWith') {
          return rowValue.startsWith?.((filterValue).toLowerCase());
        } else if (filterMode === 'endsWith') {
          return rowValue.endsWith?.((filterValue).toLowerCase());
        }
      });
    });
  }

  if (globalFilter) {
    dbData = dbData.filter((row) =>
      Object.keys(row.dataValues).some(
        (columnId) =>
          row[columnId]
            ?.toString()
            ?.toLowerCase()
            ?.includes?.((globalFilter).toLowerCase()),
      ),
    );
  }

  const parsedSorting = JSON.parse(sorting);
  if (parsedSorting?.length) {
    const sort = parsedSorting[0];
    const { id, desc } = sort;
    dbData.sort((a, b) => {
      if (desc) {
        return a[id] < b[id] ? 1 : -1;
      }
      return a[id] > b[id] ? 1 : -1;
    });
  }

  res.status(200).json({
    data:
      dbData?.slice(parseInt(start), parseInt(start) + parseInt(size)) ?? [],
    meta: { totalRowCount: dbData.length },
  });
}