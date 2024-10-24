document.addEventListener("DOMContentLoaded", function () {
  
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

  const textArea = document.getElementById('description');
  const wordCountDisplay = document.getElementById('wordCount');
  const maxWords = 10;

  textArea.addEventListener('input', () => {
    let words = textArea.value.trim().split(/\s+/);
    let wordCount = words.length;

    if (wordCount > maxWords) {
      words = words.slice(0, maxWords);
      textArea.value = words.join(' ');
      wordCount = maxWords;
    }

    wordCountDisplay.textContent = `${wordCount}/${maxWords} words`;
  });

  const textTitle = document.getElementById('title');
  const titleWordCountDisplay = document.getElementById('titleWordCount');
  const titleMaxWords = 3;

  textTitle.addEventListener('input', () => {
    let words = textTitle.value.trim().split(/\s+/);
    let wordCount = words.length;

    if (wordCount > titleMaxWords) {
      words = words.slice(0, titleMaxWords);
      textTitle.value = words.join(' ');
      wordCount = titleMaxWords;
    }

    titleWordCountDisplay.textContent = `${wordCount}/${titleMaxWords} words`;
  });

});