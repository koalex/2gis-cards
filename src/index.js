/*** ✰✰✰ Konstantin Aleksandrov ✰✰✰ https://github.com/koalex ✰✰✰ ***/

 /* 
   ================================
   ===       CARDS MODULE      ====
   ================================ 
*/

import './reset.less';
import './index.styl';
import cards from './fixtures/cards.js';

'use strict';

class Cards {
    constructor (cardsContainer) {
        this.keyboardMap     = {}; // shift = 16, alt = 18
        this.cardsContainer  = cardsContainer;
        const cardsFragment  = document.createDocumentFragment();

        window.addEventListener('keydown', this.keyboradHandler);
        window.addEventListener('keyup',   this.keyboradHandler);

        cards.forEach((card, index) => { cardsFragment.appendChild(this.cardCreator(card.type, index + 1)); });
        cardsContainer.appendChild(cardsFragment);
    }

    cardCreator (cardType = 'wide', cardNum = 1) {
        let newCardNum              = document.createElement('div');
            newCardNum.className    = 'cards-item__number';
            newCardNum.textContent  = cardNum;
        let newCard                 = document.createElement('div');
            newCard.className       = 'cards-item';
        setTimeout((card, cardType) => { card.className += ' cards-item_' + cardType; }, 0, newCard, cardType);
        newCard.appendChild(newCardNum);
        newCard.addEventListener('click', this.cardClickHandler);

        return newCard;
    }

    cardClickHandler = () => {
        if (!this.keyboardMap[16] && !this.keyboardMap[18]) {
            let card = this.cardsContainer.lastElementChild;
            card.removeEventListener('click', this.cardClickHandler);
            card.classList.add('will-deleted');
            setTimeout(function (card) { this.cardsContainer.removeChild(card); }.bind(this), 200, card); // for animation
            return;
        }

        if (this.keyboardMap[16] && !this.keyboardMap[18]) {
            this.cardsContainer.appendChild(this.cardCreator('narrow', document.getElementsByClassName('cards-item').length+1));
            return;
        }

        if (this.keyboardMap[16] && this.keyboardMap[18]) {
            this.cardsContainer.appendChild(this.cardCreator('wide', document.getElementsByClassName('cards-item').length+1));
        }
    };

    keyboradHandler = (e) => {
        e = e || event;
        this.keyboardMap[e.keyCode] = e.type == 'keydown';
    }
}

new Cards(document.getElementById('cards'));

