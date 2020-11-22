function buzzAnimation() {
    $(".buzz-inner-button").css({
        "transform": "rotate(-55deg)",
        "border": "7px solid rgb(30,5,5)",
    });

    let timer = setTimeout(function() {
        $(".buzz-inner-button").css({
            "transform": "rotate(-55deg) translate(0, -4px)",
            "border": "6px solid maroon" 
        })
    }, 100)  
}

function buzzSfx(playerNum) {
    if (playerNum > 4) {
        $("#team-2-buzzer").trigger('play').prop('currentTime', 0);

    } else {
        $("#team-1-buzzer").trigger('play').prop('currentTime', 0);
    }
}

function generatePeerID() {
    const digits = [1,2,3,4,5,6,7,8,9,0];
    var peerID = "";
    for (var x = 1; x < 10; x++) {
        peerID += digits[Math.floor(Math.random() * digits.length)];
    }
    return peerID
}

function connectAndBindKeys(peer, gameID) {
    if (confirm("Join the game?")) {

        $(".loader-container").hide();
        $(".buzzer-container").show(400);

        var conn = peer.connect(gameID);
        conn.on('open', () => {
            conn.on('data', (data) => {
                if (data == "ACCEPTED") {
                    $(".buzz-inner-light").css("background-color", "lime")
                }
                if (data == "CLEAR") {
                    $(".buzz-inner-light").css("background-color", "gray")
                }
                if (typeof data == "number") {
                    buzzSfx(data)
                }
            })
        })

        $(document).on('keydown', (e) => {
            if (e.keyCode === 32) {
                conn.send("BUZZ")
                buzzAnimation(); 
            }
        })
        $(".buzz-outer-button").on('click', () => {
            conn.send("BUZZ")
            buzzAnimation(); 
        })

        conn.on('error', () => {
            alert('Oops! Something went wrong. Do you have the correct ID?');
        })

        conn.on('close', () => {
            alert('Connection was closed!');
            window.close()
        })

    } else window.close()
}

function setupPeer(gameID) {
    let peerID = generatePeerID();

    var peer = new Peer(peerID, {
        secure: true,
        host: "connect-peer-server.herokuapp.com",
        port: 443,
        debug: 2
    });  

    console.log(peer);

    var delay = Promise.resolve()
    .then(() => {
        let timer = setTimeout(function() {
            connectAndBindKeys(peer, gameID)          
        }, 2000)
    })
}

$(document).ready(() => {
    const gameID = location.hash.slice(1);
    setupPeer(gameID);
})