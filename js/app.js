/*
 * Create a list that holds all of your cards
 */
let cardSymbols = []; //array to hold symbols
let hitCounter = 0;
let firstCardIndex = 0;
let pairsToDiscover = 8;
let timer = 0;
let timeInterval;
let mm = 0,
    ss = 0,
    starRating = 3;

//restart button
let rb = document.getElementById('restart_button');

//cards
let cards = document.querySelectorAll('.deck .card');

//elapsed time
let elapsedTime = document.querySelector('.timer');

//
let numOfMoves = document.querySelector('.moves');

//stars in Star Rating
let stars = document.querySelector('.stars');

//total number of moves
let m_totalMoves = document.getElementById('totalMoves');

//total time
let m_totalTime = document.getElementById('totalTime');

//Modal Star rating
let m_starRating = document.getElementById('starRating');

//modat - Score tabel
let modal = document.getElementById('modal');

//get symbols from cards
for (let i = 0; i < cards.length; i++) {
    cardSymbols[i] = cards[i].firstElementChild.className;
}

function initBoard() {
    cardSymbols = shuffle(cardSymbols);
    for (let i = 0; i < cards.length; i++) {
        cards[i].firstElementChild.className = cardSymbols[i];
        if (cards[i].classList.contains('match') ||
            cards[i].classList.contains('open')) {
            cards[i].className = ('card');
        }
    }
    hitCounter = 0;
    pairsToDiscover = 8;
    timer = 0;
    // starRating = 3;
    setTime(timer);
    clearInterval(timeInterval);
    updateScore(0);
    initRating();
}

//function to hide the card
function hideCard(index) {
    cards[index].className = 'card';
}

//function to show the card
function showCard(index) {
    cards[index].classList.add('open', 'show');
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided 'shuffle' method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */



// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//set up the listener event for cards
for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', function() {
        if (!cards[i].classList.contains('open')) {
            hitCounter++;
            if (hitCounter === 1) {
                //timer
                timeInterval = setInterval(setTime, 1000);
            }
            showCard(i);
            if (hitCounter % 2 === 1) {
                firstCardIndex = i;
            } else {
                verifyMatch(i);
                updateScore(hitCounter);
            }
        }
    });
}

//set up event listener for restart button
rb.addEventListener('click', function() {
    initBoard();
})

function initRating() {
    while (starRating < 3) {
        star = document.createElement('li');
        star.innerHTML = '<i class="fa fa-star"</i>';
        stars.appendChild(star);
        starRating++;
    }
}

function setTime() {
    ss = (timer % 60);
    mm = parseInt(timer / 60);
    elapsedTime.textContent = (clock(mm) + ':' + clock(ss));
    timer++;
}

function clock(x) {
    return (x < 10) ? ('0' + x.toFixed(0)) : x.toFixed(0);
}

function updateScore(val) {
    numOfMoves.textContent = (val / 2).toFixed(0) + ' moves';
    if (hitCounter === 20 || hitCounter === 30) deleteStar();
}

function deleteStar(index) {
    stars.firstElementChild.remove();
    starRating--;
}

//check if 2 cards match
function verifyMatch(index) {
    if (cards[index].firstElementChild.className === cards[firstCardIndex].firstElementChild.className) {
        //we have a match, lock the cards
        cards[index].classList.add('match');
        cards[firstCardIndex].classList.add('match');
        pairsToDiscover--;
        if (pairsToDiscover === 0) winGame();
    } else {
        let fc = firstCardIndex, //first clicked card
            sc = index; //second clicked card
        window.setTimeout(function() {
            hideCard(sc);
            hideCard(fc);
        }, 1000);
    }
}

function winGame() {
    clearInterval(timeInterval);
    m_totalMoves.textContent = (hitCounter / 2);
    m_totalTime.textContent = (mm + ' minutes and ' + ss + ' seconds');

    //m_starRating.textContent = (starRating + ' stars');

    let s = document.createElement('li');
    m_starRating.appendChild(s);
    m_starRating.firstElementChild.className = ('stars');
    for (let i = 0; i < starRating; i++) {
        let temp = document.createElement('i');
        temp.classList.add('fa', 'fa-star');
        m_starRating.firstElementChild.appendChild(temp);
    }

    modal.classList.add('show');
    document.querySelector('.close').addEventListener('click', function() {
        modal.classList.remove('show');
        initBoard();
    })
}

function restartGame() {
    initBoard();
    modal.classList.remove('show');
    while (m_starRating.firstChild) {
        m_starRating.removeChild(m_starRating.firstChild);
    }
}

initBoard();