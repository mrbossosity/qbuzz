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

function generatePeerID() {
    const digits = [1,2,3,4,5,6,7,8,9,0];
    var peerID = "";
    for (var x = 1; x < 10; x++) {
        peerID += digits[Math.floor(Math.random() * digits.length)];
    }
    return peerID
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
        if (confirm("Join the game?")) {
            var conn = peer.connect(gameID);
            conn.on('open', () => {
                conn.on('data', (data) => {
                    if (data == "ACCEPTED") {
                        $(".buzz-inner-light").css("background-color", "lime")
                    }
                    if (data == "CLEAR") {
                        $(".buzz-inner-light").css("background-color", "gray")
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
                window.close()
            })
            conn.on('close', () => {
                if (confirm('Game ended!')) {
                    window.close()
                }
            })

        } else window.close()
    })
}

$(document).ready(() => {
    const gameID = location.hash.slice(1);
    setupPeer(gameID);
})