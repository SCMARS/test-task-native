#Конечно! Вот полный текст README, готовый к вставке в файл:

````markdown
# Expense Tracker

A React Native mobile application for tracking personal expenses.

## Prerequisites

- Node.js (v14 or newer)  
- npm or yarn  
- Xcode (for iOS development)  
- Android Studio (for Android development)  
- Expo CLI  

## Installation

1. Install dependencies:  
```bash
npm install
# or
yarn install
````

2. Create a `.env` file in the root directory with your Firebase configuration. You can use the `.env.example` file as a template:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Firebase Setup

* Make sure you have created Firestore indexes for the following queries to work properly:

    * Collection `expenses` with indexes on `userId (Ascending)`, `date (Descending)`, and `__name__ (Descending)`
    * Collection `expenses` with indexes on `category (Ascending)`, `userId (Ascending)`, `date (Descending)`, and `__name__ (Descending)`

## Running the App

### iOS Simulator

```bash
npm run ios
# or
yarn ios
```

### Android Emulator

```bash
npm run android
# or
yarn android
```

### Development Server

```bash
npm start
# or
yarn start
```

### Running on a real device

* For iOS devices, make sure your Apple developer certificates and provisioning profiles are properly configured in Xcode.
* For Android devices, enable USB debugging and connect the device via USB or use wireless debugging.

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── navigation/     # Navigation configuration
  ├── screens/        # Screen components
  ├── services/       # API and service functions
  ├── store/          # State management
  ├── types/          # TypeScript type definitions
  └── utils/          # Utility functions
```

## Features

* User authentication
* Expense tracking
* Category management
* Expense history
* Profile management

## Tech Stack

* React Native with Expo
* TypeScript for type safety
* Firebase Authentication and Firestore
* React Navigation for routing
* React Native Paper for UI components
* Zustand for state management
* Date-fns for date formatting

## Known Limitations

* Limited offline support
* No data export functionality
* No multi-language support

## Future Improvements

* [ ] Add data visualization (charts, graphs)
* [ ] Implement budget planning
* [ ] Add recurring expenses
* [ ] Support for more currencies
* [ ] Offline mode with data sync
* [ ] Export data to CSV/PDF
* [ ] Dark mode support

## Contributing