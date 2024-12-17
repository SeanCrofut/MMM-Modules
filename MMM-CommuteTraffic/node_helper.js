const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
    socketNotificationReceived: async function (notification, payload) {
        if (notification === "GET_TRAFFIC_DATA") {
            const { apiKey, origin, destination } = payload;

            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
                origin
            )}&destination=${encodeURIComponent(
                destination
            )}&departure_time=now&key=${apiKey}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.status === "OK") {
                    const route = data.routes[0];
                    const leg = route.legs[0];

                    const trafficData = {
                        summary: route.summary,
                        duration: leg.duration,
                        duration_in_traffic: leg.duration_in_traffic,
                    };

                    this.sendSocketNotification("TRAFFIC_DATA", trafficData);
                } else {
                    console.error("Error fetching traffic data:", data.error_message);
                }
            } catch (error) {
                console.error("Error fetching traffic data:", error);
            }
        }
    },
});
