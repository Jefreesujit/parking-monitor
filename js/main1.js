var socket = io();

function populateValues (data) {
  var valuesArray = [];

  data.map((datum, index) => {
    let status = datum ? 'filled' : 'empty',
        slotInfo = (typeof datum === 'string') ? datum.replace(/\"/g, '') : datum;

    valuesArray.push('<div class="slot ' + status + '" data-slotinfo='+ slotInfo +' data-slotid=' + (index + 1) + '>' + (index + 1) + '</div>');
  });

  $('#slotsContainer').html(valuesArray);
}

function getValues () {
  $.get( "api/get-parking-status", ( data ) => {
    populateValues(data);
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
  if (typeof $(this).data('slotinfo') === 'string') {
    let slotInfo = $(this).data('slotinfo').split(',')
        slotId = $(this).data('slotid');

    showDetailsModal({
      'Slot No': slotId,
      'Parked Date': slotInfo[1],
      'Parked Time': slotInfo[2]
    });
  }
});

socket.on('parkingdata' , function(parkingData){ 
  populateValues(parkingData);
});

/* start */

$(document).ready(() => {
  socket.emit('getdata', Cookies.get('role'));
});
