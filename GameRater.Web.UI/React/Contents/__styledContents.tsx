import styled from 'styled-components';

declare var baseColor;

//StyledVideoGameList
const StyledVideoGameList = styled.div`
    .rating-star-box {
        text-align: right;
    }

    .td > .video-game-title:not(.disabled):hover,
    .td > .video-game-publisher:hover{
        color: ${baseColor};
    }

    button.delete-filter {
        position: absolute;
        left: 60px;
        top: 62px;
        width: 36px;
        height: 36px;
        padding: 6px 8px;
        background: #FFF;
        border-radius: 4px;
        color: ${baseColor};
        box-shadow: none;
        border: 1px solid ${baseColor};

        &[disabled] {
            color: #858585;
            border: 1px solid #858585;
        }

        &:not([disabled]):hover {
            color: white;
            background: ${baseColor};
        }
    }
`;

// StyledVideoGame
const StyledVideoGame = styled.div`
    .video-game-details-box {
        margin-left: auto;
        margin-right: auto;
        max-width: 600px;
        margin-top: 50px;

        .vgdb-item {
            padding-bottom: 10px;

            .vgdbi-label {
                font-weight: bold;
            }
        }
    }
`;

export {
    StyledVideoGameList as VideoGameList,
    StyledVideoGame as VideoGame
};