const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
    start: function () {
        console.log("EPL node helper started...");
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "FETCH_EPL_DATA") {
            this.fetchData(payload.apiUrl, payload.apiKey);
        }
    },

    fetchData: async function (url, apiKey) {
        try {
            const response = await fetch(url, {
                headers: { "X-Auth-Token": apiKey }
            });
            const data = await response.json();
            if (data.standings && data.standings.length > 0) {
                const standings = data.standings[0].table.map((team) => ({
                    position: team.position,
                    name: team.team.name,
                    playedGames: team.playedGames,
                    points: team.points
                }));
                this.sendSocketNotification("EPL_DATA_RECEIVED", standings);
            }
        } catch (error) {
            console.error("Error fetching EPL data:", error);
        }
    }
});
