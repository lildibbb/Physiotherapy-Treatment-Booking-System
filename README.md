# Physiotherapy Treatment Booking System

[![Build Status](https://img.shields.io/github/workflow/status/lildibbb/Physiotherapy-Treatment-Booking-System/CI)](https://github.com/lildibbb/Physiotherapy-Treatment-Booking-System/actions)
[![License](https://img.shields.io/github/license/lildibbb/Physiotherapy-Treatment-Booking-System)](https://github.com/lildibbb/Physiotherapy-Treatment-Booking-System/blob/main/LICENSE)
![PWA Supported](https://img.shields.io/badge/PWA-Supported-green)

## Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
  - [Clone the repository](#1-clone-the-repository)
  - [Set up environment variables](#2-set-up-environment-variables)
  - [Generate VAPID Keys](#generate-vapid-keys)
  - [Get Stripe API Key](#get-stripe-api-key)
  - [Install dependencies](#3-install-dependencies)
  - [Database Setup](#4-database-setup-backend)
  - [Running the Project](#5-running-the-project)
- [Contributing](#contributing)
- [Key Updates](#key-updates)

## Description

The **Physiotherapy Treatment Booking System** is an online platform that enables patients to easily book physiotherapy appointments. It provides a smooth and intuitive experience for both patients and healthcare providers. Patients can view available physiotherapists, book appointments, and manage their treatment plans. Physiotherapists can efficiently manage their schedules and patient records. The system also includes a **PWA** (Progressive Web App) setup for a native-like experience across different devices and platforms. Additionally, a **Stripe** payment gateway is integrated for secure payments during the booking process.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS (for styling), ShadCN UI
- **Backend:** Elysia.js, Bun.js
- **Database:** PostgreSQL, Drizzle ORM
- **API:** Custom backend API for handling appointments, user management, and payments
- **Payment Gateway:** Stripe
- **Package Manager:** Bun

## Features

- **PWA Support**: The application can be installed on devices for offline access and a native-like experience.
- Patients can view available physiotherapists, book appointments, and pay securely.
- Physiotherapists can manage schedules, view patients' treatment details, and track appointments.
- Stripe payment gateway integration for seamless and secure payment processing.
- User-friendly interface for both patients and healthcare providers.

## Setup and Installation

### 1. Clone the repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/lildibbb/Physiotherapy-Treatment-Booking-System.git
cd Physiotherapy-Treatment-Booking-System
```

### 2. Set up environment variables

Create the .env file based on the provided .env.example:

```bash
cp .env.example .env
```

Then, update the .env file with your specific environment variables, such as your database credentials and API keys.

### Generate VAPID Keys

Before using push notifications in the PWA, you need to generate VAPID keys. Run the following command to generate the keys:

```bash
cd backend
bun run keys
```

This script will generate the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY. After running the script, add these keys to your .env file:

```bash
VAPID_PUBLIC_KEY=your_generated_public_key
VAPID_PRIVATE_KEY=your_generated_private_key
VITE_VAPID_PUBLIC_KEY=your_generated_public_key
```

Replace your_generated_public_key and your_generated_private_key with the actual keys generated by the script.

### Get Stripe API Key

Sign up for a Stripe account and retrieve your Stripe API Key. Add the key to the .env file:

Log in to your Stripe Dashboard.
Navigate to Developers > API Keys.
Copy the Publishable Key and Secret Key and add them to your .env file under the relevant sections.

### 3. Install dependencies

Use Bun to install all necessary dependencies:

```bash
bun install
```

### 4. Database Setup (Backend)

Navigate to the backend directory and run the following commands to set up the database:

```bash
cd backend
bun generate  # Generates necessary models and files
bun migrate   # Applies database migrations
```

### 5. Running the Project

Once everything is set up, you can run the project with this command in root directory:

```bash

bun dev
```

This will start both the frontend and backend services, allowing you to interact with the system locally.

### Contributing

We welcome contributions! If you find any bugs or have suggestions for improvements, feel free to fork the repository, create issues, or submit pull requests.

### Key Updates:

1. **PWA Support**: It’s mentioned that the app supports PWA features, which means it can be installed on devices and used offline.
2. **Stripe Payment Gateway**: Instructions for setting up Stripe API keys and integrating it into the system.
3. **API Key**: You now need to fetch your Stripe API keys and add them to the `.env` file to ensure payments are processed securely.

Let me know if you need further modifications!
