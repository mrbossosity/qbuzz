const digits = [1,2,3,4,5,6,7,8,9,0];

function createGameID() {
    let string = "";
    for (var x = 1; x < 7; x++) {
        string += digits[Math.floor(Math.random() * digits.length)];
    }
    return string
}

function buzzAnimation(button, light, otherLight) {
    $(button).css({
        "transform": "rotate(-55deg)",
        "border": "7px solid rgb(30,5,5)"
    });
    $(light).css("background-color", "lime");
    $(otherLight).css("background-color", "gray");
    let timer = setTimeout(function() {
        $(button).css({
            "transform": "rotate(-55deg) translate(0, -4px)",
            "border": "6px solid maroon" 
        })
    }, 100)  
}

$("#host-select").on('click', () => {
    buzzAnimation("#host-select", "#host-light", "#join-light");
    const gameID = createGameID();
    const hash = `#${gameID}`;
    let timer = setTimeout(function() {
        window.open(`./moderator.html${hash}`);
        $("#host-light").css("background-color", "gray")
    }, 500)
})

$("#join-select").on('click', () => {
    buzzAnimation("#join-select", "#join-light", "#host-light");
    let timer = setTimeout(function() {
        $(".host-join-buzzer-container").hide(350, "linear");
        $(".join-modal").show(200, "linear");
        $("#game-id").val("").focus()
    }, 500)
})

$("#join-game").on('click', () => {
    let input = $("#game-id").val();
    if (input.length == 6) {
        const gameID = $("#game-id").val();
        const hash = `#${gameID}`;
        window.open(`./player.html${hash}`)
    } else {
        alert("Game IDs are 6 digits long!")
    }
})

$("#back-to-select").on('click', () => {
    let timer = setTimeout(function() {
        $(".join-modal").hide(200, "linear");
        $(".host-join-buzzer-container").show(350, "linear");
        $("#join-light").css("background-color", "gray")
    }, 500)
})