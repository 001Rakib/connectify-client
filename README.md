# Connectify - Frontend 🚀

![Connectify Logo]('./client/public/conectify.svg)

This is the frontend for Connectify, a modern, full-stack social media application built with **Next.js**, **React**, and **Tailwind CSS**. It features a responsive design, real-time notifications, and a complete suite of social networking features.

**Live Demo:** [**https://connectify-gamma-roan.vercel.app**](https://connectify-gamma-roan.vercel.app) ---

### ## ✨ Key Features

- **Full Authentication:** Secure user registration and login with JWT (Access + Refresh Tokens).
- **Personalized Feed:** Main feed displays posts from followed users.
- **Post Management:** Full CRUD (Create, Read, Update, Delete) functionality for posts.
- **Image Uploads:** Users can upload images with their posts via Cloudinary.
- **Social Interactions:** Like/unlike posts, write and view comments.
- **User Profiles:** Dynamic profile pages with user info, bio, and posts.
- **Follow System:** Ability to follow and unfollow other users.
- **Real-time Notifications:** Instant notifications for likes and comments using Socket.IO.
- **Password Management:** Secure "Change Password" and "Forgot Password" email flow.
- **Modern UI:** Built with **shadcn/ui** for a clean, responsive, and accessible design.

[Image of the Connectify application interface]('./client/public/connectify-home.png)

---

### ## 💻 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Library:** [React](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Component Library:** [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** React Context API
- **Data Fetching:** Axios
- **Real-time:** Socket.IO Client
- **Deployment:** [Vercel](https://vercel.com/)

---

### ## 🛠️ Getting Started

To run this project locally, follow these steps:

**1. Clone the repository:**

```bash
git clone [https://github.com/001Rakib/connectify-client](https://github.com/001Rakib/connectify-client)
cd connectify/client
```

**2. Install dependencies:**

```bash
npm install
```

**3. Set up environment variables:**
Create a file named `.env.local` in the `client` directory and add the following variables. Point them to your locally running backend server.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

**4. Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
