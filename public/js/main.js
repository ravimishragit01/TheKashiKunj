$(function () {

  // ⚠️ Add The Kashi Kunj's real WhatsApp number(s) — country code, no + or spaces.
  // One number: ['919935XXXXXX']  |  Two numbers: ['919935XXXXXX', '919935YYYYYY']
  const WHATSAPP_NUMBERS = ['916392658826'];

  // Tracks specific items picked via "Book Now" on cards: { room: {id,name}, cab: {...}, boat: {...} }
  let selectedItems = {};

  // Mobile menu toggle
  $('#hamburger').on('click', function () {
    $('.nav-links').toggleClass('open');
  });

  // ---------- Load Rooms ----------
  $.get('/api/rooms', function (rooms) {
    const $grid = $('#roomsGrid').empty();
    if (!rooms.length) return $grid.html('<p class="loading">No rooms available right now.</p>');
    rooms.forEach(r => $grid.append(roomCard(r)));
  }).fail(() => $('#roomsGrid').html('<p class="loading">Could not load rooms. Is the server running?</p>'));

  // ---------- Load Cabs ----------
  $.get('/api/cabs', function (cabs) {
    const $grid = $('#cabsGrid').empty();
    if (!cabs.length) return $grid.html('<p class="loading">No cabs available right now.</p>');
    cabs.forEach(c => $grid.append(serviceCard(c, 'cab')));
  }).fail(() => $('#cabsGrid').html('<p class="loading">Could not load cabs.</p>'));

  // ---------- Load Boats ----------
  $.get('/api/boats', function (boats) {
    const $grid = $('#boatsGrid').empty();
    if (!boats.length) return $grid.html('<p class="loading">No boats available right now.</p>');
    boats.forEach(b => $grid.append(serviceCard(b, 'boat')));
  }).fail(() => $('#boatsGrid').html('<p class="loading">Could not load boats.</p>'));

  function roomCard(r) {
    const img = (r.images && r.images[0]) || 'https://via.placeholder.com/400x250?text=' + encodeURIComponent(r.name);
    return $(`
      <div class="card">
        <img src="${img}" alt="${r.name}">
        <div class="card-body">
          <h3>${r.name}</h3>
          <div class="tags">${(r.amenities || []).join(' • ')}</div>
          <div class="price">
            ${r.discountPrice ? `<del>₹${r.price}</del> <strong>₹${r.discountPrice}</strong>` : `<strong>₹${r.price}</strong>`} /night
          </div>
          <button class="btn-primary book-btn" data-type="room" data-id="${r._id}" data-name="${r.name}">Book Now</button>
        </div>
      </div>
    `);
  }

  function serviceCard(item, type) {
    const img = item.image || 'https://via.placeholder.com/400x250?text=' + encodeURIComponent(item.name);
    const sub = type === 'cab' ? (item.seats + ' seats') : item.duration;
    return $(`
      <div class="card">
        <img src="${img}" alt="${item.name}">
        <div class="card-body">
          <h3>${item.name}</h3>
          <div class="tags">${item.type} ${sub ? '• ' + sub : ''}</div>
          <div class="price">
            ${item.discountPrice ? `<del>₹${item.price}</del> <strong>₹${item.discountPrice}</strong>` : `<strong>₹${item.price}</strong>`} /trip
          </div>
          <button class="btn-primary book-btn" data-type="${type}" data-id="${item._id}" data-name="${item.name}">Book Now</button>
        </div>
      </div>
    `);
  }

  // ---------- Book Now on a card: ticks its checkbox + remembers the exact item ----------
  $(document).on('click', '.book-btn', function () {
    const type = $(this).data('type');
    const id = $(this).data('id');
    const name = $(this).data('name');

    selectedItems[type] = { id, name };
    $(`#svcTypeGroup input[value="${type}"]`).prop('checked', true);
    renderSelectedItems();

    $('html, body').animate({ scrollTop: $('#contact').offset().top - 70 }, 500);
  });

  // Unchecking a service type in the form removes its remembered item too
  $(document).on('change', '#svcTypeGroup input[type="checkbox"]', function () {
    const type = $(this).val();
    if (!$(this).is(':checked')) delete selectedItems[type];
    renderSelectedItems();
  });

  function renderSelectedItems() {
    const $box = $('#selectedItemsBox').empty();
    Object.keys(selectedItems).forEach(type => {
      const item = selectedItems[type];
      $box.append(`
        <span class="selected-tag" data-type="${type}">
          ${item.name} <span class="remove-tag" data-type="${type}">✕</span>
        </span>
      `);
    });
  }

  $(document).on('click', '.remove-tag', function () {
    const type = $(this).data('type');
    delete selectedItems[type];
    $(`#svcTypeGroup input[value="${type}"]`).prop('checked', false);
    renderSelectedItems();
  });

  // ---------- Submit: save booking(s) to DB, then open WhatsApp ----------
  $('#bookingForm').on('submit', function (e) {
    e.preventDefault();

    const types = $('#svcTypeGroup input:checked').map(function () { return this.value; }).get();
    if (!types.length) {
      $('#formMsg').text('⚠️ Please select at least one: Room, Cab or Boat.').css('color', '#c0392b');
      return;
    }

    const formData = {};
    $(this).serializeArray().forEach(f => formData[f.name] = f.value);
    if (!formData.name || !formData.phone) {
      $('#formMsg').text('⚠️ Please fill your name and phone number.').css('color', '#c0392b');
      return;
    }

    $('#formMsg').text('Submitting...').css('color', '#888');

    // Open WhatsApp tab(s) IMMEDIATELY (synchronously, inside the click handler).
    // This must happen before any AJAX call — browsers block window.open() if it
    // fires after an async delay, since it no longer looks like a direct user action.
    sendToWhatsApp(types, formData);

    // One booking document per selected service type (saved in the background)
    const requests = types.map(type => {
      const item = selectedItems[type] || {};
      return $.ajax({
        url: '/api/bookings',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          bookingType: type,
          itemId: item.id,
          itemName: item.name || `General ${type} enquiry`,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: formData.guests,
          message: formData.message
        })
      });
    });

    $.when.apply($, requests)
      .done(function () {
        $('#formMsg').text('✅ Request saved and sent via WhatsApp!').css('color', 'green');
        $('#bookingForm')[0].reset();
        selectedItems = {};
        renderSelectedItems();
      })
      .fail(function (jqXHR) {
        console.error('Booking save failed:', jqXHR.responseJSON || jqXHR.responseText);
        $('#formMsg').text('⚠️ Sent via WhatsApp, but could not save to our system — please call us to confirm.').css('color', '#c0392b');
      });
  });

  function sendToWhatsApp(types, formData) {
    const lines = [
      `*New Booking Enquiry - The Kashi Kunj*`,
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      formData.email ? `Email: ${formData.email}` : null,
      `Services: ${types.map(t => {
        const item = selectedItems[t];
        return item ? `${t} (${item.name})` : t;
      }).join(', ')}`,
      formData.checkIn ? `Check-in: ${formData.checkIn}` : null,
      formData.checkOut ? `Check-out: ${formData.checkOut}` : null,
      formData.guests ? `Guests: ${formData.guests}` : null,
      formData.message ? `Message: ${formData.message}` : null
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));

    // Opens one WhatsApp tab per configured number, each with the same message.
    // NOTE: browsers may block the 2nd+ popup if the user has strict popup-blocking
    // enabled. If that happens, add a manual "Message on WhatsApp" link/button per
    // number as a fallback (see README).
    WHATSAPP_NUMBERS.forEach(number => {
      window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    });
  }

});
