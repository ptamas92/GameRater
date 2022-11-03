import * as React from "react";

export default class Main extends React.Component<any, {}> {

    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------

    render() {
        var key = this.props.match.params["key"];
        var parameters = this.props.match.params["parameters"];

        console.log(key, parameters);

        return (
            <div>cica</div>
        )
    }
}