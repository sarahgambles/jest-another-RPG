const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');

function Game() {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
}

Game.prototype.initializeGame = function() {
    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'baseball bat'));
    this.enemies.push(new Enemy('skeleton', 'axe'));

    this.currentEnemy = this.enemies[0];

    inquirer.prompt({
        type: 'text', 
        name: 'name', 
        message: 'What is your name?'
    })
    // destructure name from the prompt object
    .then(({ name }) => {
        this.player = new Player(name);

        // test the object creation
        this.startNewBattle();
    });
};

Game.prototype.startNewBattle = function() {
    if (this.player.agility > this.currentEnemy.agility) {
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    }

    console.log('Your stats are as follows:');
    console.table(this.player.getStats());

    console.log(this.currentEnemy.getDescription());
    
    startNewBattle();
};

Game.prototype.battle = function() {
    if (this.isPlayerTurn) {
        inquirer
        .prompt({
            type: 'list', 
            message: 'What would you like to do?',
            name: 'action',
            choices: ['Attack', 'Use potion']
        })
        .then(({ action }) => {
            if (action === 'Use potion') {
                if (!this.player.getInventory()) {
                    console.log("You don't have any potions!");
                    return;
                }
                inquirer
                .prompt({
                    type: 'list', 
                    message: 'Which potion would you like to use?',
                    name: 'action', 
                    choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                });
            } else {
                const damage = this.player.getAttackValue();
                this.currentEnemy.reduceHealth(damage);

                console.log(`You attacked the ${this.currentEnemy.name}`);
                console.log(this.currentEnemy.getHealth());
            }
            
        });
        // player prompts will go here
    } else {
        const damage = this.currentEnemy.getAttackValue();
        this.player.reduceHealth(damage);

        console.log(`You were attacked by the ${this.currentEnemy.name}`);
        console.log(this.player.getHealth());
    }
};

Game.prototype.checkEndOfBattle = function() {
    if (this.isPlayerTurn) {
        inquirer
        .prompt()
        .then(({ action }) => {
            if (!this.player.getInventory()) {
                // after player sees their empty inventory...
                return this.checkEndOfBattle();
            }

            inquirer 
            .prompt()
            .then(({ action }) => {
                // after player uses a potion...

                this.checkEndOfBattle();
            });
        } else {
            // after enemy attacks....
            this.checkEndOfBattle();
        }
    )};


module.exports = Game;