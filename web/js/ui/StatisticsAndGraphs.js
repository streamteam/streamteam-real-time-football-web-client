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
 * Visualizes the statistics and graphs
 */
class StatisticsAndGraphs {

	/**
	 * StatisticsAndGraphs constructor.
	 */
	constructor() {
		this.graphCharts = new Map();
	}

	/**
	 * Initializes the graphs.
	 */
	initializeGraphs() {
		var types = ["pressingIndex", "mbrSurface-A", "mbrSurface-B", "pchSurface-A", "pchSurface-B", "ballZPosition", "ballAbsVelocity"];

		for(var t=0; t<types.length; ++t)
		{
			// based on https://www.chartjs.org/samples/latest/scales/time/line-point-data.html
			var ctx = document.getElementById('statistics-container-graphs-' + types[t]).getContext('2d');
			var curChart = new Chart(ctx, {
				type: 'line',
				data: {
					datasets: [{
						label: 'Values',
						backgroundColor: 'rgba(255,255,255,0)',
						borderColor: Config.STATISTICS_NEUTRAL_FILL_COLORS[0],
						pointHoverRadius: 3,
						pointHitRadius: 3,
						pointRadius: 3,
						fill: false,
						data: []
					}]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					title: {
						display: false
					},
					tooltips: {
						enabled: false
					},
					legend: {
						display: false
					},
					scales: {
						xAxes: [{
							type: 'time',
							display: true,
							scaleLabel: {
								display: false
							},
							gridLines: {
								color: '#e0e0e0',
								zeroLineColor: '#e0e0e0',
								drawOnChartArea: false
							},
							ticks: {
								fontFamiliy: 'sans-serif',
								fontColor: '#e0e0e0'
							},
							time: {
								unit: 'second',
								displayFormats: {
									second: 'hh:mm:ss'
								}
							}
						}],
						yAxes: [{
							display: true,
							scaleLabel: {
								display: false
							},
							gridLines: {
								color: '#e0e0e0',
								zeroLineColor: '#e0e0e0',
								drawOnChartArea: false
							},
							ticks: {
								fontFamiliy: 'sans-serif',
								fontColor: '#e0e0e0',
								min: 0
							}
						}]
					}
				}
			});
			this.graphCharts.set(types[t], curChart);
		}
	}

	/**
	 * Adds value to graph.
	 * @param graphId Graph identifier
	 * @param value Value
	 */
	addValueToGraph(graphId, value) {
		// based on https://www.chartjs.org/samples/latest/scales/time/line-point-data.html & https://www.youtube.com/watch?v=De-zusP8QVM

		var date = new Date();
		var chart = this.graphCharts.get(graphId);

		chart.data.datasets[0].data.push({
			x: date,
			y: value
		});

		while(date.getTime() - chart.data.datasets[0].data[0].x.getTime() > Config.GRAPHS_HISTORY_IN_MS) {
			chart.data.datasets[0].data.shift(); // remove first item of the array
		}

		if(statisticsAndGraphs.showId === "graphs") {
			chart.update();
		}
	}

	/**
	 * Setups the statistics container.
	 * @param id Identifier of the player, the team or "comparison"
	 */
	setupStatisticsContainer(id) {
		$('#statistics-container').css('display','block');

		if(id === "comparison"){
			$('#statistics-container-singleColumn').css('display','none');
			$('#statistics-container-doubleColumn').css('display','block');
			$('#statistics-container-graphs').css('display','none');
			$("#statistics-container-title").html("Team Comparison");
		} else if(id === "graphs") {
			$('#statistics-container-singleColumn').css('display','none');
			$('#statistics-container-doubleColumn').css('display','none');
			$('#statistics-container-graphs').css('display','block');
			$("#statistics-container-title").html("Graphs");
		} else {
			$('#statistics-container-singleColumn').css('display','block');
			$('#statistics-container-doubleColumn').css('display','none');
			$('#statistics-container-graphs').css('display','none');
			if(id.length === 1) {
				$("#statistics-container-title").html(matchMetadataConsumer.names.get(id) + " (" + field.teamColor.get(id) + ")");
			} else {
				$("#statistics-container-title").html(matchMetadataConsumer.names.get(id) + " (" + id + ")");
			}
		}

		statisticsAndGraphs.showId = id;

		statisticsAndGraphs.currentOpenTooltip = undefined;

		statisticsAndGraphs.initContainerContent();
		statisticsAndGraphs.updateContainerContent();
	}

	/**
	 * Closes the statistics container.
	 */
	close() {
		$("#statistics-container").css("display", "none");
		statisticsAndGraphs.showId = undefined;
	}

	/**
	 * Resizes the content of the currently displayed statistics container.
	 */
	resize() {
		statisticsAndGraphs.initContainerContent();
		statisticsAndGraphs.updateContainerContent();
	}

	/**
	 * Initializes the content for the currently displayed statistics container.
	 */
	initContainerContent() {
		var types = ["ballPossessionStatistics",
			"shotNumStatistics",
			"setPlayNumStatistics",
			"passSequenceNumStatistics",
			"passSequenceAvgLengthStatistics",
			"passSequenceMaxLengthStatistics",
			"doublePassNumStatistics",
			"passNumStatistics",
			"passSuccessStatistics",
			"packingStatistics",
			"passDirectionStatistics",
			"distanceStatistics",
			"speedStatistics",
			"dribblingNumStatistics",
			"avgDribblingDurationStatistics",
			"avgDribblingLengthStatistics"];

		for(var t=0; t<types.length; ++t)
		{
			if (statisticsAndGraphs.showId !== undefined) {
				var width;
				if (statisticsAndGraphs.showId === "comparison") { // comparison
					width = parseInt(Resizer.FIELD_WIDTH / 2 + Config.FIELD_BORDER) - 20;

					var teamSides = ["A:left","B:right"];
					for(var k=0; k<teamSides.length; ++k) {
						var teamSidesParts = teamSides[k].split(":");
						var teamId = teamSidesParts[0];
						var side = teamSidesParts[1];

						$("#statistics-container-doubleColumn-" + side + "Column-" + types[t]).html("");
						var statisticsDataItems = [];
						statisticsDataItems[0] = "statistics-container-doubleColumn-" + side + "Column-" + types[t] + "-" + teamId;
						for (var i = 1; i <= 11; i++) {
							statisticsDataItems[i] = "statistics-container-doubleColumn-" + side + "Column-" + types[t] + "-" + teamId + i;
						}
						for (var i = 0; i < statisticsDataItems.length; ++i) {
							$("#statistics-container-doubleColumn-" + side + "Column-" + types[t]).append('<div class="statistics-item" style="width: ' + width + 'px"><div class="statics-item-tooltip-area" id="' + statisticsDataItems[i] + '" title="no tooltip content yet"></div><div style="clear:both"></div></div>');
						}
					}
				} else {
					width = (Resizer.FIELD_WIDTH+2*Config.FIELD_BORDER) - 20;
					$("#statistics-container-singleColumn-" + types[t]).html("");
					var statisticsDataItems = [];
					if (statisticsAndGraphs.showId.length > 1) { // player
						var teamId = statisticsAndGraphs.showId.substring(0, 1);
						statisticsDataItems[0] = "statistics-container-singleColumn-" + types[t] + "-" + teamId;
						statisticsDataItems[1] = "statistics-container-singleColumn-" + types[t] + "-" + statisticsAndGraphs.showId;
					} else { // single team
						statisticsDataItems[0] = "statistics-container-singleColumn-" + types[t] + "-" + statisticsAndGraphs.showId;
						for (var i = 1; i <= 11; i++) {
							statisticsDataItems[i] = "statistics-container-singleColumn-" + types[t] + "-" + statisticsAndGraphs.showId + i;
						}
					}
					for (var i = 0; i <= statisticsDataItems.length; ++i) {
						$("#statistics-container-singleColumn-" + types[t]).append('<div class="statistics-item" style="width: ' + width + 'px"><div class="statics-item-tooltip-area" id="' + statisticsDataItems[i] + '" title="no tooltip content yet"></div><div style="clear:both"></div></div>');
					}
				}
			}
		}
		$(".statics-item-tooltip-area:not(.tooltipstered)").tooltipster({
			trigger: 'custom',
			triggerOpen: {
				mouseenter: true,
				touchstart: true
			},
			triggerClose: {
				mouseleave: true,
				scroll: true,
				tap: true
			},
			functionBefore: function(instance, helper) { // This function should not be necessary according to the mouseleave trigger but without it there are sometimes multiple tooltips
				//https://github.com/iamceege/tooltipster/issues/438
				$('.tooltipstered').tooltipster('hide');
			},
			contentAsHTML: true,
			arrow: false,
			updateAnimation: null,
			animation: null,
			animationDuration: 0,
			delay: 0,
			plugins: ['follower'],
			theme: ['tooltipster-default', 'tooltipster-default-customized']
		});
	}

	/**
	 * Starts periodically updating the statistics container.
	 */
	startStatisticsContainerUpdater() {
		this.updateContainerContent(); // immediately first update
		this.updateContainerIntervalId = setInterval( (function(){this.updateContainerContent()}).bind(this), Config.STATISTICSCONTAINER_UPDATE_INTERVAL_IN_MS);
	}

	/**
	 * Updates the content for the currently displayed statistics container.
	 */
	updateContainerContent() {
		if (statisticsAndGraphs.showId !== undefined && statisticsAndGraphs.showId !== "graphs") {
			var player = undefined;
			var teamSides;
			if (statisticsAndGraphs.showId === "comparison") { // comparison
				teamSides = ["A:left", "B:right"];
			} else {
				teamSides = [statisticsAndGraphs.showId.substring(0, 1) + ":both"];
				if (statisticsAndGraphs.showId.length > 1) { // player
					player = statisticsAndGraphs.showId;
				} // else team
			}
			for(var k=0; k<teamSides.length; ++k) {
				var teamSidesParts = teamSides[k].split(":");
				var teamId = teamSidesParts[0];
				var side = teamSidesParts[1];

				var identifiers = [];
				identifiers[0] = teamId;
				if(player === undefined) {
					for (var i = 1; i <= 11; i++) {
						identifiers[i] = teamId + i;
					}
				} else {
					identifiers[1] = player;
				}

				var dataBallPossession = [];
				var dataNumShots = [];
				var dataNumSetPlays = [];
				var dataNumPassSequences = [];
				var dataAvgPassSequenceLength = [];
				var dataMaxPassSequenceLength = [];
				var dataNumDoublePasses = [];
				var dataNumPasses = [];
				var dataPassSuccessRate = [];
				var dataPacking = [];
				var dataPassDirection = [];
				var dataDistance = [];
				var dataSpeed = [];
				var dataNumDribblings = [];
				var dataAvgDribblingDuration = [];
				var dataAvgDribblingLength = [];
				for(var i=0; i <identifiers.length; i++) {
					dataBallPossession[i] = "Ball Possession:" + identifiers[i] + ":Percentage," + this.valueOrZero(ballPossessionStatisticsConsumer.ballPossessionPercentage.get(identifiers[i]));
					dataNumShots[i] = "Number of Goals and Shots:" + identifiers[i] + ":Number of goals," + this.valueOrZero(shotStatisticsConsumer.numGoals.get(identifiers[i])) + ":Number of shots on target," + this.valueOrZero(shotStatisticsConsumer.numShotsOnTarget.get(identifiers[i])) + ":Number of shots off target," + this.valueOrZero(shotStatisticsConsumer.numShotsOffTarget.get(identifiers[i]));
					dataNumSetPlays[i] = "Number of Set Plays:" + identifiers[i] + ":Number of throwins," + this.valueOrZero(setPlayStatisticsConsumer.numThrowins.get(identifiers[i])) + ":Number of corner kicks," + this.valueOrZero(setPlayStatisticsConsumer.numCornerkicks.get(identifiers[i])) + ":Number of free kicks," + this.valueOrZero(setPlayStatisticsConsumer.numFreekicks.get(identifiers[i]))+ ":Number of goal kicks," + this.valueOrZero(setPlayStatisticsConsumer.numGoalkicks.get(identifiers[i])) + ":Number of penalties," + this.valueOrZero(setPlayStatisticsConsumer.numPenalties.get(identifiers[i]));
					dataNumPassSequences[i] = "Number of Pass Sequences:" + identifiers[i] + ":Number of pass sequences," + this.valueOrZero(passSequenceStatisticsConsumer.numPassSequences.get(identifiers[i]));
					dataAvgPassSequenceLength[i] = "Average Pass Sequence Length:" + identifiers[i] + ":Average pass sequence length," + this.valueOrZero(passSequenceStatisticsConsumer.avgPassSequenceLength.get(identifiers[i]));
					dataMaxPassSequenceLength[i] = "Maximal Pass Sequence Length:" + identifiers[i] + ":Maximal pass sequence length," + this.valueOrZero(passSequenceStatisticsConsumer.maxPassSequenceLength.get(identifiers[i]));
					dataNumDoublePasses[i] = "Number of Double Passes:" + identifiers[i] + ":Number of double passes," + this.valueOrZero(passSequenceStatisticsConsumer.numDoublePasses.get(identifiers[i]));
					dataNumPasses[i] = "Number of Passes:" + identifiers[i] + ":Number of successful passes," + this.valueOrZero(passStatisticsConsumer.numSuccessfulPasses.get(identifiers[i])) + ":Number of interceptions," + this.valueOrZero(passStatisticsConsumer.numInterceptions.get(identifiers[i])) + ":Number of misplaced passes," + this.valueOrZero(passStatisticsConsumer.numMisplacedPasses.get(identifiers[i])) + ":Number of clearances," + this.valueOrZero(passStatisticsConsumer.numClearances.get(identifiers[i]));
					dataPassSuccessRate[i] = "Pass Success Rate:" + identifiers[i] + ":Pass success rate," + this.valueOrZero(passStatisticsConsumer.passSuccessRate.get(identifiers[i]));
					dataPacking[i] = "Average Packing:" + identifiers[i] + ":Average packing," + this.valueOrZero(passStatisticsConsumer.avgPacking.get(identifiers[i]));
					dataPassDirection[i] = "Pass Directions:" + identifiers[i] + ":Forward," + this.valueOrZero(passStatisticsConsumer.forwardDirectionRate.get(identifiers[i])) + ":Backward," + this.valueOrZero(passStatisticsConsumer.backwardDirectionRate.get(identifiers[i])) + ":Left," + this.valueOrZero(passStatisticsConsumer.leftDirectionRate.get(identifiers[i])) + ":Right," + this.valueOrZero(passStatisticsConsumer.rightDirectionRate.get(identifiers[i]));
					dataDistance[i] = "Distance:" + identifiers[i] + ":Distance," + this.valueOrZero(distanceStatisticsConsumer.distance.get(identifiers[i]));
					dataSpeed[i] = "Speed:" + identifiers[i] + ":Standing," + this.valueOrZero(speedLevelStatisticsConsumer.standingPercentage.get(identifiers[i])) + ":Trot," + this.valueOrZero(speedLevelStatisticsConsumer.trotPercentage.get(identifiers[i])) + ":Low speed run," + this.valueOrZero(speedLevelStatisticsConsumer.lowSpeedRunPercentage.get(identifiers[i])) + ":Medium speed run," + this.valueOrZero(speedLevelStatisticsConsumer.mediumSpeedRunPercentage.get(identifiers[i])) + ":High speed run," + this.valueOrZero(speedLevelStatisticsConsumer.highSpeedRunPercentage.get(identifiers[i])) + ":Sprint," + this.valueOrZero(speedLevelStatisticsConsumer.sprintPercentage.get(identifiers[i]));
					dataNumDribblings[i] = "Number of Dribblings:" + identifiers[i] + ":Number of dribblings," + this.valueOrZero(dribblingStatisticsConsumer.numDribblings.get(identifiers[i]));
					dataAvgDribblingDuration[i] = "Average Dribbling Duration:" + identifiers[i] + ":Average dribbling duration," + this.valueOrZero(dribblingStatisticsConsumer.avgDribblingDuration.get(identifiers[i]));
					dataAvgDribblingLength[i] = "Average Dribbling Distance:" + identifiers[i] + ":Average dribbling distance," + this.valueOrZero(dribblingStatisticsConsumer.avgDribblingLength.get(identifiers[i]));
				}

				statisticsAndGraphs.updateStatistics("ballPossessionStatistics", side, dataBallPossession);
				statisticsAndGraphs.updateStatistics("shotNumStatistics", side, dataNumShots);
				statisticsAndGraphs.updateStatistics("setPlayNumStatistics", side, dataNumSetPlays);
				statisticsAndGraphs.updateStatistics("passSequenceNumStatistics", side, dataNumPassSequences);
				statisticsAndGraphs.updateStatistics("passSequenceAvgLengthStatistics", side, dataAvgPassSequenceLength);
				statisticsAndGraphs.updateStatistics("passSequenceMaxLengthStatistics", side, dataMaxPassSequenceLength);
				statisticsAndGraphs.updateStatistics("doublePassNumStatistics", side, dataNumDoublePasses);
				statisticsAndGraphs.updateStatistics("passNumStatistics", side, dataNumPasses);
				statisticsAndGraphs.updateStatistics("passSuccessStatistics", side, dataPassSuccessRate);
				statisticsAndGraphs.updateStatistics("packingStatistics", side, dataPacking);
				statisticsAndGraphs.updateStatistics("passDirectionStatistics", side, dataPassDirection);
				statisticsAndGraphs.updateStatistics("distanceStatistics", side, dataDistance);
				statisticsAndGraphs.updateStatistics("speedStatistics", side, dataSpeed);
				statisticsAndGraphs.updateStatistics("dribblingNumStatistics", side, dataNumDribblings);
				statisticsAndGraphs.updateStatistics("avgDribblingDurationStatistics", side, dataAvgDribblingDuration);
				statisticsAndGraphs.updateStatistics("avgDribblingLengthStatistics", side, dataAvgDribblingLength);
			}

		}
	}

	/**
	 * Returns the value or 0 if the value is undefined.
	 * @param value Value
	 * @returns {number|*} The value or 0
	 */
	valueOrZero(value) {
		if(value === undefined) {
			return 0;
		} else {
			return value;
		}
	}

	/**
	 * Updates the statistics for a certain type in the currently displayed statistics container.
	 * @param type Type of the statistics
	 * @param side Column of the statistics ("both", "left" or "right")
	 * @param data Statisticsal data
	 */
	updateStatistics(type, side, data){
		var width = 0;
		var selectPrefix = "";
		if(side == "both") {
			width = (Resizer.FIELD_WIDTH+2*Config.FIELD_BORDER) - 20;
			selectPrefix = "statistics-container-singleColumn-";
		} else if(side == "left") {
			width = parseInt(Resizer.FIELD_WIDTH/2+Config.FIELD_BORDER) - 20;
			selectPrefix = "statistics-container-doubleColumn-leftColumn-";
		} else {
			width = parseInt(Resizer.FIELD_WIDTH/2+Config.FIELD_BORDER) - 20;
			selectPrefix = "statistics-container-doubleColumn-rightColumn-";
		}

		var values = [];
		var valueMin, valueMax;
		for(var i=0; i<data.length; i++) {
			values[i] = [];
			var splittedDataItem = data[i].split(":");
			var curDataItemSum = 0;
			for (var j = 2; j < splittedDataItem.length; j++) {
				values[i][j] = Number(splittedDataItem[j].split(",")[1]);
				curDataItemSum = curDataItemSum + values[i][j];
			}
			if (valueMin === undefined ||curDataItemSum < valueMin) {
				valueMin = curDataItemSum;
			}
			if (valueMax === undefined ||curDataItemSum > valueMax) {
				valueMax = curDataItemSum;
			}
		}

		var barMaxWidth = width - 40 - (1 * (values[0].length-1));

		var min;
		var max;
		var unit;
		var defaultColor;
		switch (type) {
			case "distanceStatistics":
				unit = "m";
				min = 0;
				max = valueMax;
				defaultColor = Config.STATISTICS_NEUTRAL_FILL_COLORS;
				break;
			case "passSuccessStatistics":
			case "ballPossessionStatistics":
				unit = "%";
				min = 0;
				max = 100;
				defaultColor = Config.STATISTICS_NEUTRAL_FILL_COLORS;
				break;
			case "speedStatistics":
			case "passDirectionStatistics":
				unit = "%";
				min = 0;
				max = valueMax;
				defaultColor = Config.STATISTICS_NEUTRAL_FILL_COLORS;
				break;
			case "packingStatistics":
				unit = "";
				min = valueMin;
				max = valueMax;
				if(-min > max) {
					max = -min;
				}
				min = 0;
				defaultColor = [Config.STATISTICS_POSITIVE_FILL_COLOR]; // green
				break;
			default:
				unit = "";
				min = 0;
				max = valueMax;
				defaultColor = Config.STATISTICS_NEUTRAL_FILL_COLORS;
				break;
		}

		for(var i=0; i<data.length; i++) {
			var splittedDataItem = data[i].split(":");
			var statisticsLabel = splittedDataItem[0];
			var identifier = splittedDataItem[1];

			var tooltipIdentifier;
			if(identifier.length === 1) {
				tooltipIdentifier = matchMetadataConsumer.names.get(identifier);
			} else {
				tooltipIdentifier = matchMetadataConsumer.names.get(identifier) + " (" + identifier + ")";
			}
			var tooltipContent = "<div class='tooltip-header'><span class='tooltip-header-text'>" + statisticsLabel + " of " + tooltipIdentifier + "</span></div><div class='tooltip-text'>";
			var statisticsItemContent = "";
			for (var j = 2; j < splittedDataItem.length; j++) {
				var test = splittedDataItem[j].split(",");
				var valueLabel = test[0];
				var value = Number(test[1]);
				var valueText = Math.round(value*100)/100 + unit;
				var color = defaultColor[j-2];
				var posValue = value;
				if(posValue < 0 ) {
					posValue = -value;
					color = Config.STATISTICS_NEGATIVE_FILL_COLOR; // red
				}
				var barWidth = parseInt(Math.round((posValue/(max-min)) * barMaxWidth));
				if(barWidth < 1) {
					barWidth = 1;
				}
				if(posValue === 0) {
					barWidth = 1;
				}
				tooltipContent = tooltipContent + valueLabel + ": " + valueText;
				if(j != splittedDataItem.length - 1) {
					tooltipContent = tooltipContent + "<br>";
				}
				statisticsItemContent = statisticsItemContent + '<div class="statistics-item-bar" style="background: '+color+'; width: '+barWidth+'px">&nbsp;'+valueText+'</div>';
			}

			tooltipContent = tooltipContent + "<div>";

			var labelText = identifier;
			if(identifier.length === 1) {
				labelText = "Team";
			}
			var statisticsItemId = selectPrefix + type + "-" + identifier;
			$("#" + statisticsItemId).html("");
			$("#" + statisticsItemId).append('<div class="statistics-item-label">' + labelText + '</div>' + statisticsItemContent);
			$("#" + statisticsItemId).tooltipster('instance').content(tooltipContent);
		}
	}
}