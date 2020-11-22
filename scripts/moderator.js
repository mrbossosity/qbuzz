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

function buzzSfx(playerNum) {
    if (playerNum > 4) {
        $("#team-2-buzzer").trigger('play').prop('currentTime', 0);

    } else {
        $("#team-1-buzzer").trigger('play').prop('currentTime', 0);
    }

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
        var lockout = false;

        peer.on('connection', (conn) => {
            conn.on('open', () => {
                if (openDataConnections.length == 10) {
                    conn.close();
                    return
                }

                openDataConnections.push(conn);

                conn.on('data', (data) => {
                    if (lockout == false) {
                        let playerNum = openDataConnections.indexOf(conn);
                        buzzSfx(playerNum);
                        conn.send("ACCEPTED");
                        let litColor = (playerNum > 4) ? "lime" : "rgb(255,5,0)";
                        $(".mod-actual-light").eq(playerNum).css("background-color", litColor);
                    } 

                    lockout = true;
                });

                conn.on('error', () => {
                    alert("Someone was disconnected!");
                    openDataConnections.forEach(conn => conn.close());
                    let timer = setTimeout(function() {
                        window.close()
                    }, 1000)
                })
                conn.on('close', () => {
                    alert("Someone got disconnected!");
                    openDataConnections.forEach(conn => conn.close());
                    let timer = setTimeout(function() {
                        window.close()
                    }, 1000)                
                })
            })
        })

        $(document).on('keydown', (e) => {
            if (e.keyCode === 13) {
                lockout = false;
                openDataConnections.forEach(conn => conn.send("CLEAR"))
                clearAnimation(); 
                console.log("CLEAR");
            }
        })
        $(".mod-reset").on('click', () => {
            lockout = false;
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