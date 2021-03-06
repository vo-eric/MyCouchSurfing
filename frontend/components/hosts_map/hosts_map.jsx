import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import MarkerManager from '../../util/marker_manager';

const getCoordsObj = latLng => {
  return {
    latitude: latLng.lat(),
    longitude: latLng.lng()
  };
};

const mapOptions = {
  center: {
    lat: parseFloat(window.localStorage.latitude),
    lng: parseFloat(window.localStorage.longitude)
  },
  zoom: 12,
  scrollwheel: true
};

class HostMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hosts: this.props.hosts,
      style: this.props.style,
      previousMarker: null,
      location: mapOptions.center
    };
    this.renderHosts = this.renderHosts.bind(this);
    this.renderChatOption = this.renderChatOption.bind(this);
  }

  componentDidMount(props) {
    if (this.props.center) {
      mapOptions.center = this.props.center;
    }
    if (window.localStorage.latitude) {
      mapOptions.center = {lat: parseFloat(window.localStorage.latitude),lng: parseFloat(window.localStorage.longitude)};
    }
    this.map = new google.maps.Map(this.mapNode, mapOptions);
    this.map.addListener('idle',() => {
      let location = { lat: this.map.getCenter().lat(), lng: this.map.getCenter().lng() };
      if (this.state.location.lat != location.lat){
        this.setState({ location });
      }
    });
  }

  renderChatOption(host) {
    if (host.accepting_guests) {
      return '<i class="far fa-calendar-alt accepting"></i>';
    } else {
      return '<i class="far fa-calendar-alt not-accepting"></i>';
    }
  }

  renderHosts(hosts, map) {
    if (hosts.length) {
      hosts.forEach(host => {
        let hostBio = host.bio;
        if (!hostBio) {
          hostBio = `${host.fname} has not added a bio yet!`;
        }
        let contentString = `<div id="iw-container">
          <div class="iw-title">
            <a class="iw-name-link" href="/#/hosts/${host.id}">
              ${host.fname} ${host.lname}
              ${this.renderChatOption(host)}
            </a>
            <hr>
          </div>

          <div class="iw-content">
            <div class="iw-subTitle">
              About Me
            </div>
            <img src="${host.avatar_url}" alt="${host.fname}_picture height="100" width="100">
            <p>${hostBio}</p>
          </div>`;
        const { latitude, longitude } = host;

        let marker = new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map,
          icon: "https://i.imgur.com/1kFqqW8.png"
        });
        let infowindow = new google.maps.InfoWindow({
          content: contentString,
          title: host.city
        });
        marker.addListener('click', function () {
          if (this.state.previousMarker) {
            this.state.previousMarker.close();
          }
          infowindow.open(map, marker);
          this.setState({ previousMarker: infowindow });
        }.bind(this));

        google.maps.event.addListener(map, 'click', function () {
          infowindow.close();
        });
      });
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (this.props.center !== nextProps.center) {
      this.map.setZoom(12);
      this.map.panTo(nextProps.center);
      this.props.fetchHosts(nextProps.center);
      if (this.state.hosts !== nextProps.hosts) {
        this.renderHosts(nextProps.hosts, this.map);
      }
    }
    if (this.state.location !== nextState.location) {
      this.map.panTo(nextState.location);
      this.props.fetchHosts(nextState.location);
      if (this.state.hosts !== nextProps.hosts) {
        this.renderHosts(nextProps.hosts, this.map);
      }
    }
    if (this.state.style !== nextProps.style) {
      this.setState({ style: nextProps.style });
    }
  }
  render() {
    return (
      <div
        id='map-container'
        ref={map => this.mapNode = map}
        style={this.state.style} />
    );
  }
}
export default withRouter(HostMap);
