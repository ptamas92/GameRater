var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import $ from 'jquery';
import ReactTable from "./reactTable";
import Pagination, { PaginationPosition } from "../Utils/pagination";
import { TableContainer } from "./__styledTable";
import { getValueOfTemplateAliases, replaceAliases, groupBy, sorting, getDataSourceForTheCurrentPage } from "../../Services/dataSourceFormatterService";
import * as FlashMessageService from "../../Services/flashMessageService";
var Table = /** @class */ (function (_super) {
    __extends(Table, _super);
    function Table(props) {
        var _this_1 = _super.call(this, props) || this;
        _this_1._isMounted = false;
        _this_1._hiddenColumns = null;
        _this_1._expandedKeys = null;
        _this_1._disablePaginition = false;
        //---------------------------------------------------------------------------------------------------------------
        // EVENTS
        //---------------------------------------------------------------------------------------------------------------
        //onHeaderCellClick
        _this_1.onHeaderCellClick = function (colKey) {
            _this_1._disablePaginition = true;
            var isAscendingSort = _this_1.state.propForSorting === colKey ? !_this_1.state.isAscendingSort : _this_1.state.isAscendingSort;
            if (_this_1.props.isPaginationOnTheClientSide) {
                var dataSource = _this_1.state.dataSource.sort(sorting(colKey, isAscendingSort ? "asc" : "desc"));
                var formattedDataSource = _this_1.setFormattedDataSource(_this_1.props, dataSource);
                var currentPageDataSource = getDataSourceForTheCurrentPage(formattedDataSource, 1, dataSource.length > 40);
                _this_1.setState({
                    dataSource: dataSource,
                    formattedDataSource: formattedDataSource,
                    currentPageDataSource: currentPageDataSource,
                    isAscendingSort: isAscendingSort,
                    propForSorting: colKey
                }, function () {
                    _this_1._disablePaginition = false;
                });
            }
            else {
                //TODO: Server side sorting
            }
        };
        //onRowClick
        _this_1.onRowClick = function (obj, rowId, e) {
            var origObj = {};
            for (var prop in obj) {
                if (prop !== "htmlStringForGroup" && prop !== "htmlStringForDetail" && prop !== "htmlStringsForColumns")
                    origObj[prop] = obj[prop];
            }
            if (_this_1.props.onRowClick !== undefined)
                _this_1.props.onRowClick(origObj, rowId, e);
        };
        //onPageChange
        _this_1.onPageChange = function (pageNumber) {
            if (!_this_1._disablePaginition) {
                var formattedDataSource = _this_1.state.formattedDataSource;
                var currentPageDataSource = getDataSourceForTheCurrentPage(formattedDataSource, pageNumber, _this_1.state.dataSource.length > 40);
                _this_1.setState({
                    activePage: pageNumber,
                    currentPageDataSource: currentPageDataSource
                }, function () {
                    if (!_this_1.props.isPaginationOnTheClientSide && _this_1.state.isMoreDataSourceFragment) {
                        var dataSourceLength = _this_1.state.dataSource.length;
                        var pl = dataSourceLength / sizePerPage;
                        var pagesLength = pl % 1 === 0 ? pl : pl + 1;
                        var penultimate = Math.floor(pagesLength - 1);
                        if (pageNumber >= penultimate) {
                            _this_1.setDataSource();
                        }
                    }
                });
            }
        };
        //---------------------------------------------------------------------------------------------------------------
        // FUNCTIONS
        //---------------------------------------------------------------------------------------------------------------
        //setDataSource
        _this_1.setDataSource = function () {
            var _a, _b;
            var path = _this_1.props.requestUrl;
            var params = (_a = _this_1.props.requestParams) !== null && _a !== void 0 ? _a : {};
            params["sortedBy"] = _this_1.state.propForSorting;
            params["isAscending"] = _this_1.state.isAscendingSort;
            params["dataSourceLength"] = (_b = _this_1.state.dataSource) === null || _b === void 0 ? void 0 : _b.length;
            var queryString = $.param(params);
            if (path.charAt(0) === "/")
                path = path.substring(1);
            _this_1._isMounted = true;
            _this_1._disablePaginition = true;
            fetch("/" + path + "?" + queryString, {
                method: 'get',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            })
                .then(function (res) { return res.json(); })
                .then(function (result) {
                var _a, _b;
                if (_this_1._isMounted) {
                    if (result.FlashMessage !== undefined && result.FlashMessage !== null) {
                        var fm = result.FlashMessage;
                        FlashMessageService.show(fm.ResultType, fm.FlashMessage, fm.FlashMessageTimeOut);
                    }
                    var activePage = 1;
                    var dataSource = [];
                    var formattedDataSource = [];
                    var currentPageDataSource = _this_1.state.currentPageDataSource;
                    var isMoreDataSourceFragment = false;
                    var oldDataSource = (_a = _this_1.state.dataSource) !== null && _a !== void 0 ? _a : [];
                    var resDataSource = result.DataSource && result.DataSource.length > 0 ? result.DataSource : [];
                    if (_this_1.props.isPaginationOnTheClientSide) {
                        dataSource = resDataSource;
                        formattedDataSource = _this_1.setFormattedDataSource(_this_1.props, dataSource);
                    }
                    else {
                        var dataSourceFragment = resDataSource;
                        var formattedDataSourceFragment = _this_1.setFormattedDataSource(_this_1.props, dataSourceFragment);
                        activePage = _this_1.state.activePage;
                        dataSource = oldDataSource.concat(dataSourceFragment);
                        isMoreDataSourceFragment = dataSourceFragment.length >= _this_1.props.dataSourceFragmentSize;
                        if (_this_1.props.propForGrouping !== "" && _this_1.props.htmlTemplateOfGrouping !== "") {
                            formattedDataSource = _this_1.state.formattedDataSource.concat(formattedDataSourceFragment);
                        }
                        else {
                            formattedDataSource = (_b = _this_1.state.formattedDataSource) !== null && _b !== void 0 ? _b : [];
                            if (formattedDataSource.length === 0)
                                formattedDataSource[0] = formattedDataSourceFragment[0];
                            else
                                formattedDataSource[0].objArray = formattedDataSource[0].objArray.concat(formattedDataSourceFragment[0].objArray);
                        }
                    }
                    formattedDataSource = _this_1.props.formattedDataSourceManipulationAfterArrivingFromTheServerSide(formattedDataSource);
                    currentPageDataSource = getDataSourceForTheCurrentPage(formattedDataSource, activePage, dataSource.length > 40);
                    _this_1.setState({
                        dataSource: dataSource,
                        formattedDataSource: formattedDataSource,
                        currentPageDataSource: currentPageDataSource,
                        isMoreDataSourceFragment: isMoreDataSourceFragment
                    }, function () {
                        _this_1._disablePaginition = false;
                    });
                }
            }, function (error) {
                console.log(error);
            });
        };
        //setFormattedDataSource
        _this_1.setFormattedDataSource = function (cProps, dataSource) {
            var ds = [];
            if (cProps.propForGrouping !== "") {
                var groupKeyForSort = [];
                var isValidPropName = true;
                for (var i = 0; i < dataSource.length; i++) {
                    var currObj = dataSource[i];
                    var groupKeyValue = currObj[cProps.propForGrouping];
                    if (groupKeyValue !== undefined) {
                        var dict = getValueOfTemplateAliases(currObj);
                        var htmlStringForDetail = cProps.htmlTemplateOfRowDetails !== "" ? replaceAliases(cProps.htmlTemplateOfRowDetails, dict) : "";
                        var htmlStringForGroup = cProps.htmlTemplateOfGrouping !== "" ? replaceAliases(cProps.htmlTemplateOfGrouping, dict) : "<div>" + groupKeyValue + "</div>";
                        currObj["htmlStringForGroup"] = htmlStringForGroup;
                        currObj["htmlStringForDetail"] = htmlStringForDetail;
                        currObj["htmlStringsForColumns"] = _this_1.getHtmlStringsForColumns(cProps, dict);
                        if (groupKeyForSort.indexOf(groupKeyValue) === -1) {
                            groupKeyForSort.push(groupKeyValue);
                        }
                        ds.push(currObj);
                    }
                    else {
                        isValidPropName = false;
                        break;
                    }
                }
                if (isValidPropName) {
                    var res = [];
                    var obj = groupBy(ds, cProps.propForGrouping);
                    for (var i = 0; i < groupKeyForSort.length; i++) {
                        var prop = groupKeyForSort[i];
                        var objArray = obj[prop];
                        var firstObj = objArray[0];
                        var groupValue = firstObj[cProps.propForGrouping];
                        var groupHtmlString = firstObj.htmlStringForGroup;
                        res.push({
                            groupValue: groupValue,
                            template: groupHtmlString,
                            objArray: objArray
                        });
                    }
                    return res;
                }
            }
            ds = [];
            for (var i = 0; i < dataSource.length; i++) {
                var currObj = dataSource[i];
                var dict = getValueOfTemplateAliases(currObj);
                var htmlStringForDetail = replaceAliases(cProps.htmlTemplateOfRowDetails, dict);
                currObj["htmlStringForGroup"] = "";
                currObj["htmlStringForDetail"] = htmlStringForDetail;
                currObj["htmlStringsForColumns"] = _this_1.getHtmlStringsForColumns(cProps, dict);
                ds.push(currObj);
            }
            return [{
                    groupValue: "",
                    template: "",
                    objArray: ds
                }];
        };
        //getHtmlStringsForColumns
        _this_1.getHtmlStringsForColumns = function (cProps, dict) {
            var res = [];
            Object.keys(cProps.columns).map(function (colKey) {
                var htmlTemplateOfRowCell = cProps.columns[colKey].htmlTemplateOfRowCell;
                var htmlStringForRowCell = htmlTemplateOfRowCell ? replaceAliases(htmlTemplateOfRowCell, dict)
                    : replaceAliases("<span>[##Obj." + colKey + "##]</span>", dict);
                res.push({
                    key: colKey,
                    value: htmlStringForRowCell
                });
            });
            return res;
        };
        //setHiddenColumns
        _this_1.setHiddenColumns = function (hiddenColumns) {
            _this_1._hiddenColumns = hiddenColumns;
        };
        //setExpandedKeys
        _this_1.setExpandedKeys = function (rows) {
            _this_1._expandedKeys = rows.filter(function (row) { return row.isExpanded === true; }).map(function (row) { return row.original.__rowKey; });
        };
        //expandAllDetails
        _this_1.expandAllDetails = function (e) {
            if (e.target.getAttribute("class").indexOf("detail-expand-down") !== -1) {
                var componentEl = document.getElementById(_this_1.props.componentKey);
                var downElements = componentEl.querySelectorAll('span.detail-expand-down[data-is-expand-all="false"]');
                e.target.setAttribute("class", "bi bi-caret-right detail-expand-right");
                for (var i = 0; i < downElements.length; i++) {
                    downElements[i].click();
                }
            }
            else {
                var componentEl = document.getElementById(_this_1.props.componentKey);
                var rightElements = componentEl.querySelectorAll('span.detail-expand-right[data-is-expand-all="false"]');
                e.target.setAttribute("class", "bi bi-caret-down detail-expand-down");
                for (var i = 0; i < rightElements.length; i++) {
                    rightElements[i].click();
                }
            }
        };
        //getColumns
        _this_1.getColumns = function () {
            var res = [];
            var _this = _this_1;
            var columns = _this_1.props.columns;
            if (_this_1.props.htmlTemplateOfRowDetails !== "") {
                res.push({
                    id: '__AlwaysVisibleColumn_Expander',
                    width: 40,
                    Header: function () { return (React.createElement("span", { style: { cursor: "pointer" } },
                        React.createElement("span", { className: "bi bi-caret-down detail-expand-down", "data-is-expand-all": "true", onClick: function (e) { return _this_1.expandAllDetails(e); } }))); },
                    Cell: function (_a) {
                        var row = _a.row;
                        return (React.createElement("span", __assign({}, row.getToggleRowExpandedProps(), { title: "" }), row.isExpanded ? React.createElement("span", { className: "bi bi-caret-right detail-expand-right", "data-is-expand-all": "false" })
                            : React.createElement("span", { className: "bi bi-caret-down detail-expand-down", "data-is-expand-all": "false" })));
                    }
                });
            }
            Object.keys(columns).map(function (colKey) {
                var currCol = columns[colKey];
                var title = currCol.title ? currCol.title : colKey;
                var isShow = currCol.isDisplayByDefault ? currCol.isDisplayByDefault : true;
                var isAlwaysVisible = currCol.isAlwaysVisible ? currCol.isAlwaysVisible : false;
                if (_this._hiddenColumns !== null && _this._hiddenColumns.indexOf(colKey) !== -1)
                    isShow = false;
                res.push({
                    id: isAlwaysVisible ? "__AlwaysVisibleColumn_" + colKey : colKey,
                    accessor: colKey,
                    width: currCol.minWidth ? currCol.minWidth : 150,
                    show: isShow,
                    HeaderTitle: title,
                    Header: function () {
                        return (React.createElement(React.Fragment, null,
                            React.createElement("div", { className: "th-title-box", "data-is-sortable": !(currCol.isSortable === false), onClick: function () { return _this.onHeaderCellClick(colKey); } },
                                React.createElement("span", { className: "thtb-text" }, title),
                                colKey !== _this.state.propForSorting ? null :
                                    _this.state.isAscendingSort
                                        ? React.createElement("i", { className: "bi bi-sort-down-alt" })
                                        : React.createElement("i", { className: "bi bi-sort-down" }))));
                    },
                    Cell: function (props) { return ReactHtmlParser(props.value); }
                });
            });
            return res;
        };
        //getData
        _this_1.getData = function () {
            var data = [];
            var expanded = {};
            var rowIndex = -1;
            var propForRowKey = _this_1.props.propForRowKey;
            var currentPageDataSource = _this_1.state.currentPageDataSource;
            var propForExpanded = _this_1.props.propForExpandedDetailByDefault;
            for (var x = 0; x < currentPageDataSource.length; x++) {
                var group = currentPageDataSource[x];
                for (var y = 0; y < group.objArray.length; y++) {
                    var isExpanded = false;
                    var currObj = group.objArray[y];
                    var htmlStringsForColumns = currObj.htmlStringsForColumns;
                    rowIndex++;
                    var dataObj = {
                        __rowKey: currObj[propForRowKey]
                    };
                    for (var z = 0; z < htmlStringsForColumns.length; z++) {
                        var key = htmlStringsForColumns[z].key;
                        var value = htmlStringsForColumns[z].value;
                        dataObj[key] = value;
                    }
                    if (_this_1._expandedKeys !== null)
                        isExpanded = _this_1._expandedKeys.indexOf(currObj[_this_1.props.propForRowKey]) !== -1;
                    else if (propForExpanded !== "" && currObj[propForExpanded] !== undefined)
                        isExpanded = currObj[propForExpanded] === true || currObj[propForExpanded] === "true" || currObj[propForExpanded] === "True";
                    data.push(dataObj);
                    expanded[rowIndex.toString()] = isExpanded;
                }
            }
            return { data: data, expanded: expanded };
        };
        _this_1.state = {
            activePage: 1,
            dataSource: null,
            formattedDataSource: null,
            currentPageDataSource: null,
            isMoreDataSourceFragment: false,
            propForSorting: props.propForSortingByDefault ? props.propForSortingByDefault : "",
            isAscendingSort: props.isAscendingSortByDefault ? props.isAscendingSortByDefault : false
        };
        return _this_1;
    }
    Table.prototype.componentDidMount = function () {
        this.setDataSource();
    };
    Table.prototype.componentWillUnmount = function () {
        this._isMounted = false;
    };
    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------
    Table.prototype.render = function () {
        var componentKey = this.props.componentKey;
        var activePage = this.state.activePage;
        var dataSource = this.state.dataSource;
        var currentPageDataSource = this.state.currentPageDataSource;
        if (dataSource === null)
            return null;
        var columns = this.getColumns();
        var dataObj = this.getData();
        var data = dataObj.data;
        var expanded = dataObj.expanded;
        return (React.createElement(TableContainer, { id: componentKey, className: "table-container", "data-datasource-length": dataSource.length },
            React.createElement("div", { className: "table-operation-box" },
                React.createElement(Pagination, { activePage: activePage, dataSourceLength: dataSource.length, paginationPosition: PaginationPosition.right, onPageChange: this.onPageChange })),
            React.createElement(ReactTable, { data: data, columns: columns, expanded: expanded, currentPageDataSource: currentPageDataSource, activePage: activePage, rowClick: this.onRowClick, setHiddenColumns: this.setHiddenColumns, setExpandedKeys: this.setExpandedKeys })));
    };
    Table.defaultProps = {
        propForGrouping: "",
        htmlTemplateOfGrouping: "",
        propForExpandedDetailByDefault: "",
        htmlTemplateOfRowDetails: "",
        isAscendingSortByDefault: true,
        isPaginationOnTheClientSide: true,
        datasourceFragmentSize: 100
    };
    return Table;
}(React.Component));
export default Table;
//# sourceMappingURL=table.js.map