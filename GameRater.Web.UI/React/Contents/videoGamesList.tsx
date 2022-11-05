import * as React from "react";
/*import $ from 'jquery';*/
import Table, { ITableColumn } from "../Components/Table/table";
import RatingStarBox from "../Components/Utils/ratingStarBox";
import { convertJsxToHtml } from "../Services/dataSourceFormatterService";

declare var sizePerPage;

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

    //setRatingColumn
    setRatingColumn = (ds) => {
        var _this = this;

        ds[0].objArray.forEach(function (item) {
            let averageRate = item.AverageRate;
            let htmlStringsForColumns = item.htmlStringsForColumns;

            let fullStarNum = parseInt(averageRate.toString(), 10);
            let isNextHalf = Math.round(averageRate) !== fullStarNum;

            htmlStringsForColumns.filter(x => x.key === "Rating")[0].value = <RatingStarBox fullStarNum={fullStarNum}
                                                                                            isNextHalf={isNextHalf}
                                                                                            onStarClick={(starKey) => _this.onStarClick(item, starKey)} />
        });

        return ds;
    }

    //onStarClick
    onStarClick = (item, starKey) => {
        console.log(item.Id, starKey);
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
                   dataSourceFragmentSize={sizePerPage * 4}
                   isPaginationOnTheClientSide={false}
                   formattedDataSourceManipulationAfterArrivingFromTheServerSide={this.setRatingColumn} />
        )
    }
}