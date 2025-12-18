# 🚀 PostgreSQL Quick Reference

## 📦 Database Info
```
Database: ims
Host: localhost:5432
User: postgres
Pass: admin@123
URL: postgresql://postgres:admin%40123@localhost:5432/ims
```

## 🔗 Relationships Diagram
```
                    ┌─────────────────┐
                    │   Department    │
                    │   (Hub/Root)    │
                    └────────┬────────┘
                             │
             ┌───────────────┼───────────────┐
             │               │               │
             │ 1:N           │ 1:N           │ 1:N
             │               │               │
      ┌──────▼──────┐ ┌──────▼──────┐ ┌─────▼─────────┐
      │  Question   │ │  Campaign   │ │   Candidate   │
      │             │ │             │ │               │
      │ • 10 pts    │ │ • Questions◄├─┤ • Campaign    │
      │ • Tags      │ │ • Pass %    │ │ • Answers     │
      └─────────────┘ └──────┬──────┘ └───────────────┘
                             │
                             │ 1:N
                             │
                      ┌──────▼──────┐
                      │  Candidate  │
                      │ (per camp)  │
                      └─────────────┘
```

## 🔄 Cascade Delete Flow
```
DELETE Department
  └─> Deletes Questions
  └─> Deletes Campaigns
        └─> Deletes Candidates
  └─> Deletes Candidates
```

## 📊 Tables & Relationships

| Table | PK | FKs | Unique Fields | Key Fields |
|-------|-------|-----|--------------|------------|
| **Department** | id | - | name | name, description |
| **Question** | id | departmentId→Department | - | title, marks (10), departmentId |
| **Campaign** | id | departmentId→Department | - | name, questionSetIds[], passingScore, departmentId |
| **Candidate** | id | departmentId→Department<br>campaignId→Campaign | email | email, campaignId, score |
| **User** | id | - | email | email, role |

## 🛠️ Common Commands

### **Start Dev Server**
```bash
cd interview-system
npm run dev
# → http://localhost:3000
```

### **Open Prisma Studio**
```bash
npx prisma studio
# → http://localhost:5555
```

### **Update Schema**
```bash
# Edit prisma/schema.prisma, then:
npx prisma db push
npx prisma generate
```

### **Connect to Database**
```bash
$env:PGPASSWORD="admin@123"
psql -U postgres -d ims
```

### **Backup Database**
```bash
$env:PGPASSWORD="admin@123"
pg_dump -U postgres -d ims -F c -f backup.dump
```

### **Restore Database**
```bash
$env:PGPASSWORD="admin@123"
pg_restore -U postgres -d ims backup.dump
```

## 🔍 Useful SQL Queries

### **Count Records**
```sql
SELECT 
  (SELECT COUNT(*) FROM "Department") as depts,
  (SELECT COUNT(*) FROM "Question") as questions,
  (SELECT COUNT(*) FROM "Campaign") as campaigns,
  (SELECT COUNT(*) FROM "Candidate") as candidates;
```

### **View Department with Counts**
```sql
SELECT 
  d.name,
  COUNT(DISTINCT q.id) as question_count,
  COUNT(DISTINCT c.id) as campaign_count,
  COUNT(DISTINCT cand.id) as candidate_count
FROM "Department" d
LEFT JOIN "Question" q ON q."departmentId" = d.id
LEFT JOIN "Campaign" c ON c."departmentId" = d.id
LEFT JOIN "Candidate" cand ON cand."preferredDepartmentId" = d.id
GROUP BY d.id, d.name;
```

### **Campaign Statistics**
```sql
SELECT 
  c.name,
  d.name as department,
  c."totalCandidates",
  c."completedCandidates",
  c."averageScore",
  c.status
FROM "Campaign" c
JOIN "Department" d ON d.id = c."departmentId"
ORDER BY c."createdAt" DESC;
```

### **Top Candidates**
```sql
SELECT 
  cand."firstName" || ' ' || cand."lastName" as name,
  cand.email,
  cand.score,
  c.name as campaign,
  d.name as department
FROM "Candidate" cand
JOIN "Campaign" c ON c.id = cand."campaignId"
JOIN "Department" d ON d.id = cand."preferredDepartmentId"
WHERE cand.status = 'completed'
ORDER BY cand.score DESC
LIMIT 10;
```

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | List all departments |
| POST | `/api/departments` | Create department |
| GET | `/api/departments/[id]` | Get department with relations |
| PUT | `/api/departments/[id]` | Update department |
| DELETE | `/api/departments/[id]` | Delete department (cascade) |
| GET | `/api/questions` | List all questions |
| POST | `/api/questions` | Create question |
| PUT | `/api/questions/[id]` | Update question |
| DELETE | `/api/questions/[id]` | Delete question |
| GET | `/api/campaigns` | List all campaigns |
| POST | `/api/campaigns` | Create campaign |
| PUT | `/api/campaigns/[id]` | Update campaign |
| DELETE | `/api/campaigns/[id]` | Delete campaign (cascade) |
| GET | `/api/candidates` | List all candidates |
| POST | `/api/candidates` | Create candidate |
| PUT | `/api/candidates/[id]` | Update candidate |
| DELETE | `/api/candidates/[id]` | Delete candidate |

## ✅ Files Changed

### **Schema & Config**
- `prisma/schema.prisma` - Enhanced with relationships
- `.env` - PostgreSQL connection

### **Admin Pages (now use DB)**
- `src/app/admin/questions/page.tsx`
- `src/app/admin/campaigns/page.tsx`
- `src/app/admin/candidates/page.tsx`
- `src/app/admin/departments/page.tsx`

### **Components**
- `src/components/admin/CandidateForm.tsx`

### **Store**
- `src/store/dbData.ts` (already existed, now being used)

## 🎯 Business Rules

| Rule | Value |
|------|-------|
| Points per Question | **10 (fixed)** |
| Campaign Duration | **Manual (minutes)** |
| Passing Score | **Campaign-level %** |
| Department Names | **Must be unique** |
| Candidate Emails | **Must be unique** |
| Cascade Delete | **Enabled on all FKs** |

## 🔐 Data Integrity

✅ **Foreign Keys** - All relationships enforced  
✅ **Unique Constraints** - dept.name, candidate.email, user.email  
✅ **Indexes** - 15+ indexes for fast queries  
✅ **Cascade Deletes** - No orphaned records  
✅ **NOT NULL** - Required fields enforced  
✅ **Types** - Strong typing with TypeScript + Prisma  

## 📚 Documentation Files

- `DATABASE_CREDENTIALS.md` - Access credentials
- `DATABASE_RELATIONSHIPS.md` - Detailed relationships
- `DATABASE_SETUP.md` - Setup instructions
- `POSTGRESQL_INTEGRATION_COMPLETE.md` - Full integration guide
- `DATABASE_QUICK_REFERENCE.md` - This file

---

**Your IMS is fully integrated with PostgreSQL!** 🎉  
**All relationships configured, all pages updated!** ✅

