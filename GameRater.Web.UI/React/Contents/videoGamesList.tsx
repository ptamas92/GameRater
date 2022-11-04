import * as React from "react";
import Table, { ITableColumn } from "../Components/Table/table";

export default class Main extends React.Component<any, {}> {

    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------

    render() {
        var columns: Record<string, ITableColumn> = {
            "Title": {
                title: "Title",
                htmlTemplateOfRowCell: null,
                isAlwaysVisible: true,
                isDisplayByDefault: true,
                isSortable: true,
                minWidth: 200
            },
            "YearOfPublication": {
                title: "Year of publication",
                htmlTemplateOfRowCell: null,
                isAlwaysVisible: false,
                isDisplayByDefault: true,
                isSortable: true,
                minWidth: 100
            },
            "CoverImageUrl": {
                title: "Cover image",
                htmlTemplateOfRowCell: null,
                isAlwaysVisible: true,
                isDisplayByDefault: true,
                isSortable: false,
                minWidth: 100
            },
            "Publisher": {
                title: "Publisher",
                htmlTemplateOfRowCell: null,
                isAlwaysVisible: false,
                isDisplayByDefault: true,
                isSortable: true,
                minWidth: 100
            },
            "Rating": {
                title: "Rating",
                htmlTemplateOfRowCell: null,
                isAlwaysVisible: true,
                isDisplayByDefault: true,
                isSortable: false,
                minWidth: 100
            },
        };


        return (
            <Table componentKey="video_game_list"
                   requestUrl="VideoGame/GetVideoGames"
                   requestParams={null}
                   columns={columns}
                   propForRowKey="Id"
                   dataSourceFragmentSize={100}
                   isPaginationOnTheClientSide={false} />
        )
    }
}