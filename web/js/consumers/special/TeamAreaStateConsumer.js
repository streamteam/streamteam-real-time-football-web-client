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
 * Consumes elements of the teamAreaState stream and updates the minimum bounding rectangle surface and the planar convex hull surface in the corresponding graphs.
 */
class TeamAreaStateConsumer extends AbstractStreamConsumer {

	/**
	 * TeamAreaStateConsumer constructor.
	 */
	constructor() {
		super("teamAreaState", queryDict.matchId, Config.TEAM_AREA_STATE_CONSUMPTION_LIMIT, Config.TEAM_AREA_STATE_CONSUMPTION_INTERVAL_IN_MS);
	}

	/**
	 * Handles a successful JSON result received after a consumption call.
	 *
	 * @param jsonResult Successful JSON result received after a consumption call
	 */
	handleSuccess(jsonResult) {
		if (typeof ImmutableDataStreamElementContent !== 'undefined' && typeof TeamAreaStateStreamElementPayload !== 'undefined') {
			for (var i = 0; i < jsonResult.d.length; ++i) {
				var offset = jsonResult.d[i].o;
				var teamAreaStateStreamElement = decodeBase64EncodedImmutableDataStreamElement(jsonResult.d[i].v);

				var teamId = teamAreaStateStreamElement.groupIdentifiers[0];

				if (super.isNewDataStreamElement("teamAreaState-"+teamId, offset)) {
					super.setLatestOffset("teamAreaState-"+teamId, offset);

					var mbrSurface = parseFloat(teamAreaStateStreamElement.payload.mbrSurface);
					var pchSurface = parseFloat(teamAreaStateStreamElement.payload.pchSurface);

					statisticsAndGraphs.addValueToGraph("mbrSurface-"+teamId, mbrSurface);
					statisticsAndGraphs.addValueToGraph("pchSurface-"+teamId, pchSurface);
				}
			}
		}
	}
}
