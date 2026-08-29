# ShramSetu Backend — for Jai (Backend REST API Lead)

## 1. Who does what — answering your question directly

**Yes, connecting the database is your job.** There's no separate "API builder"
role in your stack — that's just another name for what you're already doing.

| Teammate | Owns |
|---|---|
| **Jay** (Database) | Mongoose **schemas only** — the shape of `Worker`, `Booking`, etc. He does NOT write `mongoose.connect()` or any Express code. |
| **You, Jai** (Backend) | The Express server, `mongoose.connect()`, route handlers, CRUD, validation, HTTP status codes, and the fair-wage billing calc. You import Jay's schemas and use them. |
| **Prince** (Frontend) | Only calls `http://localhost:5000/api/...` with `fetch`. Never touches MongoDB, never touches Mongoose. |

So the flow is: **Jay hands you a schema file → you drop it into `src/models/` → you write routes around it → Prince calls your routes.**

---

## 2. What's in this folder

```
src/
├── config/db.js          — mongoose.connect() + auto-increment counter setup
├── models/
│   ├── Counter.js         — internal, powers the ID scheme
│   ├── Customer.js         — separate collection for customers
│   ├── Worker.js            — separate collection for workers
│   └── Admin.js
├── utils/
│   ├── generateId.js       — atomic +5 id generator
│   └── seedAdmin.js         — creates your one admin account
├── middleware/auth.js       — JWT verification + role guard
├── routes/
│   ├── authRoutes.js        — register/login for customer, worker, admin
│   ├── customerRoutes.js    — customer's own profile (id hidden)
│   ├── workerRoutes.js      — worker's own profile + public directory (id hidden)
│   └── adminRoutes.js       — the ONLY routes that reveal customerId/workerId
└── server.js                 — Express app entry point
```

---

## 3. Your requirements, and exactly how each one is implemented

**"id starting from 101 and +5 onwards"**
`utils/generateId.js` uses an atomic MongoDB `$inc` on a `counters` collection,
seeded to start at 96 so the first id generated is 101, then 106, 111, 116...
Customers and workers each have their own independent counter.

**"two different collections, one for customer, one for worker"**
`models/Customer.js` and `models/Worker.js` — two separate Mongoose models,
so two separate MongoDB collections (`customers` and `workers`).

**"one admin who can see all details"**
`models/Admin.js` + `routes/adminRoutes.js`. Every admin route is protected
by `requireRole('admin')` — only a valid admin JWT can call
`GET /api/admin/customers` or `GET /api/admin/workers`.

**"id should be private, only admin can see it"**
This is the interesting one — implemented two ways together:
1. In `Customer.js`/`Worker.js`, the id field has `select: false`, so **every**
   query excludes it by default. Only `adminRoutes.js` explicitly asks for it
   with `.select('+customerId')` / `.select('+workerId')`.
2. Login tokens (JWT) never contain `customerId`/`workerId` at all — they use
   MongoDB's own `_id` instead. This matters because a JWT payload is just
   base64-encoded, not encrypted, so anything inside it is technically
   readable by the browser holding it. Keeping the auto-generated id **out**
   of the token entirely is what makes it truly private to the database +
   admin routes only.

---

## 4. Setup (Git Bash on Windows)

```bash
cd src/..           # make sure you're inside this backend folder
npm install
cp .env.example .env
```

Open `.env` — defaults work for a local MongoDB install:
```
MONGO_URI=mongodb://127.0.0.1:27017/shramsetu
JWT_SECRET=change_this_to_any_long_random_string
PORT=5000
```

Create your one admin account (run once):
```bash
npm run seed:admin
```

Start the server:
```bash
npm run dev
```

Test it's alive: `http://localhost:5000/api/health` should return
`{"status":"ok",...}`.

---

## 5. Test with Thunder Client (matches your stated toolchain)

| Action | Method | URL | Body |
|---|---|---|---|
| Register customer | POST | `/api/auth/customer/register` | `{"name":"Anita","email":"anita@test.com","phone":"9990001111","password":"pass123","address":"Jaipur"}` |
| Login customer | POST | `/api/auth/customer/login` | `{"email":"anita@test.com","password":"pass123"}` |
| Register worker | POST | `/api/auth/worker/register` | `{"name":"Rajesh","email":"rajesh@test.com","password":"pass123","skill":"Electrician","category":"electrical"}` |
| Admin login | POST | `/api/auth/admin/login` | `{"email":"admin@shramsetu.coop","password":"Admin@123"}` |
| Admin views all customers (with ids) | GET | `/api/admin/customers` | — add header `Authorization: Bearer <admin token>` |
| Admin views all workers (with ids) | GET | `/api/admin/workers` | — same header |
| Customer views own profile (no id shown) | GET | `/api/customers/me` | header `Authorization: Bearer <customer token>` |

Try `GET /api/customers/me` and `GET /api/admin/customers` back to back — you'll
see the same person's record with the id present only in the second one.

---

## 6. Fitting this into your actual `shramsetu` project (from your zip)

Your zip's frontend (`shramsetu/src/api/`) currently has: `client.js`,
`bookings.js`, `adminWorkers.js`, `workerJobs.js`, `ratings.js`,
`notifications.js`, `availability.js` — all localStorage-based mocks, and
**no login/signup pages exist yet** (your PRD's prototype uses an
unauthenticated role switcher). That's a Prince (frontend) task to build
next — these auth routes are ready for him to call whenever those forms exist.

Nothing here conflicts with a `my-backend` folder if you have one from an
earlier attempt — just make sure only **one** backend runs on port 5000 at a
time (stop the old one, or change `PORT` in `.env`).

---

## 7. What's still on your plate as Backend Lead

- **Booking model + routes** — once Jay hands you `Booking.js`, add
  `src/routes/bookingRoutes.js` following the same pattern as
  `customerRoutes.js`/`workerRoutes.js`, and mount it in `server.js` where
  the `TODO` comment is.
- **Fair-wage billing calculation** — this belongs in the booking creation
  route (server-side, not trusted from the frontend): compute the price from
  the worker's `pricePerVisit` + any cooperative rules, don't accept a raw
  price from the client.
- **Input validation** — the auth routes here do basic required-field checks;
  you may want a validation library (e.g. `express-validator` or `zod`) for
  the booking routes given the extra numeric/date fields involved.
- **Status codes** — already following your contract: `201` on create,
  `200` on success, `400` on bad input, `401`/`403` on auth failures, `404`
  on missing resource, `500` on server error.
