document.addEventListener("DOMContentLoaded", function () {

  const addAmenityButton = document.getElementById('add-amenity');
  const additionalAmenitiesDiv = document.getElementById('additional-amenities');

  addAmenityButton.addEventListener('click', function () {
    const newAmenityRow = document.createElement('div');
    newAmenityRow.className = 'col-sm-3 form-check';

    const newAmenityInput = document.createElement('input');
    newAmenityInput.className = 'form-control';
    newAmenityInput.type = 'text';
    newAmenityInput.name = 'room_amenities_user[]';
    newAmenityInput.placeholder = 'Enter amenity';
    newAmenityInput.style.borderTop = '0px';
    newAmenityInput.style.borderLeft = '0px';
    newAmenityInput.style.borderRight = '0px';

    newAmenityRow.appendChild(newAmenityInput);
    additionalAmenitiesDiv.appendChild(newAmenityRow);
  })


  const addFacilityButton = document.getElementById('add-facility');
  const additionalFacilitiesDiv = document.getElementById('additional-facilities');

  addFacilityButton.addEventListener('click', function () {
    const newFacilityRow = document.createElement('div');
    newFacilityRow.className = 'col-sm-3 form-check';

    const newFacilityInput = document.createElement('input');
    newFacilityInput.className = 'form-control';
    newFacilityInput.type = 'text';
    newFacilityInput.name = 'hotel_facilities_user[]';
    newFacilityInput.placeholder = 'Enter Facility';
    newFacilityInput.style.borderTop = '0px';
    newFacilityInput.style.borderLeft = '0px';
    newFacilityInput.style.borderRight = '0px';



    newFacilityRow.appendChild(newFacilityInput);
    additionalFacilitiesDiv.appendChild(newFacilityRow);
  });
});