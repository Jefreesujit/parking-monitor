
function populateValues () {
  var valuesArray = [];
  $.get( "api/get-parking-status", ( data ) => {
    data.map((datum, index) => {
      let status = datum ? 'filled' : 'empty';
      valuesArray.push(
        '<div class="slot ' + status + '" data-slotid=' + (index + 1) + '>' + (index + 1) + '</div>'
      );
    });

    $('#slotsContainer').html(valuesArray);
  });
}

$('#close_btn').on('click', function(event) {
  event.preventDefault();
  $('#modalOverlay').addClass('hide');
});


function showDetailsModal (data) {
  let detailsContent = [];
  for (let key in data) {
    detailsContent.push('<div class="user-data"><span class="label">' + key + '</span><span class="value">' + data[key] + '</span></div>');
  }
  $('#parkingDetails').html(detailsContent);
  $('#modalOverlay').removeClass('hide');
} 

$(document).on('click', '.slot.filled', function () {
  let id = $(this).data('slotid');
  $.get( "api/get-parking-details/"+id, ( data ) => {
    showDetailsModal(data);
  });
});

/* start */

$(document).ready(() => {
  populateValues();
});
