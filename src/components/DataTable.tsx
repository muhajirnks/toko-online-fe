import { formatDate, formatDateTime, formatTime } from "@/utils/dateUtils";
import { getFileName, getFullUrl } from "@/utils/fileUtils";
import { formatCurrency, formatNumber } from "@/utils/stringUtils";
import {
   Avatar,
   Box,
   Checkbox,
   Skeleton,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   TableSortLabel,
   Tooltip,
   Typography,
} from "@mui/material";
import { useMemo } from "react";
import {
   MdCheck,
   MdClose,
   MdInsertDriveFile,
   MdOutlineInsertDriveFile,
} from "react-icons/md";

interface Props<T extends Record<string, any>> {
   selected?: any[];
   rows: T[];
   config: TableConfig;
   page?: number;
   limit?: number;
   sortBy?: string;
   sort?: "asc" | "desc";
   loading?: boolean;
   onCheckAll?: (checked: boolean) => void;
   onCheck?: (id: any, row: T) => void;
   onChangeSort?: (sortKey: string) => void;
   renderAction?: (row: T, idx: number) => React.ReactNode;
}

export interface TableConfig {
   showNumber?: boolean;
   uniqueField?: string;
   columns: Column[];
}

export type Column = BaseColumn & (ColumnRender | ColumnType);

interface BaseColumn {
   key: string;
   sortKey?: string;
   label: string;
   getLabel?: (value: any, row: Record<string, any>) => string;
}

interface ColumnRender {
   type: "custom";
   renderValue: (value: any, row: Record<string, any>) => React.ReactNode;
}

interface ColumnType {
   type:
      | "string"
      | "file"
      | "date"
      | "datetime"
      | "image"
      | "number"
      | "currency"
      | "url"
      | "time"
      | "avatar"
      | "boolean";
}

export const createTableConfig = (config: TableConfig) => {
   return config;
};

const DataTable = <T extends Record<string, any>>({
   selected,
   rows,
   config,
   sortBy,
   sort,
   page,
   limit,
   loading = false,
   onCheckAll,
   onCheck,
   onChangeSort,
   renderAction,
}: Props<T>) => {
   const { columns, uniqueField, showNumber = false } = config;
   const selectedSet = useMemo(() => new Set(selected), [selected]);

   const mostLeft = selected ? "selected" : showNumber ? "show_number" : "data";
   const mostRight = renderAction ? "action" : "data";

   return (
      <TableContainer className="h-full">
         <Table stickyHeader>
            <TableHead>
               <TableRow className="bg-background-paper-dark">
                  {selected && (
                     <TableCell
                        padding="checkbox"
                        className="pl-6 font-bold bg-transparent border-0 text-sm"
                     >
                        <Checkbox
                           color="primary"
                           size="small"
                           disabled={loading}
                           checked={
                              rows.length > 0 &&
                              rows.every((r, idx) =>
                                 selectedSet.has(
                                    uniqueField ? r[uniqueField] : idx,
                                 ),
                              )
                           }
                           indeterminate={
                              rows.some((r, idx) =>
                                 selectedSet.has(
                                    uniqueField ? r[uniqueField] : idx,
                                 ),
                              ) &&
                              !rows.every((r, idx) =>
                                 selectedSet.has(
                                    uniqueField ? r[uniqueField] : idx,
                                 ),
                              )
                           }
                           onChange={(_, checked) =>
                              onCheckAll && onCheckAll(checked)
                           }
                        />
                     </TableCell>
                  )}

                  {showNumber && (
                     <TableCell
                        className={`${mostLeft == "show_number" ? "pl-7" : ""} font-bold bg-transparent border-0 text-sm w-1 text-center`}
                     >
                        No
                     </TableCell>
                  )}
                  {columns.map((col, colIdx) => {
                     const isActive = col.sortKey
                        ? sortBy == col.sortKey
                        : sortBy == col.key;

                     return (
                        <TableCell
                           key={col.key}
                           className={`py-3 whitespace-nowrap font-bold bg-transparent border-0 text-sm ${
                              mostLeft == "data" && colIdx == 0 ? "pl-7" : ""
                           } ${
                              mostRight == "data" &&
                              colIdx == columns.length - 1
                                 ? "pr-7"
                                 : ""
                           }`}
                           align={col.type == "number" ? "right" : "left"}
                        >
                           {col.sortKey ? (
                              <TableSortLabel
                                 active={isActive}
                                 direction={isActive ? sort : "asc"}
                                 onClick={() =>
                                    onChangeSort &&
                                    onChangeSort(col.sortKey || col.key)
                                 }
                              >
                                 <Box className="max-w-76 truncate">
                                    {col.label}
                                 </Box>
                              </TableSortLabel>
                           ) : (
                              <Box className="max-w-76 truncate">
                                 {col.label}
                              </Box>
                           )}
                        </TableCell>
                     );
                  })}
                  {renderAction && !loading && (
                     <TableCell className="font-bold text-center bg-transparent border-0 pr-6 text-sm w-1">
                        Action
                     </TableCell>
                  )}
               </TableRow>
            </TableHead>
            <TableBody className="relative">
               {loading ? (
                  Array.from({ length: 10 }).map((_, idx) => (
                     <TableRow
                        key={idx + "loading"}
                        sx={{
                           "& td, & th": {
                              borderBottom: "1px solid rgba(0,0,0,0.1)",
                           },
                           "&:last-child td, &:last-child th": { border: 0 },
                        }}
                     >
                        {selected && (
                           <TableCell padding="checkbox" className="pl-6">
                              <Checkbox
                                 disabled
                                 color="primary"
                                 size="small"
                                 checked={false}
                              />
                           </TableCell>
                        )}
                        {showNumber && (
                           <TableCell
                              className={`${mostLeft == "show_number" ? "pl-7" : ""} w-1 py-4 text-sm`}
                           >
                              <Skeleton />
                           </TableCell>
                        )}
                        {columns.map((col, colIdx) => (
                           <Cell
                              key={idx + col.key}
                              row={{}}
                              col={col}
                              loading={true}
                              pl={mostLeft == "data" && colIdx == 0}
                              pr={
                                 mostRight == "data" &&
                                 colIdx == columns.length - 1
                              }
                           />
                        ))}
                     </TableRow>
                  ))
               ) : !rows.length ? (
                  <TableRow>
                     <TableCell
                        colSpan={999}
                        className="text-center py-10 border-0"
                     >
                        <Typography variant="body1">No Data</Typography>
                     </TableCell>
                  </TableRow>
               ) : (
                  rows.map((row, idx) => (
                     <TableRow
                        key={uniqueField ? row[uniqueField] : idx}
                        className="bg-background-paper"
                        sx={{
                           "& td, & th": {
                              borderBottom: "1px solid rgba(0,0,0,0.1)",
                           },
                           "&:last-child td, &:last-child th": {
                              border: 0,
                           },
                        }}
                     >
                        {selected && (
                           <TableCell padding="checkbox" className="pl-6">
                              <Checkbox
                                 color="primary"
                                 size="small"
                                 onChange={() =>
                                    onCheck &&
                                    onCheck(
                                       (uniqueField ? row[uniqueField] : idx), row,
                                    )
                                 }
                                 checked={selectedSet.has(
                                    uniqueField ? row[uniqueField] : idx,
                                 )}
                              />
                           </TableCell>
                        )}
                        {showNumber && (
                           <TableCell
                              className={`${mostLeft == "show_number" ? "pl-7" : ""} w-1 py-4 text-sm text-center`}
                           >
                              {page && limit ? (idx + 1) + ((page - 1) * limit) : (idx + 1)}
                           </TableCell>
                        )}
                        {columns.map((col, colIdx) => (
                           <Cell
                              key={`{${
                                 uniqueField ? row[uniqueField] : idx
                              } + ${col.key}}`}
                              row={row}
                              col={col}
                              loading={false}
                              pl={!selected && colIdx == 0}
                              pr={!renderAction && colIdx == columns.length - 1}
                           />
                        ))}
                        {renderAction && (
                           <TableCell
                              className="py-3 whitespace-nowrap max-w-76 pr-6 text-sm w-1"
                              align={"center"}
                           >
                              {renderAction(row, idx)}
                           </TableCell>
                        )}
                     </TableRow>
                  ))
               )}
            </TableBody>
         </Table>
      </TableContainer>
   );
};

interface CellProps {
   row: Record<string, any>;
   col: Column;
   loading: boolean;
   pl: boolean;
   pr: boolean;
}

function getValueByPath<T extends object>(obj: T, path: string): any {
   return path.split(".").reduce((acc, key) => acc?.[key], obj as any);
}

const Cell = ({ row, col, loading, pl, pr }: CellProps) => {
   const cell = useMemo(() => {
      if (loading)
         return (
            <TableCell className="py-4 whitespace-nowrap max-w-76">
               <Skeleton variant="text" width={150} />
            </TableCell>
         );

      const rawValue = getValueByPath(row, col.key);

      let value: React.ReactNode;
      let label: string = col.getLabel ? col.getLabel(rawValue, row) : rawValue;

      if (col.type == "custom") {
         value = col.renderValue(rawValue, row);
      } else if (col.type == "file") {
         value = rawValue ? (
            <MdInsertDriveFile className="text-lg" />
         ) : (
            <MdOutlineInsertDriveFile className="text-lg" />
         );

         label = getFileName(rawValue);
      } else if (col.type == "url") {
         value = (
            <a
               href={
                  rawValue?.startsWith("http")
                     ? rawValue
                     : "https://" + rawValue
               }
               target="_blank"
               className="text-primary hover:underline"
            >
               {label}
            </a>
         );
      } else if (col.type == "date") {
         value = formatDate(rawValue);
      } else if (col.type == "time") {
         value = formatTime(rawValue);
      } else if (col.type == "datetime") {
         value = formatDateTime(rawValue);
      } else if (col.type == "image") {
         value = (
            <Box className="w-20 h-20">
               <img
                  src={getFullUrl(rawValue)}
                  className="w-full h-full object-contain"
               />
            </Box>
         );
      } else if (col.type == "avatar") {
         value = (
            <Avatar src={getFullUrl(rawValue)} className="w-12 h-12">
               {label}
            </Avatar>
         );
      } else if (col.type == "number") {
         value = formatNumber(rawValue);
         label = value as string;
      } else if (col.type == "currency") {
         value = formatCurrency(rawValue);
         label = value as string;
      } else if (col.type == "boolean") {
         value = rawValue ? (
            <MdCheck className="text-lg text-green-700" />
         ) : (
            <MdClose className="text-lg text-red-700" />
         );
         label = "";
      } else {
         value = label || "-";
      }

      return (
         <TableCell
            className={`whitespace-nowrap max-w-76 text-sm ${
               col.type == "image" ? "py-1" : "py-4"
            } ${pl ? "pl-7" : ""} ${pr ? "pr-7" : ""}`}
            align={col.type == "number" ? "right" : "left"}
         >
            <Tooltip title={label} followCursor>
               <Box
                  className={`truncate max-w-min ${
                     col.type == "number" ? "text-right ml-auto" : "text-left"
                  }`}
               >
                  {value}
               </Box>
            </Tooltip>
         </TableCell>
      );
   }, [row, col, loading]);

   return cell;
};

export default DataTable;
