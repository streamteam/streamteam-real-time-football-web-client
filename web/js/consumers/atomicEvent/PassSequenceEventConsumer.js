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
 * Consumes elements of the passSequenceEvent stream and visualizes the pass sequence
 */
class PassSequenceEventConsumer extends AbstractAtomicEventConsumer {

	/**
	 * PassSequenceEventConsumer constructor.
	 */
	constructor() {
		super("passSequenceEvent");
	}

	/**
	 * Logs and visualizes a pass sequence event.
	 *
	 * @param dataStreamElementValue Undecoded passSequenceEvent stream element
	 */
	logAndShowEvent(dataStreamElementValue) {
		if(typeof ImmutableDataStreamElementContent !== 'undefined' && typeof PassSequenceEventStreamElementPayload !== 'undefined') {
			var passSequenceEventStreamElement = decodeBase64EncodedImmutableDataStreamElement(dataStreamElementValue);

			var displayText = "Pass sequence: ";

			var numPasses = passSequenceEventStreamElement.payload.numPasses;

			var passes = [];
			for (var i = 0; i < numPasses; i++) {
				var kickPlayerId = passSequenceEventStreamElement.objectIdentifiers[i];
				displayText = displayText + kickPlayerId + " -> ";

				var kickX = parseFloat(passSequenceEventStreamElement.positions[i*2].x);
				var kickY = parseFloat(passSequenceEventStreamElement.positions[i*2].y);
				var receiveX = parseFloat(passSequenceEventStreamElement.positions[(i*2)+1].x);
				var receiveY = parseFloat(passSequenceEventStreamElement.positions[(i*2)+1].y);
				passes.push({"startX":kickX, "startY":kickY, "endX":receiveX, "endY":receiveY});
			}

			var lastReceivePlayerId = passSequenceEventStreamElement.objectIdentifiers[numPasses];

			displayText = displayText + lastReceivePlayerId;

			eventNotifier.log(displayText);

			if($("#showEvents-passSequence-checkbox").prop("checked")) {
				eventNotifier.showText(displayText);
				field.displayPass(passes, Config.SUCCESSFUL_PASS_STROKE_COLOR);
			}
		}
	}
}
