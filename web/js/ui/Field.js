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
 *  Visualizes the field, the players, the ball and the events
 */
class Field {

	/**
	 * Field constructor.
	 */
	constructor() {
		this.teamColor = new Map();
		this.teamColor.set("A", Config.DEFAULT_TEAM_A_FILL_COLOR);
		this.teamColor.set("B", Config.DEFAULT_TEAM_B_FILL_COLOR);
	}

	/**
	 * Draws the field.
	 */
	initializeField() {
		var ratioToStandard = Resizer.FIELD_WIDTH / 1000;

		var fieldInnerSvg = $("#field-inner-svg");

		// draw a rectangle - field
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'rect')) // attach a rectangle
			.attr("class", 'field-line')
			.attr("x", 0)         // position the left of the rectangle
			.attr("y", 0)          // position the top of the rectangle
			.attr("height", Resizer.FIELD_HEIGHT)    // set the height
			.attr("width", Resizer.FIELD_WIDTH)    // set the width
			.css("stroke-width", Config.FIELD_STROKE_WIDTH * ratioToStandard)    // set the stroke width
			.css("stroke", Config.FIELD_STROKE_COLOR)    // set the line colour
			.css("fill", "transparent"));    // set the fill colour
		// draw a rectangle - halves
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'rect')) // attach a rectangle
			.attr("class", 'field-line')
			.attr("x", 0)         // position the left of the rectangle
			.attr("y", 0)          // position the top of the rectangle
			.attr("height", Resizer.FIELD_HEIGHT)    // set the height
			.attr("width", Resizer.FIELD_WIDTH / 2)    // set the width
			.css("stroke-width", Config.FIELD_STROKE_WIDTH * ratioToStandard)    // set the stroke width
			.css("stroke", Config.FIELD_STROKE_COLOR)    // set the line colour
			.css("fill", "transparent"));    // set the fill colour
		// draw a circle - center circle
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'circle')) // attach a circle
			.attr("class", 'field-circle')
			.attr("cx", Resizer.FIELD_WIDTH / 2)             // position the x-centre
			.attr("cy", Resizer.FIELD_HEIGHT / 2)             // position the y-centre
			.attr("r", Resizer.FIELD_LARGE_CIRCLE_RADIUS)               // set the radius
			.css("stroke-width", Config.FIELD_STROKE_WIDTH * ratioToStandard)    // set the stroke width
			.css("stroke", Config.FIELD_STROKE_COLOR)      // set the line colour
			.css("fill", "none"));      // set the fill colour
		// draw a rectangle - penalty area 1
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'rect')) // attach a rectangle
			.attr("class", 'field-line')
			.attr("x", 0)         // position the left of the rectangle
			.attr("y", (Resizer.FIELD_HEIGHT/2) - (Resizer.FIELD_PENALTYAREA_HEIGHT/2))          // position the top of the rectangle
			.attr("height", Resizer.FIELD_PENALTYAREA_HEIGHT)    // set the height
			.attr("width", Resizer.FIELD_PENALTYAREA_WIDTH)    // set the width
			.css("stroke-width", Config.FIELD_STROKE_WIDTH * ratioToStandard)    // set the stroke width
			.css("stroke", Config.FIELD_STROKE_COLOR)    // set the line colour
			.css("fill", "transparent"));    // set the fill colour
		// draw a rectangle - penalty area 2
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'rect')) // attach a rectangle
			.attr("class", 'field-line')
			.attr("x", Resizer.FIELD_WIDTH - Resizer.FIELD_PENALTYAREA_WIDTH)         // position the left of the rectangle
			.attr("y", (Resizer.FIELD_HEIGHT/2) - (Resizer.FIELD_PENALTYAREA_HEIGHT/2))          // position the top of the rectangle
			.attr("height", Resizer.FIELD_PENALTYAREA_HEIGHT)    // set the height
			.attr("width", Resizer.FIELD_PENALTYAREA_WIDTH)    // set the width
			.css("stroke-width", Config.FIELD_STROKE_WIDTH * ratioToStandard)    // set the stroke width
			.css("stroke", Config.FIELD_STROKE_COLOR)    // set the line colour
			.css("fill", "transparent"));    // set the fill colour
		// draw a rectangle - goal area 1
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'rect')) // attach a rectangle
			.attr("class", 'field-line')
			.attr("x", 0)         // position the left of the rectangle
			.attr("y", (Resizer.FIELD_HEIGHT/2) - (Resizer.FIELD_GOALAREA_HEIGHT/2))          // position the top of the rectangle
			.attr("height", Resizer.FIELD_GOALAREA_HEIGHT)    // set the height
			.attr("width", Resizer.FIELD_GOALAREA_WIDTH)    // set the width
			.css("stroke-width", Config.FIELD_STROKE_WIDTH * ratioToStandard)    // set the stroke width
			.css("stroke", Config.FIELD_STROKE_COLOR)    // set the line colour
			.css("fill", "transparent"));    // set the fill colour
		// draw a rectangle - goal area 2
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'rect')) // attach a rectangle
			.attr("class", 'field-line')
			.attr("x", Resizer.FIELD_WIDTH - Resizer.FIELD_GOALAREA_WIDTH)         // position the left of the rectangle
			.attr("y", (Resizer.FIELD_HEIGHT/2) - (Resizer.FIELD_GOALAREA_HEIGHT/2))          // position the top of the rectangle
			.attr("height", Resizer.FIELD_GOALAREA_HEIGHT)    // set the height
			.attr("width", Resizer.FIELD_GOALAREA_WIDTH)    // set the width
			.css("stroke-width", Config.FIELD_STROKE_WIDTH * ratioToStandard)    // set the stroke width
			.css("stroke", Config.FIELD_STROKE_COLOR)    // set the line colour
			.css("fill", "transparent"));    // set the fill colour
		// draw a rectangle - goal 1
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'rect')) // attach a rectangle
			.attr("class", 'field-line')
			.attr("x", -Resizer.FIELD_GOAL_WIDTH)         // position the left of the rectangle
			.attr("y", (Resizer.FIELD_HEIGHT/2) - (Resizer.FIELD_GOAL_HEIGHT/2))          // position the top of the rectangle
			.attr("height", Resizer.FIELD_GOAL_HEIGHT)    // set the height
			.attr("width", Resizer.FIELD_GOAL_WIDTH)    // set the width
			.css("stroke-width", Config.FIELD_STROKE_WIDTH * ratioToStandard)    // set the stroke width
			.css("stroke", Config.FIELD_STROKE_COLOR)    // set the line colour
			.css("fill", "transparent"));    // set the fill colour
		// draw a rectangle - goal 2
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'rect')) // attach a rectangle
			.attr("class", 'field-line')
			.attr("x", Resizer.FIELD_WIDTH)         // position the left of the rectangle
			.attr("y", (Resizer.FIELD_HEIGHT/2) - (Resizer.FIELD_GOAL_HEIGHT/2))          // position the top of the rectangle
			.attr("height", Resizer.FIELD_GOAL_HEIGHT)    // set the height
			.attr("width", Resizer.FIELD_GOAL_WIDTH)    // set the width
			.css("stroke-width", Config.FIELD_STROKE_WIDTH * ratioToStandard)    // set the stroke width
			.css("stroke", Config.FIELD_STROKE_COLOR)    // set the line colour
			.css("fill", "transparent"));    // set the fill colour
		// draw a circle - penalty spot 1
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'circle')) // attach a circle
			.attr("class", 'field-point')
			.attr("cx", Resizer.FIELD_PENALTYSPORT_DISTANCE)           // position the x-centre
			.attr("cy", Resizer.FIELD_HEIGHT / 2)           // position the y-centre
			.attr("r", Config.FIELD_POINT_RADIUS * ratioToStandard)             // set the radius
			.css("fill", Config.FIELD_STROKE_COLOR));     // set the fill colour
		// draw a circle - penalty spot 2
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'circle')) // attach a circle
			.attr("class", 'field-point')
			.attr("cx", Resizer.FIELD_WIDTH - Resizer.FIELD_PENALTYSPORT_DISTANCE)           // position the x-centre
			.attr("cy", Resizer.FIELD_HEIGHT / 2)           // position the y-centre
			.attr("r", Config.FIELD_POINT_RADIUS * ratioToStandard)             // set the radius
			.css("fill", Config.FIELD_STROKE_COLOR));     // set the fill colour
		// draw a circle - center spot
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'circle')) // attach a circle
			.attr("class", 'field-point')
			.attr("cx", Resizer.FIELD_WIDTH / 2)           // position the x-centre
			.attr("cy", Resizer.FIELD_HEIGHT / 2)           // position the y-centre
			.attr("r", Config.FIELD_POINT_RADIUS  * ratioToStandard)             // set the radius
			.css("fill", Config.FIELD_STROKE_COLOR));     // set the fill colour

		// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
		// https://developer.mozilla.org/de/docs/Web/SVG/Attribute/transform

		var cornerCirclePath = "M 0 0" +
			" A "+Resizer.FIELD_CORNER_CIRCLE_RADIUS+ " "+Resizer.FIELD_CORNER_CIRCLE_RADIUS+", 0, 0, 0, "+Resizer.FIELD_CORNER_CIRCLE_RADIUS+" "+Resizer.FIELD_CORNER_CIRCLE_RADIUS+"" +
			" L "+Resizer.FIELD_CORNER_CIRCLE_RADIUS+" "+(Resizer.FIELD_CORNER_CIRCLE_RADIUS-Config.FIELD_STROKE_WIDTH)+" " +
			" A "+(Resizer.FIELD_CORNER_CIRCLE_RADIUS-Config.FIELD_STROKE_WIDTH*ratioToStandard)+" "+(Resizer.FIELD_CORNER_CIRCLE_RADIUS-Config.FIELD_STROKE_WIDTH*ratioToStandard)+", 270, 0, 1, "+(Config.FIELD_STROKE_WIDTH*ratioToStandard)+" 0" +
			" Z";

		var distPenaltySpotPenaltyAreaLine = Resizer.FIELD_PENALTYAREA_WIDTH-Resizer.FIELD_PENALTYSPORT_DISTANCE;
		var heightPenaltyArc = 2*Math.sqrt((Resizer.FIELD_LARGE_CIRCLE_RADIUS*Resizer.FIELD_LARGE_CIRCLE_RADIUS)-(distPenaltySpotPenaltyAreaLine*distPenaltySpotPenaltyAreaLine));
		var strokeWidthX = (distPenaltySpotPenaltyAreaLine/Resizer.FIELD_LARGE_CIRCLE_RADIUS)*Config.FIELD_STROKE_WIDTH*ratioToStandard;
		var strokeWidthY = Math.sin(Math.acos(distPenaltySpotPenaltyAreaLine/Resizer.FIELD_LARGE_CIRCLE_RADIUS))*Config.FIELD_STROKE_WIDTH*ratioToStandard;
		var penaltyArcPath = "M 0 0" +
			" A "+Resizer.FIELD_LARGE_CIRCLE_RADIUS+ " "+Resizer.FIELD_LARGE_CIRCLE_RADIUS+", 0, 0, 1, 0 "+heightPenaltyArc+"" +
			" L "+(-strokeWidthX)+" "+(heightPenaltyArc-strokeWidthY)+
			" A "+(Resizer.FIELD_LARGE_CIRCLE_RADIUS-Config.FIELD_STROKE_WIDTH*ratioToStandard)+" "+(Resizer.FIELD_LARGE_CIRCLE_RADIUS-Config.FIELD_STROKE_WIDTH*ratioToStandard)+", 270, 0, 0, "+(-strokeWidthX)+" "+strokeWidthY+
			" Z";

		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'path')) // attach a path
			.attr("id", "field-penaltyArcLeft")
			.attr("d", penaltyArcPath)
			.attr("transform", "translate("+Resizer.FIELD_PENALTYAREA_WIDTH+","+(Resizer.FIELD_HEIGHT/2 - heightPenaltyArc/2)+"), rotate(0)")
			.css("fill", Config.FIELD_STROKE_COLOR));
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'path')) // attach a path
			.attr("id", "field-penaltyArcRight")
			.attr("d", penaltyArcPath)
			.attr("transform", "translate("+(Resizer.FIELD_WIDTH-Resizer.FIELD_PENALTYAREA_WIDTH)+","+(Resizer.FIELD_HEIGHT/2 + heightPenaltyArc/2)+"), rotate(180)")
			.css("fill", Config.FIELD_STROKE_COLOR));
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'path')) // attach a path
			.attr("id", "field-cornerTopLeft")
			.attr("d", cornerCirclePath)
			.attr("transform", "translate(0,"+Resizer.FIELD_CORNER_CIRCLE_RADIUS+"), rotate(270)")
			.css("fill", Config.FIELD_STROKE_COLOR));
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'path')) // attach a path
			.attr("id", "field-cornerTopRight")
			.attr("d", cornerCirclePath)
			.attr("transform", "translate(" + (Resizer.FIELD_WIDTH-Resizer.FIELD_CORNER_CIRCLE_RADIUS) + ",0)")
			.css("fill", Config.FIELD_STROKE_COLOR));
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'path')) // attach a path
			.attr("id", "field-cornerBottomRight")
			.attr("d", cornerCirclePath)
			.attr("transform", "translate(" + Resizer.FIELD_WIDTH + "," + (Resizer.FIELD_HEIGHT-Resizer.FIELD_CORNER_CIRCLE_RADIUS) + "), rotate(90)")
			.css("fill", Config.FIELD_STROKE_COLOR));
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'path')) // attach a path
			.attr("id", "field-cornerBottomLeft")
			.attr("d", cornerCirclePath)
			.attr("transform", "translate("+Resizer.FIELD_CORNER_CIRCLE_RADIUS+"," + Resizer.FIELD_HEIGHT + "), rotate(180)")
			.css("fill", Config.FIELD_STROKE_COLOR));
	}

	/**
	 * Initializes all objects.
	 */
	initializeObjects() {
		var ratioToStandard = Resizer.FIELD_WIDTH / 1000;

		var fieldInnerSvg = $("#field-inner-svg");

		var playerLabelVisibility = "hidden";
		if($('#visualize-playerLabels-checkbox').prop("checked")) {
			playerLabelVisibility = "visible";
		}

		var offsideLineVisibility = "hidden";
		if($('#visualize-virtualOffside-checkbox').prop("checked")) {
			offsideLineVisibility = "visible";
		}

		// MOTION PATH
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'polyline'))
			.attr("id", 'motionPath-dribbling')
			.attr("class", 'motionPath')
			.attr("points", "0,0 10,10")
			.css("stroke-linecap", "round")
			.css("stroke-width", Config.PLAYER_RADIUS * 2 * ratioToStandard)
			.css("fill", "none")
			.css("visibility", "hidden")
		);

		//OFFSIDE LINE
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'line')) // attach a line
			.attr("id", 'offsideLine')
			.attr("x1", Resizer.FIELD_WIDTH / 2)     // x position of the first end of the line
			.attr("y1", 0)      // y position of the first end of the line
			.attr("x2", Resizer.FIELD_WIDTH / 2)     // x position of the second end of the line
			.attr("y2", Resizer.FIELD_HEIGHT)   // y position of the second end of the line
			.css("stroke", Config.OFFSIDE_LINE_STROKE_COLOR)  // colour the line
			.css("stroke-width", Config.OFFSIDE_LINE_STROKE_WIDTH * ratioToStandard)
			.css("visibility", offsideLineVisibility));

		// TEAM 1
		for(var i=1; i<=11; i++) {
			fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'circle')) // attach a circle
				.attr("class", 'object_inner')
				.attr("id", 'A'+i+'_inner')
				.attr("cx", Resizer.FIELD_WIDTH/4)
				.attr("cy", i*(Resizer.FIELD_HEIGHT/12))
				.attr("r", Config.PLAYER_RADIUS * ratioToStandard)
				.css("fill", field.teamColor.get("A")));
			fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'circle')) // attach a circle
				.attr("class", 'object player playerA')
				.attr("id", 'A'+i)
				.attr("cx", Resizer.FIELD_WIDTH/4)
				.attr("cy", i*(Resizer.FIELD_HEIGHT/12))
				.attr("r", Config.PLAYER_CLICK_RADIUS * ratioToStandard)
				.css("fill", "black")
				.css("fill-opacity", 0.001));
			fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'text')) // attach a text
				.attr("class", "object_text")
				.attr("id", 'A'+i+'_text')
				.attr("x", Resizer.FIELD_WIDTH/4 + Config.PLAYER_LABEL_OFFSET_X * ratioToStandard)
				.attr("y", i*(Resizer.FIELD_HEIGHT/12) + Config.PLAYER_LABEL_OFFSET_Y * ratioToStandard)
				.attr("visibility", playerLabelVisibility)
				.attr("font-family", "sans-serif")
				.attr("font-size", Config.PLAYER_LABEL_FONT_SIZE * ratioToStandard)
				.css("fill", field.teamColor.get("A"))
				.text("A"+i));
			fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'line')) // attach a line
				.attr("class", 'object_cross')
				.attr("id", 'A'+i+"_cross_1")
				.attr("x1", Resizer.FIELD_WIDTH/4 - Config.PLAYER_CROSS_RADIUS * ratioToStandard)     // x position of the first end of the line
				.attr("y1", i*(Resizer.FIELD_HEIGHT/12) - Config.PLAYER_CROSS_RADIUS * ratioToStandard)      // y position of the first end of the line
				.attr("x2", Resizer.FIELD_WIDTH/4 + Config.PLAYER_CROSS_RADIUS * ratioToStandard)     // x position of the second end of the line
				.attr("y2", i*(Resizer.FIELD_HEIGHT/12) + Config.PLAYER_CROSS_RADIUS * ratioToStandard)    // y position of the second end of the line
				.css("stroke-width", Config.PLAYER_CROSS_STROKE_WIDTH * ratioToStandard));
			fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'line')) // attach a line
				.attr("class", 'object_cross')
				.attr("id", 'A'+i+"_cross_2")
				.attr("x1", Resizer.FIELD_WIDTH/4 - Config.PLAYER_CROSS_RADIUS * ratioToStandard)     // x position of the first end of the line
				.attr("y1", i*(Resizer.FIELD_HEIGHT/12) + Config.PLAYER_CROSS_RADIUS * ratioToStandard)      // y position of the first end of the line
				.attr("x2", Resizer.FIELD_WIDTH/4 + Config.PLAYER_CROSS_RADIUS * ratioToStandard)     // x position of the second end of the line
				.attr("y2", i*(Resizer.FIELD_HEIGHT/12) - Config.PLAYER_CROSS_RADIUS * ratioToStandard)    // y position of the second end of the line
				.css("stroke-width", Config.PLAYER_CROSS_STROKE_WIDTH * ratioToStandard));
			fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'rect')) // attach a rect
				.attr("class", 'object_rect')
				.attr("id", 'A'+i+"_rect")
				.attr("x", Resizer.FIELD_WIDTH/4 - (Config.PLAYER_RADIUS+Config.PLAYER_BORDER_WIDTH) * ratioToStandard)     // x position of the first end of the line
				.attr("y", i*(Resizer.FIELD_HEIGHT/12) - (Config.PLAYER_RADIUS+Config.PLAYER_BORDER_WIDTH) * ratioToStandard)      // y position of the first end of the line
				.attr("width", (Config.PLAYER_RADIUS+Config.PLAYER_BORDER_WIDTH)*2 * ratioToStandard)     // x position of the second end of the line
				.attr("height", (Config.PLAYER_RADIUS+Config.PLAYER_BORDER_WIDTH)*2 * ratioToStandard)    // y position of the second end of the line
				.css("stroke-width", Config.PLAYER_RECT_WIDTH * ratioToStandard)
				.css("fill", "black")
				.css("fill-opacity", 0.001));
		}

		// TEAM 2
		for(var i=1; i<=11; i++) {
			fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'circle')) // attach a circle
				.attr("class", 'object_inner')
				.attr("id", 'B'+i+'_inner')
				.attr("cx", 3*(Resizer.FIELD_WIDTH/4))
				.attr("cy", i*(Resizer.FIELD_HEIGHT/12))
				.attr("r", Config.PLAYER_RADIUS * ratioToStandard)
				.css("fill", field.teamColor.get("B")));
			fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'circle')) // attach a circle
				.attr("class", 'object player playerB')
				.attr("id", 'B'+i)
				.attr("cx", 3*(Resizer.FIELD_WIDTH/4))
				.attr("cy", i*(Resizer.FIELD_HEIGHT/12))
				.attr("r", Config.PLAYER_CLICK_RADIUS * ratioToStandard)
				.css("fill", "black")
				.css("fill-opacity", 0.001));
			fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'text')) // attach a text
				.attr("class", "object_text")
				.attr("id", 'B'+i+'_text')
				.attr("x", 3* (Resizer.FIELD_WIDTH/4) + Config.PLAYER_LABEL_OFFSET_X * ratioToStandard)
				.attr("y", i*(Resizer.FIELD_HEIGHT/12) + Config.PLAYER_LABEL_OFFSET_Y * ratioToStandard)
				.attr("visibility", playerLabelVisibility)
				.attr("font-family", "sans-serif")
				.attr("font-size", Config.PLAYER_LABEL_FONT_SIZE * ratioToStandard)
				.css("fill", field.teamColor.get("B"))
				.text("B"+i));
			fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'line')) // attach a line
				.attr("class", 'object_cross')
				.attr("id", 'B'+i+"_cross_1")
				.attr("x1", 3* Resizer.FIELD_WIDTH/4 - Config.PLAYER_CROSS_RADIUS * ratioToStandard)     // x position of the first end of the line
				.attr("y1", i*(Resizer.FIELD_HEIGHT/12) - Config.PLAYER_CROSS_RADIUS * ratioToStandard)      // y position of the first end of the line
				.attr("x2", 3* Resizer.FIELD_WIDTH/4 + Config.PLAYER_CROSS_RADIUS * ratioToStandard)     // x position of the second end of the line
				.attr("y2", i*(Resizer.FIELD_HEIGHT/12) + Config.PLAYER_CROSS_RADIUS * ratioToStandard)    // y position of the second end of the line
				.css("stroke-width", Config.PLAYER_CROSS_STROKE_WIDTH * ratioToStandard));
			fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'line')) // attach a line
				.attr("class", 'object_cross')
				.attr("id", 'B'+i+"_cross_2")
				.attr("x1", 3* Resizer.FIELD_WIDTH/4 - Config.PLAYER_CROSS_RADIUS * ratioToStandard)     // x position of the first end of the line
				.attr("y1", i*(Resizer.FIELD_HEIGHT/12) + Config.PLAYER_CROSS_RADIUS * ratioToStandard)      // y position of the first end of the line
				.attr("x2", 3* Resizer.FIELD_WIDTH/4 + Config.PLAYER_CROSS_RADIUS * ratioToStandard)     // x position of the second end of the line
				.attr("y2", i*(Resizer.FIELD_HEIGHT/12) - Config.PLAYER_CROSS_RADIUS * ratioToStandard)    // y position of the second end of the line
				.css("stroke-width", Config.PLAYER_CROSS_STROKE_WIDTH * ratioToStandard));
			fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'rect')) // attach a rect
				.attr("class", 'object_rect')
				.attr("id", 'B'+i+"_rect")
				.attr("x", 3* Resizer.FIELD_WIDTH/4 - (Config.PLAYER_RADIUS+Config.PLAYER_BORDER_WIDTH) * ratioToStandard)     // x position of the first end of the line
				.attr("y", i*(Resizer.FIELD_HEIGHT/12) - (Config.PLAYER_RADIUS+Config.PLAYER_BORDER_WIDTH) * ratioToStandard)      // y position of the first end of the line
				.attr("width", (Config.PLAYER_RADIUS+Config.PLAYER_BORDER_WIDTH)*2 * ratioToStandard)     // x position of the second end of the line
				.attr("height", (Config.PLAYER_RADIUS+Config.PLAYER_BORDER_WIDTH)*2 * ratioToStandard)    // y position of the second end of the line
				.css("stroke-width", Config.PLAYER_RECT_WIDTH * ratioToStandard)
				.css("fill", "black")
				.css("fill-opacity", 0.001));
		}

		//BALL
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'circle')) // attach a circle
			.attr("class", 'object')
			.attr("id", 'BALL')
			.attr("cx", Resizer.FIELD_WIDTH / 2)
			.attr("cy", Resizer.FIELD_HEIGHT / 2)
			.attr("r", Config.BALL_RADIUS * ratioToStandard)
			.css("fill", Config.BALL_FILL_COLOR[0]));
		fieldInnerSvg.append($(document.createElementNS("http://www.w3.org/2000/svg", 'text')) // attach a text
			.attr("class", "object_text")
			.attr("id", 'BALL_text')
			.attr("x", Resizer.FIELD_WIDTH / 2 + Config.PLAYER_LABEL_OFFSET_X * ratioToStandard)
			.attr("y", Resizer.FIELD_HEIGHT / 2 + Config.PLAYER_LABEL_OFFSET_Y * ratioToStandard)
			.attr("visibility", "hidden")
			.attr("font-family", "sans-serif")
			.attr("font-size", Config.PLAYER_LABEL_FONT_SIZE * ratioToStandard)
			.css("fill", Config.BALL_FILL_COLOR[0])
			.text("BALL"));
	}

	/**
	 * Resizes everything
	 * @param multiplicator newFieldWidth/oldFieldWidth
	 */
	resize(multiplicator) {
		var ratioToStandard = Resizer.FIELD_WIDTH / 1000;

		/*===========================================================
		=== FIELD                                                 ===
		===========================================================*/
		$('.field-line').each(function(index) {
				$(this).attr("x", $(this).attr("x") * multiplicator)
				.attr("y", $(this).attr("y") * multiplicator)
				.attr("height", $(this).attr("height") * multiplicator)
				.attr("width", $(this).attr("width") * multiplicator)
				.css("stroke-width", Config.FIELD_STROKE_WIDTH * ratioToStandard);
		});

		$('.field-circle').each(function(index) {
			$(this).attr("cx", $(this).attr("cx") * multiplicator)
				.attr("cy", $(this).attr("cy") * multiplicator)
				.attr("r",  $(this).attr("r") * multiplicator)
				.css("stroke-width", Config.FIELD_STROKE_WIDTH * ratioToStandard);
		});

		$('.field-point').each(function(index) {
			$(this).attr("cx", $(this).attr("cx") * multiplicator)
				.attr("cy", $(this).attr("cy") * multiplicator)
				.attr("r", Config.FIELD_POINT_RADIUS * ratioToStandard)
		});

		var cornerCirclePath = "M 0 0" +
			" A "+Resizer.FIELD_CORNER_CIRCLE_RADIUS+ " "+Resizer.FIELD_CORNER_CIRCLE_RADIUS+", 0, 0, 0, "+Resizer.FIELD_CORNER_CIRCLE_RADIUS+" "+Resizer.FIELD_CORNER_CIRCLE_RADIUS+"" +
			" L "+Resizer.FIELD_CORNER_CIRCLE_RADIUS+" "+(Resizer.FIELD_CORNER_CIRCLE_RADIUS-Config.FIELD_STROKE_WIDTH*ratioToStandard)+" " +
			" A "+(Resizer.FIELD_CORNER_CIRCLE_RADIUS-Config.FIELD_STROKE_WIDTH*ratioToStandard)+" "+(Resizer.FIELD_CORNER_CIRCLE_RADIUS-Config.FIELD_STROKE_WIDTH*ratioToStandard)+", 270, 0, 1, "+(Config.FIELD_STROKE_WIDTH*ratioToStandard)+" 0" +
			" Z";

		var distPenaltySpotPenaltyAreaLine = Resizer.FIELD_PENALTYAREA_WIDTH-Resizer.FIELD_PENALTYSPORT_DISTANCE;
		var heightPenaltyArc = 2*Math.sqrt((Resizer.FIELD_LARGE_CIRCLE_RADIUS*Resizer.FIELD_LARGE_CIRCLE_RADIUS)-(distPenaltySpotPenaltyAreaLine*distPenaltySpotPenaltyAreaLine));
		var strokeWidthX = (distPenaltySpotPenaltyAreaLine/Resizer.FIELD_LARGE_CIRCLE_RADIUS)*Config.FIELD_STROKE_WIDTH*ratioToStandard;
		var strokeWidthY = Math.sin(Math.acos(distPenaltySpotPenaltyAreaLine/Resizer.FIELD_LARGE_CIRCLE_RADIUS))*Config.FIELD_STROKE_WIDTH*ratioToStandard;
		var penaltyArcPath = "M 0 0" +
			" A "+Resizer.FIELD_LARGE_CIRCLE_RADIUS+ " "+Resizer.FIELD_LARGE_CIRCLE_RADIUS+", 0, 0, 1, 0 "+heightPenaltyArc+"" +
			" L "+(-strokeWidthX)+" "+(heightPenaltyArc-strokeWidthY)+
			" A "+(Resizer.FIELD_LARGE_CIRCLE_RADIUS-Config.FIELD_STROKE_WIDTH*ratioToStandard)+" "+(Resizer.FIELD_LARGE_CIRCLE_RADIUS-Config.FIELD_STROKE_WIDTH*ratioToStandard)+", 270, 0, 0, "+(-strokeWidthX)+" "+strokeWidthY+
			" Z";

		$('#field-penaltyArcLeft').attr("d", penaltyArcPath)
			.attr("transform", "translate("+Resizer.FIELD_PENALTYAREA_WIDTH+","+(Resizer.FIELD_HEIGHT/2 - heightPenaltyArc/2)+"), rotate(0)");

		$('#field-penaltyArcRight').attr("d", penaltyArcPath)
			.attr("transform", "translate("+(Resizer.FIELD_WIDTH-Resizer.FIELD_PENALTYAREA_WIDTH)+","+(Resizer.FIELD_HEIGHT/2 + heightPenaltyArc/2)+"), rotate(180)");

		$('#field-cornerTopLeft').attr("d", cornerCirclePath)
			.attr("transform", "translate(0,"+Resizer.FIELD_CORNER_CIRCLE_RADIUS*ratioToStandard+"), rotate(270), scale("+ratioToStandard+")");

		$('#field-cornerTopRight').attr("d", cornerCirclePath)
			.attr("transform", "translate(" + (Resizer.FIELD_WIDTH-Resizer.FIELD_CORNER_CIRCLE_RADIUS*ratioToStandard) + ",0), scale("+ratioToStandard+")");

		$('#field-cornerBottomRight').attr("d", cornerCirclePath)
			.attr("transform", "translate(" + Resizer.FIELD_WIDTH + "," + (Resizer.FIELD_HEIGHT-Resizer.FIELD_CORNER_CIRCLE_RADIUS*ratioToStandard) + "), rotate(90), scale("+ratioToStandard+")");

		$('#field-cornerBottomLeft').attr("d", cornerCirclePath)
			.attr("transform", "translate("+(Resizer.FIELD_CORNER_CIRCLE_RADIUS*ratioToStandard)+"," + Resizer.FIELD_HEIGHT + "), rotate(180), scale("+ratioToStandard+")");

		/*===========================================================
		=== MOTION PATHS                                          ===
		===========================================================*/
		$('.motionPath').css("stroke-width", Config.PLAYER_RADIUS * 2 * ratioToStandard)
			.css("visibility", "hidden");

		/*===========================================================
		=== OFFSIDE LINE                                          ===
		===========================================================*/
		$('#offsideLine').css("stroke", Config.OFFSIDE_LINE_STROKE_COLOR)  // colour the line
			.css("stroke-width", Config.OFFSIDE_LINE_STROKE_WIDTH * ratioToStandard)
			.attr("y2", Resizer.FIELD_HEIGHT)   // y position of the second end of the line
			.attr("x1", $('#offsideLine').attr("x1")*multiplicator)
			.attr("x2", $('#offsideLine').attr("x2")*multiplicator);

		/*===========================================================
		=== PLAYER                                                ===
		===========================================================*/
		$('.object_inner').each(function(index) {
			$(this).attr("r", Config.PLAYER_RADIUS * ratioToStandard)
				.attr("cx", $(this).attr("cx")*multiplicator)
				.attr("cy", $(this).attr("cy")*multiplicator);

			if($(this).css('stroke-width') !== "0px") {
				$(this).css('stroke-width', Config.FIELD_STROKE_WIDTH * ratioToStandard);
			}
		});

		$('.object').each(function(index) {
			$(this).attr("r", Config.PLAYER_CLICK_RADIUS * ratioToStandard)
				.attr("cx", $(this).attr("cx")*multiplicator)
				.attr("cy", $(this).attr("cy")*multiplicator);
		});

		$('.object_text').each(function(index) {
			$(this).attr("x", $(this).attr("x")*multiplicator)
				.attr("y", $(this).attr("y")*multiplicator)
				.attr("font-size", Config.PLAYER_LABEL_FONT_SIZE * ratioToStandard);
		});

		$('.object_cross').each(function(index) {
			$(this).css("stroke-width", Config.PLAYER_CROSS_STROKE_WIDTH * ratioToStandard)
				.attr("x1", $(this).attr("x1")*multiplicator)
				.attr("y1", $(this).attr("y1")*multiplicator)
				.attr("x2", $(this).attr("x2")*multiplicator)
				.attr("y2", $(this).attr("y2")*multiplicator);
		});

		$('.object_rect').each(function(index) {
			$(this).css("stroke-width", Config.PLAYER_RECT_WIDTH * ratioToStandard)
				.attr("x", $(this).attr("x")*multiplicator)
				.attr("y", $(this).attr("y")*multiplicator)
				.attr("width", $(this).attr("width")*multiplicator)
				.attr("height", $(this).attr("height")*multiplicator);
		});

		/*===========================================================
		=== BALL                                                  ===
		===========================================================*/
		$('#BALL').attr("r", Config.BALL_RADIUS * ratioToStandard);

		/*===========================================================
		=== PASS EVENT LINE                                       ===
		===========================================================*/
		$('.passLine').css("stroke-width", Config.PASSEVENT_STROKE_WIDTH * ratioToStandard)
			.attr("x1", $('.passLine').attr("x1")*multiplicator)
			.attr("y1", $('.passLine').attr("y1")*multiplicator)
			.attr("x2", $('.passLine').attr("x2")*multiplicator)
			.attr("y2", $('.passLine').attr("y2")*multiplicator);
	}

	/**
	 * Starts the distance visualization.
	 */
	startDistanceVisualization() {
		setInterval((function () {
			this.updateDistance();
		}).bind(this), Config.GOALDISTANCE_UPDATE_INTERVAL_IN_MS);
	}

	/**
	 * Updates the distance values above the field.
	 */
	updateDistance() {
		if (!userInteraction.paused) {
			var obj_id = '#BALL';
			var pos_x = ($(obj_id).attr('cx') - Resizer.FIELD_WIDTH / 2) * Resizer.STREAM_COORDS_X_DIVIDER;
			var pos_y = ($(obj_id).attr('cy') - Resizer.FIELD_HEIGHT / 2) * Resizer.STREAM_COORDS_Y_DIVIDER;

			var diffLeftX = pos_x - field.minXInM;
			var diffRightX = field.maxXInM - pos_x;
			var diffY = pos_y;
			if(diffY < 0) {
				diffY = -diffY;
			}

			var decimalHelper = Math.pow(10,Config.NUM_GOALDISTANCE_DECIMALS);
			var distLeft = Math.round(Math.sqrt((diffLeftX*diffLeftX)+(diffY*diffY))*decimalHelper)/decimalHelper;
			var distRight = Math.round(Math.sqrt((diffRightX*diffRightX)+(diffY*diffY))*decimalHelper)/decimalHelper;

			$('#above-field-info-left-distanceToGoal').html("Dist. to goal: " +  distLeft + " m left, " + distRight + " m right");
		}
	}

	/**
	 * Updates the position of a player or the ball
	 * @param objectId Identifier of the player or the ball
	 * @param x X coordinate
	 * @param y Y coordinate
	 */
	updateObject(objectId, x, y) {
		var ratioToStandard = Resizer.FIELD_WIDTH / 1000;
		var objId = "#" + objectId;

		var x_field = x / Resizer.STREAM_COORDS_X_DIVIDER + Resizer.FIELD_WIDTH / 2;
		var y_field = y / Resizer.STREAM_COORDS_Y_DIVIDER + Resizer.FIELD_HEIGHT / 2;

		$(objId).attr('cx', x_field);
		$(objId).attr('cy', y_field);

		$(objId+"_inner").attr('cx', x_field);
		$(objId+"_inner").attr('cy', y_field);

		$(objId+"_text").attr('x', x_field+Config.PLAYER_LABEL_OFFSET_X*ratioToStandard);
		$(objId+"_text").attr('y', y_field+Config.PLAYER_LABEL_OFFSET_Y*ratioToStandard);

		$(objId+"_cross_1").attr('x1', x_field-Config.PLAYER_CROSS_RADIUS*ratioToStandard);
		$(objId+"_cross_1").attr('x2', x_field+Config.PLAYER_CROSS_RADIUS*ratioToStandard);
		$(objId+"_cross_1").attr('y1', y_field-Config.PLAYER_CROSS_RADIUS*ratioToStandard);
		$(objId+"_cross_1").attr('y2', y_field+Config.PLAYER_CROSS_RADIUS*ratioToStandard);
		$(objId+"_cross_2").attr('x1', x_field-Config.PLAYER_CROSS_RADIUS*ratioToStandard);
		$(objId+"_cross_2").attr('x2', x_field+Config.PLAYER_CROSS_RADIUS*ratioToStandard);
		$(objId+"_cross_2").attr('y1', y_field+Config.PLAYER_CROSS_RADIUS*ratioToStandard);
		$(objId+"_cross_2").attr('y2', y_field-Config.PLAYER_CROSS_RADIUS*ratioToStandard);

		$(objId+"_rect").attr('x', x_field-(Config.PLAYER_RADIUS+Config.PLAYER_BORDER_WIDTH)*ratioToStandard);
		$(objId+"_rect").attr('y', y_field-(Config.PLAYER_RADIUS+Config.PLAYER_BORDER_WIDTH)*ratioToStandard);
	}

	/**
	 * Sets the fill color of the players of a team.
	 * @param teamId Identifier of the team
	 * @param fillColor Fill color
	 */
	setTeamColor(teamId, fillColor) {
		var oldTeamColor = rgbcolor(this.teamColor.get(teamId));
		for(var i=1; i<=11; i++) {
			var currentPlayerColor = rgbcolor($("#" + teamId + i + "_inner").css('fill'));
			if(oldTeamColor.r === currentPlayerColor.r && oldTeamColor.g === currentPlayerColor.g && oldTeamColor.b === currentPlayerColor.b) { // Check that prevents that the fill color of a player who has currently a fill highlight is changed
				$("#" + teamId + i + "_inner").css('fill', fillColor);
			}
			$("#" + teamId + i + "_text").css('fill', fillColor);
		}
		this.teamColor.set(teamId, fillColor);

		if(fillColor == Config.BALL_FILL_COLOR[0]) {
			$("#BALL").css('fill', Config.BALL_FILL_COLOR[1]);
			$("#BALL_text").css('fill', Config.BALL_FILL_COLOR[1]);
		}
	}

	/**
	 * Sets the label of an object.
	 * @param objectId Identifier of the object
	 * @param objectLabel Label of the object
	 */
	setObjectLabel(objectId, objectLabel) {
		$("#" + objectId + "_text").text(objectLabel);
	}

	/**
	 * Highlights the player by adding a stroke around the player.
	 * @param playerId Identifier of the player
	 * @param strokeColor Color of the stroke
	 */
	addStrokePlayerHighlight(playerId, strokeColor) {
		var objId = "#" + playerId + "_inner";
		$(objId).css('stroke-width', Config.PLAYER_BORDER_WIDTH * (Resizer.FIELD_WIDTH/1000));
		$(objId).css('stroke', strokeColor);
	}

	/**
	 * Highlights the player by changing its fill color.
	 * @param playerId Identifier of the player
	 * @param fillColor Fill color
	 */
	addFillPlayerHighlight(playerId, fillColor) {
		$("#" + playerId + "_inner").css('fill', fillColor);
	}

	/**
	 * Highlights the player by overlaying it with a cross.
	 * @param playerId Identifier of the player
	 */
	addCrossPlayerHighlight(playerId) {
		var color = rgbcolor($("#" + playerId + "_inner").css('fill'));
		var invertedColor = 'rgb(' + (255-color.r) + ',' + (255-color.g) + ',' + (255-color.b) + ')';

		$("#" + playerId + "_cross_1").css('display', 'block');
		$("#" + playerId + "_cross_2").css('display', 'block');
		$("#" + playerId + "_cross_1").css('stroke', invertedColor);
		$("#" + playerId + "_cross_2").css('stroke', invertedColor);
	}

	/**
	 * Highlights the player by surrounding it with a rect
	 * @param playerId Identifier of the player
	 * @param rectColor Color of the rect
	 */
	addRectPlayerHighlight(playerId, rectColor) {
		$("#" + playerId + "_rect").css('display', 'block');
		$("#" + playerId + "_rect").css('stroke', rectColor);
	}

	/**
	 * Removes the stroke highlighting of a player.
	 * @param playerId Identifier of the player
	 */
	removeStrokePlayerHighlight(playerId) {
		if(playerId !== null) {
			$("#" + playerId + "_inner").css('stroke-width', '0px');
		}
	}

	/**
	 * Removes the fill highlighting of a player.
	 * @param playerId Identifier of the player
	 */
	removeFillPlayerHighlight(playerId) {
		if(playerId !== null) {
			if (playerId[0] === "A") {
				$("#" + playerId + "_inner").css('fill', field.teamColor.get("A"));
			} else {
				$("#" + playerId + "_inner").css('fill', field.teamColor.get("B"));
			}
		}
	}

	/**
	 * Removes the cross highlighting of a player.
	 * @param playerId Identifier of the player
	 */
	removeCrossPlayerHighlight(playerId) {
		if(playerId !== null) {
			$("#" + playerId + "_cross_1").css('display', 'none');
			$("#" + playerId + "_cross_2").css('display', 'none');
		}
	}

	/**
	 * Removes the rect highlighting of a player.
	 * @param playerId Identifier of the player
	 */
	removeRectPlayerHighlight(playerId) {
		if(playerId !== null) {
			$("#" + playerId + "_rect").css('display', 'none');
		}
	}

	/**
	 * Highlights the ball possession.
	 * @param oldPlayer Identifier of the player that has been in ball possession
	 * @param newPlayer Identifier of the player who is in ball possession
	 */
	highlightBallPossession(oldPlayer, newPlayer) {
		if (oldPlayer != undefined) {
			this.removeStrokePlayerHighlight(oldPlayer);
			if (oldPlayer === heatmap.currentId) { // Reset heatmap stroke highlighting
				var teamColor = field.teamColor.get(oldPlayer.substr(0,1));
				this.addStrokePlayerHighlight(oldPlayer, teamColor);
			}
		}
		if (newPlayer != undefined) {
			var teamColor = field.teamColor.get(newPlayer.substr(0,1));
			var strokeColor = Config.BALL_POSSESSION_HIGHLIGHT_STROKE_COLOR[0];
			if (teamColor === strokeColor) {
				strokeColor = Config.BALL_POSSESSION_HIGHLIGHT_STROKE_COLOR[1];
			}
			this.addStrokePlayerHighlight(newPlayer, strokeColor);
		}
	}

	/**
	 * Highlights a duel.
	 * @param defendingPlayer Identifier of the defending player
	 * @param attackingPlayer Identifier of the attacking player
	 */
	highlightDuel(defendingPlayer, attackingPlayer) {
		var defendingTeamColor = field.teamColor.get(defendingPlayer.substr(0,1));
		var defendingStrokeColor = Config.DUEL_HIGHLIGHT_STROKE_COLOR[0];
		if (defendingTeamColor === defendingStrokeColor) {
			defendingStrokeColor = Config.DUEL_HIGHLIGHT_STROKE_COLOR[1];
		}
		if(!$('#visualize-ballPossession-checkbox').prop("checked")) {
			this.addStrokePlayerHighlight(defendingPlayer, defendingStrokeColor);
		}

		var attackingTeamColor = field.teamColor.get(attackingPlayer.substr(0,1));
		var attackingStrokeColor = Config.DUEL_HIGHLIGHT_STROKE_COLOR[0];
		if (attackingTeamColor === attackingStrokeColor) {
			attackingStrokeColor = Config.DUEL_HIGHLIGHT_STROKE_COLOR[1];
		}
		this.addStrokePlayerHighlight(attackingPlayer, attackingStrokeColor);
	}

	/**
	 * Removes a duel highlight.
	 * @param defendingPlayer Identifier of the defending player
	 * @param attackingPlayer Identifier of the attacking player
	 */
	removeDuelHightlight(defendingPlayer, attackingPlayer) {
		if(!$('#visualize-ballPossession-checkbox').prop("checked")) {
			this.removeStrokePlayerHighlight(defendingPlayer);
		}
		this.removeStrokePlayerHighlight(attackingPlayer);
	}

	/**
	 * Highlights a player under pressure.
	 * @param player Player under pressure
	 */
	highlightPlayerUnderPressure(player) {
		var teamColor = field.teamColor.get(player.substr(0,1));
		var rectColor = Config.UNDER_PRESSURE_HIGHLIGHT_COLOR[0];
		if (teamColor === rectColor) {
			rectColor = Config.UNDER_PRESSURE_HIGHLIGHT_COLOR[1];
		}
		this.addRectPlayerHighlight(player, rectColor);
	}

	/**
	 * Removes the player under pressure highlighting.
	 * @param player Player under pressure
	 */
	removeUnderPressureHighlight(player) {
		this.removeRectPlayerHighlight(player);
	}

	/**
	 * Updates the heatmap player highlighting,
	 * @param oldPlayer Old player for which the heatmap has been displayed
	 * @param newPlayer New player for which the heatmap is displayed now
	 */
	highlightHeatmapPlayer(oldPlayer, newPlayer) {
		if (oldPlayer != undefined && oldPlayer.length > 1) {
			field.removeFillPlayerHighlight(oldPlayer);
			field.removeStrokePlayerHighlight(oldPlayer);
		}

		var teamColor = field.teamColor.get(newPlayer.substr(0,1));
		field.addStrokePlayerHighlight(newPlayer, teamColor);

		var fillColor = Config.HEATMAP_HIGHLIGHT_FILL_COLOR[0];
		if(teamColor === fillColor) {
			fillColor = Config.HEATMAP_HIGHLIGHT_FILL_COLOR[1];
		}
		field.addFillPlayerHighlight(newPlayer, fillColor);
	}

	/**
	 * Updates the offside players highlighting.
	 * @param oldPlayersInOffsidePosition List of players which have been in offside position
	 * @param newPlayersInOffsidePosition List of players which are in offside position now
	 */
	highlightOffsidePlayers(oldPlayersInOffsidePosition, newPlayersInOffsidePosition) {
		for (var i = 0; i < oldPlayersInOffsidePosition.length; i++) {
			field.removeStrokePlayerHighlight(oldPlayersInOffsidePosition[i]);
		}

		for (var i = 0; i < newPlayersInOffsidePosition.length; i++) {
			var teamColor = field.teamColor.get(newPlayersInOffsidePosition[i].substr(0,1));
			var strokeColor = Config.OFFSIDE_HIGHLIGHT_STROKE_COLOR[0];
			if(teamColor === strokeColor) {
				strokeColor = Config.OFFSIDE_HIGHLIGHT_STROKE_COLOR[1];
			}
			field.addStrokePlayerHighlight(newPlayersInOffsidePosition[i], strokeColor);
		}
	}

	/**
	 * Visualizes a pass event.
	 * @param startX X coordinate of the start of the pass event
	 * @param startY Y coordinate of the start of the pass event
	 * @param endX X coordinate of the end of the pass event
	 * @param endY Y coordinate of the end of the pass event
	 * @param color Color
	 */
	displayPass(pass, color) {
		if (!userInteraction.blockEventVisualization) {
			var xMult = Resizer.FIELD_WIDTH / (field.maxXInM-field.minXInM);
			var yMult = Resizer.FIELD_HEIGHT / (field.maxYInM-field.minYInM);

			clearTimeout(this.displayPassTimeout);
			$(".passLine").remove();

			for(var i = 0; i<pass.length; ++i)
			{
				var x1 = Resizer.FIELD_WIDTH / 2 + pass[i].startX * xMult;
				var y1 = Resizer.FIELD_HEIGHT / 2 + pass[i].startY * yMult;
				var x2 = Resizer.FIELD_WIDTH / 2 + pass[i].endX * xMult;
				var y2 = Resizer.FIELD_HEIGHT / 2 + pass[i].endY * yMult;

				$("#field-inner-svg").append($(document.createElementNS("http://www.w3.org/2000/svg", 'line')) // attach a line
					.attr("class", 'passLine')
					.attr("x1", x1)     // x position of the first end of the line
					.attr("y1", y1)      // y position of the first end of the line
					.attr("x2", x2)     // x position of the second end of the line
					.attr("y2", y2)    // y position of the second end of the line
					.css("stroke", color)  // colour the line
					.css("stroke-width", Config.PASSEVENT_STROKE_WIDTH * (Resizer.FIELD_WIDTH / 1000)));
			}

			for(var i = 1; i<pass.length; ++i)
			{
				var x1 = Resizer.FIELD_WIDTH / 2 + pass[i-1].endX * xMult;
				var y1 = Resizer.FIELD_HEIGHT / 2 + pass[i-1].endY * yMult;
				var x2 = Resizer.FIELD_WIDTH / 2 + pass[i].startX * xMult;
				var y2 = Resizer.FIELD_HEIGHT / 2 + pass[i].startY * yMult;

				$("#field-inner-svg").append($(document.createElementNS("http://www.w3.org/2000/svg", 'line')) // attach a line
					.attr("class", 'passLine')
					.attr("x1", x1)     // x position of the first end of the line
					.attr("y1", y1)      // y position of the first end of the line
					.attr("x2", x2)     // x position of the second end of the line
					.attr("y2", y2)    // y position of the second end of the line
					.css("stroke", color)  // colour the line
					.css("stroke-dasharray", "5, 5")
					.css("stroke-width", Config.PASSEVENT_STROKE_WIDTH * (Resizer.FIELD_WIDTH / 1000)));
			}

			this.displayPassTimeout = window.setTimeout(function () {
				$(".passLine").remove();
			}, Config.PASSEVENT_DISPLAY_DURATION_IN_MS);
		}
	}

	/**
	 * Visualizes a motion path.
	 * @param type Type of the motion path
	 * @param points Points array
	 * @param color Color
	 */
	displayMotionPath(type, points, color) {
		var pointsField = [];
		for(var i=0; i<points.length; ++i) {
			var x_field = points[i][0] / Resizer.STREAM_COORDS_X_DIVIDER + Resizer.FIELD_WIDTH / 2;
			var y_field = points[i][1] / Resizer.STREAM_COORDS_Y_DIVIDER + Resizer.FIELD_HEIGHT / 2;
			pointsField.push([x_field,y_field]);
		}

		var pointsString = teamVisualization.generatePointsString(pointsField);

		$("#motionPath-"+type).attr("points", pointsString)
			.css("stroke", color)
			.css("visibility", "visible");
	}

	removeMotionPath(type) {
		$("#motionPath-"+type).css("visibility", "hidden");
	}

	/**
	 * Updates the virtual offside line.
	 * @param x X coordinate of the virtual offside line
	 */
	updateOffsideLine(x) {
		var x_field = x / Resizer.STREAM_COORDS_X_DIVIDER + Resizer.FIELD_WIDTH / 2;
		$("#offsideLine").attr('x1', x_field).attr('x2', x_field);
	}

	/**
	 * Set if the player labels should be displayed.
	 * @param decision Decision
	 */
	showPlayerLabels(decision) {
		if(decision === true) {
			$(".object_text").css("visibility", "visible");
		} else {
			$(".object_text").css("visibility", "hidden");
		}
	}

	/**
	 * Set if the ball possession should be highlighted.
	 * @param decision Decision
	 */
	showBallPossession(decision) {
		if(decision === true) {
			field.highlightBallPossession(null, ballPossessionChangeEventConsumer.playerInBallPossession);
		} else {
			field.removeStrokePlayerHighlight(ballPossessionChangeEventConsumer.playerInBallPossession);
		}
	}

	/**
	 * Updates if the virtual offside line should be displayed.
	 */
	updateOffsideVisualizationVisibility() {
		var checked = $('#visualize-virtualOffside-checkbox').prop("checked");
		if(checked && !offsideLineStateConsumer.xIsNull) {
			$("#offsideLine").css("visibility", "visible");
		} else {
			$("#offsideLine").css("visibility", "hidden");
			for (var i = 0; i < offsideLineStateConsumer.oldPlayersInOffsidePosition.length; i++) {
				field.removeStrokePlayerHighlight(offsideLineStateConsumer.oldPlayersInOffsidePosition[i]);
			}
		}
	}
}