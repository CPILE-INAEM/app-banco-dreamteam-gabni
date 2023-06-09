"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Juan Sánchez",
  movements: [
    { date: "2022-01-02", value: 200 },
    { date: "2023-02-20", value: 450 },
    { date: "2021-07-18", value: -400 },
    { date: "2021-03-1", value: 3000 },
    { date: "2019-03-25", value: -650 },
    { date: "2019-10-16", value: -130 },
    { date: "2021-12-01", value: 70 },
    { date: "2022-06-25", value: 1300 },
  ],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "María Portazgo",
  movements: [
    { date: "2022-11-22", value: 5000 },
    { date: "2023-01-02", value: 3400 },
    { date: "2021-05-13", value: -150 },
    { date: "2022-03-05", value: -790 },
    { date: "2019-04-30", value: -3210 },
    { date: "2019-01-17", value: -1000 },
    { date: "2021-12-01", value: 8500 },
    { date: "2021-06-25", value: -30 },
  ],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Estefanía Pueyo",
  movements: [
    { date: "2023-01-15", value: 200 },
    { date: "2023-03-24", value: -200 },
    { date: "2021-01-08", value: 340 },
    { date: "2017-03-1", value: -300 },
    { date: "2019-05-20", value: -20 },
    { date: "2019-01-04", value: 50 },
    { date: "2021-10-10", value: 400 },
    { date: "2022-08-25", value: -460 },
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Javier Rodríguez",
  movements: [
    { date: "2022-12-02", value: 430 },
    { date: "2023-01-01", value: 1000 },
    { date: "2021-09-20", value: 700 },
    { date: "2021-02-13", value: 50 },
    { date: "2019-06-02", value: 90 },
  ],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

let currentAccount;
let balance;

//Para tener la fecha actual
const currentDate = new Date();
labelDate.textContent = currentDate.toLocaleDateString();

//init data
const createUsername = function () {
  accounts.forEach((account) => {
    account.username = account.owner
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toLowerCase();
  });
};

console.log(accounts);
createUsername();

btnLogin.addEventListener("click", (e) => {
  //Prevent form from submitting
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);
  console.log(`Intento login con el usuario ${username} y el pin ${pin}`);

  //recorrer todos los accounts y buscar el que coincida con el username
  //y luego comparar el pin
  currentAccount = accounts.find((account) => account.username === username);

  //puede ser null si el usuario no existe!!!

  console.log(currentAccount);

  // currentAccount && currentAccount.pin === currentAccount?.pin
  if (currentAccount?.pin === pin) {
    console.log("Login correcto");
    //Cargamos los datos y visualizamos
    labelWelcome.textContent = `Bienvenido ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    //mostrar datos
    updateUI(currentAccount);
  }
});

const updateUI = (currentAccount) => {
  const { movements } = currentAccount;
  //mostrar movimientos
  displayMovements(currentAccount.movements);
  //mostrar balance
  calcAndDisplayBalance(currentAccount.movements);
  //mostrar resumen
  calcAndDisplaySummary(currentAccount);
};

let sort;

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  // Ordenar los movimientos por fecha si el parámetro sort es true
  if (sort) movements.sort((a, b) => new Date(b.date) - new Date(a.date));
  else movements.sort((a, b) => new Date(a.date) - new Date(b.date));

  currentAccount.movements.forEach((mov, i) => {
    // Convertir las fechas de los movimientos a objetos moment
    currentAccount.movements.forEach((movement) => {
      movement.date = moment(movement.date, "YYYY-MM-DD, h:mm:ss a");

      // Utilizar el método fromNow para mostrar la fecha en formato relativo
      movement.dateStr = movement.date.fromNow();
    });
    const { value } = mov;
    const dateStr = mov.dateStr;
    const typeMov = value > 0 ? "deposit" : "withdrawal";
    const movHTML = `<div class="movements__row">
      <div class="movements__type movements__type--${typeMov}">${
      i + 1
    } ${typeMov}</div>
      <div class="movements__date">${dateStr}</div>
      <div class="movements__value">${value.toFixed(2)}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", movHTML);
  });
};

const calcAndDisplayBalance = (movements) => {
  balance = movements.reduce((acc, movement) => acc + movement.value, 0);
  labelBalance.textContent = `${balance.toFixed(2)}€`;
};

const calcAndDisplaySummary = (currentAccount) => {
  const { movements } = currentAccount;
  const sumIn = movements
    .filter(({ value }) => value > 0)
    .reduce((acc, movement) => acc + movement.value, 0);
  const sumOut = movements
    .filter(({ value }) => value < 0)
    .reduce((acc, { value }) => acc - value, 0);

  labelSumIn.textContent = `${sumIn.toFixed(2)}€`;
  labelSumOut.textContent = `${Math.abs(sumOut).toFixed(2)}€`;

  //calculo de intereses:
  //teniendo en cuenta solo ingresos superiores a 100€
  //y que los intereses sean superiores a 2€
  const interest = movements
    .filter(({ value }) => value > 100)
    .map(({ value }) => (value * currentAccount.interestRate) / 100)
    .filter((int) => int >= 2)
    .map((int) => {
      //console.log(int);
      return int;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

//Implementar transferencias entre cuentas

btnTransfer.addEventListener("click", function (e) {
  //Prevent form from submitting
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverUsername = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  console.log(receiverUsername);
  const senderUsername = currentAccount;
  // transferencia mas de 0€, existe el usuario de destio, el usuario de destino no es el mismo que envia, la cuenta que envia tiene suficiente dinero
  if (
    amount > 0 &&
    receiverUsername &&
    senderUsername !== receiverUsername &&
    balance >= amount
  ) {
    console.log("cumple las condiciones");
    const receiverAccount = receiverUsername;
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    senderUsername.movements.push({
      //date: new Date().toISOString().split("T")[0],
      date:
        now.toISOString().slice(0, 10) +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second,
      value: -amount,
    });
    receiverUsername.movements.push({
      date:
        now.toISOString().slice(0, 10) +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second,
      value: amount,
    });

    updateUI(currentAccount);

    console.log("Transferencia realizada");
  }
  inputTransferAmount.value = inputTransferTo.value = "";
});

//Prestamos
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("hola mundo");
  const amount = Number(inputLoanAmount.value);
  console.log("previo");
  console.log(amount);
  console.log(balance);
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  if (amount > 0) {
    console.log(currentAccount.movements);
    currentAccount.movements.push({
      date:
        now.toISOString().slice(0, 10) +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second,
      value: amount,
    });
    balance += amount;
    updateUI(currentAccount);
  }

  inputLoanAmount.value = "";
});

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  const movements = sort
    ? [...currentAccount.movements].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )
    : currentAccount.movements;
});

btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sort);
  sort = !sort;
});

// Cerrar cuenta.
function closeAccount() {
  const user = document.querySelector(".form--close .form__input--user").value;
  const pin = document.querySelector(".form--close .form__input--pin").value;

  if (
    accounts.find((acc) => acc.username === user && acc.pin === Number(pin))
  ) {
    if (confirm("¿Estás seguro de que deseas eliminar tu cuenta?")) {
      const index = accounts.findIndex(
        (acc) => acc.username === user && acc.pin === Number(pin)
      );
      const accountToDelete = accounts[index];
      console.log(accountToDelete); // verificar que se obtiene la cuenta correcta
      accounts.splice(index, 1);
      updateUI(currentAccount);
      document.querySelector(".logout-timer").style.display = "none";
      document.querySelector(".app").style.opacity = 0;
    }
  }
  document.querySelector(".form--close").reset();
}

const closeBtn = document.querySelector(".operation--close .form__btn--close");
closeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  closeAccount();
});

//Peticion AJAX
function updateData(data) {
  accounts = data.accounts;
  account1 = accounts[0];
  account2 = accounts[1];
  account3 = accounts[2];
  account4 = accounts[3];
  updateAllUI();
}

//Ejecutar el servidor con este comando-> http-server --cors='*' <-

fetch("http://localhost:8080/movements.js")
  .then((response) => response.text())
  .then((module) => {
    const movements = eval(module).getMovements(10);
    return movements;
  })
  .then((data) => {
    updateData({
      accounts: [account1, account2, account3, account4, data],
    });
  })
  .catch((error) => console.error(error));
