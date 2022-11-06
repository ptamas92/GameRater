import styled from 'styled-components';

declare var baseColor;

//StyledTableContainer
const StyledTableContainer = styled.div`
    padding: 1rem;

    .table-operation-box {
        width: 100%;
        display: inline-block;
        padding-bottom: 7px;
    }

    .table-block {
        overflow: overlay;
        border-radius: 4px;
        border: 1px solid rgba(0,0,0,.125);

        .table {
            margin-bottom: 0;
            border-spacing: 0;
            display: inline-table;
            background: white;

            .tr {
                :last-child {
                    .td {
                        padding-bottom: 1rem;
                    }
                }

                &[data-is-even="false"],
                &[data-is-even="false"] + .tr.detail-row {
                    background: #F2F2F2;
                }

                &[data-is-even="true"] + .tr.detail-row {
                    background: white;
                }

                :not(.header-row):hover,
                :hover + .tr.detail-row {
                    background: #ECECEC;
                }

                :hover[data-is-detail="true"] {
                    cursor: pointer;
                }
            }

            .th,
            .td {
                margin: 0;
                padding: .6rem .75rem .55rem .75rem;
                overflow: hidden;
                position: relative;
                border-top: 1px solid rgba(0,0,0,.125);

                &[data-column-id="__AlwaysVisibleColumn_Expander"] {
                    max-width: 40px;
                }

                :last-child {
                    border-right: 0;
                }

                .detail-expand-right,
                .detail-expand-down {
                    top: 2px;
                    padding-left: 6px;
                    font-size: 14px;
                }

                &.group-col {
                    width: 100%;
                }

                &.detail-col {
                    width: 100%;
                    color: #3b7ba8;
                }

                &[data-column-id="Expander"] {
                    max-width: 40px;
                }
            }

            .th {
                font-weight: bold;
                padding: 0;
                border-top: none;
                border-bottom: 2px solid ${baseColor};

                .th-title-box {
                    padding: .6rem .75rem .55rem .75rem

                    &[data-is-sortable="true"] {
                        cursor: pointer;

                        > span {
                            display: inline-block;
                            width: calc(100% - 20px);
                        }

                        > i {
                            display: inline-block;
                            vertical-align: top;
                            color: ${baseColor};
                        }

                        &:hover > span {
                            color: ${baseColor};
                        }
                    }
                }

                .detail-expand-right,
                .detail-expand-down {
                    position: absolute;
                    top: 10px;
                    left: 12px;
                }
            }

            .tr.detail-row .td {
                border-top: none;
            }

            .tr.group-row .td {
                font-weight: bold;
            }
        }

        .dropdown.column-visibility-dropdown {
            position: absolute;
            margin-top: -50px;
            left: 1rem;

            .dropdown-toggle,
            .dropdown-toggle:focus {
                width: 36px;
                height: 36px;
                padding: 6px 8px;
                background: #FFF;
                border-radius: 4px;
                color: ${baseColor};
                box-shadow: none;
                border: 1px solid ${baseColor};
            }

            .show.dropdown-toggle,
            .show.dropdown-toggle:focus,
            .dropdown-toggle:hover {
                color: white;
                background: ${baseColor};
            }

            .dropdown-toggle:after {
                display: none;
            }

            .dropdown-menu {
                top: -1px !important;

                .dropdown-item-- {
                    color: #212529;
                    display: block;
                    width: 250px;
                    padding: 5px 15px 5px 15px;

                    label {
                        position: relative;
                        cursor: pointer;
                        top: -14px;

                        span.customized-cb-label {
                            top: -3px;
                            width: max-content;
                            height: 22px;
                            max-width: 210px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }

                        input:not(:checked) ~ span > span.customized-cb-label {
                            font-weight: normal;
                        }

                        input:checked~span {
                            background-color: ${baseColor};
                            border-color: ${baseColor};
                        }
                    }
                }
                
                .dropdown-item--:hover {
                    color: ${baseColor};
                    background: #F8F9Fa;
                    text-decoration: none;
                }
            }
        }
    }
`;

export {
    StyledTableContainer as TableContainer
};