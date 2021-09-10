import React, { useRef, useEffect, useCallback } from 'react';

const Map = props => {
  const mapRef = useRef();
  const { coords, zoom, descriptions } = props;

  const setMarkers = useCallback(
    map => {
      if (!coords) return;

      const markers = coords.map(location => {
        return new window.google.maps.Marker({
          position: location,
          map,
          //   icon: {
          //     url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          //   },
          zIndex: 1,
        });
      });

      return markers;
    },
    [coords]
  );

  const setInfoWindows = useCallback((markers, map, descriptions) => {
    if (!markers || markers.length !== descriptions.length) return;

    markers.forEach((marker, i) => {
      const infoWindow = new window.google.maps.InfoWindow({
        content: descriptions[i],
      });
      infoWindow.open({
        anchor: marker,
        map,
      });
    });
  }, []);

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: coords[0],
      zoom: zoom,
    });

    const bounds = new window.google.maps.LatLngBounds();

    const markers = setMarkers(map);

    markers.forEach(marker => bounds.extend(marker.position));
    setInfoWindows(markers, map, descriptions);
    map.fitBounds(bounds);
  }, [coords, zoom, descriptions, setMarkers, setInfoWindows]);

  return <div style={{ width: '100%', height: '100%' }} ref={mapRef}></div>;
};

export default Map;
