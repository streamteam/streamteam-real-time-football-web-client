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
 * Consumes elements of the heatmapStatistics stream, caches all received heatmaps, and updates the currently displayed heatmap
 */
class HeatmapStatisticsConsumer extends AbstractStreamConsumer {

	/**
	 * HeatmapStatisticsConsumer constructor.
	 */
	constructor() {
		super("heatmapStatistics", queryDict.matchId, Config.HEATMAP_STATISTICS_CONSUMPTION_LIMIT, Config.DEFAULT_HEATMAP_STATISTICS_CONSUMPTION_INTERVAL_IN_S*1000);

		this.recentCells = new Map();
		this.recentNumCellsX = new Map();
		this.recentNumCellsY = new Map();

		var optionsString = "";
		for(var i = 0; i<Config.HEATMAP_STATISTICS_CONSUMPTION_INTERVALS_IN_S.length; ++i) {
			var intervalValue = Config.HEATMAP_STATISTICS_CONSUMPTION_INTERVALS_IN_S[i];
			var intervalString;
			if (intervalValue === 1) {
				intervalString = "1 second";
			} else {
				intervalString = intervalValue + " seconds";
			}
			var selected = "";
			if(intervalValue === Config.DEFAULT_HEATMAP_STATISTICS_CONSUMPTION_INTERVAL_IN_S) {
				selected = " selected";
			}
			optionsString = optionsString + '<option value="' + intervalValue*1000 + '"' + selected + '>' + intervalString + '</option>';
		}
		$('#below-field-heatmaps-info-updateInterval-dropdown').selectBox('options', optionsString);
	}

	/**
	 * Handles a successful JSON result received after a consumption call.
	 *
	 * @param jsonResult Successful JSON result received after a consumption call
	 */
	handleSuccess(jsonResult) {
		if (typeof ImmutableDataStreamElementContent !== 'undefined' && typeof HeatmapStatisticsStreamElementPayload !== 'undefined') {
			for (var i = 0; i < jsonResult.d.length; ++i) {
				var offset = jsonResult.d[i].o;
				var heatmapStatisticsStreamElement = decodeBase64EncodedImmutableDataStreamElement(jsonResult.d[i].v);

				var id;
				if(heatmapStatisticsStreamElement.objectIdentifiers.length > 0) {
					id = heatmapStatisticsStreamElement.objectIdentifiers[0]; // player heatmapStatistics stream element
				} else {
					id = heatmapStatisticsStreamElement.groupIdentifiers[0]; // team heatmapStatistics stream element
				}

				var interval = heatmapStatisticsStreamElement.payload.intervalInS;

				if (super.isNewDataStreamElement("heatmapStatistics-" + interval + "-" + id, offset)) {
					super.setLatestOffset("heatmapStatistics-" + interval + "-" + id, offset);

					var numCellsX = heatmapStatisticsStreamElement.payload.numXGridCells;
					var numCellsY = heatmapStatisticsStreamElement.payload.numYGridCells;

					var cellsArray = [];
					var cellsArrayIndex = 0;
					var cellsParts = heatmapStatisticsStreamElement.payload.cells.split(";");
					var cellsPartsIndex = 0;
					while (cellsArrayIndex < (numCellsX * numCellsY)) {
						if (cellsParts[cellsPartsIndex].startsWith("0x")) {
							var jumpNum = parseInt(cellsParts[cellsPartsIndex].substr(2));
							for (var j = 0; j < jumpNum; ++j) {
								cellsArray[cellsArrayIndex] = {x: Math.floor(cellsArrayIndex / numCellsY), y: (cellsArrayIndex % numCellsY), value: 0};
								cellsArrayIndex++;
							}
						} else {
							cellsArray[cellsArrayIndex] = {x: Math.floor(cellsArrayIndex / numCellsY), y: (cellsArrayIndex % numCellsY), value: parseInt(cellsParts[cellsPartsIndex])};
							cellsArrayIndex++;
						}
						cellsPartsIndex++;
					}

					this.recentCells.set(interval + "-" + id, cellsArray);
					this.recentNumCellsX.set(interval + "-" + id, numCellsX);
					this.recentNumCellsY.set(interval + "-" + id, numCellsY);

					if (id === heatmap.currentId && parseInt(interval) === heatmap.currentInterval) {
						heatmap.update(cellsArray, numCellsX, numCellsY);
					}
				}
			}
		}
	}

	/**
	 * Updates the interval in which new heatmapStatistics stream elements are consumed.
	 *
	 * @param interval Interval (in ms)
	 */
	updateConsumptionInterval(interval) {
		clearInterval(this.consumptionIntervalId);
		this.interval = interval;
		this.startConsumption();
	}
}
