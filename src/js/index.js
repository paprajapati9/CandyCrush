document.addEventListener("DOMContentLoaded", ()=>{

    const dashboard = document.querySelector(".pp-dashboard");
    const size = 8;
    const blocks = [];

    const blockColors = [
        'red',
        'orange',
        'yellow',
        'purple',
        'green',
        'blue'
    ];
    
    function createBoard() {
        for (let i = 0; i < size*size; i++) {
            let block = document.createElement('div'),
                randomColor = Math.floor(Math.random() * blockColors.length);
            block.style.background = blockColors[randomColor];
            block.setAttribute('draggable', true);
            block.setAttribute('id', `${i}`);
            block.className = 'pp-block';
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
            colorDragged = this.style.background;
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
                blocks[blockDragged].style.background = colorDragged;
                blocks[blockReplaced].style.background = colorReplaced;
            } else blocks[blockDragged].style.background = colorDragged;
            
            checkMatchesForThree();
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
            colorReplaced = this.style.background;
            console.log(blockDragged, "dragged");
            this.style.background = colorDragged;
            blocks[blockDragged].style.background = colorReplaced;
            blockReplaced = parseInt(this.id, 10);
        }, false);
    }

    function checkMatchesForThree() {
        for (let i = 0; i < blocks.length; i++) {
            let matchRow = [i, i+1, i+2],
                matchColumn = [i, i+size, i+2*size],
                colorCheck = blocks[i].style.background,
                skipRowCheck = 0,
                skipColumnCheck = 0;

            const isBlank = blocks[i].style.background === '';
            const invalid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
            if(invalid.includes(i)) skipRowCheck = 1;
            if(i > 46) skipColumnCheck = 1;

            if(!skipRowCheck){
                if(matchRow.every(index => blocks[index] && blocks[index].style.background === colorCheck && !isBlank)){
                    matchRow.forEach(element => {
                        blocks[element].style.background = '';
                    });
                } 
            }  
            
            if(!skipColumnCheck){
                if(matchColumn.every(index => blocks[index] && blocks[index].style.background === colorCheck && !isBlank)){
                    matchColumn.forEach(element => {
                        blocks[element].style.background = '';
                    });
                }  
            }
        }
    }

    checkMatchesForThree();
});