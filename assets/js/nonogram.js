const CellState = {
	default : "default",
	fill : "fill",
	x : "x",	
};
const PenColor = {
	black : "black",
	blue : "blue",
	red : "red"
};



const CELL_SPACE_LENGTH = 24;
let PUZZLE_ROW = 5;
let PUZZLE_COLUMN = 5;
let MAX_ROW_CLUE = 4;
let MAX_COLUMN_CLUE = 3;
let PEN_COLOR = PenColor.black;


class Cell {
	state = CellState.default;

	setFill(b) {
		if( b === true )
			this.state = CellState.fill;
		else 
			this.state = CellState.default;
	}
	toggleX() {
		if( this.state === CellState.x )
			this.state = CellState.default;
		else 
			this.state = CellState.x;
		return this.state;
	}
	
	isFill() {
		return this.state === CellState.fill;
	}
	switchCell() {
		if( this.state === CellState.default ) 
			this.state = CellState.fill;
		else if( this.state === CellState.fill ) 
			this.state = CellState.x;
		else 
			this.state = CellState.default;
		return this.state;
	}
}

// x, y coordinate
class GameMap {
	cells = [];
	
	constructor(rows, columns) {
		let row = null;
		for( let y = 0;		 y < rows;		++y) {
			row = [];
			for( let x = 0;		x < columns;	++x ) {
				row.push(new Cell());
			}
			this.cells.push(row);
		}
	}

	
	getCell(x,y) {
		return (this.cells[y])[x];
	}
	getMaxX() {
		return this.cells[0] ? this.cells[0].length : 0;
	}
	getMaxY() {
		return this.cells.length;
	}
	debug_display() {
		const rows = this.cells.length;
		const columns = this.cells[0] ? this.cells[0].length : 0;
		let row;
		let displayRow = "";
		for( let y = 0;		 y < rows;		++y) {
			row = this.cells[y];
			displayRow = "";
			for( let x = 0;		x < columns;	++x ) {
				displayRow += row[x].isFill() === true ? "■ " : "□ ";								
			}			
		}
		
	}
}

class NonogramUI {
	rowGuideArray = [];
	columnGuideArray = [];	
	gameMap = null;
	cellElements = [];
	
	constructor(gameMap, maxRow, maxColumn, arRowGuid, maxRowGuide, arColumnGuide, maxColumnGuide) {		
		function appendElement( parent, elementId, elementClass, content) {
			const element = document.createElement("div");
			element.id =  elementId;
			element.classList = elementClass;
			if( content !== null && content !== undefined )
				element.innerHTML = content;
			parent.appendChild(element);
			return element;
		}

		this.gameMap = gameMap;
		const board = document.getElementById("board");
		board.innerHTML  = "";
		// create column guide
		// <div class="row">
		// 		<div class="space void"></div>
		// 		<div class="space void"></div>
		// 		<div class="space void"></div>
		// 		<div class="space void"></div>
		// 		<div id="col_0_0" class="space"></div>
		// 		<div id="col_0_1" class="space"></div>
		// 		<div id="col_0_2" class="space"></div>
		// 		<div id="col_0_3" class="space"></div>
		// 		<div id="col_0_4" class="space"></div>
		// 		<div id="col_0_5" class="space"></div>
		// 		<div id="col_0_6" class="space"></div>
		// 		<div id="col_0_7" class="space"></div>
		// 		<div id="col_0_8" class="space">1</div>
		// 		<div id="col_0_9" class="space"></div>
		// </div>
		let divColumnGuide = null;
		let columnGuide = null;
		let voidDiv = null
		// console.info("arColumnGuide", arColumnGuide)
		for( let idxColumnGuide = maxColumnGuide-1;		0 <= idxColumnGuide;	--idxColumnGuide ) {
			divColumnGuide = document.createElement("div");			
			divColumnGuide.classList.add("row");
			for( let j = 0;		j < maxRowGuide;	++j	) {
				voidDiv = document.createElement("div");
				voidDiv.classList = "space void";				
				divColumnGuide.appendChild(voidDiv);
			}
						
			for( let j = 0;		j < arColumnGuide.length;	++j    ) {
				columnGuide = arColumnGuide[j];
				if( columnGuide[idxColumnGuide] !== null && columnGuide[idxColumnGuide] !== undefined )
					appendElement(divColumnGuide, `col_${idxColumnGuide}_${j}`, "space", columnGuide[columnGuide.length - idxColumnGuide - 1]);
				else 
					appendElement(divColumnGuide, `col_${idxColumnGuide}_${j}`, "space");
			}
			board.appendChild(divColumnGuide);
		}
		

		// create rows 
		// cell-start : only first row 
		// <div class="row cell-start">
		// 		<div id="row_0_0" class="space"></div>
		// 		<div id="row_0_1" class="space">3</div>
		// 		<div id="row_0_2" class="space">4</div>
		// 		<div id="row_0_3" class="space">1</div>
		// 		<div id="cell_0_0" class="space cell fill"></div>
		// 		<div id="cell_0_1" class="space cell fill"></div>
		// 		<div id="cell_0_2" class="space cell x"></div>
		// 		<div id="cell_0_3" class="space cell"></div>
		// 		<div id="cell_0_4" class="space cell"></div>
		// 		<div id="cell_0_5" class="space cell"></div>
		// 		<div id="cell_0_6" class="space cell"></div>
		// 		<div id="cell_0_7" class="space cell"></div>
		// 		<div id="cell_0_8" class="space cell"></div>
		// 		<div id="cell_0_9" class="space cell"></div>
		// </div>
		let divRow = null;
		let rowGuide = null;
		let idxCurrentGuide = 0;
		// console.info("arRowGuid>>", arRowGuid);
		for( let idxRow = 0;		idxRow < maxRow;	++idxRow ) {
			divRow = document.createElement("div");
			if( idxRow === 0 )
				divRow.classList= "row cell-start";
			else 
				divRow.classList.add("row");
			

			rowGuide = arRowGuid[idxRow];
			idxCurrentGuide = 0;
			for( let idxGuide = 0;		idxGuide < maxRowGuide;		++idxGuide	) {
				if(  0 <= rowGuide.length - maxRowGuide + idxGuide  )
					appendElement(divRow, `row_${idxRow}_${idxGuide}`, "space", rowGuide[idxCurrentGuide++]);
				else  
					appendElement(divRow, `row_${idxRow}_${idxGuide}`, "space");
			}
			
			let element = null;
			for( let idxColumn = 0;		idxColumn < maxColumn;  ++idxColumn) {
				element = appendElement(divRow, `cell_${idxRow}_${idxColumn}`, "space cell");
				this.cellElements.push(element);
				element.addEventListener("mousedown", (e)=>{
					this.onCellMouseDown(e);
				});
				
			}			
			board.appendChild(divRow);
		}

		// horizental thick line drawer
		// <div class="hr-line-drawer" style="top:0px" ></div>
		const maxHorizentelLines = Math.floor(maxRow / 5) + 2;
		const hrLineWidth = CELL_SPACE_LENGTH * (maxRowGuide+ maxColumn);		
		console.info("hrLineWidth", hrLineWidth);
		let top = 0;
		let divHr = null;
		for( let i = 0;		 i < maxHorizentelLines;	++i ) {
			top = (0 < i) ? CELL_SPACE_LENGTH * maxColumnGuide + (i - 1) * CELL_SPACE_LENGTH * 5 : 0;			
			divHr = document.createElement("div");
			divHr.classList.add("hr-line-drawer");
			divHr.style.width = `${hrLineWidth}px`;
			divHr.style.top = `${top}px`;
			board.appendChild(divHr);
		}
		
		// vertical thick line drawer
		// <div class="vh-line-drawer"  style="left:0px;" ></div>
		const maxVerticalLines = Math.floor(maxColumn / 5) + 2;
		const vhLineHeight = CELL_SPACE_LENGTH * (maxColumnGuide + maxRow);
		let left = 0;
		let divVh = null;
		for( let i = 0;		 i < maxVerticalLines;	++i ) {
			left = (0 < i) ? CELL_SPACE_LENGTH * maxRowGuide + (i - 1) * CELL_SPACE_LENGTH * 5 : 0;			
			divVh = document.createElement("div");
			divVh.classList.add("vh-line-drawer");
			divVh.style.height = `${vhLineHeight}px`;
			divVh.style.left = `${left}px`;
			board.appendChild(divVh);
		}
	}

	onCellMouseDown(e) {		
		const element = e.target;
		const arSplitId = e.target.id.split("_");
		const row = arSplitId[1];
		const column = arSplitId[2];
		const cell = this.gameMap.getCell(column, row);		
		
		let cellState = null;		
		if ( e.which === 3 )
			cellState = cell.toggleX();
		else 
			cellState = cell.switchCell();		
		
		if( cellState === CellState.fill )
			element.classList = `space cell fill ${PEN_COLOR} `;
		else if( cellState === CellState.x )
			element.classList = `space cell x ${PEN_COLOR}`;
		else 
			element.classList = "space cell";		
	}

	convertPenRedToBlack() {
		for( let i=0;		i < this.cellElements.length;	++i ) {
			if( this.cellElements[i].classList.contains("red")  )
				this.cellElements[i].classList.remove("red");
		}
	}
	convertPenBlueToBlack() {
		for( let i=0;		i < this.cellElements.length;	++i ) {
			if( this.cellElements[i].classList.contains("blue")  )
				this.cellElements[i].classList.remove("blue");
		}
	}
}


class Nonogram {	
	gameMap = null;
	ui = null;
	rowGuideArray=null;
	columnGuideArray=null;
	

	createRowGuide(gameMap) {
		const rowGuideArray = [];
		let count = 0;
		let maxRowGuide = 0;
		let rowCaption = null;
		for( let y = 0;		y < gameMap.getMaxY();	++y ) {
			rowCaption = [];
			count = 0;
			for( let x = 0; 	x < gameMap.getMaxX();	++x  ) {
				// console.info(`${x} ${y}`, gameMap.getCell(x,y).isFill());
				if( gameMap.getCell(x,y).isFill() === true  ) {
					++count;
				}					
				else  {
					if( 0 < count )
						rowCaption.push(count);
					count = 0;
				}
			}
			if( 0 < count )
				rowCaption.push(count);
			if( maxRowGuide < rowCaption.length )
				maxRowGuide = rowCaption.length;
			if( rowCaption.length === 0 )
				rowCaption.push(0);
			rowGuideArray.push(rowCaption);
		}
		return {rowGuideArray, maxRowGuide};
	}

	createColumnGuide(gameMap){
		const columnGuideArray = [];
		let maxColumnGuide = 0;
		let columnCaption = null;
		let count = 0;
		for( let x = 0;		x < gameMap.getMaxX();	++x ) {
			columnCaption = [];
			count = 0;
			for( let y = 0; 	y < gameMap.getMaxY();	++y  ) {
				if( gameMap.getCell(x,y).isFill() === true  ) {
					++count;
				}
				else  {
					if( 0 < count )
						columnCaption.push(count);		
					count = 0;
				}
			}
			if( 0 < count )
				columnCaption.push(count);
			if( maxColumnGuide < columnCaption.length )
				maxColumnGuide = columnCaption.length;				
			if( columnCaption.length === 0 )
				columnCaption.push(0);
			
			columnGuideArray.push(columnCaption);
		}
		return {columnGuideArray, maxColumnGuide};
	}


	newGame(gameRow, gameColumn) {
		// new game 
		const ansMap = new GameMap(gameRow, gameColumn);
		for( let y = 0;		y < ansMap.getMaxY();	++y ) {
			for( let x = 0; 	x < ansMap.getMaxX();	++x  ) {
				ansMap.getCell(x,y).setFill( Math.random() < 0.5  );
			}
		}
		ansMap.debug_display();

		// create row guide captions		
		const jsonRowGuide = this.createRowGuide(ansMap);
		this.rowGuideArray = jsonRowGuide.rowGuideArray;
		const maxRowGuide = jsonRowGuide.maxRowGuide;

		// create column guide captions
		const jsonColumnGuide = this.createColumnGuide(ansMap);
		this.columnGuideArray = jsonColumnGuide.columnGuideArray;
		const maxColumnGuide = jsonColumnGuide.maxColumnGuide;
		
		this.gameMap = new GameMap(gameRow, gameColumn);
		this.ui = new NonogramUI(this.gameMap, gameRow, gameColumn, this.rowGuideArray, maxRowGuide, this.columnGuideArray, maxColumnGuide);

		// hide result and new game button
		document.getElementById("lblResultPanel").innerHTML = "";
		document.getElementById("btnNewGame").classList = "hidden";
	}

	submitAnswer() {	
		const {rowGuideArray} = this.createRowGuide(this.gameMap);		
		console.info("rowGuideArray", rowGuideArray);
		let rowGuide = null;
		let ansRowGuide = null;
		for( let i =0;		i < this.rowGuideArray.length;		++i ) {
			rowGuide = rowGuideArray[i];
			ansRowGuide = this.rowGuideArray[i];
			for( let j= 0; 		j < ansRowGuide.length;	 	++j  ) {
				if( rowGuide[j] !== ansRowGuide[j]  ) {
					return this.mistake();
				}
			}			
		}
		
		const {columnGuideArray} = this.createColumnGuide(this.gameMap);
		let columnGuide = null;
		let ansColumnGuide = null;
		console.info("columnGuideArray", columnGuideArray);
		for( let i =0;		i < this.columnGuideArray.length;		++i ) {
			ansColumnGuide = this.columnGuideArray[i];
			columnGuide = columnGuideArray[i];
			for( let j = 0;		j < ansColumnGuide.length;	++j ) {
				if( ansColumnGuide[j] !== columnGuide[j]  )
					return this.mistake();
			}
		}

		this.winGame();
	}
	
	mistake() {
		const lblResultPanel = document.getElementById("lblResultPanel");
		lblResultPanel.classList = "result-wrong";
		lblResultPanel.innerHTML = "Something wrong!";

		const btnNewGame = document.getElementById("btnNewGame");
		btnNewGame.classList.add("hidden");

	}

	winGame() {
		const lblResultPanel = document.getElementById("lblResultPanel");		
		lblResultPanel.classList = "result-win";
		lblResultPanel.innerHTML = "Congratulations! You have solved the puzzle.";

		const btnNewGame = document.getElementById("btnNewGame");
		btnNewGame.classList = "";
	}

	convertPenRedToBlack() {
		this.ui.convertPenRedToBlack();
	}
	convertPenBlueToBlack() {
		this.ui.convertPenBlueToBlack();
	}

}

const nonogram = new Nonogram();
nonogram.newGame(PUZZLE_ROW, PUZZLE_COLUMN);

document.getElementById("btnNewGame").addEventListener("click", ()=>{
	nonogram.newGame(PUZZLE_ROW, PUZZLE_COLUMN);
});

document.getElementById("btnSubmit").addEventListener("click", (e)=>{
	nonogram.submitAnswer();
});


document.getElementById("radBlackPen").addEventListener("click", ()=>{
	PEN_COLOR = PenColor.black;
});
document.getElementById("lblPenBlack").addEventListener("click", ()=>{
	document.getElementById("radBlackPen").click();	
});


document.getElementById("radBluePen").addEventListener("click", ()=>{
	PEN_COLOR = PenColor.blue;
});
document.getElementById("lblPenBlue").addEventListener("click", ()=>{
	document.getElementById("radBluePen").click();
});


document.getElementById("radRedPen").addEventListener("click", ()=>{
	PEN_COLOR = PenColor.red;
});
document.getElementById("lblPenRed").addEventListener("click", ()=>{
	document.getElementById("radRedPen").click();
});



function newGame(row, column)  {
	PUZZLE_ROW = row;	
	PUZZLE_COLUMN = column;
	nonogram.newGame(row, column);
}

document.getElementById("btn5x5").addEventListener("click", ()=>newGame(5,5) );
document.getElementById("btn10x10").addEventListener("click", ()=>newGame(10,10) );
document.getElementById("btn15x15").addEventListener("click", ()=>newGame(15,15) );
document.getElementById("btn20x20").addEventListener("click", ()=>newGame(20,20) );
document.getElementById("btn25x25").addEventListener("click", ()=>newGame(25,25) );
document.getElementById("btn30x30").addEventListener("click", ()=>newGame(30,30) );
document.getElementById("radBlackPen").click();


document.getElementById("btnConvertRed").addEventListener("click", ()=>{
	nonogram.convertPenRedToBlack();
});

document.getElementById("btnConvertBlue").addEventListener("click", ()=>{
	nonogram.convertPenBlueToBlack();
});





// prevant right menu
window.oncontextmenu = function (){
    return false;     // cancel default menu
}




