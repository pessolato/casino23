var crapsScore = 0;
var prevPlay = 0;

function callPass() {
    $("#rollDice").toggle();
    $("#rollPass").toggle();
}
//TODO REMOVE CONSOLE.LOG FROM FUNCTIONS --------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!
function validateRes1(res) {
    if (res === 7 || res === 11) {
        crapsScore++;
        updateScoreBoard($("#crapsScore"), 1, crapsScore);
        $("#crapsDealer").html("You Win!");
    } else if (res <= 3 || res === 12) {
        prevPlay = 0;
        $("#crapsDealer").html("You Lose!");
    } else {
        prevPlay = res;
        callPass();
        $("#crapsDealer").html("Pass = " + res);
    }
}

function validateRes2(res) {
    //THE COUPLE OF LINES BELOW ARE USED TO AVOID CHARGING THE PLAYER FOR A PASS ROLL.
    playerBalance++;
    crapsScore++;
    if (res === 7) {
        callPass();
        $("#crapsDealer").html("You Lose!");
    } else if (res === prevPlay) {
        crapsScore++;
        updateScoreBoard($("#crapsScore"), 1, crapsScore);
        prevPlay = 0;
        callPass();
        $("#crapsDealer").html("You Win!");
    }
}

$(function () {
//Slot machine script --------------------------------
    $("#crapsScore").html(crapsScore);

    $(".rollButton").click(function () {
        if (playerBalance < 1) {
            $("#myModal").modal();
            return;
        }
        crapsScore--;

        var dice1 = Math.floor(Math.random() * 6);
        var dice2 = Math.floor(Math.random() * 6);
        var res = (dice1 + 1) + (dice2 + 1);
        $("#diceRes").html(res);

        $("#diceSlot1").attr("src", "img/Dice/dado" + (dice1 + 1) + ".png");
        $("#diceSlot2").attr("src", "img/Dice/dado" + (dice2 + 1) + ".png");

        if ($(this).attr("id") === "rollDice") {
            validateRes1(res);
        } else if ($(this).attr("id") === "rollPass") {
            validateRes2(res);
        }
        updateScoreBoard($("#crapsScore"), -1, crapsScore); //This function has to be called at the end to update the balance correctly
    });
});


