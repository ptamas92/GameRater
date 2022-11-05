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
import { RatingStarBox } from "./__styledUtils";
var StarState;
(function (StarState) {
    StarState[StarState["Empty"] = 0] = "Empty";
    StarState[StarState["HalfFill"] = 1] = "HalfFill";
    StarState[StarState["Fill"] = 2] = "Fill";
})(StarState || (StarState = {}));
var TableContent = /** @class */ (function (_super) {
    __extends(TableContent, _super);
    function TableContent(props) {
        var _this = _super.call(this, props) || this;
        //---------------------------------------------------------------------------------------------------------------
        // Functions
        //---------------------------------------------------------------------------------------------------------------
        //onMouseEnter
        _this.onMouseEnter = function (e) {
            var currStarIndex = parseInt(e.target.getAttribute("data-star-index"));
            var stars = _this.state.stars;
            for (var i = 0; i < stars.length; i++) {
                var star = stars[i];
                star.currentState = star.key <= currStarIndex ? StarState.Fill : StarState.Empty;
            }
            _this.setState({
                stars: stars
            });
        };
        //onMouseLeave
        _this.onMouseLeave = function () {
            var stars = _this.state.stars;
            for (var i = 0; i < stars.length; i++) {
                var star = stars[i];
                star.currentState = star.stateByRating;
            }
            _this.setState({
                stars: stars
            });
        };
        var objArray = [];
        for (var i = 1; i <= 10; i++) {
            var state = StarState.Empty;
            if (i <= props.fullStarNum)
                state = StarState.Fill;
            else if (i + 1 === props.fullStarNum && props.isNextHalf)
                state = StarState.HalfFill;
            objArray.push({
                key: i,
                stateByRating: state,
                currentState: state
            });
        }
        _this.state = {
            stars: objArray
        };
        return _this;
    }
    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------
    TableContent.prototype.render = function () {
        var _this = this;
        var stars = this.state.stars;
        return (React.createElement(RatingStarBox, { onMouseLeave: this.onMouseLeave }, stars && stars.map(function (star) {
            var className = star.currentState === StarState.Empty ? "bi bi-star" : (star.currentState === StarState.Fill ? "bi bi-star-fill" : "bi bi-star-half");
            return (React.createElement("i", { key: star.key, "data-star-index": star.key, className: "star-item " + className, onClick: function () { return _this.props.onStarClick(star.key); }, onMouseEnter: function (e) { return _this.onMouseEnter(e); } }));
        })));
    };
    return TableContent;
}(React.Component));
export default TableContent;
//# sourceMappingURL=ratingStarBox.js.map