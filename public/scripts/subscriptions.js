const opentrialLink = document.getElementById('opentrialLink');
const trialLink = document.getElementById('submit7daytrial');

opentrialLink.addEventListener('click', function (event) {
  event.preventDefault();
  var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
  myModal.show();
});


if (trialLink) {
  trialLink.addEventListener('click', async function (event) {
    event.preventDefault();

    const trialInputValue = document.getElementById('trial').value;
    const [name, duration, durationMeasure, price, stripePriceId] = trialInputValue.split(',');
    const trialId = document.getElementById('trialId').value; 
    const trialName = document.getElementById('trialName').value;
    const hotelId = document.getElementById('trial_hotel').value;
    const paymentElement = document.getElementById('trial_payment_element').value;
    
    try {
      const response = await fetch('/hotels/create-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-TOKEN': document.getElementById('trial_csrf').value,
        },
        body: JSON.stringify(
          {
            subscriptions: {
              [trialId]: {
                [trialName]: {
                  option: trialInputValue
                }
              }
            },
            payment_element: paymentElement,
            hotel: hotelId
          }
        )
      })

      const data = await response.json;
      
      if (response.ok && data.request === 'Success') {
        window.location.href = '/hotels/current-subscriptions';
      } else {
        window.location.href = '/hotels/subscriptions';
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error creating your trial subscription. Please try again later');
    }

  });
}