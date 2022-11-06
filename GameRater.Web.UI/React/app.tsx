import * as React from "react";
import * as ReactDOM from 'react-dom';
import { AlertList } from "react-bs-notifier";
import { createBrowserHistory } from "history";
import { Router, Route, Redirect, Switch } from "react-router";
import VideoGamesList from "./Contents/videoGamesList";
import { FlashMessageContainer } from "./Components/Utils/__styledUtils"

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import "bootstrap-icons/font/bootstrap-icons.css"

export const history = createBrowserHistory();

interface IFlashMessageModel {
    ResultType: string, // success, danger, info, warning
    Message: string,
    TimeOut: number
}

interface IAppContentStates {
    flashMessageAlerts: Array<any>
}

class App extends React.Component<{}, IAppContentStates> {

    constructor(props) {
        super(props);

        this.state = {
            flashMessageAlerts: new Array<any>()
        };
    }

    componentDidMount() {
        window.addEventListener("event_flash_message_display", this.eventFlashMessageDisplay);
    }

    componentWillUnmount() {
        window.removeEventListener("event_flash_message_display", this.eventFlashMessageDisplay);
    }

    //---------------------------------------------------------------------------------------------------------------
    // CUSTOM EVENTS
    //---------------------------------------------------------------------------------------------------------------

    //eventFlashMessageDisplay
    eventFlashMessageDisplay = (e: CustomEvent) => {
        var _this = this;
        var alerts = this.state.flashMessageAlerts;
        var id = Math.floor((Math.random() * 1000000) + 1);
        var model = JSON.parse(e.detail) as IFlashMessageModel;

        var newAlert = {
            id: id,
            type: model.ResultType,
            headline: "",
            message: model.Message
        };

        alerts.push(newAlert);

        if (model.TimeOut > 0) {
            setTimeout(function () {
                _this.onAlertDismissed(newAlert);
            }, model.TimeOut)
        }

        this.setState({
            flashMessageAlerts: alerts
        }, () => {
            this.setFlashMessageIcon(alerts, id, model.ResultType);
        });
    }

    //---------------------------------------------------------------------------------------------------------------
    // EVENTS
    //---------------------------------------------------------------------------------------------------------------

    //onAlertDismissed
    onAlertDismissed = (alert) => {
        var alerts = this.state.flashMessageAlerts;
        var idx = alerts.indexOf(alert);

        if (idx >= 0) {
            this.setState({
                flashMessageAlerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)]
            });
        }
    }

    //---------------------------------------------------------------------------------------------------------------
    // FUNCTIONS
    //---------------------------------------------------------------------------------------------------------------

    //setFlashMessageIcon
    setFlashMessageIcon = (alerts: Array<any>, id: number, type: string) => {
        setTimeout(function () {
            var iconClassName = "";
            var i = alerts.findIndex((x) => { return x.id === id; });

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
    }

    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------

    render() {
        var alerts = this.state.flashMessageAlerts;

        return (
            <React.Fragment>
                <FlashMessageContainer id="app_main_flash_message">
                    <AlertList alerts={alerts} position="top-right" dismissTitle="" onDismiss={this.onAlertDismissed.bind(this)} />
                </FlashMessageContainer>

                <Router history={history as any}>
                    <Switch>
                        <Route exact path={"*"} component={VideoGamesList} />
                    </Switch>
                </Router>
            </React.Fragment>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app_container')
);