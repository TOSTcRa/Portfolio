# Portfolio

A full-featured web application for uploading, displaying, and managing images with authentication and category filtering.

---

# Technologies Used

- React (Vite)
- SCSS with responsive media queries
- Node.js + Express
- MongoDB + GridFS
- JWT-based authentication
- Multer for image uploads

---

## Getting Started

1.  **Clone repository:**

    ```bash
    git clone
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Create a .env file in the root directory:**

    ```bash
    cp .env.example .env
    ```

**And add the following variables**

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

ADMIN_USERNAME=admin

ADMIN_PASSWORD=adminpassword

```

## Running the project

**Start the backend**

```bash
node server.js
```

**Start the frontend**

```bash
npm run dev
```

## Authentication

The admin panel is only accessible to authorized users. The login credentials are stored securely in environment variables.

## Features

- Upload images to specific categories
- Browse gallery with category filters
- Delete images from the admin panel
- Responsive design for all devices

## Roles

- **Admin**

  - Can upload and delete images

- **User**
  - Username: `readonly`
  - Password: `viewonly123`
  - Can view the admin panel but cannot upload or delete images

> Regular users will see an alert if they try to perform restricted actions.

## Security

- Secrets (e.g. JWT and database URI) are stored in .env and not committed to the repository
- Protected /upload and /delete endpoints using JWT middleware

## Example .env

```env
MONGO_URI=mongodb+srv://your_user:your_pass@cluster.mongodb.net/your-db

JWT_SECRET=secretkey

ADMIN_USERNAME=youradmin

ADMIN_PASSWORD=securepassword123
```

## License

MIT License

Copyright (c) 2025 Andriy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
