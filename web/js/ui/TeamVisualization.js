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
 * Visualizes the team arrangement
 */
class TeamVisualization {

	/**
	 * TeamVisualization constructor.
	 */
	constructor() {
		this.redrawIntervalId = null;

		this.roleHirarchy = {
			"role-player" : {
				"role-player-goal" : "role-player-goal",
				"role-player-field" : {
					"role-player-field-defence" : {
						"role-player-field-defence-inner" : "role-player-field-defence-inner",
						"role-player-field-defence-outer" : "role-player-field-defence-outer"
					},
					"role-player-field-midfield" : {
						"role-player-field-midfield-defensive" : "role-player-field-midfield-defensive",
						"role-player-field-midfield-offensive" : "role-player-field-midfield-offensive"
					},
					"role-player-field-offence" : {
						"role-player-field-offence-inner" : "role-player-field-offence-inner",
						"role-player-field-offence-outer" : "role-player-field-offence-outer"
					}
				}
			}
		};

		this.recentDrawingArray = [];
		this.recentDrawingType = undefined;
	}

	/**
	 * Initializes the team visualization canvas.
	 */
	initialize() {
		var fieldInnerSvg = $("#field-inner-svg");

		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'polyline'))
			.attr("id", 'field-visualizeTeam-svg-line')
			.attr("points", "0,0 10,10")
			.css("stroke", Config.TEAM_VISUALIZATION_STROKE_COLOR)
			.css("stroke-width", Config.TEAM_VISUALIZATION_STROKE_WIDTH * (Resizer.FIELD_WIDTH/1000))
			.css("fill", "none")
			.css("visibility", "hidden")
		);

		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'polygon'))
			.attr("id", 'field-visualizeTeam-svg-rect')
			.attr("points", "0,0 10,10")
			.css("stroke", Config.TEAM_VISUALIZATION_STROKE_COLOR)
			.css("stroke-width", Config.TEAM_VISUALIZATION_STROKE_WIDTH * (Resizer.FIELD_WIDTH/1000))
			.css("fill", Config.TEAM_VISUALIZATION_FILL_COLOR)
			.css("visibility", "hidden")
		);

		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'polygon'))
			.attr("id", 'field-visualizeTeam-svg-hull')
			.attr("points", "0,0 10,10")
			.css("stroke", Config.TEAM_VISUALIZATION_STROKE_COLOR)
			.css("stroke-width", Config.TEAM_VISUALIZATION_STROKE_WIDTH * (Resizer.FIELD_WIDTH/1000))
			.css("fill", Config.TEAM_VISUALIZATION_FILL_COLOR)
			.css("visibility", "hidden")
		);
	}

	/**
	 * Resizes the team visualization.
	 */
	resize() {
		$("#field-visualizeTeam-svg-line").css("stroke-width", Config.TEAM_VISUALIZATION_STROKE_WIDTH * (Resizer.FIELD_WIDTH/1000));
		$("#field-visualizeTeam-svg-rect").css("stroke-width", Config.TEAM_VISUALIZATION_STROKE_WIDTH * (Resizer.FIELD_WIDTH/1000));
		$("#field-visualizeTeam-svg-hull").css("stroke-width", Config.TEAM_VISUALIZATION_STROKE_WIDTH * (Resizer.FIELD_WIDTH/1000));
		if (teamVisualization.recentDrawingType !== undefined) {
			teamVisualization.drawSelection(teamVisualization.recentDrawingType, teamVisualization.recentDrawingArray);
		}
	}

	/**
	 * Toggles (i.e., adds or removes) a player on the currentRole
	 * @param player
	 */
	toggleRole(player) {
		if($("#" + player).hasClass(teamVisualization.currentRole + "-" + player[0])) {
			$("#" + player).removeClass(teamVisualization.currentRole + "-" + player[0]);
		}
		else {
			$("#" + player).addClass(teamVisualization.currentRole + "-" + player[0]);
		}
	}

	/**
	 * Retrieves a list containing the role given as a parameter and all its subroles by recursively traversing the hierarchy.
	 * @param hierarchy Role Hierarchy
	 * @param role Role
	 * @param team Team
	 * @returns {Array} List containing the role given as a parameter and all its subroles with an appended team identifier
	 */
	retrieveListIncludingSubroles(hierarchy, role, team){
		var roleArray = [];
		$.each(hierarchy, function(k, v) {
			if(typeof v != "string") {
				var subRoleArray = teamVisualization.retrieveListIncludingSubroles(this, role, team);
				if(subRoleArray.length > 0) {
					for(var i = 0; i< subRoleArray.length; ++i) {
						roleArray.push(subRoleArray[i]);
					}
				}
			}
			if(k.indexOf(role) >= 0) {
				roleArray.push(k + "-" + team);
			}
		});
		return roleArray;
	}

	/**
	 * Retrieves all players that are assigned to a role or one of its subroles.
	 * @param id Role with team identifier
	 * @returns {Array} List of players asssigned to the role
	 */
	retrievePlayersAssignedToRole(id){
		var role = id.substr(0,id.length-2);
		console.log(id + "," + role);
		var roleArray = [];
		if(id[id.length-1] === "A") {
			roleArray = teamVisualization.retrieveListIncludingSubroles(teamVisualization.roleHirarchy, role, "A");
		} else {
			roleArray = teamVisualization.retrieveListIncludingSubroles(teamVisualization.roleHirarchy, role, "B");
		}

		console.log("roleArray: " + roleArray);

		var players = [];
		$.each(roleArray, function(e, v) {
			var idArr;
			idArr = $('.' + v);
			$.each(idArr, function () {
				var player = $(this).attr('id');
				if ($.inArray(player, players)) players.push(player);
			});
		});
		return players;
	}

	/**
	 * Resets the team visualization canvas.
	 */
	resetCanvas(){
		teamVisualization.recentDrawingArray = [];
		teamVisualization.recentDrawingType = undefined;
		clearInterval(teamVisualization.redrawIntervalId);
		$("#field-visualizeTeam-svg-line").css("visibility", "hidden");
		$("#field-visualizeTeam-svg-rect").css("visibility", "hidden");
		$("#field-visualizeTeam-svg-hull").css("visibility", "hidden");
	}

	/**
	 * Calls the draw function specified by the type.
	 * @param type Type of the drawing.
	 */
	drawSelection(type, playerArray){
		teamVisualization.recentDrawingType = type;
		teamVisualization.recentDrawingArray = playerArray;
		clearInterval(teamVisualization.redrawIntervalId);
		console.log(playerArray);

		switch(type) {
			case 'line':
				teamVisualization.redrawLine(playerArray);
				teamVisualization.redrawIntervalId = setInterval(function() {teamVisualization.redrawLine(playerArray);}, 20);
				break;
			case 'rect':
				teamVisualization.redrawRectangle(playerArray);
				teamVisualization.redrawIntervalId = setInterval(function() {teamVisualization.redrawRectangle(playerArray);}, 20);
				break;
			case 'hull':
				teamVisualization.redrawHull(playerArray);
				teamVisualization.redrawIntervalId = setInterval(function() {teamVisualization.redrawHull(playerArray);}, 20);
				break;
			default:
				console.log("No such draw type: " + type);
		}
	};

	/**
	 * Draws a line through a list of players
	 * @param arr List of players
	 */
	redrawLine(arr){
		var linePoints = [];
		$.each(arr, function(i, v){
			var jqueryObj = $("#" + v);
			linePoints[i] = [parseInt(jqueryObj.attr('cx')), parseInt(jqueryObj.attr('cy'))];
		});

		linePoints.sort(function(a,b) {
			return a[1]-b[1];
		});

		var pointsString = teamVisualization.generatePointsString(linePoints);

		$("#field-visualizeTeam-svg-line").attr("points", pointsString)
			.css("visibility", "visible");
	}

	/**
	 * Draws a rectangle around a list of players.
	 * @param arr List of players
	 */
	redrawRectangle(arr){
		var minX, maxX, minY, maxY;
		$.each(arr, function(i, v){
			var jqueryObj = $("#" + v);
			var x = parseInt(jqueryObj.attr('cx'));
			var y = parseInt(jqueryObj.attr('cy'));
			if(minX === undefined || x < minX) {
				minX = x;
			}
			if(maxX === undefined || x > maxX) {
				maxX = x;
			}
			if(minY === undefined || y < minY) {
				minY = y;
			}
			if(maxY === undefined || y > maxY) {
				maxY = y;
			}
		});
		var corners = [[minX, minY], [minX, maxY], [maxX, maxY], [maxX, minY]];

		var pointsString = teamVisualization.generatePointsString(corners);

		$("#field-visualizeTeam-svg-rect").attr("points", pointsString)
			.css("visibility", "visible");
	}

	/**
	 * Draws a convex hull around a list of players.
	 * @param arr List of players
	 */
	redrawHull(arr){
		if(arr.length > 2){
			var convexHull = new ConvexHullGrahamScan();
			$.each(arr, function(i,v){
				var jqueryObj = $("#" + v);
				convexHull.addPoint(parseInt(jqueryObj.attr('cx')), parseInt(jqueryObj.attr('cy')));
			});

			var	hullPoints = convexHull.getHull();

			var hullPointsAsArrays = [];
			for(var i = 0; i<hullPoints.length; ++i) {
				hullPointsAsArrays[i] = [hullPoints[i].x, hullPoints[i].y];
			}

			var pointsString = teamVisualization.generatePointsString(hullPointsAsArrays);

			$("#field-visualizeTeam-svg-hull").attr("points", pointsString)
				.css("visibility", "visible");
		}
	}

	/**
	 * Generate a string with all points for a svg polygon or polyline.
	 * @param pointArray Array of points
	 * @returns Points string
	 */
	generatePointsString(pointArray) {
		var pointsString = "";
		for (var i = 0, n = pointArray.length; i < n; ++i) {
			var x = pointArray[i][0];
			var y = pointArray[i][1];
			pointsString = pointsString + x + "," + y + " ";
		}
		return pointsString;
	}
}
