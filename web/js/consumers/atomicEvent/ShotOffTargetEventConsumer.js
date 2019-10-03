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
 * Consumes elements of the shotOffTargetEvent stream and visualizes the shot off target events
 */
class ShotOffTargetEventConsumer extends AbstractAtomicEventConsumer {

	/**
	 * ShotOffTargetEventConsumer constructor.
	 */
	constructor() {
		super("shotOffTargetEvent");
	}

	/**
	 * Logs and visualizes a shot off target event.
	 *
	 * @param dataStreamElementValue Undecoded shotOffTargetEvent stream element
	 */
	logAndShowEvent(dataStreamElementValue) {
		if(typeof ImmutableDataStreamElementContent !== 'undefined' && typeof ShotOffTargetEventStreamElementPayload !== 'undefined') {
			var shotOffTargetEventStreamElement = decodeBase64EncodedImmutableDataStreamElement(dataStreamElementValue);

			var shotPlayerId = shotOffTargetEventStreamElement.objectIdentifiers[0];
			var shotPlayerX = parseFloat(shotOffTargetEventStreamElement.positions[0].x);
			var shotPlayerY = parseFloat(shotOffTargetEventStreamElement.positions[0].y);
			var leftFieldX = parseFloat(shotOffTargetEventStreamElement.positions[1].x);
			var leftFieldY = parseFloat(shotOffTargetEventStreamElement.positions[1].y);
			var length = Math.round(parseFloat(shotOffTargetEventStreamElement.payload.length));
			var velocity = Math.round(parseFloat(shotOffTargetEventStreamElement.payload.velocity)*3.6);
			var angle = Math.round(parseFloat(shotOffTargetEventStreamElement.payload.angle));
			var dirCat = shotOffTargetEventStreamElement.payload.direction;

			var logMsg = "Shot off Target by " + shotPlayerId + " (Length: " + length + "m, Velocity: " + velocity + "km/h, Dir: " + dirCat + " [" + angle + "°])";
			eventNotifier.log(logMsg);

			if($("#showEvents-shotOffTarget-checkbox").prop("checked")) {
				var displayText = "Shot off Target by " + shotPlayerId + "<br> (Length: " + length + "m, Velocity: " + velocity + "km/h, Dir: " + dirCat + " [" + angle + "°])";
				eventNotifier.showText(displayText);
				field.displayPass([{"startX":shotPlayerX, "startY":shotPlayerY, "endX":leftFieldX, "endY":leftFieldY}], Config.SHOT_OFF_TARGET_STROKE_COLOR);
			}
		}
	}
}
