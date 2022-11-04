import * as React from "react";
import ReactPagination from "react-js-pagination";
import { PaginationContainer } from "./__styledUtils";

declare var sizePerPage;

export enum PaginationPosition {
    left,
    right,
    center
}

interface IPaginationProps {
    activePage: number,
    dataSourceLength: number,
    paginationPosition: PaginationPosition,
    onPageChange: (pageNumber) => void
}

export default class TableContent extends React.Component<IPaginationProps, {}> {

    constructor(props) {
        super(props);
    }

    //---------------------------------------------------------------------------------------------------------------
    // RENDER
    //---------------------------------------------------------------------------------------------------------------

    render() {
        var activePage = this.props.activePage;
        var dataSourceLength = this.props.dataSourceLength;

        return (
            <PaginationContainer className="pagination-container" data-pagination-position={PaginationPosition[this.props.paginationPosition]}>
                <ReactPagination prevPageText='<'
                                 nextPageText='>'
                                 firstPageText='<<'
                                 lastPageText='>>'
                                 itemsCountPerPage={sizePerPage}
                                 pageRangeDisplayed={3}
                                 activePage={activePage}
                                 totalItemsCount={dataSourceLength}
                                 onChange={this.props.onPageChange} />
            </PaginationContainer>
        )
    }
}