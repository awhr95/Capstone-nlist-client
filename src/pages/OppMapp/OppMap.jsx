import "./OppMap.scss";
import Header from "../../components/Header/Header";
import FooterNav from "../../components/FooterNav/FooterNav";
import FilterMenu from "../../components/FilterMenu/FilerMenu";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import mapboxgl, { clearStorage } from "mapbox-gl";

mapboxgl.accessToken = process.env.REACT_APP_MAP_BOX_TOKEN;

function OppMap() {
  const apiUrl = process.env.REACT_APP_URL;
  const port = process.env.REACT_APP_PORT;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-0.12);
  const [lat, setLat] = useState(51.45);
  const [zoom, setZoom] = useState(10);
  const [allOpportunities, setAllOpportunities] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [unpackedLocationData, setUnpackedLocationData] = useState(null);

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get(`${apiUrl}:${port}/opportunities`);
      setAllOpportunities(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchMapData = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}:${port}/map`);
      setLocationData(data);
    } catch (error) {
      console.error(error);
    }
  };
  function flyToOpp(currentFeature) {
    map.current.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 14,
    });
  }
  function buildLocationList(locationData) {
    if (!locationData) {
      return null;
    }
    return (
      <div className="map__listings">
        {locationData.map((feature, index) => (
          <div key={index} className="map__item">
            <a
              onClick={() => {
                flyToOpp(feature);
              }}
              href="#"
              className="map__title"
            >
              {feature.properties.title}
            </a>
            <div className="map__details">{feature.properties.description}</div>
          </div>
        ))}
      </div>
    );
  }

  useEffect(() => {
    fetchOpportunities();
    fetchMapData();
  }, []);

  useEffect(() => {
    if (map.current || !locationData) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/alex9595/cls92x1um01b201pl90gg0i2n",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on("click", (event) => {
      const features = map.current.queryRenderedFeatures(event.point, {
        layers: ["seed-data"], // replace with your layer name
      });
      // console.log(features);

      if (!features.length) {
        return;
      }

      const feature = features[0];
      flyToOpp(feature);

      const popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
          `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
        );

      if (map.current && typeof map.current.addControl === "function") {
        popup.addTo(map.current);
      }
    });

    map.current.on("load", () => {
      // Ensure locationData is not null before proceeding

      if (locationData) {
        map.current.addLayer({
          id: "locations",
          type: "circle",
          source: {
            type: "geojson",
            data: locationData,
          },
        });
        setUnpackedLocationData(locationData.features);
      }
    });
  }, [locationData]);

  let listings = null;

  if (unpackedLocationData && unpackedLocationData.length > 0) {
    listings = buildLocationList(unpackedLocationData);
  }

  return (
    <>
      <Header />
      <FilterMenu />
      {/* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}
      {/* <div ref={mapContainer} className="map-container"></div> */}
      <div className="map__page">
        <section className="map__list-container">{listings}</section>
        <div ref={mapContainer} className="map__container"></div>
      </div>

      <FooterNav />
    </>
  );
}

export default OppMap;
