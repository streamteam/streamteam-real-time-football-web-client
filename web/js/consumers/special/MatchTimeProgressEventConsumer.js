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
 * Consumes elements of the matchTimeProgressEvent stream, updates the time above the field and sets the proper video position
 */
class MatchTimeProgressEventConsumer extends AbstractStreamConsumer {

	/**
	 * MatchTimeProgressEventConsumer constructor.
	 */
	constructor() {
		super("matchTimeProgressEvent", queryDict.matchId, 1, Config.TIME_CONSUMPTION_INTERVAL_IN_MS);
		this.timeString = "00:00";
		this.timeInS = 0;
	}

	/**
	 * Handles a successful JSON result received after a consumption call.
	 *
	 * @param jsonResult Successful JSON result received after a consumption call
	 */
	handleSuccess(jsonResult) {
		if (typeof ImmutableDataStreamElementContent !== 'undefined' && typeof MatchTimeProgressEventStreamElementPayload !== 'undefined') {
			var offset = jsonResult.d[0].o;

			if (super.isNewDataStreamElement("matchTimeProgressEvent", offset)) {
				super.setLatestOffset("matchTimeProgressEvent", offset);

				var timeStreamElement = decodeBase64EncodedImmutableDataStreamElement(jsonResult.d[0].v);
				this.timeInS = parseInt(timeStreamElement.payload.matchTimeInS);

				var min = parseInt(this.timeInS / 60);
				var secs = this.timeInS % 60;

				if (min < 10) {
					min = "0" + min;
				}
				if (secs < 10) {
					secs = "0" + secs;
				}
				this.timeString = min + ":" + secs;
				$('#above-field-info-time').html(this.timeString);

				if (matchMetadataConsumer !== undefined) {
					if (!userInteraction.paused && !userInteraction.showField) {
						var myPlayer = videojs('video');
						if (myPlayer.paused()) {
							myPlayer.currentTime(matchMetadataConsumer.matchStartVideoOffset + this.timeInS);
							myPlayer.play();
						} else {
							var timeShift = myPlayer.currentTime() - (matchMetadataConsumer.matchStartVideoOffset + this.timeInS);
							if (timeShift < 0) {
								timeShift = -timeShift;
							}
							if (timeShift > Config.MAX_VIDEO_TIMESHIFT) {
								console.log("The video timeshift was too large (" + timeShift + "s) --> set current time");
								myPlayer.currentTime(matchMetadataConsumer.matchStartVideoOffset + this.timeInS);
							}
						}
					}
				}
			}
		}
	}
}
