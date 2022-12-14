import * as React from "react";
import { history, ContentType } from "../app";
import { VideoGameList } from "./__styledContents";
import Table, { ITableColumn } from "../Components/Table/table";
import RatingStarBox from "../Components/Utils/ratingStarBox";
import * as VideoGameService from "../Services/videoGameService";
import * as FlashMessageService from "../Services/flashMessageService";
import * as EventHandlerService from "../Services/eventHandlerService";
import { convertJsxToHtml } from "../Services/dataSourceFormatterService";

declare var sizePerPage, isAuthenticated, isLoginRequiredWarning;

interface IVideoGamesListContentStates {
    contentType: ContentType,
    isDeleteFilterBtnEnable: boolean
}

export default class VideoGamesListContent extends React.Component<any, IVideoGamesListContentStates> {

    _isMounted: boolean = false;
    _tableRef: React.RefObject<Table>;

    constructor(props) {
        super(props);

        this._tableRef = React.createRef();

        var contentType = ContentType.Home;

        if (props.location.pathname === "/Home/MyRatings")
            contentType = ContentType.MyRatings;

        this.state = {
            contentType: contentType,
            isDeleteFilterBtnEnable: false
        }
    }

    componentDidMount() {
        if (window.location.href.indexOf("?isLoginRequiredWarning=True") !== -1) 
            window.history.pushState({}, document.title, "/");
            
        if (isLoginRequiredWarning) {
            setTimeout(() => {
                FlashMessageService.show(FlashMessageService.IFlashMessageType.Error, "Log in to view the content of my ratings!", 5000);
            }, 500);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    //---------------------------------------------------------------------------------------------------------------
    // Events
    //---------------------------------------------------------------------------------------------------------------

    //onRowClick
    onRowClick = (obj: any, rowId: string, e: React.MouseEvent<Element, MouseEvent>) => {
        var attr = (e.target as any).getAttribute("data-action-button-key");

        if (attr && attr === "video_game_title") {
            history.push("/Home/VideoGame?id=" + obj.Id);
        }
        else if (attr && attr === "video_game_publisher") {
            this._tableRef.current.dataSourceReload({
                PublisherIdFilter: obj.PublisherId
            });

            this.setState({
                isDeleteFilterBtnEnable: true
            });
        }
    }

    //onStarClick
    onStarClick = (item, starKey) => {
        this._isMounted = true;

        var contentType = this.state.contentType;

        VideoGameService.rating(item, starKey, contentType).then((result) => {
            if (this._isMounted && result.AverageRate) {
                item.AverageRate = result.AverageRate;
                item.htmlStringsForColumns.filter(x => x.key === "Rating")[0].value = this.getRatingStarBox(item);

                EventHandlerService.callEvent("event_refresh_datasource_item_video_game_list", JSON.stringify(item));
            }
        });
    }

    //onDeleteFilterCilck
    onDeleteFilterCilck = () => {
        this._tableRef.current.dataSourceReload({
            PublisherIdFilter: null
        });

        this.setState({
            isDeleteFilterBtnEnable: false
        });
    }

    //---------------------------------------------------------------------------------------------------------------
    // Functions
    //---------------------------------------------------------------------------------------------------------------

    //getCoumns
    getCoumns = () => {
        return {
            "Title": {
                title: "Title",
                htmlTemplateOfRowCell: convertJsxToHtml(isAuthenticated ? <span className="video-game-title" data-action-button-key="video_game_title">[##Obj.Title##]</span>
                                                                        : <span className="video-game-title disabled">[##Obj.Title##]</span>),
                isAlwaysVisible: true,
                isDisplayByDefault: true,
                isSortable: false,
                minWidth: 200
            },
            "YearOfPublication": {
                title: "Year of publication",
                htmlTemplateOfRowCell: null,
                isAlwaysVisible: false,
                isDisplayByDefault: true,
                isSortable: false,
                minWidth: 170
            },
            "CoverImageUrl": {
                title: "Cover image",
                htmlTemplateOfRowCell: convertJsxToHtml(<a href="[##Obj.CoverImageUrl##]" target="_blank" data-action-button-key="cover_img_Link">Link</a>),
                isAlwaysVisible: true,
                isDisplayByDefault: true,
                isSortable: false,
                minWidth: 170
            },
            "Publisher": {
                title: "Publisher",
                htmlTemplateOfRowCell: convertJsxToHtml(<span className="video-game-publisher" data-action-button-key="video_game_publisher">[##Obj.Publisher##]</span>),
                isAlwaysVisible: false,
                isDisplayByDefault: true,
                isSortable: false,
                minWidth: 170
            },
            "Rating": {
                title: "Rating",
                htmlTemplateOfRowCell: " ",
                isAlwaysVisible: true,
                isDisplayByDefault: true,
                isSortable: false,
                minWidth: 250
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

    getRatingStarBox = (item) => {
        let averageRate = item.AverageRate;
        let fullStarNum = parseInt(averageRate.toString(), 10);
        let isNextHalf = Math.round(averageRate) !== fullStarNum;

        return (
            <React.Fragment>
                <div style={{ float: "left" }}>{averageRate}</div>

                <RatingStarBox fullStarNum={fullStarNum}
                               isNextHalf={isNextHalf}
                               isDisable={!isAuthenticated}
                               disableHoverText="Login to rate!"
                               onStarClick={(starKey) => this.onStarClick(item, starKey)} />
            </React.Fragment>

        )
    }

    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------

    render() {
        var columns = this.getCoumns();
        var isDeleteFilterBtnEnable = this.state.isDeleteFilterBtnEnable;

        var title = "Video games";
        var requestParams = null;
        var requestUrl = "VideoGame/GetVideoGames";

        if (this.state.contentType === ContentType.MyRatings) {
            title = "My ratings";
            requestParams = { IsFilteredByUser: true };
        }

        return (
            <VideoGameList>
                <h2 style={{ textAlign: "center" }}>{title}</h2>

                <button className="delete-filter" title="Delete filter" onClick={this.onDeleteFilterCilck} disabled={!isDeleteFilterBtnEnable}>
                    <i className="bi bi-x"></i>
                </button>

                <Table ref={this._tableRef}
                       componentKey="video_game_list"
                       requestUrl={requestUrl}
                       requestParams={requestParams}
                       columns={columns}
                       propForRowKey="Id"
                       htmlTemplateOfRowDetails={convertJsxToHtml(<span>[##Obj.Description##]</span>)}
                       dataSourceFragmentSize={sizePerPage * 4}
                       isPaginationOnTheClientSide={false}
                       formattedDataSourceManipulationAfterArrivingFromTheServerSide={this.setRatingColumn}
                       onRowClick={this.onRowClick} />
            </VideoGameList>
           
        )
    }
}