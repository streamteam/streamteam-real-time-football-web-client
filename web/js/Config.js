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

/** Contains config values which are needed by multiple functions and/or may change according to scenarios **/

const Config = {
	KAFKARESTPROXY_IP: "10.34.58.65",
	KAFKARESTPROXY_PORT: 5555,

	ATOMIC_EVENT_CONSUMPTION_INTERVAL_IN_MS: 300,
	NONATOMIC_EVENT_CONSUMPTION_INTERVAL_IN_MS: 100,
	NONATOMIC_EVENT_CONSUMPTION_LIMIT: 20,
	STATISTICS_CONSUMPTION_INTERVAL_IN_MS: 1000,
	STATISTICS_CONSUMPTION_LIMIT: 24,
	STATISTICS_FIRST_CONSUMPTION_LIMIT: 2000,
	TIME_CONSUMPTION_INTERVAL_IN_MS: 500,
	MATCHMETADATA_CONSUMPTION_INTERVAL_IN_MS: 10000,
	MATCHMETADATA_CONSUMPTION_LIMIT: 10,
	FIELD_OBJECT_STATE_CONSUMPTION_INTERVAL_IN_MS: 30,
	FIELD_OBJECT_STATE_CONSUMPTION_LIMIT: 60,
	HEATMAP_STATISTICS_CONSUMPTION_INTERVALS_IN_S: [1, 3, 10],
	DEFAULT_HEATMAP_STATISTICS_CONSUMPTION_INTERVAL_IN_S: 3,
	HEATMAP_STATISTICS_CONSUMPTION_LIMIT: 150,
	PRESSING_STATE_CONSUMPTION_INTERVAL_IN_MS: 200,
	OFFSIDE_LINE_STATE_CONSUMPTION_INTERVAL_IN_MS: 100,
	TEAM_AREA_STATE_CONSUMPTION_INTERVAL_IN_MS: 200,
	TEAM_AREA_STATE_CONSUMPTION_LIMIT: 10,

	STATISTICSCONTAINER_UPDATE_INTERVAL_IN_MS: 1000,
	GRAPHS_HISTORY_IN_MS: 30000,

	ANONYMIZE_NAMES: false,
	ANONYMIZE_MAX_CHARS: 3,
	ANONYMIZE_MIN_LENGTH: 6,
	BLUR_VIDEO: false,
	BLUR_FACTOR: 15,

	// Sizes of football field elements in meter
	FIELD_LARGE_CIRCLE_RADIUS_IN_M: 9.15,
	FIELD_CORNER_CIRCLE_RADIUS_IN_M: 1,
	FIELD_GOAL_HEIGHT_IN_M: 7.32,
	FIELD_GOAL_WIDTH_IN_M: 1,
	FIELD_GOALAREA_WIDTH_IN_M: 5.5,
	FIELD_GOALAREA_HEIGHT_IN_M: 18.32,
	FIELD_PENALTYAREA_WIDTH_IN_M: 16.5,
	FIELD_PENALTYAREA_HEIGHT_IN_M: 40.32,
	FIELD_PENALTYSPORT_DISTANCE_IN_M: 11,

	OVERLAY_DISPLAY_DURATION_IN_MS: 3000,
	PASSEVENT_DISPLAY_DURATION_IN_MS: 3000,
	GOALDISTANCE_UPDATE_INTERVAL_IN_MS: 1000,

	FIELD_BORDER: 28,

	HEATMAP_DEFAULT_INTERVAL_IN_S: 0, // 0 = full game

	NUM_GOALDISTANCE_DECIMALS: 0,

	// Sizes in relation to the width of the field (1000 = field width)
	FIELD_STROKE_WIDTH: 2,
	FIELD_POINT_RADIUS: 3,
	FIELD_CORNER_RADIUS: 10,
	PLAYER_RADIUS: 5,
	PLAYER_CLICK_RADIUS: 12,
	PLAYER_CROSS_RADIUS: 3.5,
	PLAYER_CROSS_STROKE_WIDTH: 2,
	PLAYER_BORDER_WIDTH: 2,
	PLAYER_RECT_WIDTH:2,
	PLAYER_LABEL_OFFSET_X: 8,
	PLAYER_LABEL_OFFSET_Y: 12,
	PLAYER_LABEL_FONT_SIZE: 14,
	BALL_RADIUS: 4,
	PASSEVENT_STROKE_WIDTH: 1,
	OFFSIDE_LINE_STROKE_WIDTH: 2,
	EVENT_OVERLAY_FONT_SIZE: 24,
	TEAM_VISUALIZATION_STROKE_WIDTH: 2,
	HEATMAP_RADIUS_MIN: 40,
	HEATMAP_RADIUS_MAX: 80,
	HEATMAP_RADIUS_DEFAULT: 50,
	HEATMAP_RADIUS_STEPSIZE: 5,

	FIELD_STROKE_COLOR: 'white',
	DEFAULT_TEAM_A_FILL_COLOR: 'rgba(0,0,0,0)',
	DEFAULT_TEAM_B_FILL_COLOR: 'rgba(0,0,0,0)',
	BALL_FILL_COLOR: ['black', 'orangered'], // the second color is the fallback color if the first color is the same as one of the team colors

	BALL_POSSESSION_HIGHLIGHT_STROKE_COLOR: ['black', 'white'], // the second color is the fallback color if the first color is the same as the current team color
	DUEL_HIGHLIGHT_STROKE_COLOR: ['darkgray', 'lightgray'], // the second color is the fallback color if the first color is the same as the current team color
	UNDER_PRESSURE_HIGHLIGHT_COLOR: ['yellow', 'red'], // the second color is the fallback color if the first color is the same as the current team color
	OFFSIDE_HIGHLIGHT_STROKE_COLOR : ['orange', 'yellow'], // the second color is the fallback color if the first color is the same as the current team color
	HEATMAP_HIGHLIGHT_FILL_COLOR : ['green', 'yellow'], // the second color is the fallback color if the first color is the same as the current team color

	OFFSIDE_LINE_STROKE_COLOR: 'yellow',

	TEAM_VISUALIZATION_STROKE_COLOR: 'blue',
	TEAM_VISUALIZATION_FILL_COLOR: 'rgba(0,96,185,.3)',

	DRIBBLING_PATH_STOKE_COLOR: 'rgba(255,255,255,.3)',

	GOAL_STROKE_COLOR: 'red',
	//SHOT_ON_TARGET_STROKE_COLOR: 'purple',
	SHOT_OFF_TARGET_STROKE_COLOR: 'red',

	SUCCESSFUL_PASS_STROKE_COLOR: 'blue',
	INTERCEPTION_STROKE_COLOR: 'purple',
	MISPLACED_PASS_STROKE_COLOR: 'red',
	CLEARANCE_STROKE_COLOR: 'orange',

	STATISTICS_NEUTRAL_FILL_COLORS: ["#337ab7", "#7F337F", "#b53232", "#B28E31", "#31b249", "#206e5e"],
	STATISTICS_POSITIVE_FILL_COLOR: "#31b249",
	STATISTICS_NEGATIVE_FILL_COLOR: "#b53232",

	PAUSE_KEY_CODES: [32, 80, 19], // space, p, pause/break

	MAX_VIDEO_TIMESHIFT: 2.0
};
Object.freeze(Config);