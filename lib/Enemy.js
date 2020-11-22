const Potion = require('./Potion');
const Character = requrie('./Character');

class Enemy extends Character {
    constructor(name = '')
    super(); 
    
    this.weapon = weapon;
    this.potion = new Potion();

   
};

Enemy.prototype = Object.create(Character.prototype);

Enemy.prototype.getDescription = function() {
    return `A ${this.name} holding a ${this.weapon} has appeared!`;
};

module.exports = Enemy;