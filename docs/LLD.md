Entities: User, College, Test, Registration, Result, Log

Flows:

Signup/Login: Firebase Auth -> create users doc

College creation: college user creates colleges/{uid}

Student browsing: query colleges with filters

Registration: registrations documents created

Tests: Admin creates tests docs; student fetches and takes; results saved

Error handling: client displays friendly alerts; logs saved

Retry/Resilience: use optimistic UI, show spinner on network actions

Logging: every action (login, signup, test completed, registration submitted) call logAction() which writes to logs collection