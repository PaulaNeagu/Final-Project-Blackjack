const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];


const yourCardsDiv = document.getElementById('your-cards');
const dealerCardsDiv = document.getElementById('dealer-cards');
const yourSumSpan = document.getElementById('your-sum');
const dealerSumSpan = document.getElementById('dealer-sum');
const resultsParagraph = document.getElementById('results');
const winningsDiv = document.getElementById('Winnings');
const lossesSpan = document.getElementById('Loss');

let deck = [];
let yourCards = [];
let dealerCards = [];
let yourSum = 0;
let dealerSum = 0;
let winnings = 0;
let losses = 0;

// Shuffle 
function shuffleDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    deck = deck.sort(() => Math.random() - 0.5);
}

// Start 
function startGame() {
    shuffleDeck();
    yourCards = [];
    dealerCards = [];
    yourSum = 0;
    dealerSum = 0;
    resultsParagraph.textContent = '';

    // Deal 
    for (let i = 0; i < 2; i++) {
        yourCards.push(drawCard());
        dealerCards.push(drawCard());
    }

    updateDisplay();
}

// Draw a card 
function drawCard() {
    const card = deck.pop();
    return card;
}

// Update 
function updateDisplay() {
    updateYourCards();
    updateDealerCards();
    updateYourSum();
    updateDealerSum();
}

function updateGame() {
  updateYourCards();
  updateDealerCardsGame();
  updateYourSum();
  updateDealerSum();
}

function updateYourCards() {
    yourCardsDiv.innerHTML = '';
    yourCards.forEach(card => {
        const cardImage = document.createElement('img');
        cardImage.src = `./images2/${card.value}-${card.suit}.png`;
        cardImage.classList.add('ycards');
        yourCardsDiv.appendChild(cardImage);
    });
}

function updateDealerCards() {
    dealerCardsDiv.innerHTML = '';
    dealerCards.forEach((card, index) => {
        const cardImage = document.createElement('img');
        if (index === 0) {
            cardImage.src = './images2/hidden.png';
        } else {
          cardImage.src = `./images2/${card.value}-${card.suit}.png`;
        }
        cardImage.classList.add('hcards');
        dealerCardsDiv.appendChild(cardImage);
    });
}

function updateDealerCardsGame() {
  dealerCardsDiv.innerHTML = '';
  dealerCards.forEach((card, index) => {
      const cardImage = document.createElement('img');
      cardImage.src = `./images2/${card.value}-${card.suit}.png`;
      cardImage.classList.add('dcards');
      dealerCardsDiv.appendChild(cardImage);
  });
}

function updateYourSum() {
    yourSum = calculateSum(yourCards);
    yourSumSpan.textContent = yourSum;
}

function updateDealerSum() {
  dealerSum = calculateSum(dealerCards);
  const absoluteSrc = dealerCardsDiv.firstChild.src;

    var baseURL = window.location.protocol + '//' + window.location.host;
    if (absoluteSrc.startsWith(baseURL)) {
        var relativeSrc = absoluteSrc.substring(baseURL.length);
    } else {
        console.error('Error: Image source does not start with the base URL');
    }
  if (relativeSrc ==  '/images2/hidden.png'){
    dealerSum -= getValue(dealerCards[0].value)
  }
  dealerSumSpan.textContent = dealerSum;
  const lastCard = dealerCards[dealerCards.length - 1];
  if (lastCard && lastCard.value !== 'hidden') {
      dealerSumSpan.textContent = dealerSum;
  }
}

// Calculate 
function calculateSum(cards) {
    let sum = 0;
    let hasAce = false;

    for (let card of cards) {
        const value = card.value;
        if (value === 'A') {
            hasAce = true;
        }
        sum += getValue(value);
    }

    if (hasAce && sum + 10 <= 21) {
        sum += 10;
    }

    return sum;
}

// Get value
function getValue(cardValue) {
    if (cardValue === 'K' || cardValue === 'Q' || cardValue === 'J') {
        return 10;
    } else if (cardValue === 'A') {
        return 1;
    } else {
        return parseInt(cardValue, 10);
    }
}

// Hit
function hit() {
    yourCards.push(drawCard());
    updateDisplay();

    if (yourSum > 21) {
        endGame(false);
    }
}

//Stand
function stand() {
    dealerCardsDiv.firstChild.src = `./images2/${dealerCards[0].value}-${dealerCards[0].suit}.png`;

    dealerTurn();
}

function dealerTurn() {
    setTimeout(() => {
        if (dealerSum < 17) {
            dealerCards.push(drawCard());
            updateGame();
            dealerTurn();
        } else {
            endGame(true);
        }
    }, 800); 
}

function endGame(playerStood) {
    resultsParagraph.textContent = '';

    while (dealerSum < 17) {
        dealerCards.push(drawCard());
        updateDisplay();
    }

    if (playerStood) {
        if (dealerSum > 21 || yourSum > dealerSum) {
            resultsParagraph.textContent = 'You win!';
            winnings++;
        } else if (yourSum === dealerSum) {
            resultsParagraph.textContent = 'It\'s a tie!';
        } else {
            resultsParagraph.textContent = 'You lose!';
            losses++;
        }
    } else {
        resultsParagraph.textContent = 'You busted! You lose!';
        losses++;
    }

    winningsDiv.textContent = `Winnings: ${winnings}`;
    lossesSpan.textContent = `Losses: ${losses}`;
}
