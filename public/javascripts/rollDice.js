function rollDice(playerId) {
    const inputElem = document.getElementById(playerId);
    inputElem.value = Math.floor(Math.random() * 6) + 1;
}