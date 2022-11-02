import * as React from "react";
import * as ReactDOM from 'react-dom';
import { Router, Route, Redirect, Switch } from "react-router";
import Main from "./Main/main";

import "bootstrap-icons/font/bootstrap-icons.css"
import "../../../WebApp.Web.Common/wwwroot/js/own.font.js";
import "../../../WebApp.Web.Common/wwwroot/css/robotofont.css";

declare var rootPath;

const mql = window.matchMedia(`(min-width: 1056px)`);

class App extends React.Component<{}, {}> {

    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------

    render() {
        return (
            <React.Fragment>
                <Router history={history as any}>
                    <Switch>
                        <Route exact path={rootPath + "/:key/:parameters?"} component={Main} />
                        <Redirect from="*" to={rootPath + "/404"} />
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