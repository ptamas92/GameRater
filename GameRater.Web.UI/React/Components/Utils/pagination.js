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
import * as React from "react";
import ReactPagination from "react-js-pagination";
import { PaginationContainer } from "./__styledUtils";
export var PaginationPosition;
(function (PaginationPosition) {
    PaginationPosition[PaginationPosition["left"] = 0] = "left";
    PaginationPosition[PaginationPosition["right"] = 1] = "right";
    PaginationPosition[PaginationPosition["center"] = 2] = "center";
})(PaginationPosition || (PaginationPosition = {}));
var TableContent = /** @class */ (function (_super) {
    __extends(TableContent, _super);
    function TableContent(props) {
        return _super.call(this, props) || this;
    }
    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------
    TableContent.prototype.render = function () {
        var activePage = this.props.activePage;
        var dataSourceLength = this.props.dataSourceLength;
        return (React.createElement(PaginationContainer, { className: "pagination-container", "data-pagination-position": PaginationPosition[this.props.paginationPosition] },
            React.createElement(ReactPagination, { prevPageText: '<', nextPageText: '>', firstPageText: '<<', lastPageText: '>>', itemsCountPerPage: sizePerPage, pageRangeDisplayed: 3, activePage: activePage, totalItemsCount: dataSourceLength, onChange: this.props.onPageChange })));
    };
    return TableContent;
}(React.Component));
export default TableContent;
//# sourceMappingURL=pagination.js.map