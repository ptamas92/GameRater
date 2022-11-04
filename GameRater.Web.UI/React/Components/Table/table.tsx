import * as React from "react";
import ReactHtmlParser from 'react-html-parser';
import $ from 'jquery';
import ReactTable from "./reactTable";
import Pagination, { PaginationPosition } from "../Utils/pagination";
import { TableContainer } from "./__styledTable";
import { getValueOfTemplateAliases, replaceAliases, groupBy, sorting, getDataSourceForTheCurrentPage } from "../../Services/dataSourceFormatterService";
import * as FlashMessageService from "../../Services/flashMessageService";

declare var rootPath, requestVerificationTokenName, requestVerificationToken;

export interface ITableColumn {
    title?: string,
    htmlTemplateOfRowCell?: string,
    isAlwaysVisible?: boolean,
    isDisplayByDefault?: boolean,
    isSortable?: boolean,
    minWidth?: number,
}

interface ITableProps {
    componentKey: string,
    requestUrl: string,
    requestParams: any,
    columns: Record<string, ITableColumn>,
    propForRowKey: string,
    propForGrouping?: string,
    htmlTemplateOfGrouping?: string,
    propForExpandedDetailByDefault?: string,
    htmlTemplateOfRowDetails?: string,
    propForSortingByDefault?: string,
    isAscendingSortByDefault?: boolean,
    isPaginationOnTheClientSide?: boolean
    dataSourceFragmentSize?: number,
    onRowClick?: (obj: any, rowId: string, e: React.MouseEvent<Element, MouseEvent>) => void
}

interface ITableStates {
    activePage: number,
    dataSource: Array<any>,
    formattedDataSource: Array<any>,
    currentPageDataSource: Array<any>,
    isMoreDataSourceFragment: boolean,
    propForSorting: string,
    isAscendingSort: boolean
}

export default class Table extends React.Component<ITableProps, ITableStates> {

    _isMounted: boolean = false;
    _hiddenColumns: Array<any> = null;
    _expandedKeys: Array<any> = null;
    _disablePaginition: boolean = false;

    public static defaultProps = {
        propForGrouping: "",
        htmlTemplateOfGrouping: "",
        propForExpandedDetailByDefault: "",
        htmlTemplateOfRowDetails: "",
        isAscendingSortByDefault: true,
        isPaginationOnTheClientSide: true,
        datasourceFragmentSize: 100
    }

    constructor(props) {
        super(props);

        this.state = {
            activePage: 1,
            dataSource: null,
            formattedDataSource: null,
            currentPageDataSource: null,
            isMoreDataSourceFragment: false,
            propForSorting: props.propForSortingByDefault ? props.propForSortingByDefault : "",
            isAscendingSort: props.isAscendingSortByDefault ? props.isAscendingSortByDefault : false
        };
    }

    componentDidMount() {
        this.setDataSource();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    //---------------------------------------------------------------------------------------------------------------
    // EVENTS
    //---------------------------------------------------------------------------------------------------------------

    //onHeaderCellClick
    onHeaderCellClick = (colKey: string) => {
        this._disablePaginition = true;

        var isAscendingSort = this.state.propForSorting === colKey ? !this.state.isAscendingSort : this.state.isAscendingSort;

        if (this.props.isPaginationOnTheClientSide) {
            var dataSource = this.state.dataSource.sort(sorting(colKey, isAscendingSort ? "asc" : "desc"));
            var formattedDataSource = this.setFormattedDataSource(this.props, dataSource);
            var currentPageDataSource = getDataSourceForTheCurrentPage(formattedDataSource, 1, dataSource.length > 40);

            this.setState({
                dataSource,
                formattedDataSource,
                currentPageDataSource,
                isAscendingSort,
                propForSorting: colKey
            }, () => {
                this._disablePaginition = false;
            });
        }
        else {
            //TODO: Server side sorting
        }
    }

    //onRowClick
    onRowClick = (obj: any, rowId: string, e: React.MouseEvent<Element, MouseEvent>) => {
        var origObj = {};

        for (const prop in obj) {
            if (prop !== "htmlStringForGroup" && prop !== "htmlStringForDetail" && prop !== "htmlStringsForColumns") 
                origObj[prop] = obj[prop];
        }

        if (this.props.onRowClick !== undefined) 
            this.props.onRowClick(origObj, rowId, e);
    }

    //onPageChange
    onPageChange = (pageNumber: number) => {
        if (!this._disablePaginition) {
            var formattedDataSource = this.state.formattedDataSource;
            var currentPageDataSource = getDataSourceForTheCurrentPage(formattedDataSource, pageNumber, this.state.dataSource.length > 40);

            this.setState({
                activePage: pageNumber,
                currentPageDataSource: currentPageDataSource
            }, () => {
                if (!this.props.isPaginationOnTheClientSide && this.state.isMoreDataSourceFragment) {
                    var dataSourceLength = this.state.dataSource.length;
                    var pl = dataSourceLength / 25;
                    var pagesLength = pl % 1 === 0 ? pl : pl + 1;
                    var penultimate = Math.floor(pagesLength - 1);

                    if (pageNumber >= penultimate) {
                        this.setDataSource();
                    }
                }
            });
        }
    }

    //---------------------------------------------------------------------------------------------------------------
    // FUNCTIONS
    //---------------------------------------------------------------------------------------------------------------

    //setDataSource
    setDataSource = () => {
        var path = this.props.requestUrl;
        var params = this.props.requestParams ?? {};

        params["sortedBy"] = this.state.propForSorting;
        params["isAscending"] = this.state.isAscendingSort;
        params["dataSourceLength"] = this.state.dataSource?.length;

        var queryString = $.param(params);

        if (path.charAt(0) === "/")
            path = path.substring(1);

        this._isMounted = true;
        this._disablePaginition = true;

        fetch("/" + path + "?" + queryString,
            {
                method: 'get',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then((result) => {
                if (this._isMounted) {
                    console.log(result);

                    if (result.FlashMessage !== undefined && result.FlashMessage !== null) {
                        var fm = result.FlashMessage;
                        FlashMessageService.show(fm.ResultType, fm.FlashMessage, fm.FlashMessageTimeOut);
                    }

                    var dataSource = [];
                    var formattedDataSource = [];
                    var currentPageDataSource = this.state.currentPageDataSource;
                    var isMoreDataSourceFragment = false;

                    var oldDataSource = this.state.dataSource ?? [];
                    var resDataSource = result.DataSource && result.DataSource.length > 0 ? result.DataSource : [];

                    if (this.props.isPaginationOnTheClientSide) {
                        dataSource = resDataSource;
                        formattedDataSource = this.setFormattedDataSource(this.props, dataSource);
                        currentPageDataSource = getDataSourceForTheCurrentPage(formattedDataSource, 1, dataSource.length > 40);
                    }
                    else {
                        var dataSourceFragment = resDataSource;
                        var formattedDataSourceFragment = this.setFormattedDataSource(this.props, dataSourceFragment);

                        dataSource = oldDataSource.concat(dataSourceFragment);
                        isMoreDataSourceFragment = dataSourceFragment.length >= this.props.dataSourceFragmentSize;

                        if (this.props.propForGrouping !== "" && this.props.htmlTemplateOfGrouping !== "") {
                            formattedDataSource = this.state.formattedDataSource.concat(formattedDataSourceFragment);
                        }
                        else {
                            formattedDataSource = this.state.formattedDataSource ?? [];

                            if (formattedDataSource.length === 0)
                                formattedDataSource[0] = formattedDataSourceFragment[0];
                            else
                                formattedDataSource[0].objArray = formattedDataSource[0].objArray.concat(formattedDataSourceFragment[0].objArray);
                        }

                        currentPageDataSource = getDataSourceForTheCurrentPage(formattedDataSource, this.state.activePage, dataSource.length > 40);
                    }

                    this.setState({
                        dataSource,
                        formattedDataSource,
                        currentPageDataSource,
                        isMoreDataSourceFragment
                    }, () => {
                        this._disablePaginition = false;
                    });
                }
            }, (error) => {
                console.log(error);
            })
    }

    //setFormattedDataSource
    setFormattedDataSource = (cProps, dataSource) => {
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
                    currObj["htmlStringsForColumns"] = this.getHtmlStringsForColumns(cProps, dict);

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
                    })
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
            currObj["htmlStringsForColumns"] = this.getHtmlStringsForColumns(cProps, dict);

            ds.push(currObj);
        }

        return [{
            groupValue: "",
            template: "",
            objArray: ds
        }];
    }

    //getHtmlStringsForColumns
    getHtmlStringsForColumns = (cProps, dict) => {
        var res = [];

        Object.keys(cProps.columns).map(function (colKey) {
            var htmlTemplateOfRowCell = cProps.columns[colKey].htmlTemplateOfRowCell;
            var htmlStringForRowCell = htmlTemplateOfRowCell ? replaceAliases(htmlTemplateOfRowCell as string, dict)
                                                             : replaceAliases("<span>[##Obj." + colKey + "##]</span>" as string, dict);

            res.push({
                key: colKey,
                value: htmlStringForRowCell
            });
        })

        return res;
    }

    //setHiddenColumns
    setHiddenColumns = (hiddenColumns) => {
        this._hiddenColumns = hiddenColumns;
    }

    //setExpandedKeys
    setExpandedKeys = (rows) => {
        this._expandedKeys = rows.filter(row => row.isExpanded === true).map(row => row.original.__rowKey);
    }

    //expandAllDetails
    expandAllDetails = (e) => {
        if (e.target.getAttribute("class").indexOf("detail-expand-down") !== -1) {
            var componentEl = document.getElementById(this.props.componentKey);
            var downElements = componentEl.querySelectorAll('span.detail-expand-down[data-is-expand-all="false"]');

            e.target.setAttribute("class", "bi bi-caret-right detail-expand-right");

            for (var i = 0; i < downElements.length; i++) {
                (downElements[i] as any).click();
            }
        }
        else {
            var componentEl = document.getElementById(this.props.componentKey);
            var rightElements = componentEl.querySelectorAll('span.detail-expand-right[data-is-expand-all="false"]');

            e.target.setAttribute("class", "bi bi-caret-down detail-expand-down");

            for (var i = 0; i < rightElements.length; i++) {
                (rightElements[i] as any).click();
            }
        }
    }

    //getColumns
    getColumns = () => {
        var res = [];
        var _this = this;
        var columns = this.props.columns;

        if (this.props.htmlTemplateOfRowDetails !== "") {
            res.push({
                id: '__AlwaysVisibleColumn_Expander',
                width: 40,
                Header: () => (
                    <span style={{ cursor: "pointer" }} >
                        <span className="bi bi-caret-down detail-expand-down" data-is-expand-all="true" onClick={(e) => this.expandAllDetails(e)}></span>
                    </span>
                ),
                Cell: ({ row }) => (
                    <span {...row.getToggleRowExpandedProps()} title="">
                        {
                            row.isExpanded ? <span className="bi bi-caret-right detail-expand-right" data-is-expand-all="false"></span>
                                           : <span className="bi bi-caret-down detail-expand-down" data-is-expand-all="false"></span>
                        }
                    </span>
                )
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
                Header: () => {
                    return (
                        <React.Fragment>
                            <div className="th-title-box" data-is-sortable={!(currCol.isSortable === false)} onClick={() => _this.onHeaderCellClick(colKey)}>
                                <span className="thtb-text">{title}</span>
                                {
                                    colKey !== _this.state.propForSorting ? null :
                                        _this.state.isAscendingSort
                                            ? <i className="bi bi-sort-down-alt"></i>
                                            : <i className="bi bi-sort-down"></i>
                                }
                            </div>
                        </React.Fragment>
                    )
                },
                Cell: props => ReactHtmlParser(props.value)
            });
        });

        return res;
    }

    //getData
    getData = () => {
        var data = [];
        var expanded = {};
        var rowIndex = -1;
        var propForRowKey = this.props.propForRowKey;
        var currentPageDataSource = this.state.currentPageDataSource;
        var propForExpanded = this.props.propForExpandedDetailByDefault;

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

                if (this._expandedKeys !== null)
                    isExpanded = this._expandedKeys.indexOf(currObj[this.props.propForRowKey]) !== -1;

                else if (propForExpanded !== "" && currObj[propForExpanded] !== undefined)
                    isExpanded = currObj[propForExpanded] === true || currObj[propForExpanded] === "true" || currObj[propForExpanded] === "True";
                
                data.push(dataObj);
                expanded[rowIndex.toString()] = isExpanded;
            }
        }

        return { data, expanded };
    }

    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------

    render() {
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

        return (
            <TableContainer id={componentKey} className="table-container" data-datasource-length={dataSource.length}>

                {/* - operation box - */}
                <div className="table-operation-box">
                    <Pagination activePage={activePage} dataSourceLength={dataSource.length} paginationPosition={PaginationPosition.right} onPageChange={this.onPageChange} />
                </div>

                {/* - table - */}
                <ReactTable data={data}
                            columns={columns}
                            expanded={expanded}
                            currentPageDataSource={currentPageDataSource}
                            activePage={activePage}
                            rowClick={this.onRowClick}
                            setHiddenColumns={this.setHiddenColumns}
                            setExpandedKeys={this.setExpandedKeys} />

            </TableContainer>
        )
    }
}