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
 * Consumes elements of the matchMetadata stream, updates the match selection, and extracts/uses the important metadata
 */
class MatchMetadataConsumer extends AbstractStreamConsumer {

	/**
	 * MatchesConsumer constructor.
	 */
	constructor() {
		super("matchMetadata", "_ALL", Config.MATCHMETADATA_CONSUMPTION_LIMIT, Config.MATCHMETADATA_CONSUMPTION_INTERVAL_IN_MS); // _ALL is the dedicated all-key of the Kafka REST Proxy

		this.weekArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

		this.names = new Map();
	}

	/**
	 * Handles a successful JSON result received after a consumption call.
	 *
	 * @param jsonResult Successful JSON result received after a consumption call
	 */
	handleSuccess(jsonResult) {
		if (typeof ImmutableDataStreamElementContent !== 'undefined' && typeof MatchMetadataConsumer !== 'undefined') {
			var curMatchIdIsInList = false;
			var optionsArray = [];

			for (var i = 0; i < jsonResult.d.length; ++i) {
				var matchesStreamElement = decodeBase64EncodedImmutableDataStreamElement(jsonResult.d[i].v);

				var matchId = jsonResult.d[i].k;
				var generationTimestampFirstDataStreamElementOfTheMatch = matchesStreamElement.payload.generationTimestampFirstDataStreamElementOfTheMatch;
				var fieldLength = matchesStreamElement.payload.fieldLength;
				var fieldWidth = matchesStreamElement.payload.fieldWidth;
				var matchStartUnixTs = matchesStreamElement.payload.matchStartUnixTs;
				var objectMap = matchesStreamElement.payload.objectRenameMap;
				var teamMap = matchesStreamElement.payload.teamRenameMap;
				var videoPath = matchesStreamElement.payload.videoPath;
				var matchStartVideoOffset = matchesStreamElement.payload.matchStartVideoOffset;
				var teamColorMap = matchesStreamElement.payload.teamColorMap;

				//http://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
				var date = new Date(parseInt(matchStartUnixTs));

				if (matchId === queryDict.matchId) {
					curMatchIdIsInList = true;

					this.videoPath = videoPath;
					this.matchStartVideoOffset = matchStartVideoOffset;
					this.generationTimestampFirstDataStreamElementOfTheMatch = generationTimestampFirstDataStreamElementOfTheMatch;

					if (typeof field !== 'undefined' && typeof userInteraction !== 'undefined') {
						if (typeof field.maxXInM === 'undefined' && typeof field.minXInM === 'undefined' && typeof field.maxYInM === 'undefined' && typeof field.minYInM === 'undefined') {
							field.maxXInM = parseFloat(fieldLength) / 2;
							field.minXInM = -field.maxXInM;
							field.maxYInM = parseFloat(fieldWidth) / 2;
							field.minYInM = -field.maxYInM;
							console.log("minX=" + field.minXInM + " maxX=" + field.maxXInM + " minY=" + field.minYInM + " maxY=" + field.maxYInM);

							resizer.setSizes();
							field.initializeField(); // field lines (lowest level in svg)
							teamVisualization.initialize(); // team visualization (middle level in svg)
							field.initializeObjects(); // players, ball and offside line (top level in svg)
							field.startDistanceVisualization();
							heatmap.initialize();
						}

						var objectMapParts = objectMap.split("%");
						for (var j = 0; j < objectMapParts.length; ++j) {
							var objectDef = objectMapParts[j].substring(1, objectMapParts[j].length - 1);
							var objectDefParts = objectDef.split(":");
							var objectId = objectDefParts[1];
							// http://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html
							var objectName = this.anonymize(decodeURIComponent(escape(objectDefParts[2])));
							this.names.set(objectId, objectName);
							if (objectId !== "BALL") {
								userInteraction.setPlayerName(objectId, objectName);
								field.setObjectLabel(objectId, objectName + " (" + objectId + ")");
							} else {
								field.setObjectLabel(objectId, objectName);
							}
						}
						var teamMapParts = teamMap.split("%");
						for (var j = 0; j < teamMapParts.length; ++j) {
							var teamDef = teamMapParts[j].substring(1, teamMapParts[j].length - 1);
							var teamDefParts = teamDef.split(":");
							var teamId = teamDefParts[1];
							// http://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html
							var teamName = this.anonymize(decodeURIComponent(escape(teamDefParts[2])));
							this.names.set(teamId, teamName);
						}

						var teamColorMapParts = teamColorMap.split("%");
						for (var j = 0; j < teamColorMapParts.length; ++j) {
							var teamColorDef = teamColorMapParts[j].substring(1, teamColorMapParts[j].length - 1);
							var teamColorDefParts = teamColorDef.split(":");
							var teamId = teamColorDefParts[0];
							var teamColor = teamColorDefParts[1];

							field.setTeamColor(teamId, teamColor);
							userInteraction.setTeamName(teamId, this.names.get(teamId), teamColor);
						}
					}
				}

				var dateString = this.weekArray[date.getDay()] + ", " + this.createTwoDigitString(date.getDate()) + "." + this.createTwoDigitString((date.getMonth() + 1)) + "." + date.getFullYear() + " " + this.createTwoDigitString(date.getHours()) + ":" + this.createTwoDigitString(date.getMinutes()) + ":" + this.createTwoDigitString(date.getSeconds());

				optionsArray.push([matchId, dateString, matchStartUnixTs]);
			}

			if (!curMatchIdIsInList && queryDict.matchId !== undefined) {
				optionsArray.push([queryDict.matchId, "No information", 0]);
			}

			optionsArray = optionsArray.sort(function (a, b) {
				return -(a[2] - b[2])
			});

			var optionsString = "";
			for (var i = 0; i < optionsArray.length; ++i) {
				optionsString = optionsString + '<option value="' + optionsArray[i][0] + '">' + optionsArray[i][0] + ' (' + optionsArray[i][1] + ')</option>'
			}

			$('#match-selection-dropdown').selectBox('options', optionsString);
			if (queryDict.matchId !== undefined) {
				$('#match-selection-dropdown').selectBox('value', queryDict.matchId);
			}
		}
	}

	/**
	 * Creates a two digit String given a value.
	 *
	 * @param value Value
	 * @returns {string} Two digit String
	 */
	createTwoDigitString(value) {
		if(value < 10) {
			return "0" + value.toString();
		} else {
			return value.toString();
		}
	}

	/**
	 * Anonymizes a name.
	 *
	 * @param name Name
	 * @returns {string|*} Anonymized Name
	 */
	anonymize(name) {
		if(name === "Ball") {
			return name;
		} else if(Config.ANONYMIZE_NAMES) {
			var res = "";
			for(var k = 0; k < name.length; ++k) {
				if(k < Config.ANONYMIZE_MAX_CHARS) {
					res = res + name[k];
				} else {
					res = res + "*";
				}
			}
			while(res.length < Config.ANONYMIZE_MIN_LENGTH) {
				res = res + "*";
			}
			return res;
		} else {
			return name;
		}
	}
}
