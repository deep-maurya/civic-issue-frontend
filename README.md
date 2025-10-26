# Civic Issue Frontend

A modern, responsive web application for reporting and managing civic issues in communities. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

### Public Features
- **Issue Reporting**: Report civic issues with photos, location, and detailed descriptions
- **Interactive Map**: Google Maps integration for precise location selection
- **Issue Categories**: Predefined categories like Potholes, Street Lights, Garbage Collection, etc.
- **Photo Upload**: Support for image attachments with preview
- **Real-time Updates**: Live data updates using React Query

## 👤 Admin Access

### Admin Credentials
- **Email**: admin@gmail.com
- **Password**: admin123

### Admin Features
- Access to dashboard at `/dashboard`
- Full issue management capabilities
- Worker assignment system
- Status update permissions
- Analytics and reporting

### Admin Dashboard
- **Issue Management**: View, filter, and manage all reported issues
- **Status Updates**: Change issue status (Pending, In Progress, Resolved, Closed)
- **Assignment System**: Assign issues to municipal workers
- **Data Visualization**: Charts and analytics for issue trends
- **Drag & Drop**: Reorder issues with drag-and-drop functionality
- **Advanced Filtering**: Filter by status, date, location, and more

### Authentication
- **User Registration & Login**: Secure authentication system
- **Protected Routes**: Role-based access control
- **Session Management**: Persistent login sessions

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Redux Toolkit + React Query
- **Maps**: Google Maps API
- **Icons**: Tabler Icons + Lucide React
- **Forms**: React Hook Form with Zod validation
- **Drag & Drop**: @dnd-kit
- **Tables**: TanStack Table

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Maps API key
- Backend API running

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd civic-issue-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)



## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Admin dashboard
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── Issues/           # Issue-related components
│   ├── PublicPages/      # Public page components
│   ├── auth/             # Authentication components
│   ├── common/           # Common/shared components
│   └── ui/               # shadcn/ui components
├── features/             # Feature-based modules
│   ├── auth/             # Authentication logic
│   └── issue/            # Issue management logic
├── config/               # Configuration files
├── context/              # React contexts
├── hooks/                # Custom hooks
├── redux/                # Redux store and providers
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🎯 Key Components

### ReportIssueModal
- Interactive form for reporting issues
- Google Maps integration for location selection
- Photo upload with preview
- Form validation with Zod

### DataTable
- Advanced data table with sorting, filtering, pagination
- Drag & drop reordering
- Status updates and worker assignment
- Real-time data refresh

### IssuesMap
- Interactive map showing all reported issues
- Marker clustering for better performance
- Issue details on marker click

## 🔄 API Integration

The application integrates with a backend API for:
- User authentication
- Issue CRUD operations
- Status updates
- Worker assignments
- File uploads

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching capability
- **Accessibility**: WCAG compliant components
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success/error feedback


```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```



**Built with ❤️ for better communities**
