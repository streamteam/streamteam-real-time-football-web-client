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
 * Consumes elements of the penaltyEvent stream and shows a text in the event notifier box for each detected penalty
 */
class PenaltyEventConsumer extends AbstractAtomicEventConsumer {

	/**
	 * PenaltyEventConsumer constructor.
	 */
	constructor() {
		super("penaltyEvent");
	}

	/**
	 * Logs a penalty event.
	 *
	 * @param dataStreamElementValue Undecoded penaltyEvent stream element
	 */
	logAndShowEvent(dataStreamElementValue) {
		if(typeof ImmutableDataStreamElementContent !== 'undefined' && typeof PenaltyEventStreamElementPayload !== 'undefined') {
			var penaltyEventStreamElement = decodeBase64EncodedImmutableDataStreamElement(dataStreamElementValue);

			var displayText = "Penalty by " + penaltyEventStreamElement.objectIdentifiers[0];

			eventNotifier.log(displayText);

			if($("#showEvents-penalty-checkbox").prop("checked")) {
				eventNotifier.showText(displayText);
			}
		}
	}
}
