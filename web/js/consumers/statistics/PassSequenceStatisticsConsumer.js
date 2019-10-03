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
 * Consumes elements of the passSequenceStatistics stream and updates the statistics visualization
 */
class PassSequenceStatisticsConsumer extends AbstractStatisticsConsumer {

	/**
	 * PassSequenceStatisticsConsumer constructor.
	 */
	constructor() {
		super("passSequenceStatistics");
		this.numPassSequences = new Map();
		this.avgPassSequenceLength = new Map();
		this.maxPassSequenceLength = new Map();
		this.numDoublePasses = new Map();
	}

	/**
	 * Updates the pass sequence statistics.
	 *
	 * @param id Player/team identifier
	 * @param dataStreamElement Decoded passSequenceStatistics stream element
	 */
	updateStatisticsValues(id, dataStreamElement) {
		var numPassSequences = parseInt(dataStreamElement.payload.numPassSequences);
		var avgPassSequenceLength = dataStreamElement.payload.avgPassSequenceLength;
		var maxPassSequenceLength = parseInt(dataStreamElement.payload.maxPassSequenceLength);
		var numDoublePasses = parseInt(dataStreamElement.payload.numDoublePasses);

		this.numPassSequences.set(id, numPassSequences);
		this.avgPassSequenceLength.set(id, avgPassSequenceLength);
		this.maxPassSequenceLength.set(id, maxPassSequenceLength);
		this.numDoublePasses.set(id, numDoublePasses);
	}
}
