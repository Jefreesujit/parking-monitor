/* global variables */

var valuesArray = [];

/* function declaration */

function populateValues () {
  $.get( "data/data.csv", ( data ) => {
    data.split('\n').map((datum) => {
      let row = datum.split(',');
      valuesArray.push(
        '<tr>' +
          '<td class="data">' + row[1] + '</td>'+
          '<td class="data">' + row[2] + '</td>'+
        '</tr>'
      );
    });

    $('#tableContent').html(valuesArray);
  });
}

// $('#form1').on('submit', function () {
//   let header = btoa($(this).serializeArray());
//   console.log(header);
//   return false;
// });

/* start */

$(document).ready(() => {
  // populateValues();
});