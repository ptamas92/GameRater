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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import * as React from "react";
import * as ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import { Router, Route, Redirect, Switch } from "react-router";
import Main from "./Contents/videoGamesList";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import "bootstrap-icons/font/bootstrap-icons.css";
var history = createBrowserHistory();
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this_1 = _super.call(this, props) || this;
        //---------------------------------------------------------------------------------------------------------------
        // CUSTOM EVENTS
        //---------------------------------------------------------------------------------------------------------------
        //eventFlashMessageDisplay
        _this_1.eventFlashMessageDisplay = function (e) {
            var _this = _this_1;
            var alerts = _this_1.state.flashMessageAlerts;
            var id = Math.floor((Math.random() * 1000000) + 1);
            var model = JSON.parse(e.detail);
            var newAlert = {
                id: id,
                type: model.resultType,
                headline: "",
                message: model.message
            };
            alerts.push(newAlert);
            if (model.timeOut > 0) {
                setTimeout(function () {
                    _this.onAlertDismissed(newAlert);
                }, model.timeOut);
            }
            _this_1.setState({
                flashMessageAlerts: alerts
            }, function () {
                _this_1.setFlashMessageIcon(alerts, id, model.resultType);
            });
        };
        //---------------------------------------------------------------------------------------------------------------
        // EVENTS
        //---------------------------------------------------------------------------------------------------------------
        //onAlertDismissed
        _this_1.onAlertDismissed = function (alert) {
            var alerts = _this_1.state.flashMessageAlerts;
            var idx = alerts.indexOf(alert);
            if (idx >= 0) {
                _this_1.setState({
                    flashMessageAlerts: __spreadArray(__spreadArray([], alerts.slice(0, idx)), alerts.slice(idx + 1))
                });
            }
        };
        //---------------------------------------------------------------------------------------------------------------
        // FUNCTIONS
        //---------------------------------------------------------------------------------------------------------------
        //setFlashMessageIcon
        _this_1.setFlashMessageIcon = function (alerts, id, type) {
            setTimeout(function () {
                var iconClassName = "";
                var i = alerts.findIndex(function (x) { return x.id === id; });
                var fmEl = document.getElementById("app_main_flash_message");
                var alertEl = fmEl.getElementsByClassName("alert")[i];
                var iEl = alertEl.getElementsByTagName("i")[0];
                if (type === "success")
                    iconClassName = iEl.className.replace("fa fa-check ", "") + " bi bi-check-circle-fill";
                else if (type === "danger")
                    iconClassName = iEl.className.replace("fa fa-exclamation-circle ", "") + " bi bi-exclamation-circle-fill";
                else if (type === "warning")
                    iconClassName = iEl.className.replace("fa fa-warning ", "") + " bi bi-exclamation-triangle-fill";
                else if (type === "info")
                    iconClassName = iEl.className.replace("fa fa-info ", "") + " bi bi-info-circle-fill";
                iEl.className = iconClassName;
            }, 100);
        };
        _this_1.state = {
            flashMessageAlerts: new Array()
        };
        return _this_1;
    }
    App.prototype.componentDidMount = function () {
        window.addEventListener("event_flash_message_display", this.eventFlashMessageDisplay);
    };
    App.prototype.componentWillUnmount = function () {
        window.removeEventListener("event_flash_message_display", this.eventFlashMessageDisplay);
    };
    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------
    App.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement(Router, { history: history },
                React.createElement(Switch, null,
                    React.createElement(Route, { exact: true, path: "/", component: Main }),
                    React.createElement(Route, { exact: true, path: "/Home", component: Main }),
                    React.createElement(Route, { exact: true, path: "/Home/Index", component: Main }),
                    React.createElement(Redirect, { from: "*", to: "/404" })))));
    };
    return App;
}(React.Component));
ReactDOM.render(React.createElement(App, null), document.getElementById('app_container'));
//# sourceMappingURL=app.js.map