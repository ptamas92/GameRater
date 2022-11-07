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
            color: #fff !important;
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

//StyledFlashMessageContainer
const StyledFlashMessageContainer = styled.div`
    && > div {
        top: 50px !important;
        padding-right: 0 !important;

        [class*="Alert-headline-"] {
            display: none;
        }

        .alert {
            padding: 0.4rem 1rem 0.5rem 1rem;

            button.close {
                outline: none;
                padding: 0 0 0 15px
                background-color: transparent;
                border: 0;
                float: right;
                font-size: 1.5rem;
                font-weight: 700;
                line-height: 1;
                color: #000;
                text-shadow: 0 1px 0 #fff;
                opacity: .5;
            }

            button.close:hover {
                opacity: 1;
            }

            i {
                opacity: 0.6;
            }

            i ~ div > div {
                padding-top: 1px;
            }
        }
    }
`;

//StyledRatingStarBox
const StyledRatingStarBox = styled.div`
    text-align: right;
    
    i {
        cursor: pointer;
        color: #ffb700;
    }

    .rsb-container.disabled .rsbc-disable-hover-text {
        min-width: 160px;
        float: right;
    }

    .rsb-container.disabled:hover .rsbc-stars {
        display: none;
    }

    .rsb-container:not(.disabled) .rsbc-disable-hover-text,
    .rsb-container.disabled:not(:hover) .rsbc-disable-hover-text {
        display: none;
    }
`;

export {
    StyledPaginationContainer as PaginationContainer,
    StyledFlashMessageContainer as FlashMessageContainer,
    StyledRatingStarBox as RatingStarBox
};