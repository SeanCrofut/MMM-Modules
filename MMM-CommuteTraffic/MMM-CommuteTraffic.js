Module.register("MMM-CommuteTraffic", {
    defaults: {
        origin: "23015 Madison St, Torrance CA", 
        destination: "1650 Glenn Curtiss Ave, Carson CA", 
        apiKey: "",
        updateInterval: 10 * 60 * 1000, // 10 minutes: 1000 (ms conversion) -> 60(seconds conversion) -> 10(minutes)
        mapHeight: 400, 
        mapWidth: 600, 
    },

    start: function () {
        this.trafficData = null;
        this.getTrafficData();
        setInterval(() => {
            this.getTrafficData();
        }, this.config.updateInterval);
    },

    getDom: function () {
        const wrapper = document.createElement("div");

        if (!this.config.apiKey) {
            wrapper.innerHTML = "Add your API key to the config";
            return wrapper;
        }

        if (!this.trafficData) {
            wrapper.innerHTML = "Loading map...";
            return wrapper;
        }

        const { summary, duration_in_traffic, duration } = this.trafficData;

        // Build map
        const mapIframe = document.createElement("iframe");
        mapIframe.src = `https://www.google.com/maps/embed/v1/directions?key=${this.config.apiKey}&origin=${this.config.origin}&destination=${this.config.destination}&mode=driving`;
        mapIframe.width = this.config.mapWidth;
        mapIframe.height = this.config.mapHeight;
        mapIframe.style.border = "0";
        mapIframe.style.marginBottom = "10px";

        // Display the traffic info
        wrapper.appendChild(mapIframe);
        wrapper.innerHTML += `
            <div>
                <strong>Route:</strong> ${summary}<br>
                <strong>Usual Estimated Duration:</strong> ${duration.text}<br>
                <strong>Current Traffic Conditions:</strong> ${duration_in_traffic.text}
            </div>
        `;
        return wrapper;
    },

    getTrafficData: function () {
        this.sendSocketNotification("GET_TRAFFIC_DATA", {
            apiKey: this.config.apiKey,
            origin: this.config.origin,
            destination: this.config.destination,
        });
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "TRAFFIC_DATA") {
            this.trafficData = payload;
            this.updateDom();
        }
    },
});
