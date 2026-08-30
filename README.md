# Jibli DZ

**A collaborative mobile list and task management application built with React Native, Expo, and Firebase.**

Jibli is a cross-platform mobile application designed around shared lists and lightweight real-time collaboration. Users can create and manage lists, add items, track pending items, collaborate with other users, invite collaborators, and synchronize shared data seamlessly through Firebase. The application features full authentication, user profiles, onboarding, localization, RTL support, and native mobile integrations.

The project is built with **React Native + Expo + TypeScript**, using **Firebase** as the backend platform and **Expo Router** for modern, file-based application navigation.

---

## Features

- **Authentication**: Email/Password and Google OAuth via Firebase Authentication.
- **List & Item Management**: Personal lists, shared lists, status tracking, item lifecycle updates, and pending item filters.
- **Real-Time Collaboration**: Multi-user sharing, invitation management, collaborator views, and instant database updates.
- **Firebase Platform Integration**: Firestore, Realtime Database, Cloud Storage, and Crashlytics crash reporting.
- **Internationalization (i18n)**: Multi-language support with native RTL layout capabilities.
- **UX & UI Styling**: NativeWind (Tailwind CSS for React Native), custom SVG icons, Poppins font family, system auto-dark mode, and keyboard-aware forms.
- **State & Form Validation**: Local/global state management with Zustand alongside React Hook Form and Zod schema validation.
- **Cross-Platform & Local Dev**: Native iOS and Android builds, Web support via Expo, and integrated Firebase Local Emulator suite.

---

## Product Workflow

```text
User
 │
 ├── Create a list
 │
 ├── Add items & track status
 │
 ├── Share the list
 │      │
 │      ├── Invite collaborators
 │      └── Manage permissions
 │
 └── Synchronize changes
        │
        ▼
     Firebase (Firestore & Realtime DB)
```

The home screen provides a consolidated dashboard of the user's personal lists, shared lists, and pending items.

---

## Technology Stack

| Domain | Technologies / Libraries |
| :--- | :--- |
| **Mobile Core** | React Native, Expo, Expo Router, TypeScript, React Navigation |
| **Animation & UI** | React Native Reanimated, Gesture Handler, SVG, NativeWind (Tailwind CSS), Custom Poppins |
| **State Management** | Zustand, React Context API |
| **Backend & Cloud** | Firebase Auth, Firestore, Realtime DB, Storage, Crashlytics |
| **Forms & Validation** | React Hook Form, Zod, `@hookform/resolvers` |
| **Internationalization** | i18next, react-i18next, Expo Localization (RTL Support) |
| **Tooling & Dev** | ESLint, Prettier, Jest (`jest-expo`), Firebase Emulator Suite |

---

## Application Architecture

The project follows a feature-oriented React Native directory structure:

```text
Jibli-DZ
│
├── src
│   ├── app                # Expo Router file-based navigation tree
│   │   ├── (auth)         # Sign In, Sign Up, and Auth routes
│   │   ├── (tabs)         # Main Tab layout (Home, Create, Collaborators, Profile)
│   │   ├── list           # Dynamic list detail routes ([id])
│   │   ├── onboarding     # Initial app onboarding flow
│   │   ├── index.tsx
│   │   └── _layout.tsx
│   │
│   ├── components         # Reusable feature-based UI components
│   ├── config             # System & Firebase configurations
│   ├── constants          # Theme colors, static assets, and constants
│   ├── hooks              # Custom React hooks
│   ├── i18n               # i18next setup & initialization
│   ├── listeners          # Real-time Firebase data listeners
│   ├── locales            # Translation resources (JSON)
│   ├── models             # Domain models & TypeScript interfaces
│   ├── schemas            # Zod validation schemas
│   ├── services           # Firebase API wrappers and storage handlers
│   ├── stores             # Zustand state stores (Auth, Profile, Lists)
│   └── utils              # Helper functions & formatting utilities
│
├── app.config.ts          # Expo configuration script
├── eas.json               # EAS Build configuration
└── firebase.json          # Firebase Emulators & security rules
```

---

## Navigation Structure

Navigation is powered by **Expo Router** using typed routes:

```text
Root Navigation
│
├── (auth)
│   ├── sign-in
│   └── sign-up
│
├── onboarding
│
└── (tabs)
    ├── Home          # Personal/Shared list summary & pending items
    ├── Create        # Quick list creation / item insertion
    ├── Collaborators # Collaboration hub & pending invitations
    └── Profile       # User settings & customization
```

Dynamic routes like `/list/[id]` handle individual list item views and modifications.

---

## Data Architecture & Real-Time Synchronization

```text
                           Firebase
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
       ▼                      ▼                      ▼
 Auth & Identity          Firestore             Realtime DB
(User State & Auth)   (Lists, Items, Users)    (Live State Sync)
       │                      │                      │
       └──────────────────────┼──────────────────────┘
                              │
                   ┌──────────┴──────────┐
                   ▼                     ▼
             Cloud Storage          Crashlytics
            (User Uploads)       (Native Diagnostic Logs)
```

### Data Synchronization Pipeline

```text
AuthProvider ──► DataLoader ──► DataListeners ──► Zustand Stores ──► React Components
```

Initial application state loading is decoupled from ongoing real-time data listeners, ensuring reliable offline/online UI synchronization.

---

## Domain & Item Lifecycle

### List Items
Every item follows an explicit status lifecycle tracked by `ListItemStatus`:

```text
Created ──► PENDING ──► COMPLETED / UPDATED
```

### Collaborative Invitations
Lists use composite structures to track metadata, owner references, collaborators, and pending invitation tokens:

```text
List Domain
 ├── Metadata (Title, Icon, Category, Timestamps)
 ├── Items (Sub-collection / Items array)
 ├── Collaborators (Authorized User IDs)
 └── Invitations (Pending share requests)
```

---

## Local Development & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended) & `npm`
* [Expo CLI](https://docs.expo.dev/get-started/installation/)
* [Firebase CLI](https://firebase.google.com/docs/cli) (optional, for emulators)
* Android Studio (for Android Emulator) or Xcode (for iOS Simulator, macOS only)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mdinacer/Jibli-DZ.git
   cd Jibli-DZ
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase Credentials:**
   Ensure native Firebase configuration files (`google-services.json` for Android and `GoogleService-Info.plist` for iOS) are placed in the project root as specified by `app.config.ts`.

4. **Start the Expo Development Server:**
   ```bash
   npm start
   ```

5. **Run on Platforms:**
   - **Android:** `npm run android`
   - **iOS:** `npm run ios`
   - **Web:** `npm run web`

---

## Firebase Emulators & Testing

### Running Emulators
To test Firebase features locally without affecting live cloud resources:

```bash
# Start emulators
npm run emulators:start

# Export local emulator state
npm run emulators:export

# Import previous data state
npm run emulators:import
```

### Testing & Quality
```bash
# Run unit tests
npm test

# Linting & formatting
npm run lint
npm run format:fix
```

---

## Repository Cleanup & Security Reminders

> [!CAUTION]
> Before publishing the repository publicly, make sure to:
> 1. Remove hardcoded email/password test credentials in `src/app/(auth)/sign-in.tsx`.
> 2. Ensure sensitive production Firebase keys in `google-services.json` / `GoogleService-Info.plist` are sanitized or added to `.gitignore`.
> 3. Delete or ignore debug logs (`*.log`) and un-sanitized emulator export directories.

---

## Engineering Highlights

- **Modern Mobile Architecture**: File-based navigation with Expo Router, React Native 0.74, and Expo SDK 51.
- **Full Offline/Cloud Balance**: Firebase Firestore + Realtime Database with robust local Zustand state management.
- **Localization Ready**: i18n implementation featuring Right-to-Left (RTL) layout support.
- **Production-Oriented Tooling**: Integrated Crashlytics reporting, form validation via Zod, and full unit test coverage setup with `jest-expo`.

---

## License

No explicit open-source license is currently defined for this repository.
