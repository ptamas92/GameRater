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
/*import $ from 'jquery';*/
import Table from "../Components/Table/table";
import RatingStarBox from "../Components/Utils/ratingStarBox";
import { convertJsxToHtml } from "../Services/dataSourceFormatterService";
var Main = /** @class */ (function (_super) {
    __extends(Main, _super);
    function Main() {
        //---------------------------------------------------------------------------------------------------------------
        // Functions
        //---------------------------------------------------------------------------------------------------------------
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        //getCoumns
        _this_1.getCoumns = function () {
            return {
                "Title": {
                    title: "Title",
                    htmlTemplateOfRowCell: null,
                    isAlwaysVisible: true,
                    isDisplayByDefault: true,
                    isSortable: false,
                    minWidth: 100
                },
                "YearOfPublication": {
                    title: "Year of publication",
                    htmlTemplateOfRowCell: null,
                    isAlwaysVisible: false,
                    isDisplayByDefault: true,
                    isSortable: false,
                    minWidth: 80
                },
                "CoverImageUrl": {
                    title: "Cover image",
                    htmlTemplateOfRowCell: convertJsxToHtml(React.createElement("a", { href: "[##Obj.CoverImageUrl##]", target: "_blank" }, "Link")),
                    isAlwaysVisible: true,
                    isDisplayByDefault: true,
                    isSortable: false,
                    minWidth: 80
                },
                "Publisher": {
                    title: "Publisher",
                    htmlTemplateOfRowCell: null,
                    isAlwaysVisible: false,
                    isDisplayByDefault: true,
                    isSortable: false,
                    minWidth: 80
                },
                "Rating": {
                    title: " ",
                    htmlTemplateOfRowCell: " ",
                    isAlwaysVisible: true,
                    isDisplayByDefault: true,
                    isSortable: false
                },
            };
        };
        //setRatingColumn
        _this_1.setRatingColumn = function (ds) {
            var _this = _this_1;
            ds[0].objArray.forEach(function (item) {
                var averageRate = item.AverageRate;
                var htmlStringsForColumns = item.htmlStringsForColumns;
                var fullStarNum = parseInt(averageRate.toString(), 10);
                var isNextHalf = Math.round(averageRate) !== fullStarNum;
                htmlStringsForColumns.filter(function (x) { return x.key === "Rating"; })[0].value = React.createElement(RatingStarBox, { fullStarNum: fullStarNum, isNextHalf: isNextHalf, onStarClick: function (starKey) { return _this.onStarClick(item, starKey); } });
            });
            return ds;
        };
        //onStarClick
        _this_1.onStarClick = function (item, starKey) {
            console.log(item.Id, starKey);
        };
        return _this_1;
    }
    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------
    Main.prototype.render = function () {
        var columns = this.getCoumns();
        return (React.createElement(Table, { componentKey: "video_game_list", requestUrl: "VideoGame/GetVideoGames", requestParams: null, columns: columns, propForRowKey: "Id", dataSourceFragmentSize: sizePerPage * 4, isPaginationOnTheClientSide: false, formattedDataSourceManipulationAfterArrivingFromTheServerSide: this.setRatingColumn }));
    };
    return Main;
}(React.Component));
export default Main;
//# sourceMappingURL=videoGamesList.js.map