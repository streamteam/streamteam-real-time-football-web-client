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
 * Consumes elements of the dribblingEvent stream and visualizes the under pressure highlighting
 */
class UnderPressureEventConsumer extends AbstractNonatomicEventConsumer {

	/**
	 * UnderPressureEventConsumer constructor.
	 */
	constructor() {
		super("underPressureEvent");
	}

	/**
	 * Updates the under pressure highlighting for a single new underPressureEvent stream element.
	 *
	 * @param dataStreamElement Decoded underPressureEvent stream element
	 */
	updateForSingleDataStreamElement(dataStreamElement) {
		var defendingPlayerId = dataStreamElement.objectIdentifiers[0];
		var attackingPlayerId = dataStreamElement.objectIdentifiers[1];
		var phase = dataStreamElement.phase;

		var player = dataStreamElement.objectIdentifiers[0];
		var phase = dataStreamElement.phase;

		if (phase === 1) { // START
			if ($('#visualize-underPressure-checkbox').prop("checked")) {
				field.highlightPlayerUnderPressure(player);
				this.playerUnderPressure = player;
			}
		} else if (phase === 3) { // END
			if ($('#visualize-underPressure-checkbox').prop("checked")) {
				field.removeUnderPressureHighlight(player);
				this.playerUnderPressure = undefined;
			}
		}
	}

	/**
	 * Does nothing since the visualization is updated for every new underPressureEvent stream element.
	 */
	updateEndOfSuccessHandling() {
		// empty by intention
	}
}
