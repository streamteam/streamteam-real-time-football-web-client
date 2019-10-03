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
 * Consumes elements of the dribblingEvent stream and visualizes the dribbling events
 */
class DribblingEventConsumer extends AbstractNonatomicEventConsumer {

	/**
	 * DribblingEventConsumer constructor.
	 */
	constructor() {
		super("dribblingEvent");

		this.points = [];
	}

	/**
	 * Processes a single new dribblingEvent stream element for later visualization.
	 *
	 * @param dataStreamElement Decoded dribblingEvent stream element
	 */
	updateForSingleDataStreamElement(dataStreamElement) {
		var phase = dataStreamElement.phase;

		if (phase === 3) { // END
			this.points = [];
		} else {
			this.points.push([dataStreamElement.positions[0].x, dataStreamElement.positions[0].y]);
		}
	}

	/**
	 * Updates the dribblingEvent visualization.
	 */
	updateEndOfSuccessHandling() {
		if ($('#visualize-dribbling-checkbox').prop("checked")) {
			field.displayMotionPath("dribbling", this.points, Config.DRIBBLING_PATH_STOKE_COLOR);
		}
	}
}
