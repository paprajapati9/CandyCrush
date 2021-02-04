document.addEventListener("DOMContentLoaded", ()=>{

    const dashboardContainer = document.querySelector(".pp-dashboard-container");
    const dashboard = document.querySelector(".pp-dashboard");
    const scoreboard = document.querySelector(".pp-scoreboard");
    const size = 8;
    const blocks = [];
    var score = 0;

    dashboardContainer.style.backgroundImage = 'url(https://miltontan.com/photography/wp-content/uploads/2013/01/portrait-bg.jpg)';

    const blockIcons = [
        'url(assets/icons/mango.png)',
        'url(assets/icons/pineapple.png)',
        'url(assets/icons/bell-pepper.png)',
        'url(assets/icons/watermelon.png)',
        'url(assets/icons/apple.png)',
        'url(assets/icons/blueberry.png)'
    ];
    
    function createBoard() {
        for (let i = 0; i < size*size; i++) {
            let block = document.createElement('div'),
                randomColor = Math.floor(Math.random() * blockIcons.length);
            block.style.backgroundImage = blockIcons[randomColor];
            block.setAttribute('draggable', true);
            block.setAttribute('id', `${i}`);
            block.className = 'pp-block pp-image-block';
            dashboard.appendChild(block);
            blocks.push(block);           
        }
    }

    createBoard();

    let colorDragged,
        colorReplaced,
        blockDragged,
        blockReplaced;

    /* events fired on the draggable target */
    blocks.forEach(block => {
        attachDragStartEvent(block);
        attachDragEndEvent(block);
        attachDragOverEvent(block);
        attachDragEnterEvent(block);
        attachDragLeaveEvent(block);
        attachDropEvent(block);
    });

    function attachDragStartEvent(block) {
        block.addEventListener("dragstart", function( e ) {
            colorDragged = this.style.backgroundImage;
            blockDragged = parseInt(this.id, 10);
            console.log(colorDragged, "color dragged");
            console.log(this.id, "dragstart");
        }, false);
    }

    function attachDragEndEvent(block) {
        block.addEventListener("dragend", function( e ) {
            //checking for valid drags
            let validDrags = [
                blockDragged - 1,
                blockDragged - size,
                blockDragged + 1,
                blockDragged + size
            ]
            let validMove = validDrags.includes(blockReplaced);
            if (blockReplaced && validMove) { 
                blockReplaced = null;
            } else if(blockReplaced && !validMove){
                blocks[blockDragged].style.backgroundImage = colorDragged;
                blocks[blockReplaced].style.backgroundImage = colorReplaced;
            } else blocks[blockDragged].style.backgroundImage = colorDragged;
            
            console.log(this.id, "dragend");
        }, false);
    }

    /* events fired on the drop targets */
    function attachDragOverEvent(block) {
        block.addEventListener("dragover", function( e ) {
            e.preventDefault();
            console.log(this.id, "dragover");
        }, false);
    }

    function attachDragEnterEvent(block) {
        block.addEventListener("dragenter", function( e ) {
            console.log(this.id, "dragenter");
        }, false);
    }

    function attachDragLeaveEvent(block) {
        block.addEventListener("dragleave", function( e ) {
            console.log(this.id, "dragleave");
        }, false);
    }

    function attachDropEvent(block) {
        block.addEventListener("drop", function( e ) {
            console.log(this.id, "drop");
            colorReplaced = this.style.backgroundImage;
            console.log(blockDragged, "dragged");
            this.style.backgroundImage = colorDragged;
            blocks[blockDragged].style.backgroundImage = colorReplaced;
            blockReplaced = parseInt(this.id, 10);
        }, false);
    }

    function checkMatchesForThree() {
        for (let i = 0; i < blocks.length; i++) {
            let matchRow = [i, i+1, i+2],
                matchColumn = [i, i+size, i+2*size],
                colorCheck = blocks[i].style.backgroundImage,
                skipRowCheck = 0,
                skipColumnCheck = 0;

            const isBlank = blocks[i].style.backgroundImage === '';
            const invalid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
            if(invalid.includes(i)) skipRowCheck = 1;
            if(i > 46) skipColumnCheck = 1;

            checkAndRemoveMatch(matchRow, colorCheck, isBlank, skipRowCheck, 3);
            
            checkAndRemoveMatch(matchColumn, colorCheck, isBlank, skipColumnCheck, 3);
        }
    }

    function checkMatchesForFour() {
        for (let i = 0; i < blocks.length; i++) {
            let matchRow = [i, i+1, i+2, i+3],
                matchColumn = [i, i+size, i+2*size, i+3*size],
                colorCheck = blocks[i].style.backgroundImage,
                skipRowCheck = 0,
                skipColumnCheck = 0;

            const isBlank = blocks[i].style.backgroundImage === '';
            const invalid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
            if(invalid.includes(i)) skipRowCheck = 1;
            if(i > 46) skipColumnCheck = 1;

            checkAndRemoveMatch(matchRow, colorCheck, isBlank, skipRowCheck, 4);
            
            checkAndRemoveMatch(matchColumn, colorCheck, isBlank, skipColumnCheck, 4);
        }
    }

    function checkAndRemoveMatch(matchArray, colorCheck, isBlank, skip, scoreIncrease) {
        if(skip) return;
        if(matchArray.every(index => blocks[index] && blocks[index].style.backgroundImage === colorCheck && !isBlank)){
            matchArray.forEach(element => {
                blocks[element].style.backgroundImage = '';
            });
            score += scoreIncrease;
            scoreboard.innerHTML = score;
        }  
    }

    function moveDown() {
        for (let i = 0; i < 55; i++) {
            if( blocks[i+size].style.backgroundImage == '' ){
                blocks[i+size].style.backgroundImage = blocks[i].style.backgroundImage;
                blocks[i].style.backgroundImage = '';
            }
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
            const isFirstRow = firstRow.includes(i);
            if(isFirstRow && blocks[i].style.backgroundImage == ''){
                randomColor = Math.floor(Math.random() * blockIcons.length);
                blocks[i].style.backgroundImage = blockIcons[randomColor];
            }
        }
    }

    window.setInterval(function () {
        moveDown();
        checkMatchesForFour();
        checkMatchesForThree();
    }, 100)
});