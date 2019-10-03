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
 * Consumes elements of the distanceStatistics stream and updates the statistics visualization
 */
class DistanceStatisticsConsumer extends AbstractStatisticsConsumer {

	/**
	 * DistanceStatisticsConsumer constructor.
	 */
	constructor() {
		super("distanceStatistics");
		this.distance = new Map();
	}

	/**
	 * Updates the distance statistics.
	 *
	 * @param id Player/team identifier
	 * @param dataStreamElement Decoded distanceStatistics stream element
	 */
	updateStatisticsValues(id, dataStreamElement) {
		var distance = Math.round(dataStreamElement.payload.distance);

		this.distance.set(id, distance);
	}
}
