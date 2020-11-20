function setupPeer(gameID) {
    const digits = [1,2,3,4,5,6,7,8,9,0];

    var peerID = "";
    for (var x = 1; x < 7; x++) {
        peerID += digits[Math.floor(Math.random() * digits.length)];
    }

    var peer = new Peer(peerID, {
        secure: true,
        host: "connect-peer-server.herokuapp.com",
        port: 443,
        debug: 2
    });  

    console.log(peer);

    var delay = Promise.resolve()
    .then(() => {
        try {
            var conn = peer.connect(gameID);
        } catch (error) {
            console.log(error)
        }
        conn.on('open', () => {
            conn.on('data', (data) => {
                console.log(data);
            })
            conn.send("HI")
        })
    })
}

$(document).ready(() => {
    const gameID = location.hash.slice(1);
    setupPeer(gameID);
})

function buzzAnimation(isFirst) {
    $(".buzz-inner-button").css({
        "transform": "rotate(-55deg)",
        "border": "7px solid rgb(30,5,5)",
    });
    if (isFirst) {
        $(".buzz-inner-light").css("background-color", "lime");
    }
    let timer = setTimeout(function() {
        $(".buzz-inner-button").css({
            "transform": "rotate(-55deg) translate(0, -4px)",
            "border": "6px solid maroon" 
        })
    }, 100)  
}

$(document).on('keydown', (e) => {
    if (e.keyCode === 32) {
        buzzAnimation(); 
    }
})