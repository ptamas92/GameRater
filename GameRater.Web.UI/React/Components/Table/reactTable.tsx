import * as React from "react";
import ReactHtmlParser from 'react-html-parser';
import { useTable, useFlexLayout, useExpanded } from "react-table";
import ThreeStateCheckbox from "../Utils/threeStateCheckbox";

//ReactTable
export default function ReactTable({ data, columns, expanded, currentPageDataSource, activePage, rowClick, setHiddenColumns, setExpandedKeys }) {

    const _data = React.useMemo(() => data, [data, columns, expanded, currentPageDataSource, activePage]);
    const _columns = React.useMemo(() => columns, [data, columns, expanded, currentPageDataSource, activePage]);
    const _defaultColumn = React.useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 800, }), []);

    return (
        <React.Fragment>
            {
                columns.filter(col => col.id.indexOf("__AlwaysVisibleColumn_") === -1).length === 0 ? null :
                    <ReactTableBody data={_data}
                                    columns={_columns}
                                    defaultColumn={_defaultColumn}
                                    expanded={expanded}
                                    currentPageDataSource={currentPageDataSource}
                                    activePage={activePage}
                                    rowClick={rowClick}
                                    setHiddenColumns={setHiddenColumns}
                                    setExpandedKeys={setExpandedKeys} />
            }
        </React.Fragment>
    )
}

//ReactTableBody
const ReactTableBody = ({ data, columns, defaultColumn, expanded, currentPageDataSource, activePage, rowClick, setHiddenColumns, setExpandedKeys }) => {

    //useTable
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, allColumns } = useTable({
        columns,
        data,
        defaultColumn,
        initialState: {
            expanded: expanded,
            hiddenColumns: columns.filter(col => col.show === false).map(col => col.accessor)
        }
    },
        useFlexLayout,
        useExpanded
    );

    //onRowClick
    function onRowClick(item, id, e, isSubComponent) {
        var isExpandable = isSubComponent &&
                           !e.target.hasAttribute("data-action-button-key") &&
                           (
                               e.target.getAttribute("data-column-id") === "__AlwaysVisibleColumn_Expander" ||
                               e.target.closest('.td[data-column-id="__AlwaysVisibleColumn_Expander"]') === null
                           );


        if (isExpandable) {
            var tr = e.target.closest(".tr");
            var col = tr.querySelectorAll('.td[data-column-id="__AlwaysVisibleColumn_Expander"]')[0];

            col.firstChild.click();
        }

        rowClick(item, id, e);
    }

    //setHiddenColumns
    var hiddenColumns = allColumns.filter(col => col.isVisible === false).map(col => col.id);
    setHiddenColumns(hiddenColumns);

    //setExpandedKeys
    var expandedKeys = rows.filter(row => row.isExpanded === true).map(row => row.original.__rowKey);
    setExpandedKeys(expandedKeys);

    //return
    var groupIndex = 0;
    var itemIndex = 0;
    var rowIndex = -1;
    var vdId = "dropdown_" + Math.floor(Math.random() * 1000000);

    return (
        <div className="table-block" data-active-page={activePage}>

            {/* - column visibility */}
            <div className="dropdown column-visibility-dropdown">
                <button className="dropdown-toggle" id={vdId} type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                    <i className="bi bi-eye-fill" />
                </button>
                <div className="dropdown-menu" aria-labelledby={vdId}>
                    {
                        allColumns.filter(col => col.id.indexOf("__AlwaysVisibleColumn_") === -1).map(column => (
                            <div key={column.id} className="hfsa-checkbox customized-cb dropdown-item--">
                                <label>
                                    <ThreeStateCheckbox {...column.getToggleHiddenProps()} indeterminate={false} />
                                    <span>
                                        <span className="customized-cb-label noselect">{column.HeaderTitle}</span>
                                    </span>
                                </label>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* - table */}
            <div {...getTableProps()} className="table">

                {/* - header */}
                <div>
                    {headerGroups.map(headerGroup => (
                        <div {...headerGroup.getHeaderGroupProps()} className="tr header-row">
                            {headerGroup.headers.map(column => {
                                return (
                                    <div {...column.getHeaderProps()} className="th" data-column-id={column.id}>
                                        {column.render('Header')}
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>

                {/* - body */}
                <div {...getTableBodyProps()}>
                    {
                        currentPageDataSource && (currentPageDataSource as any).map(group => {
                            groupIndex++;
                            itemIndex = 0;

                            return (
                                <React.Fragment key={groupIndex}>
                                    {
                                        /* - group row - */
                                        group.template === "" ? null :
                                            <div className="tr group-row" data-group-index={group.groupIndex} data-group-length={group.groupFullLength} data-active-page={activePage}>
                                                <div className="td group-col">
                                                    {ReactHtmlParser(group.template)}
                                                </div>
                                            </div>
                                    }
                                    {
                                        /* - items - */
                                        group.objArray && group.objArray.map(item => {
                                            rowIndex++;
                                            itemIndex++;

                                            var row = rows[rowIndex];
                                            var id = "item_" + vdId + "_" + rowIndex;
                                            var isDetail = item.htmlStringForDetail !== "";

                                            prepareRow(row);

                                            return (
                                                <React.Fragment key={rowIndex}>
                                                    <div {...row.getRowProps()}
                                                         id={id}
                                                         className="tr htmltable-item"
                                                         data-index={itemIndex}
                                                         data-is-detail={isDetail}
                                                         data-is-even={rowIndex % 2 !== 0}
                                                         onClick={(e) => onRowClick(item, id, e, isDetail)}>
                                                         {
                                                            row.cells.map(cell => {
                                                                return (
                                                                    <div {...cell.getCellProps()} className="td" data-column-id={cell.column.id}>
                                                                        {cell.render('Cell')}
                                                                    </div>
                                                                )
                                                            })
                                                         }
                                                    </div>
                                                    {
                                                        /* - detail - */
                                                        !isDetail || !rows[rowIndex].isExpanded ? null :
                                                            <div className="tr detail-row" data-index={itemIndex} onClick={(e) => onRowClick(item, id, e, false)}>
                                                                <div className="td detail-col">
                                                                    {ReactHtmlParser(item.htmlStringForDetail)}
                                                                </div>
                                                            </div>
                                                    }
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </React.Fragment>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}