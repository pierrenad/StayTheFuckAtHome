import React, { Component, useEffect } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { default as update } from "react-addons-update";
import {default as canUseDOM} from "can-use-dom";
import {shouldUpdate} from 'recompose'

const checkPropsChange = (props, nextProps) => {
    return false;
}
const Map = shouldUpdate(checkPropsChange)(props => {
    const [state, setState] = React.useState({ markers: []});
    const laDate = React.useRef(props.date);
    
    React.useEffect(() => {
        props.setMarkers(state.markers);
    }, [state.markers]);

    const handleMapClick = (event) => {

        var { markers } = state;
        
        markers = update(markers, {
            $push: [
                {
                    date: props.laDate.current,
                    position: event.latLng,
                    key: Date.now(),// Add a key property for: http://fb.me/react-warning-keys
                },
            ],
        });
        setState({ markers });

        // if (3 === markers.length) {
        //     props.toast(
        //         "Right click on the marker to remove it",
        //         "Also check the code!"
        //     );
        // }
    }

    const handleMarkerRightclick = (index, event) => {
        /*
         * All you modify is data, and the view is driven by data.
         * This is so called data-driven-development. (And yes, it's now in
         * web front end and even with google maps API.)
         */
        var { markers } = state;
        markers = update(markers, {
            $splice: [
                [index, 1]
            ],
        });
        setState({ markers });
    }

    const GoogleMapExample = withGoogleMap(props => (
        <GoogleMap
            defaultCenter={{ lat: 40.756795, lng: -73.954298 }}
            defaultZoom={13}
            onClick={handleMapClick}>
            >
            {state.markers && state.markers.map((marker, index) => {
                return (
                    <Marker
                        {...marker}
                        onRightclick={handleMarkerRightclick.bind(this, index)} />
                );
            })}
        </GoogleMap>
    ));
    return (
        <div>
            <GoogleMapExample
                containerElement={<div style={{
                    width: '100%',
                    height: '100vh'
                }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
    );
})
export default Map;