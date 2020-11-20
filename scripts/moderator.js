function setupPeer(id) {
    var peer = new Peer(id, {
        secure: true,
        host: "connect-peer-server.herokuapp.com",
        port: 443,
        debug: 2
    });  
    console.log(peer);

    var delay = Promise.resolve()
    .then(() => {
        var openDataConnections = [];
        peer.on('connection', (conn) => {
            conn.on('open', () => {
                console.log("established!");
                openDataConnections.push(conn);
                conn.on('data', (data) => {
                    console.log(data);
                })
            })
        })
    })
}

$(document).ready(() => {
    const gameID = location.hash.slice(1);
    setupPeer(gameID);
    $("#game-id-printout").text(`Game ID: ${gameID}`);
})

function clearAnimation() {
    $(".mod-reset-inner").css({
        "transform": "translate(0, 0)",
        "border": "2px solid rgb(30,5,5)"
    })
    let timer = setTimeout(function() {
        $(".mod-reset-inner").css({
            "transform": "translate(0, -2px)",
            "border": "2px solid maroon" 
        })
    }, 150) 
}

$(document).on('keydown', (e) => {
    if (e.keyCode === 13) {
        clearAnimation(); 
    }
})