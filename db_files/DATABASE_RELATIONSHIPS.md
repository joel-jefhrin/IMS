# 🔗 Database Relationships & Schema Documentation

## ✅ PostgreSQL Database Connected

**Database:** `ims`  
**Connection:** `postgresql://postgres:admin@123@localhost:5432/ims`  
**ORM:** Prisma v5.22.0  
**Provider:** PostgreSQL

---

## 📊 Entity Relationship Diagram

```
┌─────────────────┐
│   Department    │
│  (Central Hub)  │
└────────┬────────┘
         │
         │ One-to-Many
         ├────────────────────────────────────┐
         │                                    │
         │                                    │
┌────────▼────────┐           ┌───────────────▼──────┐
│    Question     │           │      Campaign        │
│                 │           │                      │
│ - departmentId  │◄──────────┤ - departmentId       │
│ - Fixed 10pts   │  Many     │ - questionSetIds[]   │
└─────────────────┘           └──────────┬───────────┘
                                         │
                                         │ One-to-Many
                                         │
                              ┌──────────▼──────────┐
                              │     Candidate       │
                              │                     │
                              │ - campaignId        │
                              │ - departmentId      │
                              │ - assignedQuestions │
                              └─────────────────────┘
```

---

## 🗂️ Database Tables

### 1. **Department** (Central Entity)
The hub of all relationships - departments organize questions, campaigns, and candidates.

**Fields:**
```typescript
{
  id: string (cuid)          // Unique identifier
  name: string (UNIQUE)      // Department name (must be unique)
  description?: string       // Optional description
  createdAt: DateTime        // Auto-generated timestamp
  updatedAt: DateTime        // Auto-updated timestamp
}
```

**Relationships:**
- ✅ **One Department → Many Questions** (`questions: Question[]`)
- ✅ **One Department → Many Campaigns** (`campaigns: Campaign[]`)
- ✅ **One Department → Many Candidates** (`candidates: Candidate[]`)

**Indexes:**
- `name` - Fast lookup by department name

**Constraints:**
- `name` must be UNIQUE

---

### 2. **Question**
Questions belong to a department and can be used in multiple campaigns.

**Fields:**
```typescript
{
  id: string (cuid)
  title: string
  description: string (TEXT)
  answerType: string         // 'multiple_choice' | 'code_editor' | 'essay' | 'file_upload' | 'rating_scale'
  departmentId: string       // FK → Department.id
  difficulty: string         // 'beginner' | 'intermediate' | 'advanced'
  skillType: string          // 'technical' | 'behavioral' | 'logical'
  tags: string (TEXT)        // JSON array of tags
  marks: int (default 10)    // Fixed 10 points per question
  
  // Type-specific fields (JSON)
  options?: string (TEXT)
  correctAnswer?: string (TEXT)
  codeTemplate?: string (TEXT)
  rubric?: string (TEXT)
  fileTypes?: string (TEXT)
  ratingScale?: int
  solutionTemplate?: string (TEXT)
  
  createdBy: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Relationships:**
- ✅ **Many Questions → One Department** (`department: Department`)
  - `ON DELETE CASCADE` - If department is deleted, all its questions are deleted

**Indexes:**
- `departmentId` - Fast filtering by department
- `difficulty` - Fast filtering by difficulty
- `skillType` - Fast filtering by skill type
- `createdAt` - Chronological ordering

**Business Rules:**
- Each question is worth exactly **10 points**
- Questions are department-specific
- Questions can be reused across multiple campaigns

---

### 3. **Campaign**
Campaigns belong to a department and contain a set of questions for candidates.

**Fields:**
```typescript
{
  id: string (cuid)
  name: string
  description: string (TEXT)
  departmentId: string              // FK → Department.id
  startDate: string
  endDate: string
  durationPerCandidate: int         // Manual duration in minutes
  status: string (default 'draft')  // 'draft' | 'active' | 'completed' | 'archived'
  questionSetIds: string (TEXT)     // JSON array of Question IDs
  questionsPerCandidate: int        // How many questions each candidate gets
  isRandomized: boolean             // Whether to randomize questions
  passingScore: int                 // Passing percentage (0-100)
  passingCriteria?: string (TEXT)
  totalCandidates: int (default 0)
  completedCandidates: int (default 0)
  averageScore: float (default 0)
  createdBy: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Relationships:**
- ✅ **Many Campaigns → One Department** (`department: Department`)
  - `ON DELETE CASCADE` - If department is deleted, all its campaigns are deleted
- ✅ **One Campaign → Many Candidates** (`candidates: Candidate[]`)

**Indexes:**
- `departmentId` - Fast filtering by department
- `status` - Fast filtering by status
- `startDate` - Date-based queries
- `createdAt` - Chronological ordering

**Business Rules:**
- Campaigns are department-specific
- Questions are stored as IDs in `questionSetIds` array
- Duration is manually set (not auto-calculated)
- Passing score is campaign-level percentage
- Each question = 10 points, so max score = 10 × number of questions

---

### 4. **Candidate**
Candidates are assigned to one campaign and prefer one department.

**Fields:**
```typescript
{
  id: string (cuid)
  firstName: string
  lastName: string
  email: string (UNIQUE)
  phone?: string
  education: string (TEXT)               // JSON: {degree, institution, graduationYear, gpa}
  preferredDepartmentId: string          // FK → Department.id
  campaignId: string                     // FK → Campaign.id
  status: string (default 'not_started') // 'invited' | 'in_progress' | 'completed' | 'not_started'
  assignedQuestions?: string (TEXT)      // JSON array of Question IDs
  answers?: string (TEXT)                // JSON array of answers
  score: float (default 0)
  tempPassword: string
  interviewStartedAt?: string
  interviewCompletedAt?: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Relationships:**
- ✅ **Many Candidates → One Department** (`department: Department`)
  - `ON DELETE CASCADE` - If department is deleted, candidates are removed
- ✅ **Many Candidates → One Campaign** (`campaign: Campaign`)
  - `ON DELETE CASCADE` - If campaign is deleted, candidates are removed

**Indexes:**
- `preferredDepartmentId` - Fast filtering by department
- `campaignId` - Fast filtering by campaign
- `status` - Fast filtering by status
- `email` - Fast lookup by email
- `createdAt` - Chronological ordering

**Constraints:**
- `email` must be UNIQUE

**Business Rules:**
- Each candidate belongs to exactly one campaign
- Each candidate has a preferred department
- Campaign's department and candidate's preferred department can differ
- Assigned questions are stored as JSON array of IDs

---

### 5. **User**
System users (admins, managers, etc.)

**Fields:**
```typescript
{
  id: string (cuid)
  email: string (UNIQUE)
  name: string
  role: string (default 'admin')
  password: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Relationships:**
- No direct relationships yet (future: created questions, campaigns, etc.)

**Indexes:**
- `email` - Fast lookup by email
- `role` - Fast filtering by role

---

## 🔄 Data Flow

### Question Assignment Flow
```
1. Department Created
   ↓
2. Questions Added to Department
   ↓
3. Campaign Created for Department
   ↓
4. Questions Selected from Department (questionSetIds)
   ↓
5. Candidate Assigned to Campaign
   ↓
6. Questions Assigned to Candidate (from questionSetIds)
   ↓
7. Candidate Answers Questions
   ↓
8. Score Calculated (10 points per question)
```

### Cascade Delete Behavior
```
Delete Department
  → Deletes all Questions in that department
  → Deletes all Campaigns in that department
  → Deletes all Candidates assigned to that department

Delete Campaign
  → Deletes all Candidates assigned to that campaign
  → Questions remain (they're just referenced, not owned)

Delete Question
  → Campaign's questionSetIds still contain the ID (cleanup needed in app logic)
  → Candidate's assignedQuestions still contain the ID (cleanup needed in app logic)
```

---

## 🔗 Relationship Examples

### Example 1: Engineering Department
```
Department: "Engineering" (id: d1)
  ├── Questions:
  │     ├── "What is React?" (id: q1, marks: 10)
  │     ├── "Explain closures" (id: q2, marks: 10)
  │     └── "Binary tree traversal" (id: q3, marks: 10)
  │
  ├── Campaigns:
  │     ├── "Frontend Engineer - Q1 2024" (id: c1)
  │     │     questionSetIds: [q1, q2]
  │     │     passingScore: 70%
  │     │     duration: 60 minutes
  │     │
  │     └── "Full Stack Engineer - Q1 2024" (id: c2)
  │           questionSetIds: [q1, q2, q3]
  │           passingScore: 80%
  │           duration: 90 minutes
  │
  └── Candidates:
        ├── John Doe (campaignId: c1, status: completed, score: 18/20 = 90%)
        └── Jane Smith (campaignId: c2, status: in_progress, score: 0)
```

### Example 2: Multi-Department Scenario
```
Candidate: Sarah Johnson
  - preferredDepartmentId: "d2" (Product Design)
  - campaignId: "c5" (belongs to Department "d1" - Engineering)
  
This is valid! A candidate can:
  ✅ Prefer one department (Product Design)
  ✅ Be interviewed for another department (Engineering)
```

---

## 📋 Querying Relationships

### Get Department with All Questions
```typescript
const department = await prisma.department.findUnique({
  where: { id: 'd1' },
  include: {
    questions: true,
    campaigns: true,
    candidates: true,
  },
});
```

### Get Campaign with Department and Candidates
```typescript
const campaign = await prisma.campaign.findUnique({
  where: { id: 'c1' },
  include: {
    department: true,
    candidates: {
      include: {
        department: true, // Candidate's preferred department
      },
    },
  },
});
```

### Get All Questions for a Department
```typescript
const questions = await prisma.question.findMany({
  where: { departmentId: 'd1' },
  orderBy: { createdAt: 'desc' },
});
```

### Get Campaign Statistics
```typescript
const campaign = await prisma.campaign.findUnique({
  where: { id: 'c1' },
  include: {
    candidates: {
      where: { status: 'completed' },
    },
  },
});

const totalScore = campaign.candidates.reduce((sum, c) => sum + c.score, 0);
const avgScore = totalScore / campaign.candidates.length;
```

---

## ✅ Application Configuration

### **All Pages Updated to Use PostgreSQL:**

✅ **Questions Page** (`/admin/questions`)
- Uses: `useDBDataStore` (fetches from `/api/questions`)
- Effect: `fetchQuestions()` on mount
- Operations: Add, Update, Delete, CSV Import/Export

✅ **Campaigns Page** (`/admin/campaigns`)
- Uses: `useDBDataStore` (fetches from `/api/campaigns`)
- Effect: `fetchCampaigns()` and `fetchQuestions()` on mount
- Operations: Add, Update, Delete, Export

✅ **Candidates Page** (`/admin/candidates`)
- Uses: `useDBDataStore` (fetches from `/api/candidates`)
- Effect: `fetchCandidates()` on mount
- Operations: Add, Update, Delete, Bulk Invite

✅ **Departments Page** (`/admin/departments`)
- Uses: `useDBDataStore` (fetches from `/api/departments`)
- Effect: `fetchDepartments()` on mount
- Operations: Add, Update, Delete

✅ **Candidate Form Component**
- Uses: `useDBDataStore` for department and campaign dropdowns
- Effect: `fetchDepartments()` and `fetchCampaigns()` on mount
- Features: Smart filtering, bidirectional sync

---

## 🚀 Next Steps

### **1. Seed the Database**
Visit: http://localhost:3000/admin/migrate
- Migrate data from localStorage to PostgreSQL

### **2. Test Relationships**
```bash
npx prisma studio
```
Opens GUI at http://localhost:5555

### **3. Verify Cascade Deletes**
Try deleting a department and check that questions, campaigns, and candidates are also removed.

### **4. Run the Application**
```bash
npm run dev
```
All CRUD operations now persist to PostgreSQL!

---

## 🔒 Data Integrity

### **Enforced by Database:**
- ✅ Unique department names
- ✅ Unique candidate emails
- ✅ Foreign key constraints
- ✅ Cascade deletes
- ✅ NOT NULL constraints

### **Enforced by Application:**
- Question scoring (fixed 10 points)
- Campaign passing percentage (0-100)
- JSON field validation (tags, questionSetIds, etc.)
- Date validation (startDate < endDate)

---

**Your Interview Management System is now fully integrated with PostgreSQL!** 🎉

All relationships are defined, indexes are optimized, and cascade behaviors are configured.

