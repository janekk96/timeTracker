# Work Time Management System

This project is a Work Time Management System built with React, TypeScript, and Supabase. It allows users to log their work hours, filter entries, and export data to Excel.

## Table of Contents

- [Work Time Management System](#work-time-management-system)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/work-time-management.git
   cd work-time-management
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

## Usage

- Navigate to `http://localhost:3000` in your browser.
- Log in with your credentials.
- Add, filter, and export work time entries.
