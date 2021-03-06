export default class MarkerManager {
  constructor(map) {
    this.map = map;
    this.markers = {};
  }

  updateMarkers(hosts) {
    // const hostsArr = Object.values();
    // hosts.forEach(host => hostsObj[host.id] = host);
    //
    // hosts
    //   .filter(host => !this.markers[host.id])
    //   .forEach((newHost) => this.createMarkerFromHost(newHost, this.handleClick))
    //
    // Object.keys(this.markers)
    //   .filter(hostId => !hostsObj[hostId])
    //   .forEach((hostId) => this.removeMarker(this.markers[hostId]))
  }

  createMarkerFromHost(host) {
    const pos = new google.maps.LatLng(host.latitude, host.longitude);
    const marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      hostId: host.id
    });

    this.markers[marker.hostId] = marker;
  }

  removeMarker(marker) {
    this.markers[marker.hostId].setMap(null);
    delete this.markers[marker.hostId];
  }
}
