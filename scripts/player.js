function buzzAnimation(isFirst) {
    $(".buzz-inner-button").css({
        "transform": "rotate(-55deg)",
        "border": "7px solid rgb(30,5,5)",
    });
    if (isFirst) {
        $(".buzz-inner-light").css("background-color", "lime")
    }
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
            var isFirst = true;

            conn.on('open', () => {
                conn.on('data', (data) => {
                    if (data == "LOCKOUT") {
                        isFirst = false;
                    } else {
                        isFirst = true;
                        $(".buzz-inner-light").css("background-color", "gray")
                    }
                })
            })

            $(document).on('keydown', (e) => {
                if (e.keyCode === 32) {
                    if (isFirst == true) {
                        conn.send("BUZZ")
                    };
                    buzzAnimation(isFirst); 
                }
            })
            $(".buzz-outer-button").on('click', () => {
                if (isFirst == true) {
                    conn.send("BUZZ")
                };
                buzzAnimation(isFirst); 
            })
            

            conn.on('error', () => {
                if (confirm('Game ended!')) {
                    window.close()
                }
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