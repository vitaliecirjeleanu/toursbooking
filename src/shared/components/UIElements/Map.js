import React, { useRef, useEffect } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

const Map = props => {
  const mapRef = useRef(null);
  const map = useRef(null); //for mapbox to initialize just once the map
  const { coords, zoom, descriptions } = props;

  //////////////////////////////////
  //THIS IS FOR MAPBOX API GEOCODING
  ///////////////////////////////////
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coords[0],
      // center: [lng, lat],
      zoom: zoom,
    });

    const bounds = new mapboxgl.LngLatBounds();

    coords.forEach((location, idx) => {
      // add marker
      new mapboxgl.Marker({ anchor: 'bottom', color: 'red' })
        .setLngLat(location)
        .addTo(map.current);

      //add popup
      new mapboxgl.Popup({
        offset: 50,
        closeOnClick: false,
      })
        .setLngLat(location)
        .setHTML(`<p>${descriptions[idx]}</p>`)
        .addTo(map.current);

      // Extend map bounds to include current location
      bounds.extend(location);
    });

    map.current.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
      },
    });
  }, [coords, descriptions, zoom]);

  //////////////////////////////////
  //THIS IS FOR GOOGLE API GEOCODING
  ///////////////////////////////////

  // const setMarkers = useCallback(
  //   map => {
  //     if (!coords) return;

  //     const markers = coords.map(location => {
  //       return new window.google.maps.Marker({
  //         position: location,
  //         map,
  //         //   icon: {
  //         //     url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  //         //   },
  //         zIndex: 1,
  //       });
  //     });

  //     return markers;
  //   },
  //   [coords]
  // );

  // const setInfoWindows = useCallback((markers, map, descriptions) => {
  //   if (!markers || markers.length !== descriptions.length) return;

  //   markers.forEach((marker, i) => {
  //     const infoWindow = new window.google.maps.InfoWindow({
  //       content: descriptions[i],
  //     });
  //     infoWindow.open({
  //       anchor: marker,
  //       map,
  //     });
  //   });
  // }, []);

  // useEffect(() => {
  //   const map = new window.google.maps.Map(mapRef.current, {
  //     center: coords[0],
  //     zoom: zoom,
  //   });

  //   const bounds = new window.google.maps.LatLngBounds();

  //   const markers = setMarkers(map);

  //   markers.forEach(marker => bounds.extend(marker.position));
  //   setInfoWindows(markers, map, descriptions);
  //   map.fitBounds(bounds);
  // }, [coords, zoom, descriptions, setMarkers, setInfoWindows]);

  return <div style={{ width: '100%', height: '100%' }} ref={mapRef}></div>;
};

export default Map;
