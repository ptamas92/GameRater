import * as React from "react";
/*import $ from 'jquery';*/
import Table, { ITableColumn } from "../Components/Table/table";
import RatingStarBox from "../Components/Utils/ratingStarBox";
import { convertJsxToHtml } from "../Services/dataSourceFormatterService";

export default class Main extends React.Component<any, {}> {

    //---------------------------------------------------------------------------------------------------------------
    // Functions
    //---------------------------------------------------------------------------------------------------------------

    //getCoumns
    getCoumns = () => {
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
                htmlTemplateOfRowCell: convertJsxToHtml(<a href="[##Obj.CoverImageUrl##]" target="_blank">Link</a>),
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
        } as Record<string, ITableColumn>;
    }

    //SetRatingColumn
    SetRatingColumn = (ds) => {
        ds[0].objArray.forEach(function (item) {
            var averageRate = item.AverageRate;
            var htmlStringsForColumns = item.htmlStringsForColumns;

            var fullStarNum = parseInt(averageRate.toString(), 10);
            var isNextHalf = Math.round(averageRate) !== fullStarNum;

            htmlStringsForColumns.filter(x => x.key === "Rating")[0].value = <RatingStarBox fullStarNum={fullStarNum} isNextHalf={isNextHalf} />
        });

        return ds;
    }

    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------

    render() {
        var columns = this.getCoumns();

        return (
            <Table componentKey="video_game_list"
                   requestUrl="VideoGame/GetVideoGames"
                   requestParams={null}
                   columns={columns}
                   propForRowKey="Id"
                   dataSourceFragmentSize={100}
                   isPaginationOnTheClientSide={false}
                   formattedDataSourceManipulationAfterArrivingFromTheServerSide={this.SetRatingColumn} />
        )
    }
}