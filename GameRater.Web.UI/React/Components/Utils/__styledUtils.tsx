import styled from 'styled-components';

declare var baseColor;

//StyledPaginationContainer
const StyledPaginationContainer = styled.div`
    text-align: left;

    &[data-pagination-position="center"] {
        text-align: center;
    }

    &[data-pagination-position="right"] {
        text-align: right;
    }

    ul.pagination {
        margin: 0;
        padding-left: 0;
        border-radius: 4px;
        display: inline-block;

        > li {
            display: inline;
        }

        > li > a, > li > span {
            position: relative;
            float: left;
            width: 36px;
            height: 36px;
            margin: 0 5px;
            padding-top: 7px;
            text-align: center;
            line-height: 1.42857143;
            text-decoration: none;
            color: ${baseColor};
            font-size: 14px;
            border-radius: 25px;
            background-color: #fff;
            border: 1px solid #ddd;
            margin-left: -1px;
        }

        > .active > a, > .active > span, > .active > a:hover, > .active > span:hover, > .active > a:focus, > .active > span:focus {
            z-index: 3;
            color: #fff;
            background-color: ${baseColor};
            cursor: default;
        }

        > li:last-child {
            display: none;
        }

        > li.disabled > a {
            color: #858585;
            cursor: default;
        }
    }
`;

export {
    StyledPaginationContainer as PaginationContainer
};