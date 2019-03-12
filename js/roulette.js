function dropChip(betValue, dropPos) {
    var droppedChip = "<img class='droppedChip shadow-2 rounded-circle' src='img/roulette/ficha" + betValue + ".png' alt='" + betValue + "'>";
    $("#containment-wrapper").append(droppedChip);
    $(".droppedChip:last-child").css({"position": "absolute",
        "top": dropPos.top,
        "left": dropPos.left});
}

//This function is unused, it pops and floats up the value of the dropped chip.
function flashBetValue(betValue, flashPos) {
    var flashValue = "<div id='flashValue'>+ € " + betValue + "<div>";
    $("#containment-wrapper").append(flashValue);
    $("#flashValue").css({"position": "absolute",
        "top": flashPos.top,
        "left": flashPos.left});
    setTimeout(function () {
        $("#flashValue").addClass("tranlateUp");
        $("#flashValue").fadeOut(500, function () {
            $("#flashValue").remove();
        });
    }, 50);
}

function addBetValue(category, value) {
    if (bettingValues[category] === undefined) {
        bettingValues[category] = 0;
    }
    bettingValues[category] += value;
}

function totalBets() {
    var total = 0;
    for (var cat in bettingValues) {
        if (!isNaN(bettingValues[cat])) {
            total += bettingValues[cat];
        }
    }
    return total;
}
//Reset bet values ------------------
function resetBets() {
    $('.droppedChip').remove(); // resets roulette state ------
    $(".ui-state-highlight").removeClass("ui-state-highlight");
    var bettingCats = Object.keys(bettingValues);
    for (var i = 0; i < bettingCats.length; i++) {
        bettingValues[bettingCats[i]] = 0;
    }
}
//Calls wheel animation -----------------
var animSpeed = 20;
function callWheelRotate(wheel, duration) {
    var callAnim = setInterval(rotateWheel, animSpeed);
    var spinCount = 0;
    var changeSpeedGap = parseInt(duration / 8);
    function rotateWheel() {
        if (spinCount >= duration) {
            clearInterval(callAnim);
            animSpeed = 20;
        } else {
            spinCount++;
            wheel.style.transform = "rotate(" + spinCount * -9.73 + "deg)";
            if (spinCount === changeSpeedGap * 4) {
                animSpeed = 45;
                clearInterval(callAnim);
                callAnim = setInterval(rotateWheel, animSpeed);
            } else if (spinCount === changeSpeedGap * 6) {
                animSpeed = 70;
                clearInterval(callAnim);
                callAnim = setInterval(rotateWheel, animSpeed);
            } else if (spinCount === changeSpeedGap * 7) {
                animSpeed = 100;
                clearInterval(callAnim);
                callAnim = setInterval(rotateWheel, animSpeed);
            }
        }
    }
}
//Determine the prize ------------------------------
function givePrize(numResult) {
    if (numResult === 0) {
        resetBets();
        return;
    }
    if (colorNum[numResult] === 1) {
        bettingValues.redBet *= 2;
        bettingValues.blackBet = 0;
    } else if (colorNum[numResult] === 2) {
        bettingValues.blackBet *= 2;
        bettingValues.redBet = 0;
    }
    if (numResult % 2 === 0) {
        bettingValues.evenBet *= 2;
        bettingValues.oddBet = 0;
    } else {
        bettingValues.oddBet *= 2;
        bettingValues.evenBet = 0;
    }
    if (numResult < 19) {
        bettingValues.from1to18 *= 2;
        bettingValues.from19to36 = 0;
    } else {
        bettingValues.from19to36 *= 2;
        bettingValues.from1to18 = 0;
    }
    
    var numBets = Object.keys(bettingValues).filter(function (a) {
        return !isNaN(a);
    });    
    for (var i = 0; i < numBets.length; i++) {
        if (parseInt(numBets[i]) === numResult) {
            bettingValues[numBets[i]] *= 2;
        } else {
            bettingValues[numBets[i]] = 0;
        }
    }  
    
    var prize = totalBets();
    rouletteScore += prize;
    $("#rouletteRes").modal();
    $("#rouletteResSpan").html(prize);
    updateScoreBoard($("#rouletteScore"), prize, rouletteScore);
    resetBets();
}


//Array that defines the color of the number holders------
var colorNum = [0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1]; //1=Red, 2=Black
//Position of numbes inside the wheel -----------------
var posOnWheel = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
//coreboard var -----------
var rouletteScore = 0;
//Below is an object that stores the amount betted in each category---
var bettingValues = {};

var isTurning = false;
$(function () {
    //This paints the spots -----
    var numberPositions = $("div.col > p");
    for (var i = 0; i < numberPositions.length; i++) {
        if (colorNum[i] === 1) {
            numberPositions[i].style.background = "#e60000";
        } else {
            numberPositions[i].style.background = "black";
        }
    }
    //Below I am adding the draggable and droppable features -------------------
    $("#chip50, #chip25, #chip10, #chip5").draggable({containment: "#containment-wrapper", scroll: false, revert: "invalid", helper: "clone"});
    $("#from1to18, #from19to36, #oddBet, #evenBet, #redBet, #blackBet").droppable({
        classes: {
            "ui-droppable-hover": "ui-state-hover"
        }, drop: function (event, ui) {
            $(this).addClass("ui-state-highlight");
            var chipClonePos = ui.position;
            dropChip($(ui.draggable).attr("alt"), chipClonePos);
            addBetValue($(this).attr("id"), parseInt($(ui.draggable).attr("alt")));
        }});
    $(".numBet").droppable({
        classes: {
            "ui-droppable-hover": "ui-state-hover"
        }, drop: function (event, ui) {
            $(this).addClass("ui-state-highlight");
            var chipClonePos = ui.position;
            var numberBetted = $(this).children("p").text();
            dropChip($(ui.draggable).attr("alt"), chipClonePos);
            addBetValue(numberBetted, parseInt($(ui.draggable).attr("alt")));
        }});
    //Reset button ----------------------
    $("#rouletteReset").click(function () {
        if (!Boolean(isTurning)) {
            resetBets();
        }
    });
    //Play button -----------------------
    $("#rouletteScore").html(rouletteScore);
    $("#roulettePlay").click(function () {
        if (!Boolean(isTurning)) {
            isTurning = true;
            if (totalBets() <= 0) {
                $("#pleaseBet").fadeIn(500).fadeOut(2000);
                isTurning = false;
                return;
            }
            if (playerBalance < totalBets()) {
                $("#myModal").modal();
                isTurning = false;
                return;
            }
            rouletteScore -= totalBets();
            updateScoreBoard($("#rouletteScore"), -totalBets(), rouletteScore);

            var wheelPosResult = Math.floor(Math.random() * 37);
            var wheelResult = posOnWheel[wheelPosResult];
            callWheelRotate($("#rouletteWheel")[0], wheelPosResult + (37 * 5));
            setTimeout(function () {
                givePrize(wheelResult);
                isTurning = false;
            }, 9500);
        }
    });
});