$(document).ready(function() {
  console.log("Document Ready");

  //Watches the live input within the textarea box!
  $('textarea').on('input', function(e) {
    let textlength = $(this).val().length;
    let lettersLeft = 140 - textlength;

    //dom traversal to find the .counter
    let counter = $(this).parent().next('div').children('.counter');
    counter.text(lettersLeft);

    if (lettersLeft < 0) {
     counter.addClass('redText');
    } else {
      counter.removeClass('redText');
    }
  });
});