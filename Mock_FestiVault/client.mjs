// Q1 replace the ????? so that this event listener handles click events on
// the 'search for festival' button

document.getElementById('?????').addEventListener('click', () => {

// Q2 complete these statements to read event title and organizer from form

    const title     = ?????;
    const organiser = ?????;

// Q3 complete the fetch API call to send the user's chosen title and
// organizer to the 'festival search' route in server.mjs.
    
    fetch('?????', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ title, organiser })
    }).then(response => response.json())
      .then(json => {

// Q6 complete so that it parses the JSON returned and outputs the
// data to the searchResults <div> in the format shown in the paper.

        json.forEach(event => {
            // Format: Title – [title], Organiser – [organiser], Category – [category], Available – Yes/No
            const p = document.createElement('p');
            p.innerText = `Title – ${event.title}\nOrganiser – ${event.organiser}\nCategory – ${event.category}\nAvailable – ${event.available ? 'Yes' : 'No'}`;
            
            // Q8 update with a "Reserve" button
            const btn = document.createElement('button');
            btn.innerText = 'Reserve';
            btn.addEventListener('click', () => {
                fetch('?????', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ eventID: event.ID })
                }).then(res => {
                    if (res.status === 200) {
                        alert('Reservation successful!');
                    } else {
                        alert('Reservation failed.');
                    }
                });
            });

            document.getElementById('searchResults').appendChild(p);
            document.getElementById('searchResults').appendChild(btn);
        });

    });
});

// Q9 replace the ????? so that this event listener handles click events on
// the 'add event' button

document.getElementById('?????').addEventListener('click', async () => {

// Q9 complete these statements to read event details from the form

    const title     = ?????;
    const organiser = ?????;
    const category  = ?????;
    const available = ?????;

// Q9 complete the fetch API call to send the data to the 'add festival'
// route on the server as a POST request...

    const res = await fetch('?????', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ title, organiser, category, available })
    });

// Q12 modify Q9 answer to handle non-200 status codes

    if (res.status === 200) {
        document.getElementById('eventAddStatus').innerText = 'Event added!';
    } else {
        document.getElementById('eventAddStatus').innerText = 'Error: Could not add event.';
    }
});

// Q13 login button listener

document.getElementById('?????').addEventListener('click', async () => {

// Q13 read login details

    const u = ?????;
    const p = ?????;

// Q13 fetch API call to login

    const res = await fetch('?????', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ uname: u, pword: p })
    });

// Q14 handle login status and error messages

    if (res.status === 200) {
        document.getElementById('loginStatus').innerText = 'Login successful!';
    } else {
        document.getElementById('loginStatus').innerText = 'Login failed. Please try again.';
    }
});
