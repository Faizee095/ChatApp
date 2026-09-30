# Talk All

A React chat app backed by Firebase Authentication and Cloud Firestore.

## Connect a Firebase project

1. In the [Firebase console](https://console.firebase.google.com/), open one of your projects or create one.
2. Add a **Web app** in Project settings and copy its Firebase configuration values.
3. In **Authentication > Sign-in method**, enable **Email/Password**.
4. Create a **Cloud Firestore** database.
5. Copy `.env.example` to `.env` and fill in the web app values. `REACT_APP_FIREBASE_PROJECT_ID` is the Firebase project ID from Project settings. The web config is intended to be public; access is protected by Firebase Authentication and Firestore rules.
6. Publish the contents of `firestore.rules` in **Firestore Database > Rules**.
7. Restart the development server with `npm start`.

New users register with a username, email address, and password, then sign in with their email and password. Profile settings let users update their display name and email or request a password reset. Existing accounts created before email sign-in can continue signing in with their username; update the account email in Profile to receive password reset links. The first signed-in user creates the shared **General** room. Any signed-in user can create rooms, and rooms/messages are shared with all signed-in users.

The app currently supports text messages. Image uploads, read receipts, typing indicators, and private rooms from the former ChatEngine integration are not included in this Firebase version.
