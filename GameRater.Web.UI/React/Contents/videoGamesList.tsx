import * as React from "react";
import { IFlashMessageModel } from "../app";
import Table, { ITableColumn } from "../Components/Table/table";
import RatingStarBox from "../Components/Utils/ratingStarBox";
import * as EventHandlerService from "../Services/eventHandlerService";
import { convertJsxToHtml } from "../Services/dataSourceFormatterService";

declare var sizePerPage;
declare var isLoginRequiredWarning;
declare var requestVerificationToken;
declare var requestVerificationTokenName;

interface IVideoGamesListContentStates {
    locationPath: string
}

export default class VideoGamesListContent extends React.Component<any, IVideoGamesListContentStates> {

    _isMounted: boolean = false;

    constructor(props) {
        super(props);

        this.state = {
            locationPath: this.props.location.pathname
        }
    }

    componentDidMount() {
        if (window.location.href.indexOf("?isLoginRequiredWarning=True") !== -1) 
            window.history.pushState({}, document.title, "/");
            
        if (isLoginRequiredWarning) {
            var flashMessage = {
                ResultType: "danger",
                Message: "Log in to view the content of my ratings!",
                TimeOut: 5000
            } as IFlashMessageModel;

            setTimeout(() => {
                EventHandlerService.callEvent("event_flash_message_display", JSON.stringify(flashMessage));
            }, 500);
        }
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
            Id: item.Id,
            Value: starKey
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

                    if (result.FlashMessage !== null) 
                        EventHandlerService.callEvent("event_flash_message_display", JSON.stringify(result.FlashMessage));

                    if (result.AverageRate) {
                        item.AverageRate = result.AverageRate;
                        item.htmlStringsForColumns.filter(x => x.key === "Rating")[0].value = this.getRatingStarBox(item);

                        EventHandlerService.callEvent("event_refresh_datasource_item_video_game_list", JSON.stringify(item));
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

        var requestParams = null;
        var requestUrl = "VideoGame/GetVideoGames";

        if (this.state.locationPath === "/Home/MyRatings") 
            requestParams = { IsFilter: true };

        return (
            <Table componentKey="video_game_list"
                   requestUrl={requestUrl}
                   requestParams={requestParams}
                   columns={columns}
                   propForRowKey="Id"
                   htmlTemplateOfRowDetails={convertJsxToHtml(<span>[##Obj.Description##]</span>)}
                   dataSourceFragmentSize={sizePerPage * 4}
                   isPaginationOnTheClientSide={false}
                   formattedDataSourceManipulationAfterArrivingFromTheServerSide={this.setRatingColumn} />
        )
    }
}