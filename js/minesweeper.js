(function($) {

	$.minesweeper = function() {

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
					row: row,
					col: col
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
				if ( !$(cell).hasClass('flag') ) {
					$(cell).addClass('cleared');
					if ( this.hasMine(cell) ) {
						$(cell).addClass('mine');
					}
				}
			}
		}

		return {
			data: grid.data,
			init: function() { 
				grid.init();
				grid.populate(10);
				$('.cell').on("contextmenu", function(event){
					event.preventDefault();
					grid.flagCell(this);
				});
				$('.cell').click(function(event) {
					event.preventDefault();
					grid.clearCell(this);
				});
			}
		}
	}

})(jQuery);