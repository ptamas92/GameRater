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
    onStarClick: (starKey: number) => void
}

interface ITableContentStates {
    stars: Array<IStarState>
}

export default class TableContent extends React.Component<ITableContentProps, ITableContentStates> {

    constructor(props) {
        super(props);

        var objArray = [] as Array<IStarState>;

        console.log(props.isNextHalf);

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

    //onMouseEnter
    onMouseEnter = (e) => {
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

    //onMouseLeave
    onMouseLeave = () => {
        var stars = this.state.stars;

        for (var i = 0; i < stars.length; i++) {
            var star = stars[i];

            star.currentState = star.stateByRating;
        }

        this.setState({
            stars: stars
        });
    }

    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------

    render() {
        var stars = this.state.stars;

        return (
            <RatingStarBox onMouseLeave={this.onMouseLeave}>
                {
                    stars && stars.map(star => {
                        var className = star.currentState === StarState.Empty ? "bi bi-star" : (star.currentState === StarState.Fill ? "bi bi-star-fill" : "bi bi-star-half");

                        return (
                            <i key={star.key}
                               data-star-index={star.key}
                               className={"star-item " + className}
                               onClick={() => this.props.onStarClick(star.key)}
                               onMouseEnter={(e) => this.onMouseEnter(e)}></i> 
                        )
                    })
                }
            </RatingStarBox>
        )
    }
}