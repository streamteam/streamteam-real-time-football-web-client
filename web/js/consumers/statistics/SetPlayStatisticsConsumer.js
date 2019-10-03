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
 * Consumes elements of the setPlayStatistics stream and updates the statistics visualization
 */
class SetPlayStatisticsConsumer extends AbstractStatisticsConsumer {

	/**
	 * SetPlayStatisticsConsumer constructor.
	 */
	constructor() {
		super("setPlayStatistics");
		this.numFreekicks = new Map();
		this.numCornerkicks = new Map();
		this.numGoalkicks = new Map();
		this.numPenalties = new Map();
		this.numThrowins = new Map();
	}

	/**
	 * Updates the set play statistics.
	 *
	 * @param id Player/team identifier
	 * @param dataStreamElement Decoded setPlayStatistics stream element
	 */
	updateStatisticsValues(id, dataStreamElement) {
		var numFreekicks = parseInt(dataStreamElement.payload.numFreekicks);
		var numCornerkicks = parseInt(dataStreamElement.payload.numCornerkicks);
		var numGoalkicks = parseInt(dataStreamElement.payload.numGoalkicks);
		var numPenalties = parseInt(dataStreamElement.payload.numPenalties);
		var numThrowins = parseInt(dataStreamElement.payload.numThrowins);

		this.numFreekicks.set(id, numFreekicks);
		this.numCornerkicks.set(id, numCornerkicks);
		this.numGoalkicks.set(id, numGoalkicks);
		this.numPenalties.set(id, numPenalties);
		this.numThrowins.set(id, numThrowins);
	}
}
