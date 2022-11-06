import * as React from "react";
import { RatingStarBox } from "./__styledUtils";

interface IStarState {
    key: number,
    stateByRating: StarState,
    currentState: StarState
}

enum StarState {
    Empty = 0,
    HalfFill = 1,
    Fill = 2
}

interface ITableContentProps {
    fullStarNum: number,
    isNextHalf: boolean,
    isDisable?: boolean,
    disableHoverText?: string,
    onStarClick: (starKey: number) => void
}

interface ITableContentStates {
    stars: Array<IStarState>
}

export default class TableContent extends React.Component<ITableContentProps, ITableContentStates> {

    constructor(props) {
        super(props);

        var objArray = [] as Array<IStarState>;

        for (var i = 1; i <= 10; i++) {
            var state = StarState.Empty;

            if (i <= props.fullStarNum)
                state = StarState.Fill;

            else if (i === props.fullStarNum + 1 && props.isNextHalf)
                state = StarState.HalfFill;

            objArray.push({
                key: i,
                stateByRating: state,
                currentState: state
            });
        }

        this.state = {
            stars: objArray
        };
    }

    //---------------------------------------------------------------------------------------------------------------
    // Functions
    //---------------------------------------------------------------------------------------------------------------

    //onClick
    onClick = (key) => {
        if (!this.props.isDisable)
            this.props.onStarClick(key);
    }

    //onStarMouseEnter
    onStarMouseEnter = (e) => {
        if (!this.props.isDisable) {
            var currStarIndex = parseInt(e.target.getAttribute("data-star-index"));
            var stars = this.state.stars;

            for (var i = 0; i < stars.length; i++) {
                var star = stars[i];

                star.currentState = star.key <= currStarIndex ? StarState.Fill : StarState.Empty;
            }

            this.setState({
                stars: stars
            });
        }
    }

    //onStarsBoxMouseLeave
    onStarsBoxMouseLeave = () => {
        if (!this.props.isDisable) {
            var stars = this.state.stars;

            for (var i = 0; i < stars.length; i++) {
                var star = stars[i];
                star.currentState = star.stateByRating;
            }

            this.setState({
                stars: stars
            });
        }
    }

    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------

    render() {
        var stars = this.state.stars;
        var isDisable = this.props.isDisable;
        var disableHoverText = this.props.disableHoverText ?? "";

        return (
            <RatingStarBox>
                <span className={"rsb-container" + (isDisable ? " disabled" : "")}>
                    <div className="rsbc-disable-hover-text">{disableHoverText}</div>

                    <span className="rsbc-stars" onMouseLeave={this.onStarsBoxMouseLeave}>
                        {
                             stars && stars.map(star => {
                                 var className = star.currentState === StarState.Empty ? "bi bi-star" : (star.currentState === StarState.Fill ? "bi bi-star-fill" : "bi bi-star-half");

                                 return (
                                     <i key={star.key}
                                        data-star-index={star.key}
                                        data-action-button-key={"rating_star_" + star.key}
                                        title={star.key.toString()}
                                        className={"star-item " + className}
                                        onClick={() => this.onClick(star.key)}
                                        onMouseEnter={(e) => this.onStarMouseEnter(e)}></i>
                                 )
                             })
                        }
                    </span>
                </span>
            </RatingStarBox>
        )
    }
}