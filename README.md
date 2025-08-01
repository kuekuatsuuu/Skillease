# Skillease

Skillease is a modern, location-aware platform for discovering, booking, and providing local services. Built with Next.js, Supabase, and Tailwind CSS, it features a beautiful glassmorphism UI, real-time data, and seamless booking workflows.

## Features

- **Find Local Services:** Search, filter, and sort trusted professionals near you.
- **Location Awareness:** Uses geolocation to personalize results and calculate distances.
- **Service Booking:** Book services directly from the app with a smooth modal workflow.
- **Provider Dashboard:** Service providers can create, manage, and track their offerings.
- **Animated UI:** Glassmorphism, smooth transitions, and responsive layouts for a premium experience.
- **Supabase Backend:** Real-time data, authentication, and secure storage.

## Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS, Lucide-react icons
- **Backend:** Supabase (Postgres, Auth, Storage)
- **APIs:** Google Maps (Geolocation, Distance Matrix, Geocoding)
- **Notifications:** react-hot-toast

## Key Components

- `src/app/services/page.js` — Services listing, filtering, sorting, and booking
- `src/app/components/CreateService.js` — Service creation form for providers
- `src/app/components/CreateBooking.js` — Booking modal and workflow
- `src/app/lib/locationUtils.js` — Geolocation, distance, and address utilities
- `src/app/context/AuthContext.js` — Authentication context

## How It Works

1. **User Location:** On page load, the app requests the user's location. If denied, defaults to Kochi.
2. **Service Discovery:** Fetches active services from Supabase, calculates distance, and displays them in a grid.
3. **Filtering & Sorting:** Users can search, filter by category, and sort by rating, price, distance, or reviews.
4. **Booking:** Clicking "Book Now" opens a modal to complete the booking process.
5. **Provider Tools:** Providers can create new services, specifying details, location, availability, and images.

## Setup & Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/kuekuatsuuu/Skillease.git
   cd Skillease
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Create a `.env.local` file and add your Supabase and Google Maps API keys:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     ```
4. **Run the app:**
   ```bash
   npm run dev
   ```

## Folder Structure

```
Skillease/
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   └── page.js
│   │   ├── components/
│   │   │   ├── CreateService.js
│   │   │   ├── CreateBooking.js
│   │   ├── lib/
│   │   │   └── locationUtils.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   └── ...
├── public/
│   └── ...
├── package.json
├── README.md
└── ...
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

---

For questions or support, contact [@kuekuatsuuu](https://github.com/kuekuatsuuu).
