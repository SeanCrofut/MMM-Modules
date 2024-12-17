Module.register("MMM-PremierLeagueSoccer", {
    defaults: {
        updateInterval: 10 * 60 * 1000 // Update every 10 minutes
    },

    start: function () {
        this.standings = [];
        this.getData();
        this.scheduleUpdate();
    },

    getStyles: function () {
        return ["MMM-PremierLeagueSoccer.css"];
    },

    getData: function () {
        this.sendSocketNotification("FETCH_EPL_DATA", {
            apiUrl: this.config.apiUrl,
            apiKey: this.config.apiKey
        });
    },

    scheduleUpdate: function () {
        const self = this;
        setInterval(() => {
            self.getData();
        }, this.config.updateInterval);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "EPL_DATA_RECEIVED") {
            this.standings = payload;
            this.updateDom();
        }
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        if (this.standings.length === 0) {
            wrapper.innerHTML = "Loading standings...";
            return wrapper;
        }

        const table = document.createElement("table");
        table.className = "MMM-PremierLeagueSoccer";

        const headerRow = document.createElement("tr");
        [" ", "Team ", "Played ", "Points"].forEach((header) => {
            const th = document.createElement("th");
            th.innerHTML = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        let counter = 0; 
        this.standings.forEach((team) => {
            if (counter >= 10) return; // Only show top N teams
            const row = document.createElement("tr");

            // Add data for each row
            ["position", "name", "playedGames", "points"].forEach((key) => {
                const cell = document.createElement("td");
                cell.innerHTML = team[key];
                row.appendChild(cell);
            });

            table.appendChild(row);
            counter++;
        });

        wrapper.appendChild(table);
        return wrapper;
    }
});
