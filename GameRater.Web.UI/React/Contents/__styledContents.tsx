import styled from 'styled-components';

declare var baseColor;

//StyledVideoGameList
const StyledVideoGameList = styled.div`
    .rating-star-box {
        text-align: right;
    }

    .td > .video-game-title:not(.disabled):hover {
        color: ${baseColor};
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