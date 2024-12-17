Module.register("MMM-Alexa", {
    defaults: {
        deviceName: "MagicMirror", 
        port: 11000,  
    },

    start: function() {
        Log.info("Starting MMM-Alexa module...");

        this.sendSocketNotification("START_ALEXA", this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "ALEXA_ACTION") {

            Log.info("Received action from Alexa: " + payload.action);
            
            if (payload.action === "ON") {
                this.sendNotification("SHOW_ALERT", {title: "Alexa", message: "Turning the mirror on!"});
            } else if (payload.action === "OFF") {
                this.sendNotification("SHOW_ALERT", {title: "Alexa", message: "Turning the mirror off!"});
            }
        }
    }
});
