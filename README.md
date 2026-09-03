# The Kashi Kunj — Hotel, Cab & Boat Booking Website

Full-stack website: **jQuery** (frontend) + **Express + MongoDB/Mongoose** (backend).

## Folder Structure
```
kashikunj/
├── server.js           # Express app entry point
├── seed.js             # Inserts sample rooms/cabs/boats into MongoDB
├── package.json
├── .env.example         # copy to .env and edit
├── config/
│   └── db.js            # MongoDB connection
├── models/
│   ├── Room.js
│   ├── Cab.js
│   ├── Boat.js
│   └── Booking.js
├── routes/
│   ├── rooms.js          # /api/rooms
│   ├── cabs.js           # /api/cabs
│   ├── boats.js          # /api/boats
│   └── bookings.js       # /api/bookings
└── public/               # static frontend (served by Express)
    ├── index.html
    ├── css/style.css
    └── js/main.js         # jQuery: fetches data, handles booking form
```

## Setup (run locally in VS Code)

1. **Install Node.js** (v18+) if not already installed.
2. **Install MongoDB Community Server** and make sure it's running locally
   (or use a free MongoDB Atlas cluster — just change `MONGO_URI`).
3. Open this folder in VS Code, then in the terminal:
   ```bash
   npm install
   copy .env.example .env      # Windows
   cp .env.example .env        # Mac/Linux
   ```
4. Edit `.env` if your MongoDB URI is different (e.g. Atlas connection string).
5. Seed sample data (rooms, cabs, boats):
   ```bash
   node seed.js
   ```
6. Start the server:
   ```bash
   npm start
   ```
   or for auto-reload during development:
   ```bash
   npm run dev
   ```
7. Open your browser at **http://localhost:3000**

## How it works
- `public/index.html` is the single-page site (Home, Rooms, Cabs, Boats, About, Contact).
- `public/js/main.js` (jQuery) calls `/api/rooms`, `/api/cabs`, `/api/boats` on page load and
  renders cards dynamically. Clicking **Book Now** scrolls to the enquiry form and
  pre-fills the booking type/item.
- Submitting the form does a jQuery `$.ajax` POST to `/api/bookings`, which saves the
  enquiry into MongoDB (`Booking` collection). You can build a simple admin page later
  to view/update the `status` field (`pending → confirmed → cancelled`).

## Customize for The Kashi Kunj
- Replace placeholder images in `public/images/` with real hotel/cab/boat photos, and
  update `image`/`images` fields in `seed.js` (or add rooms via `POST /api/rooms`).
- Update phone number, email, and address in `index.html` (footer + topbar) and add
  your Google Maps embed if you want.
- Change the hero background image URL in `css/style.css` (`.hero` rule).
- Colors are controlled via CSS variables at the top of `style.css` (`:root`) —
  change `--primary` to your brand color.

## Extending
- Add authentication (JWT) + an admin dashboard to manage bookings/rooms.
- Add image uploads (multer) for room/cab/boat photos.
- Add payment gateway (Razorpay/Stripe) for advance booking payment.
- Add city/attraction pages like the reference site (Sarnath, Ganga Aarti, etc.).
