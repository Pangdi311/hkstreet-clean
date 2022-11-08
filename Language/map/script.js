mapboxgl.accessToken = "pk.eyJ1IjoiZHBhbmczMTEiLCJhIjoiY2tidmNld2cyMDA5djJwbXYzZjZsNTB0OSJ9.hvW536UZKn2wDDH6yDjJ2g";

const bounds = [
    [113.8, 22.18], // Southwest coordinates
    [114.5, 22.57] // Northeast coordinates
];

const lineColors = ["#4589ff", "#d2a106", "#6fdc8c"];
const layerNames = ["Sino-Tibetan", "Indo-European", "Mixed"];


const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/dpang311/ck21xo59h0cht1cmm2wjrmoki",
    center: [114.18, 22.285],
    zoom: 12,
    maxBounds: bounds
});

const sources = {
    chi: {
        type: "geojson",
        data: "https://raw.githubusercontent.com/Pangdi311/hkstreets/main/chi.geojson"
    },
    eng: {
        type: "geojson",
        data:
            "https://raw.githubusercontent.com/Pangdi311/hkstreets/main/eng.geojson"
    },
    mixed: {
        type: "geojson",
        data:
            "https://raw.githubusercontent.com/Pangdi311/hkstreets/main/mix.geojson"
    }
}

const layers = {
    chi: {
        source: "chi",
        id: "chi-layer",
        type: "line",
        layout: {
            "line-join": "round",
            "line-cap": "round"
        },
        paint: {
            "line-color": "#4589ff",
            "line-width": 1,
            "line-opacity": 1
        },
        getHTML: function (e) {
            return '<strong><p style="color:#4589ff; margin-top:0px">Sino-Tibetan</p></strong>' +
                e.features[0].properties.name
        }
    },
    eng: {
        source: "eng",
        id: "eng-layer",
        type: "line",
        layout: {
            "line-join": "round",
            "line-cap": "round"
        },
        paint: {
            "line-color": " #d2a106",
            "line-width": 1
        },
        getHTML: function (e) {
            return '<strong><p style="color:#d2a106; margin-top:0px">Indo-European</p></strong>' +
                e.features[0].properties.name
        }
    },
    mixed: {
        source: "mixed",
        id: "mixed-layer",
        type: "line",
        layout: {
            "line-join": "round",
            "line-cap": "round"
        },
        paint: {
            "line-color": "#6fdc8c",
            "line-width": 1
        },
        getHTML: function (e) {
            return '<strong><p style="color:#6fdc8c; margin-top:0px">Mixed</p></strong>' +
                e.features[0].properties.name
        }
    }
}

const invisiblePaint = {
    "line-width": 5,
    "line-opacity": 0
}

const createLegend = () => {
    const legend = document.getElementById("legend");
    layerNames.forEach((layer, i) => {
        const color = lineColors[i];
        const item = document.createElement("div");
        const key = document.createElement("span");
        key.className = "legend-key";
        key.style.backgroundColor = color;

        const value = document.createElement("span");
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });
}

map.on("load", () => {

    // create legend
    createLegend(layerNames)

    // Add Sources
    for (const [sourceName, source] of Object.entries(sources)) {
        map.addSource(sourceName, source);
    };

    for (const [layerName, layer] of Object.entries(layers)) {
        map.addLayer(layer);
        map.addLayer({
            ...layer, ...{
                id: `${layer.id}-invisible`,
                paint: {...layer.paint, ...invisiblePaint}
            }
        });
    }

    const popupCommon = new mapboxgl.Popup({
        // closeButton: false,
        // closeOnClick: false,
        className: "popup"
    });

    for (const [layerName, layer] of Object.entries(layers)) {
        map.on("mouseenter", `${layer.id}-invisible`, (e) => {
            map.getCanvas().style.cursor = "";
            popupCommon.remove();

            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = "pointer";
            popupCommon
                .setLngLat(e.lngLat)
                .setHTML(layer.getHTML(e))
                .addTo(map);
        });

        // map.on("mouseleave", `${layer.id}-invisible`, () => {
        //     map.getCanvas().style.cursor = "";
        //     popupCommon.remove();
        // });
    }});
