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
						thisGrid.data[row].push("");
					}
				}		
			},
			flagCell: function(cell) {
				if ( !$(cell).hasClass('cleared') ) {
					$(cell).toggleClass('flag');
				}
			},
			clearCell: function(cell) {
				if ( !$(cell).hasClass('flag') ) {
					$(cell).addClass('cleared');
				}
			}
		}

		return {
			data: grid.data,
			init: function() { 
				grid.init();
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