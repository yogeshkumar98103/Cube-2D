let cubeSize = 3;
let colors = ["white", "red", "yellow", "orange", "green", "blue"];
let colorsIndex = {white : 0, red : 1, yellow : 2, orange : 3, green: 4, blue : 5};
var centreColors = colors;
var globalMoveList = [];
// For a given position in array representation of cube, this gives the corresponding location of div on canvas
var position = [[0,0],[0,1],[0,2],[1,2],[2,2],[2,1],[2,0],[1,0]];
let cube = createCubeMatrix();
var displayCube = document.getElementById("cube");
create2DCube();

function createCubeMatrix(){
    var matrix = []
    for(let i = 0; i < 6; i++){
        var side = [];
        for(let j = 0; j < 8; j++){
            side.push(i);
        }
        matrix.push(side);
    }
    return matrix;
} 

function create2DCube(){
    var cube = document.getElementById("cube");
    let pieceWidth = 40;
    let sideSize = (pieceWidth + 5) * cubeSize + 10;
    let top = 40;

    for(color of colors){
        var newSide = document.createElement('div');
        for(let k = 0; k < cubeSize; k++){
            var newLevel = document.createElement('div');
            for(let i = 0; i < cubeSize; i++){
                var newPiece = document.createElement('div');
                newPiece.setAttribute('class', 'piece');
                newPiece.style.backgroundColor = color;
                newLevel.appendChild(newPiece);
            }
            newLevel.setAttribute('class', 'level');
            newSide.appendChild(newLevel);
        };
        newSide.setAttribute('class', 'side');
        if(color == 'green'){
            newSide.style.top = sideSize + 40;
            newSide.style.transform = "translate(-150%,0%)"  
        }
        else if(color == 'blue'){
            newSide.style.top = sideSize + 40;
            newSide.style.transform = "translate(50%,0%)" 
        }
        else{
            newSide.style.top = top;
            top += sideSize;
        }
        cube.appendChild(newSide);
    }   
}

// This functions return the index of piece to be turned corresponding to a given move
function orderOfIndices(moveType){
    switch(moveType){
        case 'R' : return [[0,[2,3,4]], [1,[2,3,4]], [2,[2,3,4]], [3,[2,3,4]], 5];
        case 'L' : return [[0,[0,7,6]], [3,[0,7,6]], [2,[0,7,6]], [1,[0,7,6]], 4];
        case 'F' : return [[0,[4,5,6]], [4,[2,3,4]], [2,[0,1,2]], [5,[6,7,0]], 1];
        case 'U' : return [[1,[0,1,2]], [5,[0,1,2]], [3,[4,5,6]], [4,[0,1,2]], 0];
        case 'D' : return [[1,[6,5,4]], [4,[6,5,4]], [3,[2,1,0]], [5,[6,5,4]], 2];
        case 'B' : return [[0,[0,1,2]], [5,[2,3,4]], [2,[4,5,6]], [4,[6,7,0]], 3];
    }
}

// This function Moves cube on screen
function changeColor(side, index){
    // Move cube on screen
    let x = position[index][0];
    let y = position[index][1];
    let piece = displayCube.children[side].children[x].children[y];
    piece.style.backgroundColor = colors[cube[side][index]];
}

// This function is used for counterclockwise moves
function swapOrder(order){
    let start = 0;
    let end = 3;
    let temp = [];

    while(start < end){
        temp = order[start];
        order[start] = order[end];
        order[end] = temp;
        start++;
        end--;
    }
}

// This function performs a valid move on Cube
function move(moveType, clockWise = true, moveOnCanvas = false){
    let order = orderOfIndices(moveType);
    if(!clockWise){
        swapOrder(order);
    }

    // Rotate 4 Sides
    let temp = [];
    let side = order[0][0];
    for(let index of order[0][1]){
        temp.push(cube[side][index]);
    }

    for(let i = 0; i<3; i++){
        let side1 = order[i][0];
        let side2 = order[i+1][0];
        for(let j = 0; j < 3; j++){
            let pieceIndex1 = order[i][1][j];
            let pieceIndex2 = order[i+1][1][j];
            cube[side1][pieceIndex1] = cube[side2][pieceIndex2];

            // Move cube on screen
            if(moveOnCanvas){
                changeColor(side1, pieceIndex1);
            } 
        }
    }

    side = order[3][0];
    for(let i = 0; i < temp.length; i++){
        cube[side][order[3][1][i]] = temp[i];

        // Move cube on screen
        if(moveOnCanvas){
            changeColor(side, order[3][1][i])
        }
    }

    // Rotate Main Side
    rotateMainSide(order[4], clockWise, moveOnCanvas);
}

function rotateMainSide(sideIndex, clockWise, moveOnCanvas = false){
    temp = [];
    mainSide = cube[sideIndex];

    if(clockWise){
        temp.push(mainSide[6]);
        temp.push(mainSide[7]); 

        for(let index = 7; index >= 2; index--){
            mainSide[index] = mainSide[index-2];
        }

        mainSide[0] = temp[0];
        mainSide[1] = temp[1];
    }

    else{
        temp.push(mainSide[0]);
        temp.push(mainSide[1]); 

        for(let index = 0; index < 6; index++){
            mainSide[index] = mainSide[index+2];
        }

        mainSide[6] = temp[0];
        mainSide[7] = temp[1];
    }
    
    if(moveOnCanvas){
        // Move Cube on screen
        for(let i = 0; i < 8; i++){
            changeColor(sideIndex, i);
        }
    }
}

function rotateCube(direction){
    let newIndices = [];
    globalMoveList.push(direction);

    console.log(direction);
    switch(direction){
        case 'left'  :  newIndices = [0,4,2,5,3,1];
                        rotateMainSide(0,false);
                        rotateMainSide(2,true);
                        rotateMainSide(3,true);
                        rotateMainSide(3,true);
                        rotateMainSide(5,false);
                        rotateMainSide(5,false);
                        break;

        case 'right' :  newIndices = [0,5,2,4,1,3];      
                        rotateMainSide(0,true);
                        rotateMainSide(2,false);
                        rotateMainSide(3,false);
                        rotateMainSide(3,false);
                        rotateMainSide(4,false);
                        rotateMainSide(4,false);
                        break;

        case 'up'    :  newIndices = [3,0,1,2,4,5]; 
                        rotateMainSide(5,false);
                        rotateMainSide(4,true);     
                        break;

        case 'down'  :  newIndices = [1,2,3,0,4,5];
                        rotateMainSide(4,false);
                        rotateMainSide(5,true);      
                        break;
        
        case 'z-clockwise' : 
                        newIndices = [4,1,5,3,2,0];
                        rotateMainSide(0,false);
                        rotateMainSide(1,true);
                        rotateMainSide(2,false);
                        rotateMainSide(3,true);
                        rotateMainSide(4,false);
                        rotateMainSide(5,false);    
                        break;

        case 'z-counterclockwise' : 
                        newIndices = [5,1,4,3,0,2];
                        rotateMainSide(0,true);
                        rotateMainSide(1,false);
                        rotateMainSide(2,true);
                        rotateMainSide(3,false);
                        rotateMainSide(4,true);
                        rotateMainSide(5,true);      
                        break;
    }

    newCube = [];
    newCentreColors = []
    for(let i = 0; i<6; i++){
        newCube[i] = cube[newIndices[i]];
        newCentreColors[i] = centreColors[newIndices[i]];
    }
    cube = newCube;
    centreColors = newCentreColors;

}

function moveCombination(moves){
    for(let m of moves){
        globalMoveList.push(m);
        if(m.length == 2){ move(m[0], false);}
        else{move(m)};
    }
}

// This functions scrambles Cube
let scrambledCube = [[0],[0],[0],[0],[0],[0],];
function scramble(){
    let num = 0, index;
    let validMoves = ["R","L","F","B","U","D"];
    let list = [];
    for(let i = 0; i < 20; i++){
        num = Math.random()*6;
        index = Math.floor(num);
        if((num-index) > 0.5){
            list.push(validMoves[index]);
        }else{
            list.push(validMoves[index] + 'i');
        }  
    }
    finalizeMoves(list, true);
}

// This functions brings the cube to initial (solved) state
function reset(){
    cube = createCubeMatrix();
    for(let i = 0; i<6; i++){
        for(let j = 0; j<8; j++){
            changeColor(i,j);
        }
    }
    globalMoveList = [];
}

var edges = [[[1,1],[0,5]], [[1,3],[5,7]], [[1,5],[2,1]], [[1,7],[4,3]],
             [[0,1],[3,5]], [[0,3],[5,1]], [[0,7],[4,1]], [[2,3],[5,5]],
             [[2,5],[3,1]], [[2,7],[4,5]], [[3,3],[5,3]], [[3,7],[4,7]]];

var corners = [ [[1,0],[0,6],[4,2]], [[1,2],[0,4],[5,0]], [[1,4],[2,2],[5,6]], 
                [[1,6],[2,0],[4,4]], [[3,0],[2,6],[4,6]], [[3,2],[2,4],[5,4]], 
                [[3,4],[0,2],[5,2]], [[3,6],[0,0],[4,0]]];

function findEdge(color1, color2){
    let c1,c2;
    let side, piece;
    color1 = colorsIndex[color1];
    color2 = colorsIndex[color2];
    let end = edges.length;
    if(color1 === 'red'){
        end = 4;
    }
    for(let i = 0; i<end; i++){
        side = edges[i][0][0];
        piece = edges[i][0][1];
        c1 = cube[side][piece];

        side = edges[i][1][0];
        piece = edges[i][1][1];
        c2 = cube[side][piece];

        // Edge Found
        if(c1 === color1 && c2 === color2){
            return edges[i];
        }
        else if(c1 === color2 && c2 === color1){
            return [edges[i][1], edges[i][0]];
        }
    } 
}

function findCorner(color1, color2, color3){
    let c1,c2,c3;
    let start = 0, end = 8;
    let side, piece;
    color1 = colorsIndex[color1];
    color2 = colorsIndex[color2];
    color3 = colorsIndex[color3];

    if(color1=== 'red'){
        end = 4;
    }

    for(let i = start; i < end; i++){
        side = corners[i][0][0];
        piece = corners[i][0][1];
        c1 = cube[side][piece];

        side = corners[i][1][0];
        piece = corners[i][1][1];
        c2 = cube[side][piece];

        side = corners[i][2][0];
        piece = corners[i][2][1];
        c3 = cube[side][piece];

        // Corner Found
        if(c1 === color1 && c2 === color2 && c3 === color3){
            return corners[i];
        }
        else if(c1 === color1 && c3 === color2 && c2 === color3){
            return [corners[i][0], corners[i][2], corners[i][1]];
        }
        else if(c2 === color1 && c1 === color2 && c3 === color3){
            return [corners[i][1], corners[i][0], corners[i][2]];
        }
        else if(c2 === color1 && c3 === color2 && c1 === color3){
            return [corners[i][1], corners[i][2], corners[i][0]];
        }
        else if(c3 === color1 && c1 === color2 && c2 === color3){
            return [corners[i][2], corners[i][0], corners[i][1]];
        }
        else if(c3 === color1 && c2 === color2 && c1 === color3){
            return [corners[i][2], corners[i][1], corners[i][0]];
        }
    }
}

// SOLVE CUBE
function solveCube(){
    globalMoveList = [];

    // Layer 1
    layer1Cross();
    layer1Corners();

    // Layer 2
    layer2Edges();

    // Layer 3
    layer3Cross();
    layer3Corners();
    layer3AllignCorners();
    layer3AllignEdges();

    // Perform Moves;
    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 8; j++){
            cube[i][j] = scrambledCube[i][j];
        }
    }
    finalizeMoves(globalMoveList.slice(0));
    globalMoveList = [];
}

// First Layer
function layer1(){
    layer1Cross();
    layer1Corners();
}

function layer1Cross(){
    let edge = findEdge('orange','white');
    
    let color1 = colors[edge[0][0]];
    let piece1 = edge[0][1];
    let color2 = colors[edge[1][0]];
    let piece2 = edge[1][1];

    // First Edge
    if(color1 === 'orange'){
        switch(piece1){
            case 1 : moveCombination(['B','B']);        break;
            case 3 : moveCombination(['B']);            break;
            case 7 : moveCombination(['Bi']);           break;
        }
    }
    else if(color2 === 'orange'){
        switch(piece2){
            case 1 : moveCombination(['Di','Ri','B']);   break;
            case 3 : moveCombination(['Ri','Ui']);       break;
            case 5 : moveCombination(['U','R','B']);    break;
            case 7 : moveCombination(['L','U']);         break;
        }
    }
    else if(color1 === 'red'){
        switch(piece1){
            case 3 : moveCombination(['Fi']);            break;
            case 5 : moveCombination(['F','F']);         break;
            case 7 : moveCombination(['F']);             break;
        }

        moveCombination(['U','U']);
    }
    else if(color2 === 'red'){
        switch(piece2){
            case 1 : moveCombination(['F']);        break;
            case 5 : moveCombination(['Fi']);       break;
            case 7 : moveCombination(['F','F']);    break;
        }
        moveCombination(['R','Ui']); 
    }

    else if(color1 === 'yellow' && color2 === 'blue'){
        moveCombination(['Ri','B'])
    }
    else if( color1 === 'blue' && color2 === 'yellow'){
        moveCombination(['D','B','B']);
    }
    else if(color1 === 'blue' && color2 === 'white'){
        moveCombination(['Ui']);
    }
    else if(color1 === 'white' && color2 == 'blue'){
        moveCombination(['R','B']);
    }
    else if(color1 === 'white' && color2 == 'green'){
        moveCombination(['Li','Bi']);
    }
    else if(color1 === 'green' && color2 == 'white'){
        moveCombination(['U']);
    }
    else if(color1 === 'green' && color2 == 'yellow'){
        moveCombination(['Di','B','B']);
    }
    else if(color1 === 'yellow' && color2 == 'green'){
        moveCombination(['L','Bi']);
    }

    // Rest Edges
    edgeColors = ['blue','yellow', 'green'];

    for(let edgeColor of edgeColors){
        moveCombination(['B']);
        edge = findEdge('orange',edgeColor);
        color1 = colors[edge[0][0]];
        piece1 = edge[0][1];
        color2 = colors[edge[1][0]];
        piece2 = edge[1][1];

        if(color1 === 'orange'){
            switch(piece1){
                case 1 : moveCombination(['B','B','U','B','B','Ui']);   break;
                case 3 : moveCombination(['B','U','Bi','Ui']);          break;
                case 7 : moveCombination(['Bi','U','B','Ui']);          break;
            }
        }
        else if(color2 === 'orange'){
            switch(piece2){
                case 1 : moveCombination(['Di','Bi','Ri','B']);   break;
                case 3 : moveCombination(['Ri','Ui']);            break;
                case 5 : moveCombination(['U','Bi','R','B']);    break;
            }
        }
        else if(color1 === 'red'){
            switch(piece1){
                case 3 : moveCombination(['Fi']);       break;
                case 5 : moveCombination(['F','F']);    break;
                case 7 : moveCombination(['F']);        break;
            }
    
            moveCombination(['U','U']);
        }
        else if(color2 === 'red'){
            switch(piece2){
                case 1 : moveCombination(['F']);        break;
                case 5 : moveCombination(['Fi']);       break;
                case 7 : moveCombination(['F','F']);    break;
            }
            moveCombination(['R','Ui','Ri']); 
        }
        else if(color1 === 'yellow' && color2 === 'blue'){
            moveCombination(['Bi','Ri','B']);
        }
        else if( color1 === 'blue' && color2 === 'yellow'){
            moveCombination(['Bi','Bi','D','B','B']);
        }
        else if(color1 === 'blue' && color2 === 'white'){
            moveCombination(['Ui']);
        }
        else if(color1 === 'white' && color2 == 'blue'){
            moveCombination(['Bi','R','B']);
        }
        else if(color1 === 'white' && color2 == 'green'){
            moveCombination(['B','Li','Bi']);
        }
        else if(color1 === 'green' && color2 == 'white'){
            moveCombination(['U']);
        }
        else if(color1 === 'green' && color2 == 'yellow'){
            moveCombination(['Bi','Bi','Di','B','B']);
        }
        else if(color1 === 'yellow' && color2 == 'green'){
            moveCombination(['B','L','Bi']);
        } 
    }
    moveCombination(['B']);
}
function layer1Corners(){
    let cornerColors = [['white','blue'],['blue','yellow'],['yellow','green'],['green','white']];
    let pos, matchPos;
    let type;

    for(let color of cornerColors){
        let positioned = false;
        while(!positioned){
            let corner = findCorner('orange',color[0], color[1]);
            
            let color1 = colors[corner[0][0]];
            let color2 = colors[corner[1][0]];
            let color3 = colors[corner[2][0]];
            
            if((color1 === 'orange' && !(color2 === color[0] && color2 === color[1]))|| color3 === 'orange'){
                pos = corner[0][1];
                if(color3 == 'orange'){
                    pos = corner[2][1];
                }
                switch(pos){
                    case 0: moveCombination(['D','F','Di']);    break;
                    case 2: moveCombination(['R','F','Ri']);    break;
                    case 4: moveCombination(['U','F','Ui']);    break;
                    case 6: moveCombination(['L','F','Li']);    break;
                }
                // Now the piece is in bottom layer
            }
            else if(color2 === 'orange'){
                pos = corner[1][1]
                switch(pos){
                    case 0: moveCombination(['Li','Fi','L']);    break;
                    case 2: moveCombination(['Di','Fi','D']);    break;
                    case 4: moveCombination(['Ri','Fi','R']);    break;
                    case 6: moveCombination(['Ui','Fi','U']);    break;
                }
                // Now the piece is in third layer
            }
            else if(color1 === 'red'){
                // piece is in third layer (along with red side)
                pos = corner[0][1];
                switch(pos){
                    case 0: moveCombination(['F']);         break;
                    case 4: moveCombination(['Fi']);        break;
                    case 6: moveCombination(['F','F']);     break;
                }
                moveCombination(['Ri','F','R']);
                // Piece is now in third layer
            }
            else{
                if(color2 === 'red'){
                    matchPos = corner[2][1];
                    type = 1;
                }
                else{
                    matchPos = corner[1][1];
                    type = 2;
                }

                switch(matchPos){
                    case 0: moveCombination(['Fi']);        break;
                    case 2: moveCombination(['F','F']);     break;
                    case 4: moveCombination(['F']);         break;
                }

                if(type === 1){
                    moveCombination(['Ri','F','R']);
                }
                else{
                    moveCombination(['U','Fi','Ui']);
                }
                positioned = true;
                moveCombination(['B']);
            }
        }
    }
}


// Second Layer
function layer2Edges(){
    let edgeColors = [['white','blue'], ['blue','yellow'],['yellow','green'],['green','white']];
    let finalPositions = {white: 1, blue : 3, yellow: 5, green: 7};
    let edge;
    let noEdgesOnTop = false;
    rotateCube('down');

    while(edgeColors.length != 0){
        let incompleteEdges = [];
        for(let color of edgeColors){
            edge = findEdge(color[0],color[1]);
            let color1 = centreColors[edge[0][0]];
            let color2 = centreColors[edge[1][0]];
            let pos1 = edge[0][1];
            let pos2 = edge[1][1];
            let finalPosition, currentPosition;
            
            let matchColor,turnColor;
            if(color1 ==='red'){
                finalPosition = finalPositions[color[1]];
                currentPosition = pos1;
                matchColor = color[1];
                turnColor = color[0]
            }
            else if(color2 === 'red'){
                finalPosition = finalPositions[color[0]];
                currentPosition = pos2;
                matchColor = color[0];
                turnColor = color[1];
            }
            else{
                // Edge is in second Layer
                if(color1 === color[0] && color2 === color[1]){
                    // This edge is in correct positions.
                    continue;
                }
                // Incorrectly Oriennted
                incompleteEdges.push(color)
                if(noEdgesOnTop){
                    if(color1 === 'white' && color2 === 'blue' || color1 === 'blue' && color2 === 'white'){
                        rotateCube('right');
                        moveCombination(['R','Ui','Ri','Ui','Fi','U','F']);
                        rotateCube('left');
                    }
                    else if(color1 === 'white' && color2 === 'green' || color1 === 'green' && color2 === 'white'){
                        rotateCube('left');
                        moveCombination(['Li','U','L','U','F','Ui','Fi']);
                        rotateCube('right');
                    }
                    else if(color1 === 'yellow' && color2 === 'green' || color1 === 'green' && color2 === 'yellow'){
                        moveCombination(['Li','U','L','U','F','Ui','Fi']);
                    }
                    else if(color1 === 'yellow' && color2 === 'blue' || color1 === 'blue' && color2 === 'yellow'){
                        moveCombination(['R','Ui','Ri','Ui','Fi','U','F']);
                    }
                }
                continue;
            }

            let d = finalPosition - currentPosition;
            switch(d){
                case 2  : 
                case -6 : moveCombination(['U']);      
                          break;
    
                case 4  : 
                case -4 : moveCombination(['U','U']);   
                          break;
                
                case 6  : 
                case -2 : moveCombination(['Ui']);      
                          break;
            }
            switch(matchColor){
                case 'blue'  :  rotateCube('right');         break;
                case 'green' :  rotateCube('left');          break;
                case 'white' :  rotateCube('left');
                                rotateCube('left');          break;
            }

            if(centreColors.indexOf(turnColor) == 4){
                moveCombination(['Ui','Li','U','L','U','F','Ui','Fi']);
            }
            else if(centreColors.indexOf(turnColor) == 5){
                moveCombination(['U','R','Ui','Ri','Ui','Fi','U','F']);
            }
            
            switch(matchColor){
                case 'blue'  :  rotateCube('left');         break;
                case 'green' :  rotateCube('right');        break;
                case 'white' :  rotateCube('left');
                                rotateCube('left');         break;
            }
        }
        if(incompleteEdges.length === edgeColors.length){
            noEdgesOnTop = true;
        }
        else{
            noEdgesOnTop = false;
        }
        edgeColors = incompleteEdges;
    }

    rotateCube('up');
}


// Third Layer
function layer3(){
    layer3Cross();
    layer3Corners();
    layer3AllignCorners();
    layer3AllignEdges();
}

function layer3Cross(){
    edgePattern = [];
    for(let pos = 1; pos<8; pos+=2){

        if(colors[cube[1][pos]] === 'red'){
            edgePattern.push(pos);
        }
    }

    if(edgePattern.length === 4){
        // Cross is already formed
        return;
    }
    
    if(edgePattern.length === 0){
        moveCombination(['D','F','R','Fi','Ri','Di']);
        edgePattern = [1,5];
    }
    
    let d = Math.abs(edgePattern[0] - edgePattern[1]);
    if(d === 4){
        // minus pattern
        if(edgePattern[0] === 1){
            moveCombination(['F']);
        }
        
        moveCombination(['D','R','F','Ri','Fi','Di']);
    }
    else{
        // L pattern
        if(edgePattern[0] === 1 && edgePattern[1] === 3){
            moveCombination(['Fi']);
        }
        else if(edgePattern[0] === 3 && edgePattern[1] === 5){
            moveCombination(['F','F']);
        }
        else if(edgePattern[0] === 5 && edgePattern[1] === 7){
            moveCombination(['F']);
        }
        moveCombination(['D','F','R','Fi','Ri','Di']);
    }
}
function layer3Corners(){
    // Finding Corner Pattern
    cornerPattern = [];
    for(let index = 0; index < 8; index+=2){
        if(colors[cube[1][index]] === 'red'){
            cornerPattern.push(index);
        }
    }

    switch(cornerPattern.length){
        case 4 : // Top Corners are facing up
                    return;

        case 0 : // Search for red color on left
                    let num = colorsIndex['red'];
                    switch(num){
                        case cube[4][2]:                                break;
                        case cube[0][6]: moveCombination(['Fi']);       break;
                        case cube[1][2]: moveCombination(['F']);        break;
                        case cube[5][0]: moveCombination(['F','F']);    break;
                    }

                    break;

        case 1 :    switch(cornerPattern[0]){
                        case 0 : moveCombination(['Fi']);       break;
                        case 2 : moveCombination(['F','F']);    break;
                        case 4 : moveCombination(['F']);        break;
                    }
                    
                    // If Color facing is red
                    if(colors[cube[2][2]] === 'red'){
                        moveCombination(['R','F','Ri','F','R','F','F','Ri']);
                    }
                    else{
                        moveCombination(['Ui','Fi','U','Fi','Ui','Fi','Fi','U']);
                    }
                    return;

        case 2 :    if(cornerPattern[1] - cornerPattern[0] != 4){
                        // Red Corners are adjacent
                        switch(cornerPattern[0]){
                            case 2: moveCombination(['Fi']);        break;
                            case 4: moveCombination(['F','F']);     break;
                            case 6: moveCombination(['F']);         break;
                        }
                    }
                    
                    break;
    }

    moveCombination(['R','F','Ri','F','R','F','F','Ri']); 
    layer3Corners();
}
function layer3AllignCorners(){
    // Check for correct pairs of corners
    possibleLocations = [[[0,6],[0,4]], [[5,0],[5,6]], [[2,0],[2,2]], [[4,2],[4,4]]];
    let found = false;
    let pos;
    let i = 0;
    for(let location of possibleLocations){
        if(cube[location[0][0]][location[0][1]] === cube[location[1][0]][location[1][1]]){
            // Matching corner found
            if(found){
                finalAllign();
                return;
            }
            pos = i;
            found = true;
        }

        i++;
    }

    if(found){
        switch(pos){
            case 1: moveCombination(['Fi']);        break;
            case 2: moveCombination(['F','F']);     break;
            case 3: moveCombination(['F']);         break;
        }
    }

    moveCombination(['Ri','D','Ri','U','U','R','Di','Ri','U','U','R','R']);

    if(found){
        // Allign Corners
        finalAllign();
    }
    else{
        layer3AllignCorners();
    }
}
function layer3AllignEdges(){
    possibleLocations = [[0,[4,5,6]], [5,[0,7,6]], [2,[0,1,2]], [4,[2,3,4]]];
    let c1,c2,c3;
    let pos;
    let i = 0;
    let found = false;
    for(let location of possibleLocations){
        c1 = cube[location[0]][location[1][0]];
        c2 = cube[location[0]][location[1][1]];
        c3 = cube[location[0]][location[1][2]];

        if(c1 === c2 && c2 === c3){
            // Side Found
            if(found){
                return;
            }
            pos = i;
            found = true;
        }
        i++;
    }

    if(found){
        // Take that side to back;
        let moves = [];
        switch(pos){
            case 1 : moveCombination(['Fi']); break;
            case 2 : moveCombination(['F','F']); break;
            case 3 : moveCombination(['F']); break;
        }
    }

    // Perform Move
    c1 = cube[2][0];
    c2 = cube[5][7];
    if(c1 === c2){
        moveCombination(['D','D','F','Ri','L','D','D','R','Li','F','D','D']);
    }
    else{
        moveCombination(['D','D','Fi','Ri','L','D','D','R','Li','Fi','D','D']);
    }

    finalAllign();

    if(!found){
        layer3AllignEdges();
    }
}
function finalAllign(){
        let color = cube[0][6];
        switch(color){
            case 4: moveCombination(['Fi']);        break;
            case 5: moveCombination(['F']);         break;
            case 2: moveCombination(['F','F']);     break;
        }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

// Finalize Moves
async function finalizeMoves(moveList, copyToScrambledCube = false){
    let finalMovesList = [];
    let top = -1;
    let rotationTable = {
        'left'  :   {'F' : 'L', 'B' : 'R', 'U' : 'U', 'D' : 'D', 'R' : 'F', 'L' : 'B'},
        'right' :   {'F' : 'R', 'B' : 'L', 'U' : 'U', 'D' : 'D', 'R' : 'B', 'L' : 'F'},
        'up'    :   {'F' : 'U', 'B' : 'D', 'U' : 'B', 'D' : 'F', 'R' : 'R', 'L' : 'L'},
        'down'  :   {'F' : 'D', 'B' : 'U', 'U' : 'F', 'D' : 'B', 'R' : 'R', 'L' : 'L'},
    }
    
    let movesTable = {'F' : 'F', 'B' : 'B', 'U' : 'U', 'D' : 'D', 'R' : 'R', 'L' : 'L'};
    let m;
    for(let i = 0; i < moveList.length; i++){
        m = moveList[i];
        if(m.length < 3 && m !== 'up'){
            if(m.length == 1 && (top === -1 || !areComplementary(finalMovesList[top],movesTable[m]))){
                finalMovesList.push(movesTable[m]);
                top++;  
            }
            else if(m.length == 2 && (top === -1 || !areComplementary(finalMovesList[top],movesTable[m[0]] + 'i'))){
                finalMovesList.push(movesTable[m[0]].toLowerCase());
                top++;
            }
            else{
                finalMovesList.pop();
                top--;
            }
        }
        else{
            newMovesTable = {};
            for(let move in rotationTable[m]){
                newMovesTable[move] = movesTable[rotationTable[m][move]];
            }
            movesTable = newMovesTable;
        }
    }
    
    for(let m of finalMovesList){
        if(m.charCodeAt(0) >= 97){
            // Lower Case
            move(m.toUpperCase(), false, true);
        }
        else{
            // Upper Case
            move(m, true, true);
        }
        await sleep(500);
    }

    if(copyToScrambledCube){
        for(let i = 0; i < 6; i++){
            for(let j = 0; j < 8; j++){
                scrambledCube[i][j] = cube[i][j];
            }
        }
    }
}

function areComplementary(a, b){
    let complementaryTable = {'b': 'B', 'B': 'Bi', 'f' : 'F', 'F' : 'Fi', 'u' : 'U', 'U' : 'Ui',
                                'd' : 'D', 'D' : 'Di', 'r' : 'R', 'R' : 'Ri', 'l' : 'L', 'L' : 'Li'};
    if(complementaryTable[a] === b){
        return true;
    }
    return false;
}