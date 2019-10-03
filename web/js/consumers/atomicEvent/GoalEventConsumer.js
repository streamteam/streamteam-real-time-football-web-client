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
 * Consumes elements of the goalEvent stream and visualizes the goal events
 */
class GoalEventConsumer extends AbstractAtomicEventConsumer {

	/**
	 * GoalEventConsumer constructor.
	 */
	constructor() {
		super("goalEvent");
	}

	/**
	 * Logs and visualizes a goal event.
	 *
	 * @param dataStreamElementValue Undecoded goalEvent stream element
	 */
	logAndShowEvent(dataStreamElementValue) {
		if(typeof ImmutableDataStreamElementContent !== 'undefined' && typeof GoalEventStreamElementPayload !== 'undefined') {
			var goalEventStreamElement = decodeBase64EncodedImmutableDataStreamElement(dataStreamElementValue);

			var shotPlayerId = goalEventStreamElement.objectIdentifiers[0];
			var shotPlayerX = parseFloat(goalEventStreamElement.positions[0].x);
			var shotPlayerY = parseFloat(goalEventStreamElement.positions[0].y);
			var leftFieldX = parseFloat(goalEventStreamElement.positions[1].x);
			var leftFieldY = parseFloat(goalEventStreamElement.positions[1].y);
			var length = Math.round(parseFloat(goalEventStreamElement.payload.length));
			var velocity = Math.round(parseFloat(goalEventStreamElement.payload.velocity)*3.6);
			var angle = Math.round(parseFloat(goalEventStreamElement.payload.angle));
			var dirCat = goalEventStreamElement.payload.direction;

			var logMsg = "Goal by " + shotPlayerId + " (Length: " + length + "m, Velocity: " + velocity + "km/h, Dir: " + dirCat + " [" + angle + "°])";
			eventNotifier.log(logMsg);

			if($("#showEvents-goal-checkbox").prop("checked")) {
				var displayText = "Goal by " + shotPlayerId + "<br> (Length: " + length + "m, Velocity: " + velocity + "km/h, Dir: " + dirCat + " [" + angle + "°])";
				eventNotifier.showText(displayText);
				field.displayPass([{"startX":shotPlayerX, "startY":shotPlayerY, "endX":leftFieldX, "endY":leftFieldY}], Config.GOAL_STROKE_COLOR);
			}
		}
	}
}
