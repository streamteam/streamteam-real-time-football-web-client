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
 * Consumes elements of the goalkickEvent stream and shows a text in the event notifier box for each detected goalkick
 */
class GoalkickEventConsumer extends AbstractAtomicEventConsumer {

	/**
	 * GoalkickEventConsumer constructor.
	 */
	constructor() {
		super("goalkickEvent");
	}

	/**
	 * Logs a goalkick event.
	 *
	 * @param dataStreamElementValue Undecoded goalkickEvent stream element
	 */
	logAndShowEvent(dataStreamElementValue) {
		if(typeof ImmutableDataStreamElementContent !== 'undefined' && typeof GoalkickEventStreamElementPayload !== 'undefined') {
			var goalkickEventStreamElement = decodeBase64EncodedImmutableDataStreamElement(dataStreamElementValue);

			var displayText = "Goal Kick by " + goalkickEventStreamElement.objectIdentifiers[0];

			eventNotifier.log(displayText);

			if($("#showEvents-goalkick-checkbox").prop("checked")) {
				eventNotifier.showText(displayText);
			}
		}
	}
}
