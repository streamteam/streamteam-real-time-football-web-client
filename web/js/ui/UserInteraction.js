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
 * Manages all user interactions
 */
class UserInteraction {

	/**
	 * UserInteraction constructor.
	 */
	constructor() {
		this.paused = false;

		this.blockEventVisualization = true;

		// https://stackoverflow.com/questions/287903/enums-in-javascript
		this.ModeEnum = Object.freeze({NORMAL: 0, ROLEASSIGNMENT: 1, CUSTOMSELECTION: 2});
		this.mode = this.ModeEnum.NORMAL;

		this.currentlySelectedPlayers = [];

		this.showField = true;
	}

	/**
	 * Performs all jQuery bindings.
	 */
	initialize() {
		// =============================================================
		// === WINDOW RESIZING                                       ===
		// =============================================================
		$( window ).resize(function() {
			var oldFieldSize = Resizer.FIELD_WIDTH;
			resizer.setSizes();

			var multiplicator = Resizer.FIELD_WIDTH/oldFieldSize;
			field.resize(multiplicator);
			heatmap.resize(multiplicator);
			teamVisualization.resize();
			statisticsAndGraphs.resize();
		});

		// =============================================================
		// === KEYBOARD                                              ===
		// =============================================================

		// Bind pause key codes to pause function
		$(document).on('keyup', function (e) {
			// https://stackoverflow.com/questions/143847/best-way-to-find-if-an-item-is-in-a-javascript-array
			if (Config.PAUSE_KEY_CODES.indexOf(e.keyCode) !== -1) {
				userInteraction.togglePause();
			}
		});

		// =============================================================
		// === Modals                                                ===
		// =============================================================

		// Bind click on x button
		$(document).on('click', '#modal-close-button', function (e) {
			userInteraction.resetCurrentlySelectedPlayers();
			if(userInteraction.mode === userInteraction.ModeEnum.ROLEASSIGNMENT) {
				userInteraction.removeRoleAssignmentInfoBelowField();
				userInteraction.mode = userInteraction.ModeEnum.NORMAL;
			}
			if($(e.target).parent().html().startsWith("Single Role Visualization") || $(e.target).parent().html().startsWith("Multiple Role Visualization") || $(e.target).parent().html().startsWith("Custom Visualization")) {
				userInteraction.updateVisualizationMenuHighlighting(undefined);
			}
			$('#modal').toggle();
		});

		// Bind click on cancel button
		$(document).on('click', '#modal-cancel-button', function (e) {
			userInteraction.resetCurrentlySelectedPlayers();
			$('#modal').toggle();
		});

		// =============================================================
		// === LEFT MENU                                             ===
		// =============================================================

		// Bind match selection in dropdown to loadMatch function
		$(document).on('change', '#match-selection-dropdown', function (e) {
			var selected = $('#match-selection-dropdown').find(":selected").text();
			var selectedParts = selected.split(" ");
			var newMatchId = selectedParts[0];
			userInteraction.loadMatch(newMatchId);
		});

		// Bind "Player Labels" checkbox to showPlayerLabels function
		$(document).on('change', '#visualize-playerLabels-checkbox', function (e) {
			field.showPlayerLabels($('#visualize-playerLabels-checkbox').prop("checked"));
		});

		// Bind "Ball Possession" checkbox to showBallPossession function
		$(document).on('change', '#visualize-ballPossession-checkbox', function (e) {
			field.showBallPossession($('#visualize-ballPossession-checkbox').prop("checked"));
		});

		// Bind "Virtual Offside" checkbox to showOffsideVisualization function
		$(document).on('change', '#visualize-virtualOffside-checkbox', function (e) {
			field.updateOffsideVisualizationVisibility();
		});

		// Bind "Dribbling" checkbox to removeMotionPath function
		$(document).on('change', '#visualize-dribbling-checkbox', function (e) {
			field.removeMotionPath("dribbling");
		});

		// Bind "Duel" checkbox to removeRectPlayerHighlight function
		$(document).on('change', '#visualize-duel-checkbox', function (e) {
			if(duelEventConsumer.attackingPlayer !== undefined) {
				field.removeDuelHightlight(duelEventConsumer.defendingPlayer, duelEventConsumer.attackingPlayer);
			}
		});

		// Bind "Under Pressure" checkbox to removeRectPlayerHighlight function
		$(document).on('change', '#visualize-underPressure-checkbox', function (e) {
			if(underPressureEventConsumer.playerUnderPressure !== undefined) {
				field.removeUnderPressureHighlight(underPressureEventConsumer.playerUnderPressure);
			}
		});

		// =============================================================
		// === Field                                                 ===
		// =============================================================

		// Bind click on field minimize (-) and maximize (+) button
		$(document).on('click', '#field-toggle-button', function (e) {
			userInteraction.toggleField();
		});

		// Bind click on a player on the field
		$(document).on('click', '.player', function (e) {
			var player =  $(e.target).attr('id');
			switch(userInteraction.mode) {
				case userInteraction.ModeEnum.CUSTOMSELECTION:
					userInteraction.togglePlayerSelection(player);
					userInteraction.updateCustomSelectionInfoBelowField(userInteraction.currentlySelectedPlayers);
					break;
				case userInteraction.ModeEnum.ROLEASSIGNMENT:
					userInteraction.togglePlayerSelection(player);
					teamVisualization.toggleRole(player);
					break;
				case userInteraction.ModeEnum.NORMAL:
					userInteraction.resetCurrentlySelectedPlayers();
					userInteraction.addToCurrentlySelectedPlayers([player]);

					var title = "Select feature for " + matchMetadataConsumer.names.get(player) + " (" + player + ")";
					var body = "<a class='button'id='playerModal-heatmaps-button'>Heatmap</a><a class='button' id='playerModal-statistics-button'>Statistics</a>";
					var footer = "<button id='modal-cancel-button'>Cancel</button>";
					userInteraction.showModal(title, body, footer);
					break;
			}
		});

		// =============================================================
		// === Event notifier                                        ===
		// =============================================================

		// Bind click on "Show Log"/"Close Log" button below the field
		$(document).on('click', '#eventNotifier-container-log-button', function (e) {
			$('#eventNotifier-container-log-text').toggle();

			if($('#eventNotifier-container-log-text').css('display') === "none") {
				$('#eventNotifier-container-log-button').text("Show Log");
			} else {
				$('#eventNotifier-container-log-button').text("Close Log");
			}
		});

		// =============================================================
		// === Footer                                                ===
		// =============================================================

		// Bind click on Show Credits button in footer
		$(document).on('click', '#footer-credits-button', function (e) {
			userInteraction.showCredits();
		});

		// Bind click on Show Video button in footer
		$(document).on('click', '#footer-video-button', function (e) {
			userInteraction.showFullscreenVideo();
		});

		// Bind click on Pause button in footer
		$(document).on('click', '#footer-pause-button', function (e) {
			userInteraction.togglePause();
		});

		// =============================================================
		// === Statistics & Graphs menues, dialogues and buttons              ===
		// =============================================================

		// Bind click on statistics team submenu
		$(document).on('click', '.statistics-selection-submenu', function (e) {
			userInteraction.toggleSubmenu(e.target);
		});

		// Bind click on a statistics selection item in menu
		$(document).on('click', '.statistics-selection-item', function (e) {
			var id = $(e.target).attr('id').split("-")[2];

			if (id === "comparison") {
				statisticsAndGraphs.setupStatisticsContainer(id);
			} else if (id.length === 1) {
				statisticsAndGraphs.setupStatisticsContainer(id);
			} else {
				statisticsAndGraphs.setupStatisticsContainer(id);
			}
		});

		// Bind click on "Statistics" in player dialogue
		$(document).on('click', '#playerModal-statistics-button', function (e) {
			$('#modal').toggle();
			statisticsAndGraphs.setupStatisticsContainer(userInteraction.currentlySelectedPlayers[0]);
			userInteraction.resetCurrentlySelectedPlayers();
		});

		// Bind click on statics close button (x)
		$(document).on('click', '#statistics-container-close-button', function (e) {
			statisticsAndGraphs.close();
		});

		// =============================================================
		// === Heatmap menus, dialogues and buttons                  ===
		// =============================================================

		// Bind click on heatmaps team submenu
		$(document).on('click', '.heatmaps-selection-submenu', function (e) {
			userInteraction.toggleSubmenu(e.target);
		});

		// Bind click on a heatmaps selection item in menu
		$(document).on('click', '.heatmaps-selection-item', function (e) {
			var id = $(e.target).attr('id').split("-")[2];
			heatmap.show(id, heatmap.currentInterval);
			heatmap.update(heatmapStatisticsConsumer.recentCells.get(heatmap.currentInterval + "-" + id), heatmapStatisticsConsumer.recentNumCellsX.get(heatmap.currentInterval + "-" + id), heatmapStatisticsConsumer.recentNumCellsY.get(heatmap.currentInterval + "-" + id));
		});

		// Bind click on "Heatmap" in player dialogue
		$(document).on('click', '#playerModal-heatmaps-button' , function (e) {
			$('#modal').toggle();
			heatmap.show(userInteraction.currentlySelectedPlayers[0], heatmap.currentInterval);
			heatmap.update(heatmapStatisticsConsumer.recentCells.get(heatmap.currentInterval + "-" + userInteraction.currentlySelectedPlayers[0]), heatmapStatisticsConsumer.recentNumCellsX.get(heatmap.currentInterval + "-" + userInteraction.currentlySelectedPlayers[0]), heatmapStatisticsConsumer.recentNumCellsY.get(heatmap.currentInterval + "-" + userInteraction.currentlySelectedPlayers[0]));
			userInteraction.resetCurrentlySelectedPlayers();
		});

		// Bind click on heatmap interval selection item below the field
		$(document).on('click', '.below-field-heatmaps-info-interval-selection-item', function (e) {
			var valueParts = $(this).attr('value').split("-");
			var interval = valueParts[0];
			var id = valueParts[1];
			heatmap.show(id, interval);
			heatmap.update(heatmapStatisticsConsumer.recentCells.get(interval + "-" + id), heatmapStatisticsConsumer.recentNumCellsX.get(interval + "-" + id), heatmapStatisticsConsumer.recentNumCellsY.get(interval + "-" + id));
		});

		// Bind click on "Close Heatmap" button below the field
		$(document).on('click', '#below-field-heatmaps-info-remove', function (e) {
			heatmap.remove();
		});

		// Bind click on heatmap granularity slider below the field
		$(document).on('input', '#below-field-heatmaps-info-range', function (e) {
			heatmap.adaptGranularity($(this).val());
		});

		// Bind click on "Close Heatmap" button below the field
		$(document).on('change', '#below-field-heatmaps-info-updateInterval-dropdown', function (e) {
			var value = $('#below-field-heatmaps-info-updateInterval-dropdown').find(":selected").attr("value");
			heatmapStatisticsConsumer.updateConsumptionInterval(value);
		});

		// =============================================================
		// === Visualize Team userInteraction, dialogues and buttons ===
		// =============================================================

		// === Role Selection ===

		$(document).on('click', '#visualizeTeam-roleAssignment-menuItem', function (e) {
			var title = "Assign Roles to Players";
			var body = '<div id="visualizeTeam-roleAssignment-selection-list"><div class="visualizeTeam-roleAssignment-selection-item visualizeTeam-roleAssignment-selection-level1" role="role-player-goal">Goal</div><div class="visualizeTeam-roleAssignment-selection-field" role="role-player-field">Field</div><ul class="visualizeTeam-roleAssignment-selection-level2-list"> <li class="visualizeTeam-roleAssignment-selection-item visualizeTeam-roleAssignment-selection-level2" role="role-player-field-defence">Defence</li> <ul class="visualizeTeam-roleAssignment-selection-level3-list"> <li class="visualizeTeam-roleAssignment-selection-item visualizeTeam-roleAssignment-selection-level3" role="role-player-field-defence-inner">Inner</li> <li class="visualizeTeam-roleAssignment-selection-item visualizeTeam-roleAssignment-selection-level3" role="role-player-field-defence-outer">Outer</li> </ul> <li class="visualizeTeam-roleAssignment-selection-item visualizeTeam-roleAssignment-selection-level2" role="role-player-field-midfield">Midfield</li> <ul class="visualizeTeam-roleAssignment-selection-level3-list"> <li class="visualizeTeam-roleAssignment-selection-item visualizeTeam-roleAssignment-selection-level3" role="role-player-field-midfield-defensive">Defensive</li> <li class="visualizeTeam-roleAssignment-selection-item visualizeTeam-roleAssignment-selection-level3" role="role-player-field-midfield-offensive">Offensive</li> </ul> <li class="visualizeTeam-roleAssignment-selection-item visualizeTeam-roleAssignment-selection-level2" role="role-player-field-offence">Offence</li> <ul class="visualizeTeam-roleAssignment-selection-level3-list"> <li class="visualizeTeam-roleAssignment-selection-item visualizeTeam-roleAssignment-selection-level3" role="role-player-field-offence-inner">Inner</li> <li class="visualizeTeam-roleAssignment-selection-item visualizeTeam-roleAssignment-selection-level3" role="role-player-field-offence-outer">Outer</li> </ul> </ul> </div>';
			var footer = "<a class='button' id='visualizeTeam-roleAssignment-selectPlayers-button'>Select Players</a>";
			userInteraction.showModal(title, body, footer);
		});

		// Bind click on first level userInteraction item in assign roles dialogue
		$(document).on('click', '.visualizeTeam-roleAssignment-selection-level1', function (e) {
			userInteraction.updateRoleAssignmentModalHighlighting(e.target);
		});

		// Bind click on second level userInteraction item in assign roles dialogue
		$(document).on('click', '.visualizeTeam-roleAssignment-selection-level2', function (e) {
			userInteraction.updateRoleAssignmentModalHighlighting(e.target);
			$('.visualizeTeam-roleAssignment-selection-level3-list').each(function () {
				if ($(this).css("display") === "block" && $(e.target).attr('role') !== $(this).prev().attr('role')) {
					$(this).slideToggle();
				}
			});
			if($(e.target).next().css("display") !== "block") {
				$(e.target).next().slideToggle();
			}
		});

		// Bind click on third level userInteraction item in assign roles dialogue
		$(document).on('click', '.visualizeTeam-roleAssignment-selection-level3', function (e) {
			userInteraction.updateRoleAssignmentModalHighlighting(e.target);
		});

		// Bind click on a role in assign roles dialogue
		$(document).on('click', '.visualizeTeam-roleAssignment-selection-item' , function (e) {
			userInteraction.removeCustomSelectionInfoBelowField();
			teamVisualization.resetCanvas();
			var id = $(e.target).attr('role');
			userInteraction.mode = userInteraction.ModeEnum.ROLEASSIGNMENT;
			teamVisualization.currentRole = id;
			userInteraction.resetCurrentlySelectedPlayers();
			var elems1 = document.getElementsByClassName(teamVisualization.currentRole + "-A");
			var arr1 = jQuery.makeArray(elems1);
			jQuery.each( arr1 , function(){
				userInteraction.addToCurrentlySelectedPlayers([$(this).attr('id')]);
			});

			var elems2 = document.getElementsByClassName(teamVisualization.currentRole + "-B");
			var arr2 = jQuery.makeArray(elems2);
			jQuery.each( arr2 , function(){
				userInteraction.addToCurrentlySelectedPlayers([$(this).attr('id')]);
			});

			userInteraction.setupRoleAssignmentInfoBelowField(id);
		});

		// Bind click on select players in assign roles dialogue
		$(document).on('click', '#visualizeTeam-roleAssignment-selectPlayers-button', function (e) {
			$('#modal').toggle();
			console.log(userInteraction.currentlySelectedPlayers);
		});

		// Bind click on done button for role assignment
		$(document).on('click', '#below-field-roleAssignment-info-done' , function (e) {
			userInteraction.mode = userInteraction.ModeEnum.NORMAL;
			userInteraction.removeRoleAssignmentInfoBelowField();
		});

		// === Single role visualization ===

		// Bind click on first level menu item in visualize team menu
		$(document).on('click', '.visualizeTeam-singleRoleVisualization-selection-submenu' , function (e) {
			userInteraction.mode = userInteraction.ModeEnum.NORMAL;
			$(e.target).next().slideToggle();
			if ($(e.target).attr('id') === "visualizeTeam-singleRoleVisualization-selection-submenuA") {
				if ($('#visualizeTeam-singleRoleVisualization-selection-submenuB').next().css('display') === "block") {
					$('#visualizeTeam-singleRoleVisualization-selection-submenuB').next().slideToggle();
				}
			}
			if ($(e.target).attr('id') === "visualizeTeam-singleRoleVisualization-selection-submenuB") {
				if ($('#visualizeTeam-singleRoleVisualization-selection-submenuA').next().css('display') === "block") {
					$('#visualizeTeam-singleRoleVisualization-selection-submenuA').next().slideToggle();
				}
			}
		});

		// Bind click on a role in visualize team menu
		$(document).on('click', '.visualizeTeam-singleRoleVisualization-selection-item' , function (e) {
			userInteraction.updateVisualizationMenuHighlighting(e.target);
			var players = teamVisualization.retrievePlayersAssignedToRole($(e.target).attr('id'));
			console.log(players);
			teamVisualization.resetCanvas();
			userInteraction.resetCurrentlySelectedPlayers();
			userInteraction.addToCurrentlySelectedPlayers(players);
			var title = "Single Role Visualization";
			var body = '<span>Players: <span><span id="visualizeTeam-singleRoleVisualization-playerList"></span>';
			var footer = "<a class='button visualizeTeam-singleRoleVisualization-draw-button' id='visualizeTeam-singleRoleVisualization-draw-type-line'>Line</a><a class='button visualizeTeam-singleRoleVisualization-draw-button' id='visualizeTeam-singleRoleVisualization-draw-type-rect'>Rectangle</a><a class='button visualizeTeam-singleRoleVisualization-draw-button' id='visualizeTeam-singleRoleVisualization-draw-type-hull'>Convex Hull</a>";
			userInteraction.showModal(title, body, footer);
			$.each(players, function(){
				$("#visualizeTeam-singleRoleVisualization-playerList").append( " " + this);
			});
		});

		// Bind click in select draw type dialogue for single role visualization
		$(document).on('click', '.visualizeTeam-singleRoleVisualization-draw-button' , function (e) {
			userInteraction.invokeDrawSelection(e.target);
		});

		// === Multiple role visualization ===

		// Bind click on multiple selection menu item
		$(document).on('click', '#visualizeTeam-multipleRoleVisualization-menuItem', function (e) {
			teamVisualization.resetCanvas();
			userInteraction.resetCurrentlySelectedPlayers();
			userInteraction.updateVisualizationMenuHighlighting(e.target);
			userInteraction.mode = userInteraction.ModeEnum.NORMAL;
			var title = "Multiple Role Visualization";

			var array = [["left", "A", "Team A"], ["right", "B", "Team B"]];

			var body = "";
			for(var i = 0; i<array.length; ++i) {
				body = body +
					'<div class="visualizeTeam-multipleRoleVisualization-selection-list visualizeTeam-multipleRoleVisualization-selection-list-' + array[i][0] + '"> ' +
						'<span class="visualizeTeam-multipleRoleVisualization-selection-header">' + array[i][2] + ' (' + field.teamColor.get(array[i][1]) + ')</span> ' +
						'<label class="visualizeTeam-multipleRoleVisualization-selection-level1">' +
							'<input class="visualizeTeam-multipleRoleVisualization-selection-item" type="checkbox" name="role-player-goal-' + array[i][1] + '">Goal</input>' +
						'</label>' +
						'<label class="visualizeTeam-multipleRoleVisualization-selection-level1">' +
							'<input class="visualizeTeam-multipleRoleVisualization-selection-item" type="checkbox" name="role-player-field-' + array[i][1] + '">Field</input>' +
						'</label>' +
							'<label class="visualizeTeam-multipleRoleVisualization-selection-level2">' +
								'<input class="visualizeTeam-multipleRoleVisualization-selection-item" type="checkbox" name="role-player-field-defence-' + array[i][1] + '">Defence</input>' +
							'</label>' +
								'<label class="visualizeTeam-multipleRoleVisualization-selection-level3">' +
									'<input class="visualizeTeam-multipleRoleVisualization-selection-item" type="checkbox" name="role-player-field-defence-inner-' + array[i][1] + '">Inner</input>' +
								'</label>' +
								'<label class="visualizeTeam-multipleRoleVisualization-selection-level3">' +
									'<input class="visualizeTeam-multipleRoleVisualization-selection-item" type="checkbox" name="role-player-field-defence-outer-' + array[i][1] + '">Outer</input>' +
								'</label>' +
							'<label class="visualizeTeam-multipleRoleVisualization-selection-level2">' +
								'<input class="visualizeTeam-multipleRoleVisualization-selection-item" type="checkbox" name="role-player-field-midfield-' + array[i][1] + '">Midfield</input>' +
							'</label>' +
								'<label class="visualizeTeam-multipleRoleVisualization-selection-level3">' +
									'<input class="visualizeTeam-multipleRoleVisualization-selection-item" type="checkbox" name="role-player-field-midfield-defensive-' + array[i][1] + '">Defensive</input>' +
								'</label>' +
								'<label class="visualizeTeam-multipleRoleVisualization-selection-level3">' +
									'<input class="visualizeTeam-multipleRoleVisualization-selection-item" type="checkbox" name="role-player-field-midfield-offensive-' + array[i][1] + '">Offensive</input>' +
								'</label>' +
							'<label class="visualizeTeam-multipleRoleVisualization-selection-level2">' +
								'<input class="visualizeTeam-multipleRoleVisualization-selection-item" type="checkbox" name="role-player-field-offence-' + array[i][1] + '">Offence</input>' +
							'</label>' +
								'<label class="visualizeTeam-multipleRoleVisualization-selection-level3">' +
									'<input class="visualizeTeam-multipleRoleVisualization-selection-item" type="checkbox" name="role-player-field-offence-inner-' + array[i][1] + '">Inner</input>' +
								'</label>' +
								'<label class="visualizeTeam-multipleRoleVisualization-selection-level3">' +
									'<input class="visualizeTeam-multipleRoleVisualization-selection-item" type="checkbox" name="role-player-field-offence-outer-' + array[i][1] + '">Outer</input>' +
								'</label> ' +
					'</div> ';
			}
			var footer = "<a class='button visualizeTeam-multipleRoleVisualization-draw-button' id='visualizeTeam-multipleRoleVisualization-draw-type-line'>Line</a><a class='button visualizeTeam-multipleRoleVisualization-draw-button' id='visualizeTeam-multipleRoleVisualization-draw-type-rect'>Rectangle</a><a class='button visualizeTeam-multipleRoleVisualization-draw-button' id='visualizeTeam-multipleRoleVisualization-draw-type-hull'>Convex Hull</a>";
			userInteraction.showModal(title, body, footer);
		});

		// Bind click in multiple role visualization dialogue
		$(document).on('click', '.visualizeTeam-multipleRoleVisualization-draw-button' , function (e) {
			var elems = document.getElementsByClassName("visualizeTeam-multipleRoleVisualization-selection-item");
			var arr = jQuery.makeArray(elems);
			var allPlayers = [];
			jQuery.each( arr , function(){
				if($(this).prop("checked") === true){
					var players = teamVisualization.retrievePlayersAssignedToRole($(this).attr("name"));
					for(var i=0; i<players.length; ++i) {
						if(allPlayers.indexOf(players[i]) === -1) {
							allPlayers.push(players[i]);
						}
					}
				}
			});
			userInteraction.resetCurrentlySelectedPlayers();
			userInteraction.addToCurrentlySelectedPlayers(allPlayers);

			userInteraction.invokeDrawSelection(e.target);
		});

		// === Custom Visualization ===

		// Bind click on Create Custom Selection menu item
		$(document).on('click', '#visualizeTeam-customVisualization-menuItem' , function (e) {
			teamVisualization.resetCanvas();
			userInteraction.resetCurrentlySelectedPlayers();
			userInteraction.updateVisualizationMenuHighlighting(undefined);
			userInteraction.removeCustomSelectionInfoBelowField();
			userInteraction.removeRoleAssignmentInfoBelowField();
			userInteraction.mode = userInteraction.ModeEnum.CUSTOMSELECTION;
			userInteraction.setupCustomSelectionInfoBelowField();
		});

		// Bind click on x after custom selection menu item
		$(document).on('click', '.visualizeTeam-customVisualization-selection-removeButton' , function (e) {
			if($(e.target).parent().hasClass('active')) {
				teamVisualization.resetCanvas();
			}
			$(e.target).parent().remove();
		});

		// Bind click on a custom selection menu item
		$(document).on('click', '.visualizeTeam-customVisualization-selection-item' , function (e) {
			if(e.target === this) { // do not show when clicked on remove button (https://stackoverflow.com/questions/9183381/how-to-have-click-event-only-fire-on-parent-div-not-children)
				teamVisualization.resetCanvas();
				userInteraction.updateVisualizationMenuHighlighting(e.target);
				userInteraction.removeRoleAssignmentInfoBelowField();
				var title = "Custom Visualization";
				var body = '<span>Players: <span><span id="visualizeTeam-customVisualization-playerList">' + $(e.target).attr('attr') + '</span>';
				var footer = "<a class='button visualizeTeam-customVisualization-draw-button' id='visualizeTeam-customVisualization-draw-type-line'>Line</a><a class='button visualizeTeam-customVisualization-draw-button' id='visualizeTeam-customVisualization-draw-type-rect'>Rectangle</a><a class='button visualizeTeam-customVisualization-draw-button' id='visualizeTeam-customVisualization-draw-type-hull'>Convex Hull</a>";
				userInteraction.showModal(title, body, footer);
				var players = $("#visualizeTeam-customVisualization-playerList").html().split(' ');
				userInteraction.resetCurrentlySelectedPlayers();
				userInteraction.addToCurrentlySelectedPlayers(players);
			}
		});

		// Bind click on save button for custom selection
		$(document).on('click', '#below-field-customSelection-info-save' , function (e) {
			var name = $('#below-field-customSelection-info-name').val();

			$('#visualizeTeam-customVisualization-menuItem').after('<li class="visualizeTeam-customVisualization-selection-item" attr="' + $('#below-field-customSelection-info-players').html().trim() + '">' + name + '<div class="visualizeTeam-customVisualization-selection-removeButton"></div></li>');
			teamVisualization.resetCanvas();
			userInteraction.resetCurrentlySelectedPlayers();
			userInteraction.removeCustomSelectionInfoBelowField();
			userInteraction.mode = userInteraction.ModeEnum.NORMAL;
		});

		// Bind click on cancel button for custom selection
		$(document).on('click', '#below-field-customSelection-info-cancel' , function (e) {
			userInteraction.mode = userInteraction.ModeEnum.NORMAL;
			userInteraction.removeCustomSelectionInfoBelowField();
			userInteraction.resetCurrentlySelectedPlayers();
		});

		// Bind click in select draw type dialogue for custom selection visualization
		$(document).on('click', '.visualizeTeam-customVisualization-draw-button' , function (e) {
			userInteraction.invokeDrawSelection(e.target);
		});

		// === Clear Visualization ===

		// Bind click on clear visualization menu item
		$(document).on('click', '#visualizeTeam-clearVisualization-menuItem', function (e) {
			userInteraction.updateVisualizationMenuHighlighting(undefined);
			teamVisualization.resetCanvas();
		});
	}

	// =============================================================
	// === Navigating and Highlighting                           ===
	// =============================================================

	/**
	 * Loads a new match.
	 * @param matchId Id of the match
	 */
	loadMatch(matchId) {
		var oldHref = window.location.href;
		var oldPartsHref = oldHref.split("?");
		window.location.href = oldPartsHref[0] + "?matchId=" + matchId;
	}

	/**
	 * Opens the match video in a new window/tab.
	 */
	showFullscreenVideo() {
		queryDict = {};
		location.search.substr(1).split("&").forEach(function (item) {
			queryDict[item.split("=")[0]] = item.split("=")[1]
		});
		var url = "./video.html";
		if (queryDict.matchId != undefined) {
			url += "?matchId=" + queryDict.matchId;
		}
		window.open(url);
	}

	/**
	 * Toggles the pause functionality.
	 */
	togglePause() {
		userInteraction.paused = !userInteraction.paused;
		$('#above-field-info-paused').toggle();
		if (userInteraction.paused) {
			var myPlayer = videojs('video');
			myPlayer.pause();
		}
		// If userInteraction.paused == false, the video is started by the TimeConsumer
	}

	/**
	 * Maximizes/Minimizes the field and all below-field-information.
	 */
	toggleField() {
		var myPlayer = videojs('video');
		if(this.showField) {
			this.showField = false;
			$("#field-wrapper").css("display", "none");
			$("#video").css("display", "block");
			// Video is started by the TimeConsumer
			$("#field-toggle-button").html("Field");
			if(Config.BLUR_VIDEO) {
				$('#video-privacy-info-wrapper').css("display","block");
			}
		} else {
			this.showField = true;
			$("#field-wrapper").css("display", "block");
			$("#video").css("display", "none");
			myPlayer.pause();
			$("#field-toggle-button").html("Video");
			$('#video-privacy-info-wrapper').css("display","none");
		}
	}

	/**
	 * Toggles a submenu for the statistics or heatmap in the right sidebar.
	 * @param eventTarget Target of the click event
	 */
	toggleSubmenu(eventTarget) {
		var className;
		var classParts = $(eventTarget).attr('class').split(" ");
		for(var i=0; i<classParts.length; ++i) {
			if(classParts[i].includes("submenu")) {
				className = "." + classParts[i];
			}
		}
		$(className).each(function () {
			if($(this).attr('id') === $(eventTarget).attr('id') || $(this).next().css('display') === "block") {
				$(this).next().slideToggle();
			}
		});
	}

	/**
	 * Updates the active highlighting in the roleAssignment modal.
	 * @param eventTarget Target of the click event
	 */
	updateRoleAssignmentModalHighlighting(eventTarget) {
		$('.visualizeTeam-roleAssignment-selection-level1').removeClass('active');
		$('.visualizeTeam-roleAssignment-selection-level2').removeClass('active');
		$('.visualizeTeam-roleAssignment-selection-level3').removeClass('active');
		if (eventTarget !== undefined) {
			$(eventTarget).addClass('active');
		}
	}

	/**
	 * Updates the active highlighting for the visualization in the right sidebar.
	 * @param eventTarget Target of the click event
	 */
	updateVisualizationMenuHighlighting(eventTarget) {
		$('.visualizeTeam-singleRoleVisualization-selection-level1').removeClass('active');
		$('.visualizeTeam-singleRoleVisualization-selection-level2').removeClass('active');
		$('.visualizeTeam-singleRoleVisualization-selection-level3').removeClass('active');
		$('#visualizeTeam-multipleRoleVisualization-menuItem').removeClass('active');
		$('.visualizeTeam-customVisualization-selection-item').removeClass('active');
		if (eventTarget !== undefined) {
			$(eventTarget).addClass('active');
		}
	}

	/**
	 * Sets the name of a team in all labels.
	 * @param teamId Identifier of the team
	 * @param teamName Name of the team
	 * @param teamColor Color of the team
	 */
	setTeamName(teamId, teamName, teamColor) {
		var teamText = teamName + " <span style=\"color:"+teamColor+"\">&#11044;</span>";
		$("#statistics-selection-submenu" + teamId).html(teamText);
		$("#heatmaps-selection-submenu" + teamId).html(teamText);
		$("#visualizeTeam-singleRoleVisualization-selection-submenu" + teamId).html(teamText);
		if(teamId === "A") {
			$(".statistics-container-doubleColumn-leftColumn-title").html(teamText);
			$(".statistics-container-subtitle-teamA").html(teamName);
		} else {
			$(".statistics-container-doubleColumn-rightColumn-title").html(teamText);
			$(".statistics-container-subtitle-teamB").html(teamName);
		}
	}

	/**
	 * Sets the name of a player in all labels
	 * @param playerId Identifier of the player
	 * @param playerName Name of the player
	 */
	setPlayerName(playerId, playerName) {
		var playerText = playerName + " (" + playerId + ")";
		$("#statistics-selection-" + playerId).text(playerText);
		$("#heatmaps-selection-" + playerId).text(playerText);
	}

	// =============================================================
	// === Modal Functions                                       ===
	// =============================================================

	/**
	 * Shows a modal.
	 * @param title Title of the modal
	 * @param body Body of the modal
	 * @param footer Footer of the modal
	 */
	showModal(title, body, footer) {
		$('#modal-header').html(title + "<div id='modal-close-button'></div>");
		$('#modal-body').html(body);
		$('#modal-footer').html(footer);
		$('#modal').toggle();
	}

	/**
	 * Shows the credits modal.
	 */
	showCredits() {
		var title = "Credits";
		var body = "<div style='padding:8px'>StreamTeam is developped by the Databases and Information Systems Group, Department of Mathematics and Computer Science, University of Basel, Switzerland.<br><br>The WEB Client uses the following libraries:<ul style='margin-top:0; margin-bottom:0; padding-top:10px; padding-bottom:10px; list-style-type: disc'><li><a href='https://www.chartjs.org/'>Chart.js</a></li><li><a href='https://github.com/brian3kb/graham_scan_js'>graham_scan_js</a></li><li><a href='https://www.patrick-wied.at/static/heatmapjs/de/'>Heatmap.js</a></li><li><a href='https://jquery.com/'>jQuery</a></li><li><a href='http://marcj.github.io/jquery-selectBox/'>jQuery SelectBox</a></li><li><a href='https://github.com/protobufjs/protobuf.js'>Protobuf.js</a></li><li><a href='https://github.com/diegotremper/rgb-color'>rgb-color</a></li><li><a href='http://iamceege.github.io/tooltipster/'>Tooltipster</a></li><li><a href='https://github.com/louisameline/tooltipster-follower'>Tooltipster Follower</a></li><li><a href='https://videojs.com/'>Video.js</a></li></ul></div>";
		var footer = "<button id='modal-cancel-button'>Cancel</button>";
		userInteraction.showModal(title, body, footer);
	}

	// =============================================================
	// === Below Field Information                               ===
	// =============================================================

	/**
	 * Removes the customSelection information below the field.
	 */
	removeCustomSelectionInfoBelowField(){
		$('#below-field-customSelection-info').css("display","none");
		$('#below-field-customSelection-info-players').html('');
		$('#below-field-customSelection-info-name').val('');
	}

	/**
	 * Sets the customSelection information below the field up.
	 */
	setupCustomSelectionInfoBelowField(){
		$('#below-field-customSelection-info').css("display","block");
	}

	/**
	 * Updates the customSelection information below the field.
	 * @param players List of players
	 */
	updateCustomSelectionInfoBelowField(players){
		$('#below-field-customSelection-info-players').html('');
		$.each(players, function(i,v){
			$('#below-field-customSelection-info-players').append(' ' + v);
		});
	}

	/**
	 * Removes the roleAssignment information below the field.
	 */
	removeRoleAssignmentInfoBelowField(){
		userInteraction.resetCurrentlySelectedPlayers();
		$('#below-field-roleAssignment-info').css("display","none");
	};

	/**
	 * Sets the roleAssignment information below the field up.
	 * @param role The role to which the selected players are assigned
	 */
	setupRoleAssignmentInfoBelowField(role){
		$('#below-field-roleAssignment-info').css("display","block");
		$('#below-field-roleAssignment-info-role').html(" " + role);
	}

	// =============================================================
	// === Modify currentlySelectedPlayers list                  ===
	// =============================================================

	/**
	 * Resets the currentlySelectedPlayers list.
	 */
	resetCurrentlySelectedPlayers() {
		$.each(userInteraction.currentlySelectedPlayers, function(i, v){
			field.removeCrossPlayerHighlight(v);
		});
		userInteraction.currentlySelectedPlayers = [];
	}

	/**
	 * Adds a a list of players to the currentlySelectedPlayers list.
	 * @param players List of identifiers of the players
	 */
	addToCurrentlySelectedPlayers(players) {
		$.each(players, function(i, v){
			field.addCrossPlayerHighlight(v);
			userInteraction.currentlySelectedPlayers.push(v);
		});
	}

	/**
	 * Removes an player from the currentlySelectedPlayers list.
	 * @param player Identifier of the player
	 */
	removeFromCurrentlySelectedPlayers(player) {
		field.removeCrossPlayerHighlight(player);
		var arr = jQuery.grep(userInteraction.currentlySelectedPlayers, function(i) {
			if(i != player) return i;
		});
		userInteraction.currentlySelectedPlayers = arr;
	}

	/**
	 * Toggles (i.e., adds or removes) a player on the currentlySelectedPlayers list.
	 * @param player Identifier of the player
	 */
	togglePlayerSelection(player) {
		if(jQuery.inArray(player, userInteraction.currentlySelectedPlayers) !== -1){
			userInteraction.removeFromCurrentlySelectedPlayers(player);
		}
		else{
			userInteraction.addToCurrentlySelectedPlayers([player]);
		}
	}

	/**
	 * Invokes the selected TeamVisualization if possible.
	 * @param eventTarget Target of the click event
	 */
	invokeDrawSelection(eventTarget) {
		var type = $(eventTarget).attr('id').split('-')[4];
		console.log(userInteraction.currentlySelectedPlayers);
		console.log(type);
		if(userInteraction.currentlySelectedPlayers.length > 2 && type === "hull"){
			$('#modal').toggle();
			teamVisualization.drawSelection(type, userInteraction.currentlySelectedPlayers);
			userInteraction.resetCurrentlySelectedPlayers();
		}
		else if(userInteraction.currentlySelectedPlayers.length > 1 && type !== "hull"){
			$('#modal').toggle();
			teamVisualization.drawSelection(type, userInteraction.currentlySelectedPlayers);
			userInteraction.resetCurrentlySelectedPlayers();
		}
		else {
			alert("Unable to draw " + type + " with only " + userInteraction.currentlySelectedPlayers.length + " selected players.");
		}
	}
}
