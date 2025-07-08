// ========== DOM Elements ==========
const displayInput = document.querySelector("#display-input");
const displayOutput = document.querySelector("#display-output");
const onBtn = document.querySelector("#on");
const constBtn = document.querySelector("#const-toggle-btn");

const clearBtn = document.querySelector("#ac");
const delBtn = document.querySelector("#del");
const evalBtn = document.querySelector("#eval");
const ansBtn = document.querySelector("#ans-button");
const angleModeBtn = document.querySelector("#angle-mode-toggle");
const angleUnitDisplay = document.querySelector("#angle-unit");

const allButtons = document.querySelectorAll(".btn");
const charButtons = document.querySelectorAll(".char-button");
const button2s = document.querySelectorAll(".button2");

// Angle mode
var angleMode = {
  type: "DEG",
  value: "(Math.PI/180)",
};

let ans = null;
let errorMsg = "Error";

// ========== UI Display Functions ==========
function hideInput() {
  displayInput.style.display = "none";
  displayOutput.style.display = "block";
}

function showInput() {
  displayInput.style.display = "block";
  displayOutput.style.display = "none";
}

// ========== Startup Animation ==========
window.addEventListener("load", () => {
  displayOutput.value = "ABAsio";
  displayInput.style.display = "none";
  allButtons.forEach((btn) => (btn.disabled = true));

  setTimeout(() => (displayOutput.style.opacity = 1), 500);
  setTimeout(() => {
    displayOutput.style.opacity = 0;
    displayOutput.value = "";
  }, 3000);
  setTimeout(() => {
    displayOutput.style.opacity = 1;
    displayInput.style.display = "block";
    displayInput.value = "";
    allButtons.forEach((btn) => (btn.disabled = false));
  }, 3500);
});

// ========== Button Event Listeners ==========

// ON button reloads page
onBtn.addEventListener("click", () => location.reload());

// Character buttons input
charButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.getAttribute("data-value");
    displayInput.value += value;
    displayOutput.value = "";
    showInput();
  });
});

// CONST toggle side-popup
constBtn.addEventListener("click", () => {
  let popup = document.getElementById("constants-popup");
  if (popup.style.display == "none") {
    popup.style.display = "flex";
  } else {
    popup.style.display = "none";
  }
});

// AC - All Clear
clearBtn.addEventListener("click", () => {
  displayInput.value = "";
  displayOutput.value = "";
  showInput();
});

// DEL - Delete last character
delBtn.addEventListener("click", () => {
  displayInput.value = displayInput.value.slice(0, -1);
  displayOutput.value = "";
  showInput();
});

// ANS - Insert last answer
ansBtn.addEventListener("click", () => {
  if (ans !== null) {
    displayInput.value += "ans";
  }
  displayOutput.value = "";
  showInput();
});

// Angle mode toggle
angleModeBtn.addEventListener("click", () => {
  switch (angleModeBtn.innerText) {
    case "DEG":
      angleMode.type =
        angleUnitDisplay.innerText =
        angleModeBtn.innerText =
          "RAD";
      angleMode.value = "1";
      break;

    default:
      angleMode.type =
        angleUnitDisplay.innerText =
        angleModeBtn.innerText =
          "DEG";
      angleMode.value = "(Math.PI/180)";

      break;
  }
});

// EVAL - Evaluate expression
evalBtn.addEventListener("click", () => {
  displayOutput.value = evaluate(displayInput.value);
  displayInput.value = "";
  hideInput();
});

var logarithm = (num) => Math.log10(num);
// ========== Expression Evaluator ==========
function evaluate(inputString) {
  try {
    let expression = inputString
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/\^/g, "**")
      .replace(/²/g, "**2")
      .replace(/mod/g, "%")
      .replace(/E/g, "e")

      // π and ans replacements
      .replace(/(?<=[0-9])π/g, `*${Math.PI}`)
      .replace(/(?<=[+\-*/.%e])π/g, `${Math.PI}`)
      .replace(/π/g, `${Math.PI}`)
      .replace(/(?<=[0-9])ans/g, `*${ans}`)
      .replace(/(?<=[+\-*/.%e])ans/g, `${ans}`)
      .replace(/ans/g, ans)

      // Functions
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/log \(/g, "logarithm(")
      .replace(/ln \(/g, "Math.log(")
      .replace(/sin \(/g, `Math.sin(${angleMode.value}*`)
      .replace(/cos \(/g, `Math.cos(${angleMode.value}*`)
      .replace(/tan \(/g, `Math.tan(${angleMode.value}*`)
      .replace(/hyp \(/g, `Math.hypot(${angleMode.value}*`)

      // Clean leading zeros
      .replace(/\b0+(\d)/g, "$1");
    console.log(expression);

    // Implicit multiplication: 2( or a( → 2*(
    expression = expression
      .replace(/(?<=[0-9])\(/g, "*(")
      .replace(/\*\*/g, "@");

    // Empty input
    if (expression.trim() === "") return 0;
    console.log(expression);
    // Evaluate safely
    let result = Function(`"use strict"; return (${expression})`)();

    // Handle invalid result
    if (typeof result !== "number" || !isFinite(result)) {
      errorMsg = "Math Error";
      throw new Error("Invalid result");
    }

    // Precision adjustment
    let resultStr = result.toString();
    if (resultStr.length > 13) {
      result = parseFloat(result.toPrecision(13));
    }

    ans = result;
    return result;
  } catch (err) {
    return errorMsg;
  }
}
