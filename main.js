document.querySelector(".control-button span").onclick = function () {
  let h1 = document.createElement("h1");
  var ul = document.createElement("ul");
  h1.appendChild(document.createTextNode(`Choose the difficulty level of the game`));
  for (var k = 1; k <= 3; k++) {
    var li = document.createElement("li");
    li.setAttribute("data-index", k);
    if (k == 1) {
      li.appendChild(document.createTextNode(`Easy`));
    }
    if (k == 2) {
      li.appendChild(document.createTextNode(`Medium`));
    }
    if (k == 3) {
      li.appendChild(document.createTextNode(`Hard`));
    }
    li.style.listStyle = "none";
    h1.style.top = "30%";
    h1.style.pointerEvents = "none";
    ul.classList.add("common-style");
    h1.classList.add("common-style");
    li.classList.add("common-size");

    ul.appendChild(li);
  }
  var controlButton = document.querySelector(".control-button");
  controlButton.appendChild(ul);
  controlButton.appendChild(h1);
  document.querySelector(".control-button span").remove();

  const liElements = document.querySelectorAll("li");

  liElements.forEach((li) => {
    li.addEventListener("click", function (event) {
      const LEVEL = event.target.getAttribute("data-index");
      ShowData();
      startGame(LEVEL);
    });
  });
};

let levels = {
  1: ["imgs/1.png", "imgs/2.png", "imgs/3.png", "imgs/4.png", "imgs/5.png"],
  2: ["imgs/6.png", "imgs/7.png", "imgs/8.png", "imgs/9.png", "imgs/10.png"],
  3: ["imgs/11.png", "imgs/12.png", "imgs/13.png", "imgs/14.png", "imgs/15.png"],
};

function startGame(level) {
  let yourName = prompt("What's Your Name ?");
  if (!yourName) document.querySelector(".name span").innerHTML = `Unknown`;
  else document.querySelector(".name span").innerHTML = yourName;


  document.querySelector(".control-button").remove();

  let newBlocks;
  switch (level) {
    case "1":
      newBlocks = levels[1];
      break;
    case "2":
      newBlocks = [...levels[1], ...levels[2]];
      break;
    case "3":
      newBlocks = [...levels[1], ...levels[2], ...levels[3]];
      break;
    default:
  }
  addCards(newBlocks);

  const BackgroundAudio = document.getElementById("BG");
  BackgroundAudio.play();
  BackgroundAudio.volume = 0.1;

  const startingMinutes = 2;
  startTimer(startingMinutes);
}

var blocksContainer = document.querySelector(".memory-game-blocks");

function addCards(imageUrls) {
  const containerArray = [];
  for (let i = 0; i < imageUrls.length; i++) {
    var container = document.createElement("div");
    container.classList.add("game-block");
    var frontFace = document.createElement("div");
    frontFace.classList.add("face", "front");
    var backFace = document.createElement("div");
    backFace.classList.add("face", "back");
    var img = document.createElement("img");
    img.alt = "";
    img.src = imageUrls[i];
    backFace.appendChild(img);
    container.appendChild(frontFace);
    container.appendChild(backFace);
    container.setAttribute("data-tech", i);
    var container2 = container.cloneNode(true);
    blocksContainer.appendChild(container);
    blocksContainer.appendChild(container2);
    document.body.appendChild(blocksContainer);
    containerArray.push(container);
    containerArray.push(container2);
    shuffle(containerArray)
  }
  for (let i = 0; i < containerArray.length; i++) {
    containerArray[i].style.order = i;
  }
  indexes(containerArray);
  ShowCards(containerArray);
}

function ShowCards(blocks) {
  blocks.forEach((block) => {
    block.classList.add("has-match");
  });

  setTimeout(() => {
    blocks.forEach((block) => {
      block.classList.remove("has-match");
    });
  }, 1000);
}

function indexes(blocks) {
  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    block.addEventListener("click", function () {
      block.classList.add("is-flipped");
      flipBlock(blocks);
    });
  }
}

function flipBlock(blocks) {
  let allFlippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
  );
  if (allFlippedBlocks.length === 2) {
    stopClicking();
    checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

function stopClicking() {
  blocksContainer.classList.add("no-clicking");
  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, 1000);
}
let counter = 0;

function checkMatchedBlocks(firstBlock, secondBlock) {
  let triesElement = document.querySelector(".tries span");

  if (firstBlock.dataset.tech === secondBlock.dataset.tech) {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    document.getElementById("success").play();
  } else {
    counter++;
    triesElement.innerHTML = counter;

    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, 1000);

    document.getElementById("fail").play();
  }
  EndGame();
}

function shuffle(array) {
  let current = array.length,
    temp,
    random;

  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;
    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
  }
  return array;
}

function startTimer(durationInMinutes) {
  const startingTimeInSeconds = durationInMinutes * 60;
  let time = startingTimeInSeconds;
  const countdownElement = document.getElementById("countdown");

  function updateCountdown() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    countdownElement.innerHTML = `${minutes} : ${seconds}`;

    if (time > 0) {
      time--;
    } else {
      clearInterval(timerInterval);
      handleTimerEnd();
      location.reload();
    }
  }

  const timerInterval = setInterval(updateCountdown, 1000);
}

function handleTimerEnd() {
  alert("Press OK");
  resetBlocks();
}

function resetBlocks() {
  const blocks = document.querySelectorAll(".has-match");
  blocks.forEach((block) => {
    block.classList.remove("has-match");
  });
}

function ShowData() {
  let tbody = document.querySelector("tbody");

  // Retrieve playersArray from localStorage
  let storedPlayers = JSON.parse(localStorage.getItem("playersArray")) || [];
  tbody.innerHTML = ''
  // Loop through the array and add a row for each player
  for (let i = 0; i < storedPlayers.length; i++) {
    let player = storedPlayers[i];
    tbody.innerHTML += `
      <tr>
        <th scope="row">${i + 1}</th>
        <td>${player.name}</td>
        <td>${player.count}</td>
        <td>${player.counter}</td>
        <td><button onclick='deleteElement(${i})' type="button" class="btn btn-danger">Delete</button></td>
        </tr>`;
  }
}



var count = 0;
// إنشاء مصفوفة لتخزين معلومات اللاعبين
let playersArray = [];

function EndGame() {
  const blocksContainer = document.querySelector(".memory-game-blocks");
  const allChildrenMatched = Array.from(blocksContainer.children).every((child) =>
    child.classList.contains("has-match")
  );

  if (allChildrenMatched) {
    count = count + 1;
    let storedPlayers = JSON.parse(localStorage.getItem("playersArray")) || [];

    let playerInfo = {
      name: document.querySelector(".name span").innerHTML,
      count: count,
      counter: counter,
    };

    storedPlayers.push(playerInfo);

    localStorage.setItem("playersArray", JSON.stringify(storedPlayers));

    Swal.fire({
      title: "Congratulations!",
      html: "<div id='animation-container'>You've successfully completed the game. Well done! 🎉</div>",
      confirmButtonText: 'OK',
      showCancelButton: true,
      cancelButtonText: 'Continue',
    }).then((result) => {
      if (result.isConfirmed) {
        location.reload();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        resetBlocks();
      }
    });

    ShowData();
  }
}