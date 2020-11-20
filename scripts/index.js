const digits = [1,2,3,4,5,6,7,8,9,0];

function createGameID() {
    let string = "";
    for (var x = 1; x < 7; x++) {
        string += digits[Math.floor(Math.random() * digits.length)];
    }
    return string
}

$("#host-select").on('click', () => {
    const gameID = createGameID();
    const hash = `#${gameID}`;
    window.open(`/moderator.html${hash}`)
})

$("#join-game").on('click', () => {
    const gameID = $("#game-id").val();
    const hash = `#${gameID}`;
    window.open(`/player.html${hash}`)
})