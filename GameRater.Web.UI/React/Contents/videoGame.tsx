import * as React from "react";
import { history } from "../app";
import { VideoGame } from "./__styledContents";
import RatingStarBox from "../Components/Utils/ratingStarBox";
import * as FlashMessageService from "../Services/flashMessageService";
import * as EventHandlerService from "../Services/eventHandlerService";

declare var isAuthenticated;

interface IVideoGameontentStates {
    id: number,
    dataSource: any
}

export default class VideoGameContent extends React.Component<any, IVideoGameontentStates> {

    _isMounted: boolean = false;

    constructor(props) {
        super(props);

        var id: number = null;

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const param = urlParams.get('id');

            if (param)
                id = parseInt(param);
        } catch (e) {}

        if (id) {
            this.state = {
                id,
                dataSource: null
            };
        }
        else {
            history.push("");
        }
    }

    componentDidMount() {
        if (isAuthenticated) {

            this._isMounted = true;

            var id = this.state.id;

            fetch("/VideoGame/GetVideoGame?id=" + id,
                {
                    method: 'get',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
                })
                .then(res => res.json())
                .then((result) => {
                    if (this._isMounted) {

                        if (result.FlashMessage !== null)
                            EventHandlerService.callEvent("event_flash_message_display", JSON.stringify(result.FlashMessage));

                        if (result.DataSource != null) {
                            this.setState({
                                dataSource: result.DataSource
                            });
                        }
                    }
                }, (error) => {
                    console.log(error);
                    return null;
                })
        }
        else {
            FlashMessageService.show(FlashMessageService.IFlashMessageType.Error, "Log in to view the content of my ratings!", 5000);
            history.push("");
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    //---------------------------------------------------------------------------------------------------------------
    // Events
    //---------------------------------------------------------------------------------------------------------------

    //onStarClick
    onStarClick = (item, starKey) => {

    }

    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------

    render() {
        var obj = this.state.dataSource;

        var averageRate = obj.AverageRate;
        var fullStarNum = parseInt(averageRate.toString(), 10);
        var isNextHalf = Math.round(averageRate) !== fullStarNum;

        if (obj) {
            return (
                <VideoGame>
                    <h2 style={{ textAlign: "center" }}>Video game</h2>


                    <div className="video-game-details-box">
                        <div className="vgdb-item">
                            <div className="vgdbi-label">Title</div>
                            <div className="vgdbi-value">{obj.Title}</div>
                        </div>
                        <div className="vgdb-item">
                            <div className="vgdbi-label">Description</div>
                            <div className="vgdbi-value">{obj.Description}</div>
                        </div>
                        <div className="vgdb-item">
                            <div className="vgdbi-label">Year of publication</div>
                            <div className="vgdbi-value">{obj.YearOfPublication}</div>
                        </div>
                        <div className="vgdb-item">
                            <div className="vgdbi-label">Publisher</div>
                            <div className="vgdbi-value">{obj.Publisher}</div>
                        </div>
                        <div className="vgdb-item">
                            <div className="vgdbi-label">Cover image</div>
                            <div className="vgdbi-value">
                                <a href={obj.CoverImageUrl} target="_blank">Link</a>
                            </div>
                        </div>
                        <div className="vgdb-item">
                            <div className="vgdbi-label">My rating</div>
                            <div className="vgdbi-value">
                                <RatingStarBox fullStarNum={fullStarNum}
                                               isNextHalf={isNextHalf}
                                               isDisable={!isAuthenticated}
                                               disableHoverText="Login to rate!"
                                               onStarClick={(starKey) => this.onStarClick(obj, starKey)} />
                            </div>
                        </div>
                    </div>
                </VideoGame>
            )
        }

        return null;
    }
}