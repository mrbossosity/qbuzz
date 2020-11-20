function clearAnimation() {
    $(".mod-reset-inner").css({
        "transform": "translate(0, 0)",
        "border": "2px solid rgb(30,5,5)"
    })
    $(".team-1-light").css({
        "background-color": "rgb(102, 0, 0)"
    })
    $(".team-2-light").css({
        "background-color": "darkgreen"
    })
    let timer = setTimeout(function() {
        $(".mod-reset-inner").css({
            "transform": "translate(0, -2px)",
            "border": "2px solid maroon" 
        })
    }, 150) 
}

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
                console.log("Player joined!");
                openDataConnections.push(conn);

                conn.on('data', (data) => {
                    openDataConnections.forEach(conn => conn.send("LOCKOUT"));
                    console.log(data);

                    let playerNum = openDataConnections.indexOf(conn);
                    let litColor = (playerNum > 4) ? "lime" : "rgb(255,5,0)";
                    $(".mod-actual-light").eq(playerNum).css("background-color", litColor);
                });

                conn.on('error', () => {
                    alert("Someone was disconnected!");
                    openDataConnections.forEach(conn => conn.close());
                    window.location.reload()
                })
                conn.on('close', () => {
                    alert("Someone got disconnected!");
                    openDataConnections.forEach(conn => conn.close());
                    window.location.reload()
                })
            })
        })

        $(document).on('keydown', (e) => {
            if (e.keyCode === 13) {
                openDataConnections.forEach(conn => conn.send("CLEAR"))
                clearAnimation(); 
                console.log("CLEAR");
            }
        })
        $(".mod-reset").on('click', () => {
            openDataConnections.forEach(conn => conn.send("CLEAR"))
            clearAnimation(); 
            console.log("CLEAR");
        })
    })
}

$(document).ready(() => {
    const gameID = location.hash.slice(1);
    setupPeer(gameID);
    $("#game-id-printout").text(`Game ID: ${gameID}`);
})