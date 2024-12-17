const NodeHelper = require("node_helper");
const Fauxmo = require("fauxmojs");

module.exports = NodeHelper.create({
    start: function() {
        console.log("MMM-Alexa Node Helper started...");
        
        this.fauxmo = new Fauxmo({
            devices: [
                {
                    name: "MagicMirror",
                    port: 11000,
                    handler: (action) => {
                        console.log(`Action: ${action}`);
                        this.sendSocketNotification("ALEXA_ACTION", { action: action });
                    }
                }
            ]
        });

        console.log("Fauxmo started...");
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "START_ALEXA") {
            console.log("Starting Alexa...");
        }
    }
});
