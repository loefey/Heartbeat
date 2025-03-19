# Heartbeat

Monitors the online status of a device and updates its status in a MongoDB database.

## Prerequisites

- Node.js
- Bun
- MongoDB

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/loefey/heartbeat.git
   cd heartbeat
   ```

2. Install dependencies:

   ```sh
   bun install
   ```

3. Set your MongoDB URI in the `.env` file:
   ```env
   MONGO_URI=your_mongodb_uri
   ```

## Usage

Run the project:

```sh
bun run .
```
