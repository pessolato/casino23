Array.prototype.shuffle = function (num) {
    num = num || 1;
    for (var i = 0; i < num; i++) {
        this.sort(function () {
            return .5 - Math.random();
        });
    }
};

function createDeck() {
    var suit = ["c", "d", "p", "t"];
    var deck = [];

    for (var x = 0; x < 13; x++) {
        for (var i = 0; i < suit.length; i++) {
            deck.push((x + 1).toString() + suit[i]);
        }
    }
    deck.shuffle(5);
    return deck;
}
//Retrieve the cards value, its called only inside handValue -----
function cardValue(card) {
    var toAdd = parseInt(card.slice(0, -1));
    if (toAdd > 10) {
        toAdd = 10;
    }
    return toAdd;
}
//Define the hand value -------
function handValue(handArray) {
    var handValue = 0;
    for (var i = 0; i < handArray.length; i++) {
        handValue += cardValue(handArray[i]);
    }
    for (var i = 0; i < handArray.length; i++) {
        if (cardValue(handArray[i]) === 1 && handValue <= 11) {
            handValue += 10;
        }
    }
    return handValue;
}

//animation functions --------------------
function startCardDeal() {
    callCard(summonCard($("#tableHand"), tableHand[0]));
    setTimeout(function () {
        callCard(summonCard($("#playerHand"), playerHand[0]));
    }, 2500);
    setTimeout(function () {
        callCardFlipped(summonCard($("#tableHand"), tableHand[1]));
        //callCard($("#tableHand"), tableHand[1]);
    }, 5000);
    setTimeout(function () {
        callCard(summonCard($("#playerHand"), playerHand[1]));
        $("#playerPoints").fadeIn(500, function () {
            playingAnim = false; //This releases the lock for another animation call.
        }); //This shows the player points after all cards are dealt -----
    }, 7500);
}

function summonCard(playerID, cardValue) {
    var newCard = $("#cardAsset").clone();
    newCard.removeAttr("id");
    playerID.append(newCard);
    newCard.find("img:first-child").attr("src", "img/blackJack/" + cardValue + ".png");
    return newCard;
}

function dealCard(cardFace) { //This function visualy takes 3 seconds ------
    $("#cardToShow").find("img:first-child")
            .attr("src", cardFace);
    $("#cardToShow").show().removeClass("dealingCard");
    setTimeout(function () {
        $("#cardToShow").fadeOut(500, function () {
            $("#cardToShow").addClass("dealingCard");
        });
    }, 1500);
}

function callCard(card) {
    dealCard(card.find("img:first-child").attr("src"));
    setTimeout(function () {
        card.fadeIn(1000, function () {
            $("#playerPoints > .pointsDisplay").html(handValue(playerHand)); //Updates the hand value once the card reaches the hand ---
            $("#tablePoints > .pointsDisplay").html(handValue(tableHand));
        });
    }, 2000);
}

function callCardFlipped(card) {
    dealCard(card.find("img:last-child").attr("src"));
    card.children().attr("id", "cardToFlip").addClass("is-flipped");
    setTimeout(function () {
        card.fadeIn(1000);
    }, 2000);
}

function tableTurn() {
    $("#bjDealer").html("Table's turn");
    $("#cardToFlip").removeClass("is-flipped");
    $("#tablePoints").fadeIn(500);
    if (handValue(tableHand) < handValue(playerHand)) {
        setTimeout(function () {
            tableHit();
        }, 2500);
    } else {
        if (handValue(tableHand) < handValue(playerHand) || handValue(tableHand) > 21) {
            $("#bjDealer").html("You Won!");
            blackjackScore++;
            updateScoreBoard($("#blackjackScore"), 1, blackjackScore);
        } else {
            $("#bjDealer").html("You Lost!");
        }
        $("#startPlay, #hit, #stand").slideToggle(300);
    }
}

function tableHit() {
    tableHand.push(deck.pop());
    callCard(summonCard($("#tableHand"), tableHand[tableHand.length - 1]));
    tableTurn();
}

function resetTable() {
    $("#playerHand, #tableHand, #bjDealer").empty();
    $("#tablePoints, #playerPoints").hide();
}

//Global variables ---------------------
var deck = [];
var tableHand = [];
var playerHand = [];
var playingAnim = false; // this variable avoid interrupting an animation.

$(function () {
    var blackjackScore = 0;
    $("#blackjackScore").html(blackjackScore);
    //Start event -----------------------
    $("#startPlay").click(function () {
        if (playerBalance < 1) {
            $("#myModal").modal();
            return;
        }
        playingAnim = true; //This avoid the animation to be interrupted.

        blackjackScore--;
        updateScoreBoard($("#blackjackScore"), -1, blackjackScore);

        resetTable();
        $(this).slideToggle(200);
        $("#hit, #stand").off().slideToggle(200);

        //Reset global variables -------------------------
        deck = createDeck();
        tableHand = [];
        playerHand = [];

        //Give cards ---------------
        tableHand.push(deck.pop());
        playerHand.push(deck.pop());
        tableHand.push(deck.pop());
        playerHand.push(deck.pop());
        $("#playerPoints > .displayPoints").html(handValue(playerHand));
        $("#tablePoints > .displayPoints").html(handValue(tableHand));

        //First cards deal ------------------- 
        startCardDeal();

        $("#hit").click(function () {
            if (!Boolean(playingAnim)) {
                playerHand.push(deck.pop());
                playingAnim = true; //This avoid the animation to be interrupted.
                callCard(summonCard($("#playerHand"), playerHand[playerHand.length - 1]));
                if (handValue(playerHand) > 21) {
                    $("#bjDealer").html("You Lost!");
                    $("#startPlay, #hit, #stand").slideToggle(300);
                } else {
                    $("#bjDealer").html("You may play again.");
                }
                setTimeout(function () {
                    playingAnim = false; //This releases the lock for another animation call.
                },2000);
            }
        });

        $("#stand").click(function () {
            if (!Boolean(playingAnim)) {
                $("#hit, #stand").off(); //This line avoid the player to interfere on the tables play.
                tableTurn();
            }
        });
    });
});

