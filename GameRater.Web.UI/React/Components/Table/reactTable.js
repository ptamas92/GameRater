var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as React from "react";
import ReactHtmlParser from 'react-html-parser';
import { useTable, useFlexLayout, useExpanded } from "react-table";
import ThreeStateCheckbox from "../Utils/threeStateCheckbox";
//ReactTable
export default function ReactTable(_a) {
    var data = _a.data, columns = _a.columns, expanded = _a.expanded, currentPageDataSource = _a.currentPageDataSource, activePage = _a.activePage, rowClick = _a.rowClick, setHiddenColumns = _a.setHiddenColumns, setExpandedKeys = _a.setExpandedKeys;
    var _data = React.useMemo(function () { return data; }, [data, columns, expanded, currentPageDataSource, activePage]);
    var _columns = React.useMemo(function () { return columns; }, [data, columns, expanded, currentPageDataSource, activePage]);
    var _defaultColumn = React.useMemo(function () { return ({ minWidth: 30, width: 150, maxWidth: 800, }); }, []);
    return (React.createElement(React.Fragment, null, columns.filter(function (col) { return col.id.indexOf("__AlwaysVisibleColumn_") === -1; }).length === 0 ? null :
        React.createElement(ReactTableBody, { data: _data, columns: _columns, defaultColumn: _defaultColumn, expanded: expanded, currentPageDataSource: currentPageDataSource, activePage: activePage, rowClick: rowClick, setHiddenColumns: setHiddenColumns, setExpandedKeys: setExpandedKeys })));
}
//ReactTableBody
var ReactTableBody = function (_a) {
    var data = _a.data, columns = _a.columns, defaultColumn = _a.defaultColumn, expanded = _a.expanded, currentPageDataSource = _a.currentPageDataSource, activePage = _a.activePage, rowClick = _a.rowClick, setHiddenColumns = _a.setHiddenColumns, setExpandedKeys = _a.setExpandedKeys;
    //useTable
    var _b = useTable({
        columns: columns,
        data: data,
        defaultColumn: defaultColumn,
        initialState: {
            expanded: expanded,
            hiddenColumns: columns.filter(function (col) { return col.show === false; }).map(function (col) { return col.accessor; })
        }
    }, useFlexLayout, useExpanded), getTableProps = _b.getTableProps, getTableBodyProps = _b.getTableBodyProps, headerGroups = _b.headerGroups, rows = _b.rows, prepareRow = _b.prepareRow, allColumns = _b.allColumns;
    //onRowClick
    function onRowClick(item, id, e, isSubComponent) {
        var isExpandable = isSubComponent &&
            !e.target.hasAttribute("data-action-button-key") &&
            (e.target.getAttribute("data-column-id") === "__AlwaysVisibleColumn_Expander" ||
                e.target.closest('.td[data-column-id="__AlwaysVisibleColumn_Expander"]') === null);
        if (isExpandable) {
            var tr = e.target.closest(".tr");
            var col = tr.querySelectorAll('.td[data-column-id="__AlwaysVisibleColumn_Expander"]')[0];
            col.firstChild.click();
        }
        rowClick(item, id, e);
    }
    //setHiddenColumns
    var hiddenColumns = allColumns.filter(function (col) { return col.isVisible === false; }).map(function (col) { return col.id; });
    setHiddenColumns(hiddenColumns);
    //setExpandedKeys
    var expandedKeys = rows.filter(function (row) { return row.isExpanded === true; }).map(function (row) { return row.original.__rowKey; });
    setExpandedKeys(expandedKeys);
    //return
    var groupIndex = 0;
    var itemIndex = 0;
    var rowIndex = -1;
    var vdId = "dropdown_" + Math.floor(Math.random() * 1000000);
    return (React.createElement("div", { className: "table-block", "data-active-page": activePage },
        React.createElement("div", { className: "dropdown column-visibility-dropdown" },
            React.createElement("button", { className: "dropdown-toggle", id: vdId, type: "button", "data-bs-toggle": "dropdown", "data-bs-auto-close": "outside", "aria-expanded": "false" },
                React.createElement("i", { className: "bi bi-eye-fill" })),
            React.createElement("div", { className: "dropdown-menu", "aria-labelledby": vdId }, allColumns.filter(function (col) { return col.id.indexOf("__AlwaysVisibleColumn_") === -1; }).map(function (column) { return (React.createElement("div", { key: column.id, className: "hfsa-checkbox customized-cb dropdown-item--" },
                React.createElement("label", null,
                    React.createElement(ThreeStateCheckbox, __assign({}, column.getToggleHiddenProps(), { indeterminate: false })),
                    React.createElement("span", null,
                        React.createElement("span", { className: "customized-cb-label noselect" }, column.HeaderTitle))))); }))),
        React.createElement("div", __assign({}, getTableProps(), { className: "table" }),
            React.createElement("div", null, headerGroups.map(function (headerGroup) { return (React.createElement("div", __assign({}, headerGroup.getHeaderGroupProps(), { className: "tr header-row" }), headerGroup.headers.map(function (column) {
                return (React.createElement("div", __assign({}, column.getHeaderProps(), { className: "th", "data-column-id": column.id }), column.render('Header')));
            }))); })),
            React.createElement("div", __assign({}, getTableBodyProps()), currentPageDataSource && currentPageDataSource.map(function (group) {
                groupIndex++;
                itemIndex = 0;
                return (React.createElement(React.Fragment, { key: groupIndex },
                    /* - group row - */
                    group.template === "" ? null :
                        React.createElement("div", { className: "tr group-row", "data-group-index": group.groupIndex, "data-group-length": group.groupFullLength, "data-active-page": activePage },
                            React.createElement("div", { className: "td group-col" }, ReactHtmlParser(group.template))),
                    /* - items - */
                    group.objArray && group.objArray.map(function (item) {
                        rowIndex++;
                        itemIndex++;
                        var row = rows[rowIndex];
                        var id = "item_" + vdId + "_" + rowIndex;
                        var isDetail = item.htmlStringForDetail !== "";
                        prepareRow(row);
                        return (React.createElement(React.Fragment, { key: rowIndex },
                            React.createElement("div", __assign({}, row.getRowProps(), { id: id, className: "tr htmltable-item", "data-index": itemIndex, "data-is-detail": isDetail, "data-is-even": rowIndex % 2 !== 0, onClick: function (e) { return onRowClick(item, id, e, isDetail); } }), row.cells.map(function (cell) {
                                return (React.createElement("div", __assign({}, cell.getCellProps(), { className: "td", "data-column-id": cell.column.id }), typeof cell.value === 'string' || cell.value instanceof String ? cell.render('Cell') : cell.value));
                            })),
                            /* - detail - */
                            !isDetail || !rows[rowIndex].isExpanded ? null :
                                React.createElement("div", { className: "tr detail-row", "data-index": itemIndex, onClick: function (e) { return onRowClick(item, id, e, false); } },
                                    React.createElement("div", { className: "td detail-col" }, ReactHtmlParser(item.HtmlStringForDetail)))));
                    })));
            })))));
};
//# sourceMappingURL=reactTable.js.map