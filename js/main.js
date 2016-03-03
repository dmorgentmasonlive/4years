window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    var x1;
    var x2;
    var cursors;
    var question;
    var answer;
    var style;
    var style2;
    var timer;
    var timer2;
    var timer3;
    var timer4;
    var stage = 1;
    
    var enemy1;
    var player;
    var aim;
    var shield;
    
    var gameStart = 0;
    
    var music1;
    var music2;
    var hit;
    var dmg;
    var incorrect;
    
    var StageText;
    var ShieldText;
    var StartText;
    
    var targetted;
    var enemyTarget = false;
    var wrong = false;
    
    var space;
    var bgtile;
    
    function preload() {
        game.load.spritesheet("enemy1", "assets/enemy1.png", 64,64);
        game.load.image("player", "assets/player.png");
        game.load.image("aim", "assets/aim.png");
        game.load.spritesheet("shield", "assets/shield.png", 32, 32);
        game.load.spritesheet("enemy2", "assets/enemy2.png", 64, 64);
        game.load.audio("stage1", "assets/Stage1.mp3");
        game.load.audio("boss", "assets/Boss.mp3");
        game.load.audio("hit", "assets/hit.mp3");
        game.load.audio("wrong", "assets/Buzz.mp3");
        game.load.audio("dmg", "assets/Warning.mp3");
        game.load.spritesheet("boss", "assets/boss.png", 64,64);
        game.load.image("space", "assets/space.png");
    }
    
    function create() { 
           music1 = game.add.audio("stage1");
         music2 = game.add.audio("boss");
         hit = game.add.audio("hit");
         dmg = game.add.audio("dmg");
         incorrect = game.add.audio("wrong");
        //game.input.mouse.capture = true;
        // game.events.onInputDown.add(listener, this);
         game.physics.startSystem(Phaser.Physics.ARCADE);
        
         space = game.add.sprite(0,0, 'space');
         bgtile = game.add.tileSprite(0, 0, game.cache.getImage('space').width, game.cache.getImage('space').height, 'space');

         
         player = game.add.sprite(400, 550, 'player');
         game.physics.arcade.enable(player);
         aim = game.add.sprite(0, 0, 'aim');
         shield = game.add.sprite(0, 0, 'shield');
         
         this.game.canvas.style.cursor = "none";
        
         enemy1 = game.add.group();
         enemy1.enableBody = true;
         //var testEnemy = game.add.sprite(0,0, "enemy1");
        
         //var testEnemy2 = game.add.sprite(300, 300, "enemy1");
         //testEnemy.inputEnabled = true;
         //testEnemy.events.onInputDown.add(listener, this);
         //testEnemy.animations.add('die', [0,1,2,3,4,5,6,7,8,9,10,11]);
         //testEnemy2.inputEnabled = true;
         //testEnemy2.events.onInputDown.add(listener, this);
        
         timer = game.time.create(false);
         timer.loop(1000, timerLoop, this);
         timer.start();
         timer.pause();
        
         timer2 = game.time.create(false);
         timer2.loop(3000, enemySpawn, this);
        
        timer3 = game.time.create(false);
        timer3.loop(Phaser.Timer.SECOND * 60, changeStage, this);
        
        timer4 = game.time.create(false);
        timer4.loop(Phaser.Timer.SECOND * (60 + 34), changeStage2, this);

         //x1 = game.rnd.integerInRange(0,10);
         //x2 = game.rnd.integerInRange(0,10);
         //while(x1 + x2 > 9)
         //{
        //    x1 = game.rnd.integerInRange(0,10);
        //    x2 = game.rnd.integerInRange(0,10);
         //}
         game.stage.backgroundColor = '#454645';
         style = { font: "32px Arial", fill: "#ff0044", align: "center" };
         style2 = { font: "14px Arial", fill: "#ff0044", align: "center" };
         question = game.add.text(700, 450,'', style);
         answer = game.add.text(700, 490, '', style);
         ShieldText = game.add.text(0, 25, 'Shield', style2);
         StageText = game.add.text(650, 0, 'Stage: 1 \n Asteroid Belt', style2);
         StartText = game.add.text(325, 300, 'Click To Start', style);
         
         //add keys
         cursors = {one: game.input.keyboard.addKey(Phaser.Keyboard.ONE), two: game.input.keyboard.addKey(Phaser.Keyboard.TWO), three: game.input.keyboard.addKey(Phaser.Keyboard.THREE), four: game.input.keyboard.addKey(Phaser.Keyboard.FOUR), five: game.input.keyboard.addKey(Phaser.Keyboard.FIVE), six: game.input.keyboard.addKey(Phaser.Keyboard.SIX), seven: game.input.keyboard.addKey(Phaser.Keyboard.SEVEN), eight: game.input.keyboard.addKey(Phaser.Keyboard.EIGHT), nine: game.input.keyboard.addKey(Phaser.Keyboard.NINE), zero: game.input.keyboard.addKey(Phaser.Keyboard.ZERO)};
    }
    
    function update() 
    {
        if(gameStart == 0)
        {
            game.input.onDown.add(startGame, this);
        }
        if(gameStart == 1)
        {
            timer3.start();
            bgtile.tilePosition.y += 1;
            aim.x = game.input.mousePointer.x;
            aim.y = game.input.mousePointer.y;
            game.world.bringToTop(aim);
            game.world.bringToTop(shield);
            if(enemyTarget == false)
            {
                //answer.text = '';
                question.text = '';
            }
            if (stage == 1)
            {
                timer2.start();
                enemy1.addAll('angle', 10);
            }
            //stage = 2;
            if(cursors.four.isDown && enemyTarget == true && wrong == false)
            {
                //answer.text = '';
                //answer.text = '4';
                if(x1 + x2 == 4)
                {
                    //answer.text = '4';
                    //game.add.text(32, 170, 'You Win!');
                    //targetted.kill();
                    enemyTarget = false;
                    game.physics.arcade.moveToObject(targetted, player, 0);
                    targetted.animations.play('die', 10, false, true);
                    hit.play();
                }
                else
                {
                    incorrect.play();
                    timer.resume();
                    wrong = true;
                }
            }
            else if(cursors.one.isDown && enemyTarget == true && wrong == false)
            {
                //answer.text = '';
                //answer.text = '1';
                if(x1 + x2 == 1)
                {
                    //answer.text = '1';
                    //game.add.text(32, 170, 'You Win!');
                    //targetted.kill();
                    enemyTarget = false;
                    game.physics.arcade.moveToObject(targetted, player, 0);
                    targetted.animations.play('die', 10, false, true);
                    hit.play();
                }
                else
                {
                    timer.resume();
                    wrong = true;
                    incorrect.play();
                }
            }
            else if(cursors.two.isDown && enemyTarget == true && wrong == false)
            {
                //answer.text = '';
                //answer.text = '1';
                if(x1 + x2 == 2)
                {
                    //answer.text = '2';
                    //game.add.text(32, 170, 'You Win!');
                    //targetted.kill();
                    enemyTarget = false;
                    game.physics.arcade.moveToObject(targetted, player, 0);
                    targetted.animations.play('die', 10, false, true);
                    hit.play();
                }
                else
                {
                    timer.resume();
                    wrong = true;
                    incorrect.play();
                }
            }
            else if(cursors.three.isDown && enemyTarget == true && wrong == false)
            {
                //answer.text = '';
                //answer.text = '1';
                if(x1 + x2 == 3)
                {
                    //answer.text = '3';
                    //game.add.text(32, 170, 'You Win!');
                    //targetted.kill();
                    enemyTarget = false;
                    game.physics.arcade.moveToObject(targetted, player, 0);
                    targetted.animations.play('die', 10, false, true);
                    hit.play();
                }
                else
                {
                    timer.resume();
                    wrong = true;
                    incorrect.play();
                }
            }
            else if(cursors.five.isDown && enemyTarget == true && wrong == false)
            {
                //answer.text = '';
                //answer.text = '1';
                if(x1 + x2 == 5)
                {
                    //answer.text = '3';
                    //game.add.text(32, 170, 'You Win!');
                    //targetted.kill();
                    enemyTarget = false;
                    game.physics.arcade.moveToObject(targetted, player, 0);
                    targetted.animations.play('die', 10, false, true);
                    hit.play();
                }
                else
                {
                    timer.resume();
                    wrong = true;
                    incorrect.play();
                }
            }
            else if(cursors.six.isDown && enemyTarget == true && wrong == false)
            {
                //answer.text = '';
                //answer.text = '1';
                if(x1 + x2 == 6)
                {
                    //answer.text = '3';
                    //game.add.text(32, 170, 'You Win!');
                    //targetted.kill();
                    enemyTarget = false;
                    game.physics.arcade.moveToObject(targetted, player, 0);
                    targetted.animations.play('die', 10, false, true);
                    hit.play();
                }
                else
                {
                    timer.resume();
                    wrong = true;
                    incorrect.play();
                }
            }
            else if(cursors.seven.isDown && enemyTarget == true && wrong == false)
            {
                //answer.text = '';
                //answer.text = '1';
                if(x1 + x2 == 7)
                {
                    //answer.text = '3';
                    //game.add.text(32, 170, 'You Win!');
                    //targetted.kill();
                    enemyTarget = false;
                    game.physics.arcade.moveToObject(targetted, player, 0);
                    targetted.animations.play('die', 10, false, true);
                    hit.play();
                }
                else
                {
                    timer.resume();
                    wrong = true;
                    incorrect.play();
                }
            }
            else if(cursors.eight.isDown && enemyTarget == true && wrong == false)
            {
                //answer.text = '';
                //answer.text = '1';
                if(x1 + x2 == 8)
                {
                    //answer.text = '3';
                    //game.add.text(32, 170, 'You Win!');
                    //targetted.kill();
                    enemyTarget = false;
                    game.physics.arcade.moveToObject(targetted, player, 0);
                    targetted.animations.play('die', 10, false, true);
                    hit.play();
                }
                else
                {
                    timer.resume();
                    wrong = true;
                    incorrect.play();
                }
            }
            else if(cursors.nine.isDown && enemyTarget == true && wrong == false)
            {
                //answer.text = '';
                //answer.text = '1';
                if(x1 + x2 == 9)
                {
                    //answer.text = '3';
                    //game.add.text(32, 170, 'You Win!');
                    //targetted.kill();
                    enemyTarget = false;
                    game.physics.arcade.moveToObject(targetted, player, 0);
                    targetted.animations.play('die', 10, false, true);
                    hit.play();
                }
                else
                {
                    timer.resume();
                    wrong = true;
                    incorrect.play();
                }
            }
            else if(cursors.zero.isDown && enemyTarget == true && wrong == false)
            {
                //answer.text = '';
                //answer.text = '1';
                if(x1 + x2 == 0)
                {
                    //answer.text = '3';
                    //game.add.text(32, 170, 'You Win!');
                    //targetted.kill();
                    enemyTarget = false;
                    game.physics.arcade.moveToObject(targetted, player, 0);
                    targetted.animations.play('die', 10, false, true);
                    hit.play();
                }
                else
                {
                    timer.resume();
                    wrong = true;
                    incorrect.play();
                }
            }
            game.physics.arcade.overlap(player, enemy1, loseShield, null, this)
        }
    }
    
    function timerLoop()
    {
        if(enemyTarget == true)
        {
        x1 = game.rnd.integerInRange(0,10);
        x2 = game.rnd.integerInRange(0,10);
        while(x1 + x2 > 9)
        {
         x1 = game.rnd.integerInRange(0,10);
         x2 = game.rnd.integerInRange(0,10);
        }
        question.text = x1 + '\n+' + x2;
        wrong = false;
        timer.pause();
        }
    }
    
    function listener(sprite, pointer)
    {
        if(targetted != sprite)
        {
        targetted = sprite;
        enemyTarget = true;
        x1 = game.rnd.integerInRange(0,10);
        x2 = game.rnd.integerInRange(0,10);
        while(x1 + x2 > 9)
        {
         x1 = game.rnd.integerInRange(0,10);
         x2 = game.rnd.integerInRange(0,10);
        }
        question.text = x1 + '\n+' + x2;
        //timer.pause();
        }
    }
    
    function enemySpawn()
    {
        if(stage == 1)
        {
            var posX = game.rnd.integerInRange(0,740);
            var spawn = game.add.sprite(posX, 0, 'enemy1');
            spawn.inputEnabled = true;
            spawn.events.onInputDown.add(listener, this);
            spawn.enableBody = true;
            spawn.animations.add('die', [0,1,2,3,4,5,6,7,8,9,10,11]);
            spawn.anchor.setTo(0.5, 0.5);
            enemy1.add(spawn);
            game.physics.arcade.moveToObject(spawn, player, 100);
        }
        if(stage == 2)
        {
            var posX = game.rnd.integerInRange(0,740);
            var posY = game.rnd.integerInRange(0,400);
            var spawn = game.add.sprite(posX, posY, 'enemy2');
            spawn.inputEnabled = true;
            spawn.events.onInputDown.add(listener, this);
            spawn.animations.add('die', [0,1,2,3,4,5,6,7,8,9,10]);
            spawn.animations.add('attack', [0,11,12,13,14,15,16,17,18]);
            enemy1.add(spawn);
            spawn.animations.play('attack',3, false, true);
            spawn.animations.currentAnim.onComplete.add(loseShield2, this);
        }
        if(stage == 3)
        {
            var spawn = game.add.sprite(400, 0, 'boss');
            spawn.inputEnabled = true;
            spawn.events.onInputDown.add(listener, this);
            spawn.animations.add('attack', [0,1,2,3,4,5,6,7,8,9]);
            spawn.animations.add('die', [0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
            enemy1.add(spawn);
            spawn.animations.play('attack',3, false, true);
            spawn.animations.currentAnim.onComplete.add(loseShield2, this);
        }
    }
    
    function loseShield(player, enemy1)
    {
        enemy1.kill();
        dmg.play();
        if(shield.frame == 0)
        {
            shield.frame = 1;
        }
        else if(shield.frame == 1)
        {
            shield.frame = 2;
        }
        else if(shield.frame == 2)
        {
            shield.frame = 3;
        }
        else if(shield.frame == 3)
        {
            shield.frame = 4;
        }
        else if(shield.frame == 4)
        {
            player.kill();
            aim.kill();
            timer2.stop();
            timer3.stop();
            timer4.stop();
            StartText.text = 'Game Over';
            music1.loop = true;
        }
    }
    
    function loseShield2(spawn)
    {
        spawn.kill();
        dmg.play();
        if(stage == 3)
        {
           player.kill();
           aim.kill();
           timer2.stop(); 
           shield.frame = 4;
           StartText.text = 'Game Over';
        }
        else if(shield.frame == 0)
        {
            shield.frame = 1;
        }
        else if(shield.frame == 1)
        {
            shield.frame = 2;
        }
        else if(shield.frame == 2)
        {
            shield.frame = 3;
        }
        else if(shield.frame == 3)
        {
            shield.frame = 4;
        }
        else if(shield.frame == 4)
        {
            player.kill();
            aim.kill();
            timer2.stop();
            timer4.stop();
            question.text = '';
            StartText.text = 'Game Over';
        }
    }
    
    function startGame(){
       if(gameStart == 0)
        {
        gameStart = 1;
        music1.play();
        StartText.text = '';
       }
    }
    
    function changeStage(){
        if(stage == 1)
        {
            stage = 2;
            StageText.text = 'Stage: 2 \n Engage the Enemy';
            timer3.stop();
            timer4.start();
        }
    }
    
     function changeStage2(){
        if(stage == 2)
        {
            stage = 3;
            StageText.text = 'Stage: 3 \n That\'s No Moon!';
            timer4.stop();
            music2.play();
        }
    }
    
};
