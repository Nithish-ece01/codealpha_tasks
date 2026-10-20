const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";
let justCalculated = false;

function updateDisplay() {
    display.value = expression || "0";
}

function calculate() {
    if (!expression) return;

    try {
        // Accept only calculator characters.
        if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }

        // Evaluate the arithmetic expression.
        const result = Function('"use strict"; return (' + expression + ')')();

        if (typeof result !== "number" || !Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        expression = String(Number(result.toPrecision(12)));
        updateDisplay();
        justCalculated = true;
    } catch {
        display.value = "Error";
        expression = "";
        justCalculated = false;
    }
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "clear") {
        expression = "";
        justCalculated = false;
        updateDisplay();
        return;
    }

    if (action === "delete") {
        if (justCalculated) {
            expression = "";
            justCalculated = false;
        } else {
            expression = expression.slice(0, -1);
        }
        updateDisplay();
        return;
    }

    if (action === "calculate") {
        calculate();
        return;
    }

    if (value !== undefined) {
        if (justCalculated) {
            if (/[0-9.]/.test(value[0])) {
                expression = "";
            }
            justCalculated = false;
        }

        expression += value;
        updateDisplay();
    }
});

// Keyboard support
document.addEventListener("keydown", function (event) {
    if (/^[0-9.+\-*/%()]$/.test(event.key)) {
        if (justCalculated) {
            if (/[0-9.]/.test(event.key)) {
                expression = "";
            }
            justCalculated = false;
        }

        expression += event.key;
        updateDisplay();
    } else if (event.key === "Enter" || event.key === "=") {
        calculate();
    } else if (event.key === "Backspace") {
        expression = expression.slice(0, -1);
        justCalculated = false;
        updateDisplay();
    } else if (event.key === "Escape") {
        expression = "";
        justCalculated = false;
        updateDisplay();
    }
});