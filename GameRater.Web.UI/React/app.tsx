import * as React from "react";
import * as ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import { Router, Route, Redirect, Switch } from "react-router";
import Main from "./Main/main";

import "bootstrap-icons/font/bootstrap-icons.css"

const history = createBrowserHistory();

class App extends React.Component<{}, {}> {

    constructor(props) {
        super(props);
    }

    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------

    render() {
        return (
            <React.Fragment>
                <Router history={history as any}>
                    <Switch>
                        <Route exact path={"/"} component={Main} />
                        <Route exact path={"/Home"} component={Main} />
                        <Route exact path={"/Home/Index"} component={Main} />
                        {/*<Route exact path={"/:key/:parameters?"} component={Main} />*/}
                        <Redirect from="*" to={"/404"} />
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