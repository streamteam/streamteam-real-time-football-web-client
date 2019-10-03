/*
 * StreamTeam
 * Copyright (C) 2019  University of Basel
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Visualizes the heatmap
 */
class Heatmap {

	/**
	 * Initializes the heatmap.
	 */
	initialize() {
		var ratioToStandard = Resizer.FIELD_WIDTH / 1000;
		this.currentRadius = Config.HEATMAP_RADIUS_DEFAULT * ratioToStandard;
		this.minRadius = Config.HEATMAP_RADIUS_MIN * ratioToStandard;
		this.maxRadius = Config.HEATMAP_RADIUS_MAX * ratioToStandard;
		this.stepsizeRadius = Config.HEATMAP_RADIUS_STEPSIZE * ratioToStandard;
		this.currentInterval = Config.HEATMAP_DEFAULT_INTERVAL_IN_S;
	}

	/**
	 * Resizes the heatmap.
	 * @param multiplicator newFieldWidth/oldFieldWidth
	 */
	resize(multiplicator) {
		heatmap.currentRadius = heatmap.currentRadius * multiplicator;
		heatmap.minRadius = heatmap.minRadius * multiplicator;
		heatmap.maxRadius = heatmap.maxRadius * multiplicator;
		heatmap.stepsizeRadius = heatmap.stepsizeRadius * multiplicator;
		heatmap.initializeHeatmapCanvas();
		if (heatmap.currentId !== undefined) {
			heatmap.showBelowFieldInfo();
			heatmap.update(heatmapStatisticsConsumer.recentCells.get(heatmap.currentInterval + "-" + heatmap.currentId), heatmapStatisticsConsumer.recentNumCellsX.get(heatmap.currentInterval + "-" + heatmap.currentId), heatmapStatisticsConsumer.recentNumCellsY.get(heatmap.currentInterval + "-" + heatmap.currentId));
		}
	}

	/**
	 * Show the heatmap for a given player or team.
	 *
	 * @param id Player or team identifier.
	 * @param interval Heatmap interval
	 */
	show(id, interval) {
		heatmap.initializeHeatmapCanvas();

		field.highlightHeatmapPlayer(heatmap.currentId, id);

		heatmap.currentId = id;
		heatmap.currentInterval = parseInt(interval);

		heatmap.showBelowFieldInfo();
	}

	/**
	 * Shows the heatmap information below the field.
	 */
	showBelowFieldInfo() {
		if(heatmap.currentId.length === 1) {
			$("#below-field-heatmaps-info-title-suffix").html(matchMetadataConsumer.names.get(heatmap.currentId) + " (" + field.teamColor.get(heatmap.currentId) + ")");
		} else {
			$("#below-field-heatmaps-info-title-suffix").html(matchMetadataConsumer.names.get(heatmap.currentId) + " (" + heatmap.currentId + ")");
		}
		$('#below-field-heatmaps-info-range').attr('min', heatmap.minRadius)
			.attr('max', heatmap.maxRadius)
			.attr('step', heatmap.stepsizeRadius)
			.attr('value', heatmap.currentRadius);
		$('.below-field-heatmaps-info-interval-selection-item').each(function(index) {
			var oldValue = $(this).attr('value');
			var interval = oldValue.split("-")[0];
			$(this).attr('value', interval + "-" + heatmap.currentId);
			if(parseInt(interval) === heatmap.currentInterval) {
				$(this).prop('checked', true);
			}
		});
		$('#below-field-heatmaps-info').css('display', 'block');
	}

	/**
	 * Removes the currently displayed heatmap.
	 */
	remove() {
		field.removeFillPlayerHighlight(heatmap.currentId);
		field.removeStrokePlayerHighlight(heatmap.currentId);
		heatmap.currentId = undefined;
		$('#below-field-heatmaps-info').css('display', 'none');
		$('.heatmap-canvas').remove();
	}

	/**
	 * Adapts the granularity of the heatmap.
	 * @param value Heatmap granularity
	 */
	adaptGranularity(value) {
		heatmap.currentRadius = value;
		heatmap.initializeHeatmapCanvas();
		heatmap.update(heatmapStatisticsConsumer.recentCells.get(heatmap.currentInterval + "-" + heatmap.currentId), heatmapStatisticsConsumer.recentNumCellsX.get(heatmap.currentInterval + "-" + heatmap.currentId), heatmapStatisticsConsumer.recentNumCellsY.get(heatmap.currentInterval + "-" + heatmap.currentId));
	}

	/**
	 * Initializes the canvas for the heatmap.
	 */
	initializeHeatmapCanvas(){
		$('.heatmap-canvas').remove();
		var config = {
			container: document.getElementById('field-withBorder'),
			radius: this.currentRadius,
			maxOpacity: .7,
			minOpacity: 0,
			blur: .8
		};
		this.heatmapInstance = h337.create(config);
	}

	/**
	 * Updates the cells of the currently displayed heatmap.
	 * @param cells Array of cells
	 */
	update(cells, numCellsX, numCellsY){
		if(!userInteraction.paused) {
			var points = [];
			var max = 0;
			for(var i=0; i<cells.length; i++) {
				var x = Config.FIELD_BORDER + (cells[i].x + 0.5)/numCellsX * Resizer.FIELD_WIDTH;
				var y = Config.FIELD_BORDER + (cells[i].y + 0.5)/numCellsY * Resizer.FIELD_HEIGHT;

				var point = {
					x: Math.floor(x),
					y: Math.floor(y),
					value: cells[i].value
				};
				points[i] = point;

				if(max < cells[i].value) {
					max = cells[i].value;
				}
			}
			var data = {
				max: max,
				data: points
			};
			heatmap.heatmapInstance.setData(data);
		}
	}
}