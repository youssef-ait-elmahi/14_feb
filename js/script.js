/* Global Stage Management & Utilities */
const UNSPLASH_ACCESS_KEY = '0BDKc_EOu2BiuD9KD1bLjoyAnkzBmmZ65gzBXgQyTTc';
const stages = {
  heart: document.getElementById('heart-stage'),
  memory: document.getElementById('memory-stage'),
  puzzle: document.getElementById('puzzle-stage'),
  branching: document.getElementById('branching-stage'),
  quotes: document.getElementById('quotes-stage'),
  form: document.getElementById('form-stage'),
  certificate: document.getElementById('certificate-stage'),
  final: document.getElementById('final-view-stage')
};
const body = document.body;

// Audio elements
const reviveSound = document.getElementById('reviveSound');
const heartbeatSound = document.getElementById('heartbeatSound');
const cardFlipSound = document.getElementById('cardFlipSound');
const matchSound = document.getElementById('matchSound');
const puzzleDropSound = document.getElementById('puzzleDropSound');
const buttonClickSound = document.getElementById('buttonClickSound');
const romanticSong = document.getElementById('romanticSong');

/**
 * transitionToStage(stageName)
 * Hides all stages and displays the selected stage.
 */
function transitionToStage(stageName) {
  document.querySelectorAll('.stage').forEach(stage => {
    stage.classList.remove('active');
  });
  if (stageName === 'memory') {
    initMemoryGame();
  } else if (stageName === 'puzzle') {
    initPuzzleGame();
  }
  stages[stageName].classList.add('active');
}

/**
 * checkLockout()
 * Checks for a 24-hour lockout from previous negative response.
 */
function checkLockout() {
  const lockoutTimestamp = localStorage.getItem('lockoutTimestamp');
  if (lockoutTimestamp) {
    const now = Date.now();
    const diff = now - parseInt(lockoutTimestamp, 10);
    const hours24 = 24 * 60 * 60 * 1000;
    if (diff < hours24) {
      showModal("You answered 'No' recently. Please try again later.", () => {});
      return true;
    } else {
      localStorage.removeItem('lockoutTimestamp');
    }
  }
  return false;
}

/* ===============================
   Stage 1: Heart Healing
   =============================== */
const maxBlood = 100;
let bloodLevel = 0;
const clickIncrement = 6;
const decayRate = 1;
const intervalTime = 100;
const fillRect = document.getElementById('fillRect');
const heartSVG = document.getElementById('heartSVG');

function updateHeartFill() {
  const fillHeight = (bloodLevel / maxBlood) * 100;
  const newY = 100 - fillHeight;
  fillRect.setAttribute('y', newY);
  fillRect.setAttribute('height', fillHeight);
}

function updateHeartState() {
  if (bloodLevel >= maxBlood) {
    heartSVG.classList.add('alive');
    if (heartbeatSound.paused) {
      heartbeatSound.currentTime = 0;
      heartbeatSound.play();
    }
    body.classList.add('live-background');
    setTimeout(() => {
      transitionToStage('memory');
    }, 6000);
  } else {
    heartSVG.classList.remove('alive');
    heartbeatSound.pause();
    heartbeatSound.currentTime = 0;
  }
}

// Heart click event with beat animation
heartSVG.addEventListener('click', () => {
  if (bloodLevel < maxBlood) {
    heartSVG.classList.add("beat");
    heartSVG.addEventListener("animationend", function removeBeat() {
      heartSVG.classList.remove("beat");
      heartSVG.removeEventListener("animationend", removeBeat);
    });
    bloodLevel = Math.min(bloodLevel + clickIncrement, maxBlood);
    updateHeartFill();
    updateHeartState();
    reviveSound.currentTime = 0;
    reviveSound.play();
  }
});

setInterval(() => {
  if (bloodLevel > 0 && bloodLevel < maxBlood) {
    bloodLevel = Math.max(bloodLevel - decayRate, 0);
    updateHeartFill();
    updateHeartState();
  }
}, intervalTime);

/* ===============================
   Stage 2: Memory Matching Game
   =============================== */
const memoryGrid = document.getElementById('memory-grid');
let memoryCards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
const symbols = ['❤️', '💍', '🌸', '😍', '💕', '😘', '💖', '🥰'];

function initMemoryGame() {
  memoryGrid.innerHTML = '';
  memoryCards = [];
  matchedPairs = 0;
  const cardSymbols = [...symbols, ...symbols];
  shuffleArray(cardSymbols);
  cardSymbols.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.innerHTML = '';
    card.addEventListener('click', onCardClicked);
    memoryGrid.appendChild(card);
    memoryCards.push(card);
  });
}

function onCardClicked(e) {
  const card = e.currentTarget;
  if (lockBoard || card.classList.contains('flipped')) return;
  
  flipCard(card);
  cardFlipSound.currentTime = 0;
  cardFlipSound.play();
  
  if (!firstCard) {
    firstCard = card;
    return;
  }
  
  secondCard = card;
  lockBoard = true;
  
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    matchSound.currentTime = 0;
    matchSound.play();
    matchedPairs++;
    firstCard.removeEventListener('click', onCardClicked);
    secondCard.removeEventListener('click', onCardClicked);
    resetMemorySelection();
    if (matchedPairs === symbols.length) {
      setTimeout(() => {
        transitionToStage('puzzle');
      }, 2000);
    }
  } else {
    setTimeout(() => {
      flipCard(firstCard);
      flipCard(secondCard);
      resetMemorySelection();
    }, 1000);
  }
}

function flipCard(card) {
  card.classList.toggle('flipped');
  card.textContent = card.classList.contains('flipped') ? card.dataset.symbol : '';
}

function resetMemorySelection() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/* ===============================
   Stage 3: Draggable Jigsaw Puzzle with Unsplash Image
   =============================== */
const puzzleGrid = document.getElementById('puzzle-grid');
let puzzlePieces = [];

function initPuzzleGame() {
  puzzleGrid.innerHTML = '';
  puzzlePieces = [];
  fetch(`https://api.unsplash.com/photos/random?query=love&client_id=${UNSPLASH_ACCESS_KEY}`)
    .then(response => response.json())
    .then(data => {
      const puzzleImageSrc = data.urls.regular;
      createPuzzlePieces(puzzleImageSrc);
    })
    .catch(error => {
      console.error("Error fetching image from Unsplash:", error);
      createPuzzlePieces('images/love-image.jpg');
    });
}

function createPuzzlePieces(imageUrl) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const piece = document.createElement('div');
      piece.classList.add('puzzle-piece');
      piece.style.backgroundImage = `url(${imageUrl})`;
      piece.style.backgroundSize = '300px 300px';
      piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
      piece.dataset.correctIndex = row * 3 + col;
      piece.dataset.currentIndex = row * 3 + col;
      piece.draggable = true;
      
      piece.addEventListener('dragstart', onDragStart);
      piece.addEventListener('dragover', onDragOver);
      piece.addEventListener('drop', onDrop);
      piece.addEventListener('dragend', onDragEnd);
      
      // Add touch event listener for mobile tap-swap
      piece.addEventListener('touchend', handleTouchSwap);
      
      puzzleGrid.appendChild(piece);
      puzzlePieces.push(piece);
    }
  }
  shufflePuzzlePieces();
}

function shufflePuzzlePieces() {
  const indices = puzzlePieces.map((_, i) => i);
  shuffleArray(indices);
  indices.forEach((shuffledIndex, i) => {
    const piece = puzzlePieces[i];
    piece.dataset.currentIndex = shuffledIndex;
    piece.style.order = shuffledIndex;
  });
}

let draggedPiece = null;
function onDragStart(e) {
  draggedPiece = e.currentTarget;
  e.dataTransfer.effectAllowed = 'move';
  draggedPiece.classList.add('dragging');
}
function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}
function onDrop(e) {
  e.preventDefault();
  const targetPiece = e.currentTarget;
  if (draggedPiece === targetPiece) return;
  
  swapPieces(draggedPiece, targetPiece);
  
  puzzleDropSound.currentTime = 0;
  puzzleDropSound.play();
  checkPuzzleSolved();
}
function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  draggedPiece = null;
}

// Function to swap two puzzle pieces (used for drag and touch)
function swapPieces(piece1, piece2) {
  let tempIndex = piece1.dataset.currentIndex;
  piece1.dataset.currentIndex = piece2.dataset.currentIndex;
  piece2.dataset.currentIndex = tempIndex;
  
  let tempOrder = piece1.style.order;
  piece1.style.order = piece2.style.order;
  piece2.style.order = tempOrder;
  
  // Remove any "selected" highlight if present
  piece1.classList.remove('selected');
  piece2.classList.remove('selected');
}

// Touch-based swapping for mobile devices
let selectedPiece = null;
function handleTouchSwap(e) {
  e.preventDefault();
  const piece = e.currentTarget;
  // If no piece is selected, mark this one as selected
  if (!selectedPiece) {
    selectedPiece = piece;
    piece.classList.add('selected');
  } else if (selectedPiece === piece) {
    // Tapping the same piece deselects it
    selectedPiece.classList.remove('selected');
    selectedPiece = null;
  } else {
    // Swap the selected piece with the tapped piece
    swapPieces(selectedPiece, piece);
    selectedPiece = null;
    checkPuzzleSolved();
  }
}

function checkPuzzleSolved() {
  const solved = puzzlePieces.every(piece => piece.dataset.currentIndex === piece.dataset.correctIndex);
  if (solved) {
    setTimeout(() => {
      transitionToStage('branching');
    }, 500);
  }
}

/* ===============================
   Stage 4: "Do you love me?" Branching with Custom Modal
   =============================== */
let noCount = 0;
if (checkLockout()) {
  document.body.innerHTML = "<h1 style='color:#fff; text-align:center; margin-top:50px;'>Please try again after 24 hours.</h1>";
}

document.getElementById('yes-btn').addEventListener('click', () => {
  buttonClickSound.currentTime = 0;
  buttonClickSound.play();
  romanticSong.currentTime = 0;
  romanticSong.play();
  transitionToStage('quotes');
  startQuotesSlideshow();
});

document.getElementById('no-btn').addEventListener('click', () => {
  buttonClickSound.currentTime = 0;
  buttonClickSound.play();
  noCount++;
  if (noCount < 2) {
    showModal("Are you sure? Please answer honestly.", () => {});
  } else {
    showModal("Oh no... a broken heart.", () => {
      localStorage.setItem('lockoutTimestamp', Date.now().toString());
      document.body.innerHTML = "<h1 style='color:#fff; text-align:center; margin-top:50px;'>Your heart is broken. Please try again in 24 hours.</h1>";
    });
  }
});

/* ===============================
   Stage 5: Love Quotes Slideshow
   =============================== */
const quotesContainer = document.getElementById('quotes-container');
const loveQuotes = [
  "Love is composed of a single soul inhabiting two bodies. – Aristotle",
  "Where there is love there is life. – Mahatma Gandhi",
  "Love recognizes no barriers. – Maya Angelou",
  "The best thing to hold onto in life is each other. – Audrey Hepburn",
  "Love cures people—both the ones who give it and the ones who receive it. – Karl Menninger",
  "We accept the love we think we deserve. – Stephen Chbosky",
  "To love and be loved is to feel the sun from both sides. – David Viscott",
  "You know you’re in love when you can’t fall asleep because reality is finally better than your dreams.",
  "Love is the only force capable of transforming an enemy into a friend. – Martin Luther King Jr.",
  "The heart has its reasons which reason knows nothing of. – Blaise Pascal"
];
let quoteIndex = 0;
let quoteInterval;
function startQuotesSlideshow() {
  quotesContainer.textContent = loveQuotes[quoteIndex];
  quoteInterval = setInterval(() => {
    quoteIndex++;
    if (quoteIndex < loveQuotes.length) {
      quotesContainer.textContent = loveQuotes[quoteIndex];
    } else {
      clearInterval(quoteInterval);
      setTimeout(() => {
        transitionToStage('form');
      }, 1200);
    }
  }, 6500);
}

/* ===============================
   Stage 6: Promise Form
   =============================== */
const promiseForm = document.getElementById('promise-form');
let certificateData = {};
promiseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  buttonClickSound.currentTime = 0;
  buttonClickSound.play();
  const yourName = document.getElementById('your-name').value;
  const soulmateName = document.getElementById('soulmate-name').value;
  const promiseText = document.getElementById('promise').value;
  certificateData = { yourName, soulmateName, promiseText };
  transitionToStage('certificate');
  generateCertificate();
});

/* ===============================
   Stage 7: Final Certificate & Screenshot
   =============================== */
function generateCertificate() {
  const certificateContent = document.getElementById('certificate-content');
  certificateContent.innerHTML = "";
  
  // Create scattered quote pieces
  loveQuotes.forEach(quote => {
    const quoteDiv = document.createElement('div');
    quoteDiv.classList.add('quote-piece');
    quoteDiv.textContent = quote;
    const posX = Math.random() * 80;
    const posY = Math.random() * 80;
    const rotation = Math.random() * 30 - 15;
    quoteDiv.style.left = posX + "%";
    quoteDiv.style.top = posY + "%";
    quoteDiv.style.transform = `rotate(${rotation}deg)`;
    certificateContent.appendChild(quoteDiv);
  });
  
  // Create central block for names and promise
  const centralDiv = document.createElement('div');
  centralDiv.id = "certificate-central";
  centralDiv.innerHTML = `
    <h2>${certificateData.yourName} &amp; ${certificateData.soulmateName}</h2>
    <p>Promise: ${certificateData.promiseText}</p>
  `;
  certificateContent.appendChild(centralDiv);
}

document.getElementById('screenshot-btn').addEventListener('click', () => {
  html2canvas(document.getElementById('certificate-stage')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'certificate.png';
    link.href = canvas.toDataURL();
    link.click();
  });
  buttonClickSound.currentTime = 0;
  buttonClickSound.play();
  setTimeout(() => {
    transitionToStage('final');
    showFinalMessage();
  }, 5000);
});

/* ===============================
   Stage 8: Final View
   =============================== */
function showFinalMessage() {
  const finalMessage = document.getElementById('final-message');
  finalMessage.innerHTML = `<strong>${certificateData.yourName}</strong> and <strong>${certificateData.soulmateName}</strong>, you are meant for each other.`;
}

/* ===============================
   Custom Modal Functions
   =============================== */
function showModal(message, onConfirm) {
  const modal = document.getElementById('modal');
  const modalMessage = document.getElementById('modal-message');
  const confirmBtn = document.getElementById('modal-confirm');
  const cancelBtn = document.getElementById('modal-cancel');
  
  modalMessage.textContent = message;
  cancelBtn.style.display = "none";
  modal.style.display = "block";
  
  confirmBtn.onclick = function() {
    modal.style.display = "none";
    onConfirm();
  };
}

window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
