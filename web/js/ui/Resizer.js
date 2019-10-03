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
 * Adapts the sizes to the field width
 */
class Resizer {

	/**
	 * Adapts the sizes of many elements to the field width.
	 */
	setSizes() {
		Resizer.FIELD_WIDTH = $(window).width() - (700 + 2 * Config.FIELD_BORDER);
		Resizer.FIELD_HEIGHT = ((field.maxYInM - field.minYInM) / (field.maxXInM - field.minXInM)) * Resizer.FIELD_WIDTH;
		Resizer.STREAM_COORDS_X_DIVIDER = (field.maxXInM-field.minXInM) / Resizer.FIELD_WIDTH;
		Resizer.STREAM_COORDS_Y_DIVIDER = (field.maxYInM-field.minYInM) / Resizer.FIELD_HEIGHT;

		var multiplicator = Resizer.FIELD_WIDTH/(field.maxXInM-field.minXInM);
		Resizer.FIELD_LARGE_CIRCLE_RADIUS = Config.FIELD_LARGE_CIRCLE_RADIUS_IN_M * multiplicator;
		Resizer.FIELD_CORNER_CIRCLE_RADIUS = Config.FIELD_CORNER_CIRCLE_RADIUS_IN_M * multiplicator;
		Resizer.FIELD_GOAL_HEIGHT = Config.FIELD_GOAL_HEIGHT_IN_M * multiplicator;
		Resizer.FIELD_GOAL_WIDTH = Config.FIELD_GOAL_WIDTH_IN_M * multiplicator;
		Resizer.FIELD_GOALAREA_WIDTH = Config.FIELD_GOALAREA_WIDTH_IN_M * multiplicator;
		Resizer.FIELD_GOALAREA_HEIGHT = Config.FIELD_GOALAREA_HEIGHT_IN_M * multiplicator;
		Resizer.FIELD_PENALTYAREA_WIDTH = Config.FIELD_PENALTYAREA_WIDTH_IN_M * multiplicator;
		Resizer.FIELD_PENALTYAREA_HEIGHT = Config.FIELD_PENALTYAREA_HEIGHT_IN_M * multiplicator;
		Resizer.FIELD_PENALTYSPORT_DISTANCE = Config.FIELD_PENALTYSPORT_DISTANCE_IN_M * multiplicator;

		var ratioToStandard = Resizer.FIELD_WIDTH / 1000;

		$('#above-field-info').css('width', Resizer.FIELD_WIDTH  + 2*Config.FIELD_BORDER);

		$('#field-toggle-button-wrapper').css('width', Resizer.FIELD_WIDTH + 2*Config.FIELD_BORDER);
		$('#video-privacy-info-wrapper').css('width', Resizer.FIELD_WIDTH + 2*Config.FIELD_BORDER);
		$('#video-privacy-info').css('width', Resizer.FIELD_WIDTH + 2*Config.FIELD_BORDER);

		$('#field-withBorder').css('width', Resizer.FIELD_WIDTH + 2*Config.FIELD_BORDER);
		$('#field-withBorder').css('height', Resizer.FIELD_HEIGHT + 2*Config.FIELD_BORDER);

		$('#field-inner').css('height', Resizer.FIELD_HEIGHT);
		$('#field-inner').css('width', Resizer.FIELD_WIDTH);
		$('#field-inner').css('margin-top', -(Resizer.FIELD_HEIGHT+Config.FIELD_BORDER));
		$('#field-inner').css('margin-bottom', Config.FIELD_BORDER + 20);

		$('#field-inner-svg').attr('width', Resizer.FIELD_WIDTH);
		$('#field-inner-svg').attr('height', Resizer.FIELD_HEIGHT);

		$('#video').css('width', Resizer.FIELD_WIDTH + 2*Config.FIELD_BORDER);
		$('#video').css('height', Resizer.FIELD_HEIGHT + 2*Config.FIELD_BORDER);

		$('.container').css('width', Resizer.FIELD_WIDTH + 2*Config.FIELD_BORDER);

		$('#footer').css('width', Resizer.FIELD_WIDTH + 2*Config.FIELD_BORDER);
	}
}