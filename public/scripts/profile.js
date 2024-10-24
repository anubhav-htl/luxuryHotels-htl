const hotel_identifier = window.hotel_identifier;

if (!hotel_identifier) {
    var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
    myModal.show();
}


const currentUrl = window.location.origin + window.location.pathname;
const navlinks = document.querySelectorAll('.highlightablelink');

navlinks.forEach(link => {
  if (link.href === currentUrl) {
    link.classList.add('current-page');
  }
});