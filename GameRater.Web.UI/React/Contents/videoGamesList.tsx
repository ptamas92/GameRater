import * as React from "react";
/*import $ from 'jquery';*/
import Table, { ITableColumn } from "../Components/Table/table";
import RatingStarBox from "../Components/Utils/ratingStarBox";
import * as EventHandlerService from "../Services/eventHandlerService";
import { convertJsxToHtml } from "../Services/dataSourceFormatterService";

declare var sizePerPage;
declare var requestVerificationToken;
declare var requestVerificationTokenName;

export default class Main extends React.Component<any, {}> {

    _isMounted: boolean = false;

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

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
            item.htmlStringsForColumns.filter(x => x.key === "Rating")[0].value = _this.getRatingStarBox(item);
        });

        return ds;
    }

    //onStarClick
    onStarClick = (item, starKey) => {
        this._isMounted = true;

        var params = {
            id: item.Id,
            value: starKey
        };

        fetch("/VideoGame/Rating",
            {
                method: 'post',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', [requestVerificationTokenName]: requestVerificationToken },
                body: JSON.stringify(params)
            })
            .then(res => res.json())
            .then((result) => {
                if (this._isMounted) {

                    console.log(result.FlashMessage);

                    if (result.FlashMessage !== null) 
                        EventHandlerService.callEvent("event_flash_message_display", JSON.stringify(result.FlashMessage));

                    if (result.AverageRate) {
                        item.AverageRate = result.AverageRate;
                        item.htmlStringsForColumns.filter(x => x.key === "Rating")[0].value = this.getRatingStarBox(item);


                    }
                }
            }, (error) => {
                console.log(error);

                return null;
            })
    }

    getRatingStarBox = (item) => {
        let averageRate = item.AverageRate;
        let fullStarNum = parseInt(averageRate.toString(), 10);
        let isNextHalf = Math.round(averageRate) !== fullStarNum;

        return <RatingStarBox fullStarNum={fullStarNum}
                              isNextHalf={isNextHalf}
                              onStarClick={(starKey) => this.onStarClick(item, starKey)} />
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