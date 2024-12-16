// Global variables
let price = 0; // Set dynamically
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

// Helper function to calculate change
function calculateChange(price, cash, cid) {
  let changeDue = cash - price;

  // Case: Exact payment
  if (changeDue === 0) {
    return { status: "EXACT", message: "No change due - customer paid with exact cash" };
  }

  let totalInDrawer = cid.reduce((sum, [, amount]) => sum + amount, 0);
  let changeArray = [];
  const denominations = [
    ["ONE HUNDRED", 100],
    ["TWENTY", 20],
    ["TEN", 10],
    ["FIVE", 5],
    ["ONE", 1],
    ["QUARTER", 0.25],
    ["DIME", 0.1],
    ["NICKEL", 0.05],
    ["PENNY", 0.01]
  ];

  if (changeDue > totalInDrawer) return { status: "INSUFFICIENT_FUNDS", change: [] };

  for (let [name, value] of denominations) {
    let amount = 0;
    let drawerAmount = cid.find((item) => item[0] === name)[1];
    while (changeDue >= value && drawerAmount > 0) {
      changeDue = Math.round((changeDue - value) * 100) / 100;
      drawerAmount = Math.round((drawerAmount - value) * 100) / 100;
      amount += value;
    }
    if (amount > 0) changeArray.push([name, amount]);
  }

  if (changeDue > 0) return { status: "INSUFFICIENT_FUNDS", change: [] };
  if (totalInDrawer === cash - price) return { status: "CLOSED", change: changeArray };

  return { status: "OPEN", change: changeArray };
}

// Button click event listener
document.getElementById("purchase-btn").addEventListener("click", function () {
  const cashInput = parseFloat(document.getElementById("cash").value);

  if (isNaN(cashInput)) {
    alert("Please enter a valid cash amount.");
    return;
  }

  if (cashInput < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  const result = calculateChange(price, cashInput, cid);

  if (result.status === "EXACT") {
    document.getElementById("change-due").textContent = result.message;
  } else if (result.status === "INSUFFICIENT_FUNDS") {
    document.getElementById("change-due").textContent = "Status: INSUFFICIENT_FUNDS";
  } else if (result.status === "CLOSED") {
    document.getElementById("change-due").textContent = `Status: CLOSED ${result.change
      .map(([name, amount]) => `${name}: $${amount}`)
      .join(" ")}`;
  } else {
    document.getElementById("change-due").textContent = `Status: OPEN ${result.change
      .map(([name, amount]) => `${name}: $${amount}`)
      .join(" ")}`;
  }
});

// Example usage: Set price dynamically
price = 11.95; // Example item price
