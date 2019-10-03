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
 * Consumes elements of the shotStatistics stream and updates the statistics visualization
 */
class ShotStatisticsConsumer extends AbstractStatisticsConsumer {

	/**
	 * ShotStatisticsConsumer constructor.
	 */
	constructor() {
		super("shotStatistics");
		this.numGoals = new Map();
		this.numShotsOnTarget = new Map();
		this.numShotsOffTarget = new Map();
	}

	/**
	 * Updates the set play statistics.
	 *
	 * @param id Player/team identifier
	 * @param dataStreamElement Decoded setPlayStatistics stream element
	 */
	updateStatisticsValues(id, dataStreamElement) {
		var numGoals = parseInt(dataStreamElement.payload.numGoals);
		var numShotsOnTarget = parseInt(dataStreamElement.payload.numShotsOnTarget);
		var numShotsOffTarget = parseInt(dataStreamElement.payload.numShotsOffTarget);

		this.numGoals.set(id, numGoals);
		this.numShotsOnTarget.set(id, numShotsOnTarget);
		this.numShotsOffTarget.set(id, numShotsOffTarget);
	}
}
