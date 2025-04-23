'use client';

import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';


export function CustomersPagination({ count, page, setPage, setRowsPerPage, rowsPerPage }) {
  return (
    <TablePagination
      component="div"
      count={count}
      onPageChange={(ev, page) => {
        setPage(page);
      }}
      onRowsPerPageChange={(ev) => {
        setRowsPerPage(ev.target.value);
      }}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[5, 10, 25]}
    />
  );
}
