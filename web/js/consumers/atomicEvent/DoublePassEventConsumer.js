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
 * Consumes elements of the doublePassEvent stream and visualizes the double pass
 */
class DoublePassEventConsumer extends AbstractAtomicEventConsumer {

	/**
	 * DoublePassEventConsumer constructor.
	 */
	constructor() {
		super("doublePassEvent");
	}

	/**
	 * Logs and visualizes a double pass event.
	 *
	 * @param dataStreamElementValue Undecoded doublePassEvent stream element
	 */
	logAndShowEvent(dataStreamElementValue) {
		if(typeof ImmutableDataStreamElementContent !== 'undefined' && typeof DoublePassEventStreamElementPayload !== 'undefined') {
			var doublePassEventStreamElement = decodeBase64EncodedImmutableDataStreamElement(dataStreamElementValue);

			var passes = [];
			for (var i = 0; i < 2; i++) {
				var kickX = parseFloat(doublePassEventStreamElement.positions[i*2].x);
				var kickY = parseFloat(doublePassEventStreamElement.positions[i*2].y);
				var receiveX = parseFloat(doublePassEventStreamElement.positions[(i*2)+1].x);
				var receiveY = parseFloat(doublePassEventStreamElement.positions[(i*2)+1].y);
				passes.push({"startX":kickX, "startY":kickY, "endX":receiveX, "endY":receiveY});
			}

			var displayText = "Double pass: " + doublePassEventStreamElement.objectIdentifiers[0] + " &#10132; " + doublePassEventStreamElement.objectIdentifiers[1] + " &#10132; " + doublePassEventStreamElement.objectIdentifiers[0];

			eventNotifier.log(displayText);

			if($("#showEvents-doublePass-checkbox").prop("checked")) {
				eventNotifier.showText(displayText);
				field.displayPass(passes, Config.SUCCESSFUL_PASS_STROKE_COLOR);
			}
		}
	}
}
