(function (window, document, ymaps, Vue) {
  let
    map,
    init = function () {
      map = new ymaps.Map('map', {
        center: [59.939095, 30.31586],
        zoom: 9,
        behaviors: ['default','scrollZoom']
      });

      new ymaps.SuggestView('suggest', {
        offset: [5, 12],
        width: 300
      })
        .events.add('select', function () {
          suggest.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true,
          }));
        });
    };

  new Vue({
    el: '#veus',

    data: {
      inputAddress: '',
      inputTitle: '',
      checked: false,
      addresses: []
    },

    methods: {
      createMarker (title, address, placemark) {
        return {
          title: title,
          visited: false,
          address: address,
          placemark: placemark
        }
      },

      addMarker (title, address, placemark) {
        console.log(placemark);
        this.addresses.push(this.createMarker(title, address, placemark));
      },

      addAddress (title, address) {
        let
          newPlacemark,
          myGeocoder = ymaps.geocode(address);
          vm = this;

        if (this.inputAddress == '' || this.inputTitle == '') {
          return alert('Fill all the forms, please');
        }

        myGeocoder.then(
          (res) => {
            let coordinates = res.geoObjects.get(0).geometry.getCoordinates();
            newPlacemark = new ymaps.Placemark(coordinates, {
              balloonContent: '<strong>' + title + '</strong> <br>' + address
            });
            map.geoObjects.add(newPlacemark);
            map.setCenter(coordinates, 14);
            vm.addMarker(title, address, newPlacemark);
          },
          (err) => {
            console.log('Ошибка');
          }
        )
      },

      removeAddress (address) {
        let index = this.addresses.indexOf(address);
        console.log(this.addresses[index]);
        map.geoObjects.remove(this.addresses[index].placemark);
        this.addresses.splice(index, 1);
      },

      isVisited (address) {
        let index = this.addresses.indexOf(address);
        let place = this.addresses[index];
        if (place.visited) {
          place.placemark.options.set('preset', 'islands#blueIcon');
          this.addresses[index].visited = false;
        } else {
          place.placemark.options.set('preset', 'islands#greenIcon');
          this.addresses[index].visited = true;
        }
      },

      showPlace (address) {
        let index = this.addresses.indexOf(address);
        let placemark = this.addresses[index].placemark;
        map.setCenter(placemark.geometry.getCoordinates(), 12);
        placemark.balloon.open();
      }
    }
  })

  ymaps.ready(init);

})(window, document, ymaps, Vue);
