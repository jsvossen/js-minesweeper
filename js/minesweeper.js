(function($) {

	$.minesweeper = function() {

		var game = {
			level: 1,
			mines: 10,
			flags: 0,
			inProgress: false,
			lose: function() {
				$('.cell').each(function(cell) {
					if (grid.hasMine(this)) { grid.clearCell(this); }
				});
				timer.stop();
			}
		};

		var grid = {
			size: 9,
			data: [],
			init: function() {
				thisGrid = this;
				for (row=0; row < thisGrid.size; row++) {
					var rowDiv = $('<div class="row" data-row='+row+'></div>').appendTo($("#board"));
					thisGrid.data.push([]);
					for (col=0; col < thisGrid.size; col++) {
						$(rowDiv).append('<div class="cell" data-col='+col+'></div>');
						thisGrid.data[row].push(0);
					}
				}		
			},
			populate: function(mines) {
				var i = 0;
				while (i<mines) {
					var row = Math.floor( Math.random() * this.size );
					var col = Math.floor( Math.random() * this.size );
					if ( !this.data[row][col]) {
						this.data[row][col] = 1;
						i++;
					}
				}
			},
			getCell: function(row,col) {
				return $('.row[data-row='+row+'] .cell[data-col='+col+']');
			},
			getCoords: function(cell) {
				var row = $(cell).parent().attr('data-row');
				var col = $(cell).attr('data-col');
				return {
					row: parseInt(row),
					col: parseInt(col)
				}
			},
			hasMine: function(cell) {
				coords = this.getCoords(cell);
				return this.data[coords.row][coords.col];
			},
			flagCell: function(cell) {
				if ( !$(cell).hasClass('cleared') ) {
					$(cell).toggleClass('flag');
				}
			},
			clearCell: function(cell) {
				var thisGrid = this;
				if ( !$(cell).hasClass('flag') && !$(cell).hasClass('cleared') ) {
					$(cell).addClass('cleared');
					if ( this.hasMine(cell) ) {
						$(cell).addClass('mine');
						game.lose();
					} else {
						var mines = this.mineCount(cell);
						if (mines > 0) { 
							$(cell).addClass("clue m"+mines);
						} else {
							$.each( this.getAdjacent(cell), function(i,nextCell) {
								thisGrid.clearCell(nextCell);
							});
						}

					}

				}
			},
			getAdjacent: function(cell) {
				var thisGame = this;
				var coords = this.getCoords(cell);
				var newCoords = [
					[coords.row+1,coords.col+1],
					[coords.row-1,coords.col-1],
					[coords.row+1,coords.col-1],
					[coords.row-1,coords.col+1],
					[coords.row,coords.col+1],
					[coords.row,coords.col-1],
					[coords.row+1,coords.col],
					[coords.row-1,coords.col],
				];
				var adjacent = [];
				$.each(newCoords, function(i,coord){
					nextCell = thisGame.getCell(coord[0],coord[1]);
					if ( nextCell.length>0 ) adjacent.push(nextCell);
				});
				return adjacent;
			},
			mineCount: function(cell) {
				var thisGrid = this;
				var mines = 0;
				$.each( this.getAdjacent(cell), function(i,nextCell) {
					if ( thisGrid.hasMine(nextCell) ) mines++;
				});
				return mines;
			}
		};

		var timer = {
			interval: 1000,
			enabled: false,
			timerId: 0,
			start: function() {
				var thisTimer = this;
				thisTimer.enabled = true;
				var t = 0;
				if (thisTimer.enabled) {
					thisTimer.timerId = setInterval(function(){
						t++;
						stats.updateClock(t);
					}, thisTimer.interval);
				}
			},
			stop: function() {
				this.enabled = false;
				clearInterval(this.timerId);
			}
		};

		var stats = {
			init: function() {
				$('#stats').append('<div id="timer">00:00</div>');
			},
			updateClock: function(seconds) {
				var min = Math.floor(seconds/60);
				var sec = seconds % 60;
				min = (min < 10) ? "0"+min : min;
				sec = (sec < 10) ? "0"+sec : sec;
				$('#timer').text(min+':'+sec);
			}
		};

		return {
			init: function() { 
				grid.init();
				stats.init();
				grid.populate(10);
				$('.cell').on("contextmenu", function(event){
					event.preventDefault();
					if (!game.inProgress) { timer.start(); game.inProgress = true; }
					if (timer.enabled && game.flags < game.mines) {
						grid.flagCell(this);
						game.flags++;
					}
				});
				$('.cell').click(function(event) {
					event.preventDefault();
					if (!game.inProgress) { timer.start(); game.inProgress = true; }
					if (timer.enabled) {
						grid.clearCell(this);
					}
				});
			}
		};
	}

})(jQuery);