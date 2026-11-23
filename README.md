# NamlaTech - StayFind (Hotel List Manager)



namlatech assignment -hotel/
├── backend/
│   ├── controllers/
│   │   └── hotelsController.js    # CRUD handlers & Native SQL queries
│   ├── middleware/
│   │   ├── upload.js              # Multer configuration (5MB limit, disk storage)
│   │   └── validateHotel.js       # Field-level validation & temp file cleanup
│   ├── routes/
│   │   └── hotels.js              # REST endpoints definition
│   ├── uploads/                   # Stored hotel images (served at /uploads)
│   ├── db.js                      # PostgreSQL pool configuration
│   ├── schema.sql                 # Native PostgreSQL table schema
│   ├── seed.js                    # Seeder with 8 sample hotels & downloaded images
│   ├── server.js                  # Express server entry point
│   ├── .env                       # Database credentials
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── hotelsApi.js       # API fetch wrapper
│   │   ├── components/
│   │   │   ├── ConfirmDialog.jsx  # Accessible delete confirmation modal
│   │   │   ├── Footer.jsx         # NamlaTech sample UI footer
│   │   │   ├── Header.jsx         # Top navbar, search bar & hero breadcrumb banner
│   │   │   ├── HotelCard.jsx      # Horizontal card layout matching sample UI
│   │   │   ├── HotelForm.jsx      # Reusable Add/Edit form with live image preview
│   │   │   ├── Pagination.jsx     # Centered pagination component
│   │   │   └── SuccessPopup.jsx   # Success notification modal
│   │   ├── pages/
│   │   │   ├── HotelDetailPage.jsx# Full details, OpenStreetMap & Geolocation distance
│   │   │   ├── HotelFormPage.jsx  # Container page for Add/Edit
│   │   │   └── HotelListPage.jsx  # Sidebar filters, results topbar, cards & pagination
│   │   ├── store/
│   │   │   ├── hotelsSlice.js     # Redux Toolkit slice & async thunks
│   │   │   └── index.js           # Redux store
│   │   ├── styles/
│   │   │   └── index.css          # Design system matching NamlaTech sample UI
│   │   ├── utils/
│   │   │   └── validation.js      # Form validation & Haversine formula
│   │   ├── App.jsx                # SPA routes
│   │   └── main.jsx               # Entry point
│   ├── vite.config.js             # Vite configuration with proxy to backend (5000)
│   └── package.json
└── README.md
```

