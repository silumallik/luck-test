let createuser = document.querySelector("#createuser");

let totalSeconds = 0;
const timeBox = document.getElementById("time");

// timmer function
setInterval(() => {
    totalSeconds++;

    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    // leading zero
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timeBox.textContent = `${minutes}:${seconds}`;
}, 1000);

// Number Show
function shownumber() {
    let numbreboxp = document.querySelector("#unique")
    let frstrndmnmbr = Math.floor(Math.random() * 10)
    numbreboxp.textContent = frstrndmnmbr
}

// Number Animation
function numberanimation() {
    gsap.fromTo("#unique",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "back.out(2)" }
    );
}

shownumber()
numberanimation()

class game {
    constructor() {
        this.riskusers = new Set();
        this.currentRandomNumber = null;
    }

    addplayer(Player) {
        this.riskusers.add(Player);
    }

    numbergenerate() {
        return Math.floor(Math.random() * 10);
    }

    startRound() {
        this.currentRandomNumber = this.numbergenerate();

        const unique = document.querySelector("#unique");
        unique.textContent = this.currentRandomNumber;

        console.log("Random Number:", this.currentRandomNumber);
    }

    result() {
        if (this.currentRandomNumber === null) {
            alert("Click Start Game First!");
            return;
        }

        // STEP 1 — PURANA RESULT CLEAR (CARDS ME)
        document.querySelectorAll(".result-card").forEach(card => {
            if (card.resultSpan) {
                card.resultSpan.textContent = "";
            }
        });

        // STEP 2 — PURANA RESULT BOARD CLEAR
        document.querySelector(".result-box").innerHTML = "";

        // Convert Set to Array for Result Board
        let playersArray = Array.from(this.riskusers);

        // STEP 3 — NAYA RESULT SHOW (CARDS ME)
        this.riskusers.forEach((val) => {
            if (val.number === this.currentRandomNumber) {
                val.resultSpan.textContent =
                    `Win ${Number(val.balance) * 4}`;
            } else {
                val.resultSpan.textContent =
                    `Lost ${val.balance}`;
            }
        });

        // STEP 4 — NAYA RESULT BOARD ENTRY
        addToResultBoard(this.currentRandomNumber, playersArray);

    }

    resetGame() {
        this.riskusers.clear();
        this.currentRandomNumber = null;

        const unique = document.querySelector("#unique");
        unique.textContent = "";

        console.log("Game Restarted!");
    }
}

class player {
    constructor(name, balance, number, resultSpan) {
        this.name = name;
        this.balance = balance;
        this.number = number;
        this.resultSpan = resultSpan;
    }
}

const Game = new game();

function createuserbox(inputname, inputamount) {

    let userboard = document.querySelector(".userboards");

    //Users Boxs
    let resultcard = document.createElement("div");
    resultcard.classList.add("result-card");
    userboard.append(resultcard);

    //Users Name
    let Name = document.createElement("p");
    Name.textContent = "Name :- ";
    let namespan = document.createElement("span");
    namespan.textContent = inputname;
    Name.append(namespan);

    //Selected Number
    let select = document.createElement("p");
    select.textContent = "Select :- ";
    let selectspan = document.createElement("span");
    selectspan.textContent = "None";
    select.append(selectspan);

    //Amount Show
    let amount = document.createElement("p");
    amount.textContent = "Amount :- ";
    let amountspan = document.createElement("span");
    amountspan.textContent = inputamount;
    amount.append(amountspan);

    //Edit amount
    let editInput = document.createElement("input");
    editInput.type = "number";
    editInput.min = 10;
    editInput.placeholder = "New Amount";
    editInput.style.display = "none";

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    //Specific Users Result 
    let result = document.createElement("p");
    result.textContent = "Result :- ";
    let resultspan = document.createElement("span");
    resultspan.textContent = "Waiting...";
    result.append(resultspan);

    resultcard.append(Name, select, amount, result);

    //grid numbers
    let grid = document.createElement("div");
    grid.classList.add("grid");
    resultcard.append(grid);


    for (let i = 1; i <= 12; i++) {
        let gridbox = document.createElement("div");

        if (i === 10) gridbox.textContent = "*";
        else if (i === 11) gridbox.textContent = 0;
        else if (i === 12) gridbox.textContent = "#";
        else gridbox.textContent = i;

        grid.append(gridbox);
    }

    //delete btn
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.marginTop = "10px";

    resultcard.dataset.name = inputname;
    resultcard.dataset.balance = inputamount;
    resultcard.dataset.selected = "";

    //number selection
    grid.addEventListener("click", (e) => {

        let value = e.target.textContent;

        if (isNaN(value)) {
            alert("⚠️ Only Single Digit Numbers Allowed.");
            return;
        }

        let selectedNumber = Number(value);

        selectspan.textContent = selectedNumber;
        resultcard.dataset.selected = selectedNumber;
    });

    //delete btn remove
    deleteBtn.addEventListener("click", () => {
        let name = resultcard.dataset.name;

        Game.riskusers = new Set(
            [...Game.riskusers].filter(p => p.name !== name)
        );

        resultcard.remove();
    });

    editBtn.addEventListener("click", () => {

        // INPUT SHOW
        if (editInput.style.display === "none") {
            editInput.style.display = "block";
            editBtn.textContent = "Save";
        }
        else {
            let newAmount = Number(editInput.value);

            // ✅ VALIDATION YAHAN
            if (isNaN(newAmount) || newAmount < 10) {
                alert("⚠️ Enter valid amount (minimum 10)");
                return;
            }

            if (!newAmount) {
                alert("Enter valid amount");
                return;
            }

            // ✅ UI update
            amountspan.textContent = newAmount;

            // ✅ dataset update
            resultcard.dataset.balance = newAmount;

            // ✅ Game.riskusers update
            Game.riskusers.forEach(p => {
                if (p.name === resultcard.dataset.name) {
                    p.balance = newAmount;
                }
            });

            // RESET UI
            editInput.value = "";
            editInput.style.display = "none";
            editBtn.textContent = "Edit";
        }
    });

    resultcard.resultSpan = resultspan;
    resultcard.append(editInput, editBtn);
    resultcard.append(deleteBtn);

    return resultcard;
}

// CREATE USER
createuser.addEventListener("click", () => {
    let nameInput = document.querySelector("#name");
    let amountInput = document.querySelector("#amount");

    let inputname = nameInput.value;
    let inputamount = Number(amountInput.value);

    // ❗ EMPTY VALIDATION
    if (!inputname || !inputamount) {
        alert("Enter valid data");
        return;
    }

    // ❗ MIN AMOUNT VALIDATION
    if (inputamount < 10) {
        alert("⚠️ Minimum amount is 10");
        return;
    }

    // ❗ SAME NAME CHECK
    let allCards = document.querySelectorAll(".result-card");
    for (let card of allCards) {
        if (card.dataset.name.toLowerCase() === inputname.toLowerCase()) {
            alert(`⚠️ ${inputname} already exists!`);
            return;
        }
    }

    createuserbox(inputname, inputamount);

    nameInput.value = "";
    amountInput.value = "";
});

// PLAY BUTTON — adds/updates MULTIPLE users replase kiya hey Update Number mey
document.querySelector("#updatenumber").addEventListener("click", () => {
    
    let allCards = document.querySelectorAll(".result-card");


    allCards.forEach(card => {
        let name = card.dataset.name;
        let balance = Number(card.dataset.balance);
        let selected = card.dataset.selected;

        if (!selected) return;

        let alreadyExists = false;

        Game.riskusers.forEach(p => {
            if (p.name === name) {
                alreadyExists = true;
                p.number = Number(selected);

            }
        });

        if (!alreadyExists) {
            const newPlayer = new player(
                name,
                balance,
                Number(selected),
                card.resultSpan
            );

            Game.addplayer(newPlayer);
        }
    });
});

// START GAME BUTTON ko replase kiya hey Check Result
document.querySelector("#checkresult").addEventListener("click", () => {
    Game.startRound();
    Game.result();
});

// RESTART BUTTON
document.querySelector("#restart").addEventListener("click", () => {

    Game.resetGame();

    document.querySelector(".userboards").innerHTML = "";
    let resultbox = document.querySelector(".result-box")
    Array.from(resultbox.children).forEach(child => {
        if (child.tagName !== "H5") {
            child.remove();
        }
    })
    shownumber()
    numberanimation()
    console.log("Game Fully Restarted!");
});

// GAME RESULT BOARD
function addToResultBoard(randomNumber, players) {
    let board = document.querySelector(".result-box");

    let h5 = document.createElement("h5")
    h5.innerText = "Result Board"

    let roundDiv = document.createElement("div");
    roundDiv.classList.add("result-row");

    let title = document.createElement("p");
    title.textContent = `Lucky Number : ${randomNumber}`;
    roundDiv.append(title);

    let lines = []; // Store lines for stagger animation

    players.forEach(p => {
        let line = document.createElement("p");

        if (p.number === randomNumber) {
            line.textContent =
                `✅ ${p.name} WON ${Number(p.balance) * 4} Rs.`;
            line.style.color = "white"
            line.style.opacity = ".8"
            line.style.fontWeight = "bold"
        } else {
            line.textContent =
                `❌ ${p.name} LOST ${p.balance} Rs.`;
            line.style.color = "red"
        }

        roundDiv.append(line);
        lines.push(line); // collect elements

        numberanimation()

    });
    board.append(h5)
    board.append(roundDiv);

    // GSAP Timeline Animation
    let tl = gsap.timeline();

    tl.from(title, {
        opacity: 0,
        y: 10,
        duration: 0.3
    })
        .from(lines, {
            opacity: 0,
            y: 10,
            ease: "sin.in0ut",
            stagger: {
                from: "start",
                each: .5
            }
        });

}

gsap.registerPlugin(ScrollTrigger);

gsap.from("#gamedescription p", {
    opacity: 0,
    y: "20px",
    stagger: {
        from: "start",
        each: ".5"
    },
    ease: "sin.inout",
    scrollTrigger: {
        trigger: "#gamedescription",
        start: "top 85%",
    },
})


