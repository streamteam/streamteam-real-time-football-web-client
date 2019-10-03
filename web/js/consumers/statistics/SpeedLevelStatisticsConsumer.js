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
 * Consumes elements of the speedLevelStatistics stream and updates the statistics visualization
 */
class SpeedLevelStatisticsConsumer extends AbstractStatisticsConsumer {

	/**
	 * SpeedLevelStatisticsConsumer constructor.
	 */
	constructor() {
		super("speedLevelStatistics");
		this.standingPercentage = new Map();
		this.trotPercentage = new Map();
		this.lowSpeedRunPercentage = new Map();
		this.mediumSpeedRunPercentage = new Map();
		this.highSpeedRunPercentage = new Map();
		this.sprintPercentage = new Map();
	}

	/**
	 * Updates the speed level statistics.
	 *
	 * @param id Player/team identifier
	 * @param dataStreamElement Decoded speedLevelStatistics stream element
	 */
	updateStatisticsValues(id, dataStreamElement) {
		var standingPercentage = dataStreamElement.payload.percentage[0]*100;
		var trotPercentage = dataStreamElement.payload.percentage[1]*100;
		var lowSpeedRunPercentage = dataStreamElement.payload.percentage[2]*100;
		var mediumSpeedRunPercentage = dataStreamElement.payload.percentage[3]*100;
		var highSpeedRunPercentage = dataStreamElement.payload.percentage[4]*100;
		var sprintPercentage = dataStreamElement.payload.percentage[5]*100;

		this.standingPercentage.set(id, standingPercentage);
		this.trotPercentage.set(id, trotPercentage);
		this.lowSpeedRunPercentage.set(id, lowSpeedRunPercentage);
		this.mediumSpeedRunPercentage.set(id, mediumSpeedRunPercentage);
		this.highSpeedRunPercentage.set(id, highSpeedRunPercentage);
		this.sprintPercentage.set(id, sprintPercentage);
	}
}
