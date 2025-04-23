/**
 * Data Table Component
 * 
 * A flexible and feature-rich table component built on Material-UI's Table
 * components. Supports row selection, custom formatting, column configuration,
 * and interactive features like hover and click handling.
 */

'use client';

import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

/**
 * Data Table Component
 * 
 * Renders a data table with support for selection, custom formatting,
 * and interactive features. Integrates with Material-UI's table components
 * for consistent styling and behavior.
 * 
 * @param {Object} props - Component props
 * @param {Array<{name: string, field?: string, formatter?: Function, width?: string|number, align?: 'left'|'center'|'right', hideName?: boolean}>} props.columns - Column configuration
 * @param {boolean} [props.hideHead] - Whether to hide the table header
 * @param {boolean} [props.hover] - Whether to enable hover effect on rows
 * @param {Function} [props.onClick] - Click handler for rows
 * @param {Function} [props.onDeselectAll] - Handler for deselecting all rows
 * @param {Function} [props.onDeselectOne] - Handler for deselecting a single row
 * @param {Function} [props.onSelectAll] - Handler for selecting all rows
 * @param {Function} [props.onSelectOne] - Handler for selecting a single row
 * @param {Array<Object>} props.rows - Data rows to display
 * @param {boolean} [props.selectable] - Whether to enable row selection
 * @param {Set<string|number>} [props.selected] - Set of selected row IDs
 * @param {Function} [props.uniqueRowId] - Function to generate unique row IDs
 * @returns {JSX.Element} A data table with the specified configuration
 */
export function DataTable({
  columns,
  hideHead,
  hover,
  onClick,
  onDeselectAll,
  onDeselectOne,
  onSelectOne,
  onSelectAll,
  rows,
  selectable,
  selected,
  uniqueRowId,
  ...props
}) {
  // Calculate selection states
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Table {...props}>
      {/* Table Header */}
      <TableHead sx={{ ...(hideHead && { visibility: 'collapse', '--TableCell-borderWidth': 0 }) }}>
        <TableRow>
          {/* Selection Checkbox Column */}
          {selectable ? (
            <TableCell padding="checkbox" sx={{ width: '40px', minWidth: '40px', maxWidth: '40px' }}>
              <Checkbox
                checked={selectedAll}
                indeterminate={selectedSome}
                onChange={(event) => {
                  if (selectedAll) {
                    onDeselectAll?.(event);
                  } else {
                    onSelectAll?.(event);
                  }
                }}
              />
            </TableCell>
          ) : null}
          {/* Column Headers */}
          {columns.map((column) => (
            <TableCell
              key={column.name}
              sx={{
                width: column.width,
                minWidth: column.width,
                maxWidth: column.width,
                ...(column.align && { textAlign: column.align }),
              }}
            >
              {column.hideName ? null : column.name}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      {/* Table Body */}
      <TableBody>
        {rows.map((row, index) => {
          // Determine row ID and selection state
          const rowId = row.id ? row.id : uniqueRowId?.(row);
          const rowSelected = rowId ? selected?.has(rowId) : false;

          return (
            <TableRow
              hover={hover}
              key={rowId ?? index}
              selected={rowSelected}
              {...(onClick && {
                onClick: (event) => {
                  onClick(event, row);
                },
              })}
              sx={{ ...(onClick && { cursor: 'pointer' }) }}
            >
              {/* Row Selection Checkbox */}
              {selectable ? (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={rowId ? rowSelected : false}
                    onChange={(event) => {
                      if (rowSelected) {
                        onDeselectOne?.(event, row);
                      } else {
                        onSelectOne?.(event, row);
                      }
                    }}
                    onClick={(event) => {
                      if (onClick) {
                        event.stopPropagation();
                      }
                    }}
                  />
                </TableCell>
              ) : null}
              {/* Row Cells */}
              {columns.map((column) => (
                <TableCell key={column.name} sx={{ ...(column.align && { textAlign: column.align }) }}>
                  {column.formatter ? column.formatter(row, index) : column.field ? row[column.field] : null}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
