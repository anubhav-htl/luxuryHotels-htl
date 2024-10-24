flatpickr("#competitionclosure", {
  altInput: true,
  altFormat: "F j, Y",
  dateFormat: "Y-m-d",
  onChange: function (selectedDates, dateStr, instance) {
    document.getElementById('competitionclosure')._flatpickr;
  }
});
flatpickr("#from_date", {
  altInput: true,
  altFormat: "F j, Y",
  dateFormat: "Y-m-d",
  onChange: function (selectedDates, dateStr, instance) {
    document.getElementById('to_date')._flatpickr.set('minDate', dateStr);
  }
});
flatpickr("#to_date", {
  altInput: true,
  altFormat: "F j, Y",
  dateFormat: "Y-m-d",
  onChange: function (selectedDates, dateStr, instance) {
    document.getElementById('from_date')._flatpickr.set('maxDate', dateStr);
  }
});

'use strict'

Dropzone.autoDiscover = false;
const dropzoneElement = document.getElementById('hotelimageupload');
let uploadedImageNames = [];
const imageInput = document.getElementById('images');
const placeholders = {};


let myDropzone = new Dropzone(dropzoneElement, {
  url: '/hotels/upload',
  autoProcessQueue: false,
  maxFilesize: 2,
  dictDefaultMessage: `Drag an image here or click to select from your files. Maximum of 1 files allowed`,
  maxFiles: 1,
  parallelUploads: 1,
  paramName: 'file',
  acceptedFiles: 'image/*',
  addRemoveLinks: true,
  headers: {
    'X-CSRF-TOKEN': document.querySelector('input[name="_csrf"]').value
  },
  init: function () {
    this.on('addedfile', function (file) {
      if (!file.type.startsWith('image/')) {
        const imageErrorModal = new bootstrap.Modal(document.getElementById('imageErrorModal'));
        const errorMessage = `Your file is is not an image. Only image files are allowed.`;
        document.getElementById('imageErrorModalBody').innerText = errorMessage;
        imageErrorModal.show();

        this.removeFile(file);

        document.querySelector("#imageErrorClose").addEventListener("click", function (e) {
          window.location.reload();
        });

        document.querySelector('#lambalolo').addEventListener("submit", function (e) {
          e.preventDefault();
        });
      } else {
        const placeholder = `placeholder_${file.upload.uuid}`;
        placeholders[file.upload.uuid] = placeholder;
        uploadedImageNames.push(placeholder);
        dropzoneElement.classList.remove('is-invalid');
        document.querySelector('.error-message').style.display = 'none';
      }
    });

    var progressBar = document.querySelector(".progress-bar");

    this.on("uploadprogress", function (file, progress) {
      progressBar.style.width = progress + "%";
      progressBar.setAttribute("aria-valuenow", progress);
    });

    this.on('success', function (file, response) {
      const placeholder = placeholders[file.upload.uuid];
      const index = uploadedImageNames.indexOf(placeholder);
      if (index !== -1) {
        uploadedImageNames[index] = response.fileName;
      }
      imageInput.value = uploadedImageNames.join(',');
    });

    this.on('error', function (file) {
      if (file.size > this.options.maxFilesize * 1024 * 1024) {
        const imageErrorModal = new bootstrap.Modal(document.getElementById('imageErrorModal'));
        const errorMessage = `Your file is too large. The size is ~ ${(parseInt(file.size) / (1024 * 1024)).toFixed(1)} MB, which exceeds the limit of ${this.options.maxFilesize} MB.`;
        document.getElementById('imageErrorModalBody').innerText = errorMessage;
        imageErrorModal.show();

        this.removeFile(file);

        document.querySelector("#imageErrorClose").addEventListener("click", function (e) {
          window.location.reload();
        });

        document.querySelector('#lambalolo').addEventListener("submit", function (e) {
          e.preventDefault();
        });
      }
    });

    this.on("complete", function (file) {
      progressBar.style.width = "0%";
      progressBar.setAttribute("aria-valuenow", "0");
    });

    this.on('thumbnail', function (file) {
      if (file.accepted !== false) {
        if (file.width < 640 || file.height < 480) {
          file.rejectDimensions();
        } else {
          file.acceptDimensions();
        }
      }
    });
    this.on('removedfile', function (file) {
      const placeholder = placeholders[file.upload.uuid];
      uploadedImageNames = uploadedImageNames.filter(name => name !== placeholder);
      delete placeholders[file.upload.uuid];
      imageInput.value = uploadedImageNames.join(',');

      if (uploadedImageNames.length === 0) {
        dropzoneElement.classList.add('is-invalid');
        document.querySelector('.error-message').style.display = 'block';
      }

    });
  },

  accept: function (file, done) {
    file.acceptDimensions = done;
    file.rejectDimensions = function () {
      done('The image must be at least 640 x 480px');
    };
  }
});

function scrollToFirstInvalidField(form) {
  const firstInvalidField = form.querySelector('.is-invalid, :invalid');
  if (firstInvalidField) {
    firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalidField.focus();
  }
}

const forms = document.querySelectorAll('.needs-validation');

Array.from(forms).forEach(form => {
  form.addEventListener('submit', function (event) {
    if (!form.checkValidity() || uploadedImageNames.length === 0) {
      event.preventDefault();
      event.stopPropagation();

      if (uploadedImageNames.length === 0) {
        dropzoneElement.classList.add('is-invalid');
        document.querySelector('.error-message').style.display = 'block';
      }

      scrollToFirstInvalidField(form);
    } else {
      if (myDropzone.getQueuedFiles().length > 0) {
        event.preventDefault();

        document.getElementById('uploadprogress').style.display = 'block';
        document.getElementById('progress-bar').style.display = 'block';

        myDropzone.processQueue();
      }
    }

    form.classList.add('was-validated');
  }, false);
});

myDropzone.on('queuecomplete', function () {
  const form = document.querySelector('#hoteldetails');
  if (form.checkValidity()) {
    document.getElementById('uploadprogress').style.display = 'none';
    document.getElementById('progress-bar').style.display = 'none';

    form.submit();
  }
});


async function deleteImage(hotel_identifier, imageName, modelName) {

  const imageErrorModal = new bootstrap.Modal(document.getElementById('imageErrorModal'));

  document.getElementById('imageModalErrorTitle').innerText = 'Confirm Deletion';
  document.getElementById('imageErrorModalBody').innerHTML = `<p>Are you sure you want to delete this image?</p>`;

  document.getElementById('confirmDelete').style.display = 'block';
  imageErrorModal.show();

  document.getElementById('confirmDelete').onclick = async function () {
    try {
      const response = await fetch('/hotels/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ hotel_identifier, imageName, Model: modelName })
      });

      if (response.ok) {
        console.log('Image deleted successfully');
        location.reload();
      } else {
        const result = await response.json();
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  document.querySelector('#lambalolo').addEventListener("submit", function (e) {
    e.preventDefault();
  });

}