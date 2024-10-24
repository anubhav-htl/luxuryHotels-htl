document.addEventListener('DOMContentLoaded', function () {

  const transportContainer = document.getElementById('transportContainer');
  const addTransportButton = document.getElementById('addTransport');
  const transportstations = window.transportstations.transportstations.transportation_category;
  let index = transportstations ? transportstations.length : 1;

  addTransportButton.addEventListener('click', (e) => {
    e.preventDefault();
    const newEntry = document.createElement('div');
    newEntry.classList.add('transportEntry');
    newEntry.classList.add('mb-2');
    newEntry.classList.add('row');
    newEntry.classList.add('g-2');


    newEntry.innerHTML = `
          <div class="col-4">
            <label class="form-label" for="transportation_category">Select tranport station
              <select class="form-select border border-top-0 border-end-0 border-start-0" id="country" aria-label="Transport Station Selection" name="transportation_category[${index}][station_category]" required="required">
                <option value="">Select category</option>
                <option value="airport">Airport</option>
                <option value="train_station">Train Station</option>
                <option value="bus_station">Bus Station</option>
                <option value="metro_subway_station">Metro/Subway Station</option>
                <option value="tram_station">Tram Station</option>
                <option value="ferry_boat_terminal">Ferry/Boat Terminal</option>
                <option value="taxi_stand">Taxi Stand</option>
                <option value="helipad">Helipad</option>
                <option value="car_rental_agency">Car Rental Agency</option>
                <option value="highway_exit">Highway Exit</option>
                <option value="bicycle_rental">Bicycle Rental</option>
                <option value="shuttle_bus_stop">Shuttle Bus Stop</option>
              </select>
            </label>
          </div>
          <div class="col">
            <label class="form-label" for="name">Name of station:</label>
            <input class="form-control" type="text" id="station_name" name="transportation_category[${index}][station_name]" required="required" placeholder="e.g. LAX International Airport"/>
          </div>
          <div class="col">
            <label class="form-label" for="time">Time to station (mins):</label>
            <input class="form-control" type="number" id="time_to_station" name="transportation_category[${index}][time_to_station]" required="required"/>
          </div>
        `;
    transportContainer.appendChild(newEntry);
    index++;
  })
})