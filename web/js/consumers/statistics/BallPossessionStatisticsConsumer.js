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
 * Consumes elements of the ballPossessionStatistics stream and updates the statistics visualization
 */
class BallPossessionStatisticsConsumer extends AbstractStatisticsConsumer {

	/**
	 * BallPossessionStatisticsConsumer constructor.
	 */
	constructor() {
		super("ballPossessionStatistics");
		this.ballPossessionPercentage = new Map();
	}

	/**
	 * Updates the ball possession statistics.
	 *
	 * @param id Player/team identifier
	 * @param dataStreamElement Decoded ballPossessionStatistics stream element
	 */
	updateStatisticsValues(id, dataStreamElement) {
		var ballPossessionPercentage = parseFloat(dataStreamElement.payload.percentage)*100;

		this.ballPossessionPercentage.set(id, ballPossessionPercentage);
	}
}
