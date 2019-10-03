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
 * Visualizes the event notifications
 */
class EventNotifier {

	/**
	 * EventNotifier constructor.
	 *
	 * @param width Width
	 * @param height Height
	 */
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}

	/**
	 * Adds an event to the event log
	 * @param logMsg Log message
	 */
	log(logMsg) {
		if(!userInteraction.blockEventVisualization) {
			var br = "";
			if ($('#eventNotifier-container-log-text').html() !== "") {
				br = "<br>\n";
			}

			$('#eventNotifier-container-log-text').prepend("&nbsp;[" + matchTimeProgressEventConsumer.timeString + "] " + logMsg + br);
		}
	}

	/**
	 * Shows an event in the event notifier container.
	 * @param displayText Text to be shown
	 */
	showText(displayText) {
		if(!userInteraction.blockEventVisualization) {
			clearTimeout(this.showTextTimeout);

			$('#eventNotifier-container-text').html(displayText).css('visibility', 'visible');

			this.showTextTimeout = window.setTimeout(function () {
				$('#eventNotifier-container-text').css('visibility', 'hidden');
			}, Config.OVERLAY_DISPLAY_DURATION_IN_MS);
		}
	}
}