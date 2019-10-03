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
 * Consumes elements of the passStatistics stream and updates the statistics visualization
 */
class PassStatisticsConsumer extends AbstractStatisticsConsumer {

	/**
	 * PassStatisticsConsumer constructor.
	 */
	constructor() {
		super("passStatistics");
		this.numSuccessfulPasses = new Map();
		this.numInterceptions = new Map();
		this.numMisplacedPasses = new Map();
		this.numClearances = new Map();
		this.passSuccessRate = new Map();
		this.forwardDirectionRate = new Map();
		this.backwardDirectionRate = new Map();
		this.leftDirectionRate = new Map();
		this.rightDirectionRate = new Map();
		this.avgPacking = new Map();
	}

	/**
	 * Updates the pass statistics.
	 *
	 * @param id Player/team identifier
	 * @param dataStreamElement Decoded passStatistics stream element
	 */
	updateStatisticsValues(id, dataStreamElement) {
		var numSuccessfulPasses = parseInt(dataStreamElement.payload.numSuccessfulPasses);
		var numInterceptions = parseInt(dataStreamElement.payload.numInterceptions);
		var numMisplacedPasses = parseInt(dataStreamElement.payload.numMisplacedPasses);
		var numClearances = parseInt(dataStreamElement.payload.numClearances);
		var passSuccessRate = dataStreamElement.payload.passSuccessRate*100;
		var forwardDirectionRate = dataStreamElement.payload.forwardDirectionRate*100;
		var backwardDirectionRate = dataStreamElement.payload.backwardDirectionRate*100;
		var leftDirectionRate = dataStreamElement.payload.leftDirectionRate*100;
		var rightDirectionRate = dataStreamElement.payload.rightDirectionRate*100;
		var avgPacking = dataStreamElement.payload.avgPacking;

		this.numSuccessfulPasses.set(id, numSuccessfulPasses);
		this.numInterceptions.set(id, numInterceptions);
		this.numMisplacedPasses.set(id, numMisplacedPasses);
		this.numClearances.set(id, numClearances);
		this.passSuccessRate.set(id, passSuccessRate);
		this.forwardDirectionRate.set(id, forwardDirectionRate);
		this.backwardDirectionRate.set(id, backwardDirectionRate);
		this.leftDirectionRate.set(id, leftDirectionRate);
		this.rightDirectionRate.set(id, rightDirectionRate);
		this.avgPacking.set(id, avgPacking);
	}
}
