# Portal Architecture - Separate Deployments

The Interview Management System is now split into **two independent applications**:

## 📦 Applications

### 1. Admin Portal (`interview-system/`)
**Purpose**: Backend management, question bank, campaigns, candidates

**Port**: 3000  
**URL**: http://localhost:3000

**Features**:
- Dashboard with KPIs
- Question Bank Management
- Campaign Management
- Candidate Management
- Department Management
- Results & Rankings
- Mappings Visualization
- Database Management (PostgreSQL)

**Tech Stack**:
- Next.js 14
- PostgreSQL + Prisma
- Zustand (state management)
- Tailwind CSS
- API Routes

**Theme**: Orange gradient

---

### 2. Candidate Portal (`candidate-portal/`)
**Purpose**: Interview interface for candidates

**Port**: 3001  
**URL**: http://localhost:3001

**Features**:
- Candidate Login
- Interview Interface
- Real-time Timer
- Auto-save
- Results & Rankings (candidate view)
- Session Management

**Tech Stack**:
- Next.js 14
- Tailwind CSS
- Session Storage
- React Hot Toast

**Theme**: Blue-Indigo gradient

---

## 🚀 Running Both Applications

### Development

**Terminal 1 - Admin Portal**:
```bash
cd d:\cursorproject\interview-system
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Candidate Portal**:
```bash
cd d:\cursorproject\candidate-portal
npm install
npm run dev
# Runs on http://localhost:3001
```

### Production

Both applications can be deployed to different servers/domains:

- **Admin**: `https://admin.yourcompany.com`
- **Candidate**: `https://interview.yourcompany.com`

---

## 🔗 Communication Between Portals

The Candidate Portal communicates with the Admin Portal's API:

```typescript
// candidate-portal/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/candidates/:id` | GET | Get candidate details |
| `/api/candidates/:id/login` | POST | Authenticate candidate |
| `/api/answers` | POST | Submit interview answers |
| `/api/results/:candidateId` | GET | Get candidate results |

---

## 🛠️ Deployment Strategies

### Option 1: Single Server, Different Ports
```
Server: myserver.com
- Admin: myserver.com:3000
- Candidate: myserver.com:3001
```

### Option 2: Different Subdomains (Recommended)
```
- Admin: admin.mycompany.com
- Candidate: interview.mycompany.com
```

### Option 3: Completely Different Domains
```
- Admin: admin-dashboard.com
- Candidate: candidate-interview.com
```

---

## 📋 Environment Configuration

### Admin Portal (`.env`)
```bash
DATABASE_URL="postgresql://postgres:admin@123@localhost:5432/ims"
NEXT_PUBLIC_ADMIN_URL=http://localhost:3000
```

### Candidate Portal (`.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_CANDIDATE_URL=http://localhost:3001
```

---

## 🔐 Authentication Flow

### Admin Portal
```
Login → Email/Password → JWT Token → Admin Dashboard
```

### Candidate Portal
```
Login → Email/Temp Password → Session Storage → Interview Interface
```

---

## 📊 Data Flow

```
Admin Creates Candidate
↓
Candidate receives email with:
  - Login link: http://localhost:3001/login
  - Temp Password: temp1234
↓
Candidate logs in → Starts Interview
↓
Answers submitted → Saved to Admin DB via API
↓
Admin reviews results in Admin Portal
```

---

## 🎯 Benefits of Separation

1. **Independent Deployment**: Update admin without affecting candidates
2. **Scalability**: Scale each portal independently
3. **Security**: Separate authentication systems
4. **Performance**: Lighter candidate portal (no admin overhead)
5. **Maintenance**: Easier to maintain smaller codebases
6. **Branding**: Different themes for different user types

---

## 🚨 Important Notes

### CORS Configuration

The Admin Portal must allow requests from the Candidate Portal:

```javascript
// interview-system/next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://localhost:3001' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};
```

### Database Access

Only the Admin Portal has direct database access. The Candidate Portal accesses data through API endpoints.

---

## 📈 Monitoring

### Admin Portal Health Check
```bash
curl http://localhost:3000/api/health
```

### Candidate Portal Health Check
```bash
curl http://localhost:3001/api/health
```

---

## 🔄 Migration from Old Architecture

The old monolithic structure (`/candidate` routes in admin portal) has been removed and replaced with:

- **Before**: `interview-system/src/app/candidate/*`
- **After**: `candidate-portal/src/app/*`

All candidate routes are now standalone:
- `/candidate/login` → `/login`
- `/candidate/interview` → `/interview`
- `/candidate/results` → `/results`

---

## 📦 Package Differences

### Admin Portal Dependencies
- `@prisma/client` - Database access
- `prisma` - ORM
- `pg` - PostgreSQL driver
- `zustand` - State management (persistent)

### Candidate Portal Dependencies
- NO database dependencies
- Lighter bundle size
- Focuses on UI/UX

---

## 🎨 Theming Differences

| Feature | Admin Portal | Candidate Portal |
|---------|-------------|------------------|
| Primary Color | Orange (#f97316) | Blue (#2563eb) |
| Secondary | Red (#ef4444) | Indigo (#4f46e5) |
| Header | Admin Dashboard | Candidate Portal |
| Sidebar | Yes | No |
| Layout | Dashboard | Full-page |

---

## 🚀 Quick Start Commands

```bash
# Install both applications
cd d:\cursorproject\interview-system && npm install
cd d:\cursorproject\candidate-portal && npm install

# Run both in development
# Terminal 1
cd d:\cursorproject\interview-system && npm run dev

# Terminal 2
cd d:\cursorproject\candidate-portal && npm run dev

# Access applications
# Admin: http://localhost:3000/admin/login
# Candidate: http://localhost:3001/login
```

---

## ✅ Separation Complete!

The Interview Management System is now fully decoupled into two independent, deployable applications! 🎉

