Client: static SPA (HTML + JS)

Backend: Firebase (Auth, Firestore, Storage); optional Cloud Functions for heavy tasks (email, secure admin tasks)

Hosting: Firebase Hosting / Netlify

Data flow: Client ↔ Firestore (reads/writes), Auth handles identity

Security: Firestore rules + optional Cloud Functions for elevated operations

Scalability: Firestore scales; paginate queries; index frequently used fields (location, ranking)