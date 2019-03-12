//Slot animation function -------------------------------
var isRolling = false;

function callRotation(hexagon, duration) {
    var animSpeed = setInterval(rotateSlot, 10);
    var spinCount = 0;
    function rotateSlot() {
        if (spinCount >= duration) {
            clearInterval(animSpeed);
            setTimeout(function () {
                isRolling = false;
            }, 1500);
        } else {
            spinCount++;
            hexagon.style.transform = "translateZ(-320px) rotateX(" + spinCount * -5 + "deg)";
        }
    }
}

function slotWinnerAnimation() {
    $("#game1").css("background-color", "yellow");
    setTimeout(function () {
        $("#game1").css("background-color", "blue");
    }, 200);
    setTimeout(function () {
        $("#game1").css("background-color", "yellow");
    }, 400);
    setTimeout(function () {
        $("#game1").css("background-color", "black");
    }, 600);
}

$(function () {
//Slot machine script --------------------------------
    var slotScore = 0;
    $("#slotScore").html(slotScore);

    $("#slotBet").click(function () {
        if (playerBalance < 1) {
            $("#myModal").modal();
            return;
        }
        if (!Boolean(isRolling)) {
            isRolling = true;
            slotScore--;
            updateScoreBoard($("#slotScore"), -1, slotScore);

            var slot1 = Math.floor(Math.random() * 6);
            var slot2 = Math.floor(Math.random() * 6);
            var slot3 = Math.floor(Math.random() * 6);

            callRotation($("#slotHolder1 .hexagon")[0], (slot1 * 12) + 432);
            callRotation($("#slotHolder2 .hexagon")[0], (slot2 * 12) + 432);
            callRotation($("#slotHolder3 .hexagon")[0], (slot3 * 12) + 432);

            if (slot1 === slot2 && slot2 === slot3) {
                var pointsToAdd = (slot1 + 1) * 5;
                slotScore += pointsToAdd;
                setTimeout(function () {
                    slotWinnerAnimation();
                    updateScoreBoard($("#slotScore"), pointsToAdd, slotScore);
                }, 5200);
            }
        }
    });
});

