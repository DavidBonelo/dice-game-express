let playerCount = document.getElementById("players").childElementCount;

function addPlayer() {
    
    playerCount++;

    const divElem = document.createElement('div');
    divElem.className = 'form-group';

    const inputElem = document.createElement('input');
    inputElem.id = 'player' + (playerCount);
    inputElem.className = 'form-control'
    inputElem.setAttribute('name', 'players');
    inputElem.setAttribute('placeholder', 'player ' + (playerCount) + ' name');
    inputElem.setAttribute('type', 'text');
    inputElem.nodeName = 'player' + (playerCount);

    const labelElem = document.createElement('label');
    labelElem.setAttribute('for', 'player' + (playerCount));
    labelElem.innerHTML = 'Player ' + playerCount + ': ';

    divElem.appendChild(labelElem);
    divElem.appendChild(inputElem);

    document.getElementById("players").appendChild(divElem);

}
