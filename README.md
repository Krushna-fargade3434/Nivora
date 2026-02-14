# Nivora

A beautiful, secure, and feature-rich notes application for organizing your thoughts, credentials, reminders, and personal information. Built with modern web technologies for a seamless user experience.

![Nivora](public/logo.png)

## ✨ Features

### 📝 Note Management
- **Create & Edit Notes** - Rich text editor with title, content, and tags
- **Background Customization** - Choose from preset colors or add custom background images
- **Custom Background Images** - Select from beautiful preset images or use your own image URLs
- **Tags & Organization** - Add comma-separated tags to categorize your notes
- **Search Functionality** - Quickly find notes with powerful search
- **Date Tracking** - Automatic timestamps for creation and updates

### ⭐ Organization Features
- **Favorites** - Mark important notes as favorites for quick access
- **Pin Notes** - Pin critical notes to the top of your dashboard
- **Smart Sorting** - Pinned notes always appear first, followed by recent notes
- **Favorites Page** - Dedicated view for all your starred notes

### 🎨 Customization
- **7 Preset Colors** - White, Cream, Sage, Lavender, Peach, Sky, and Mint
- **6 Preset Background Images** - Gradient, Abstract, Nature, Mountain, Stars, and Geometric
- **Custom Image URLs** - Add any image URL as a note background
- **Real-time Preview** - See background changes instantly as you apply them

### 🔒 Security & Authentication
- **User Authentication** - Secure sign-up and sign-in with Supabase Auth
- **Protected Routes** - Dashboard accessible only to authenticated users
- **Row Level Security** - Users can only access their own notes
- **Session Management** - Automatic session handling and token refresh

### 💫 User Experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode** - Automatic theme detection and manual toggle
- **Smooth Animations** - Framer Motion animations for delightful interactions
- **Loading States** - Clear feedback during data operations
- **Error Handling** - User-friendly error messages with toast notifications
- **Back Navigation** - Easy navigation with back buttons on auth pages

## 🛠 Technologies

### Frontend
- **Vite** - Lightning-fast build tool and dev server
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Framer Motion** - Production-ready animation library
- **React Router** - Client-side routing
- **TanStack Query** - Powerful data synchronization

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Robust relational database
- **Row Level Security** - Database-level security policies
- **Real-time subscriptions** - Live data updates

### Development Tools
- **ESLint** - Code quality and consistency
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - Automatic vendor prefixes

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Supabase Account** - [Sign up](https://supabase.com/)

### Setup Instructions

1. **Clone the repository**
```sh
git clone <YOUR_GIT_URL>
cd nivora
```

2. **Install dependencies**
```sh
npm install
```

3. **Configure Supabase**

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings at https://app.supabase.com/

4. **Run the development server**
```sh
npm run dev
```

The app will be available at `http://localhost:8080`

## 📜 Available Scripts

```sh
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run type-check
```

## 🗂 Project Structure

```
nivora/
├── public/              # Static assets
│   ├── logo.png        # Application logo
│   └── robots.txt      # SEO configuration
├── src/
│   ├── components/     # React components
│   │   ├── auth/       # Authentication components
│   │   ├── dashboard/  # Dashboard components
│   │   ├── landing/    # Landing page components
│   │   └── ui/         # shadcn/ui components
│   ├── contexts/       # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/          # Custom React hooks
│   │   ├── useNotes.ts
│   │   └── useProfile.ts
│   ├── integrations/   # External integrations
│   │   └── supabase/   # Supabase client & types
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   └── main.tsx        # Application entry point
├── supabase/           # Supabase configuration
│   └── migrations/     # Database migrations
└── package.json        # Dependencies and scripts
```

## 🗄 Database Schema

### Notes Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users |
| title | text | Note title |
| content | text | Note content |
| bg_color | text | Background color (hex) |
| bg_image_url | text | Background image URL |
| is_favorite | boolean | Favorite status |
| is_pinned | boolean | Pinned status |
| tags | text[] | Array of tags |
| note_date | date | Note date |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

### Profiles Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (matches auth.users.id) |
| email | text | User email |
| full_name | text | User's full name |
| avatar_url | text | Profile picture URL |
| created_at | timestamp | Account creation time |
| updated_at | timestamp | Last profile update |

## 🚀 Deployment

### Build for Production

```sh
npm run build
```

The optimized production build will be in the `dist/` directory.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist/` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Other Platforms

The app can be deployed to any static hosting service:
- GitHub Pages
- Cloudflare Pages
- Firebase Hosting
- AWS S3 + CloudFront
- And more!

## 🎨 Customization

### Colors

Edit background color presets in `src/components/dashboard/NoteEditor.tsx`:

```typescript
const colorOptions = [
  { value: '#ffffff', label: 'White', class: 'bg-white' },
  { value: '#faf5f0', label: 'Cream', class: 'bg-note-cream' },
  // Add more colors...
];
```

### Background Images

Add more preset images in `src/components/dashboard/NoteEditor.tsx`:

```typescript
const bgImageOptions = [
  { url: 'https://your-image-url.com/image.jpg', label: 'Your Label' },
  // Add more images...
];
```

### Theming

Customize the theme in `src/index.css`:

```css
:root {
  --primary: /* your color */;
  --background: /* your color */;
  /* ... more theme variables */
}
```

## 📌 Version Management

Nivora uses a semantic versioning system to track updates and changes. The version is displayed in:
- **Profile Section** - Logged-in users can see the current version, version name, and last update date
- **Footer** - Version number visible on the landing page

### Updating the Version

When making updates to the application, update the version in `src/lib/version.ts`:

```typescript
export const APP_VERSION = '1.0'; // Increment this
export const VERSION_NAME = 'Foundation'; // Update the version name
export const LAST_UPDATED = 'February 2026'; // Update the date
```

### Versioning Guidelines

Follow semantic versioning principles:
- **Major (X.0)** - Breaking changes or major feature releases
- **Minor (1.X)** - New features, backwards compatible
- **Patch (1.0.X)** - Bug fixes and minor improvements

### Version History

Add new version entries to the `VERSION_HISTORY` array in `src/lib/version.ts` to maintain a changelog:

```typescript
{
  version: '1.1',
  name: 'Enhancement',
  date: 'March 2026',
  changes: [
    'New feature description',
    'Bug fixes',
    'Performance improvements',
  ],
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

Your Name - [Your Website](https://yourwebsite.com)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Supabase](https://supabase.com/) - Amazing backend platform
- [Unsplash](https://unsplash.com/) - Beautiful preset images
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ using React, TypeScript, and Supabase
