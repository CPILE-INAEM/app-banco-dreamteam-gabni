//Crear movimientos (faker.js)

function generateMovements(numMovements) {
  const movements = [];

  for (let i = 0; i < numMovements; i++) {
    const date = faker.date.past().toISOString().slice(0, 10);
    const value = parseFloat(faker.finance.amount(-5000, 5000, 2));
    movements.push({ date, value });
  }

  return movements;
}

console.log("movimientos aleatorios ini");
const newMovements = generateMovements(10); // Generar 10 movimientos aleatorios
console.log(newMovements);
console.log("movimientos aleatorios fin");

function updateAllUI() {
  for (let account of accounts) {
    updateUI(account);
  }
}

const accountsToUpdate = [account1, account2, account3, account4];

for (let account of accountsToUpdate) {
  account.movements = [...account.movements, ...newMovements]; // Agregar nuevos movimientos a la cuenta existente
}

updateAllUI(); // Actualizar la interfaz de usuario para todas las cuentas
