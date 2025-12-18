# 🔗 Mapping System Documentation

## Overview
The Interview Management System uses a **hierarchical mapping structure** to connect Departments → Questions → Campaigns → Candidates.

---

## 📊 Data Relationship Hierarchy

```
Department
    ↓
Questions (belong to department)
    ↓
Campaign (uses questions from department)
    ↓
Candidates (assigned to campaign, receive questions)
```

---

## 🏗️ Entity Relationships

### **1. Department → Questions**

**Relationship:** One-to-Many
- One department has many questions
- Each question belongs to one department

**Type Definition:**
```typescript
interface Question {
  id: string;
  title: string;
  departmentId: string;  // ← Links to Department
  // ... other fields
}

interface Department {
  id: string;
  name: string;
  // Department has many questions (not stored in dept, queried by departmentId)
}
```

**Example:**
```typescript
// Engineering Department
{ id: 'd1', name: 'Engineering' }

// Questions belonging to Engineering
[
  { id: 'q1', title: 'Binary Search', departmentId: 'd1' },
  { id: 'q2', title: 'React Hooks', departmentId: 'd1' },
  { id: 'q3', title: 'SQL Optimization', departmentId: 'd1' }
]
```

---

### **2. Department → Campaign**

**Relationship:** One-to-Many
- One department has many campaigns
- Each campaign belongs to one department

**Type Definition:**
```typescript
interface Campaign {
  id: string;
  name: string;
  departmentId: string;  // ← Links to Department
  questionSetIds: string[];  // ← Links to Questions
  // ... other fields
}
```

**Example:**
```typescript
// Campaign for Engineering Department
{
  id: 'c1',
  name: 'Frontend Developer Hiring',
  departmentId: 'd1',  // Engineering
  questionSetIds: ['q1', 'q2', 'q3']  // Questions from Engineering
}
```

---

### **3. Campaign → Questions**

**Relationship:** Many-to-Many
- One campaign can use many questions
- One question can be used in many campaigns

**Type Definition:**
```typescript
interface Campaign {
  questionSetIds: string[];  // Array of question IDs
}
```

**Logic:**
- Campaign selects questions **only from its own department**
- `questionSetIds` contains the IDs of questions to use
- Questions can be randomized per candidate

**Example:**
```typescript
// Campaign
{
  id: 'c1',
  departmentId: 'd1',
  questionSetIds: ['q1', 'q2', 'q5']  // Selected 3 questions
}

// When candidate assigned:
// - System picks questions from questionSetIds
// - Can randomize order
// - Can pick subset if campaign.questionsPerCandidate < total
```

---

### **4. Campaign → Candidates**

**Relationship:** One-to-Many
- One campaign has many candidates
- Each candidate belongs to one campaign

**Type Definition:**
```typescript
interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  campaignId: string;  // ← Links to Campaign
  preferredDepartmentId: string;  // ← Links to Department
  assignedQuestions: string[];  // ← Specific questions for this candidate
  // ... other fields
}
```

**Example:**
```typescript
// Candidate
{
  id: 'can1',
  name: 'Sarah Johnson',
  campaignId: 'c1',  // Frontend Developer Hiring
  preferredDepartmentId: 'd1',  // Engineering
  assignedQuestions: ['q1', 'q2', 'q5']  // Questions from campaign
}
```

---

## 🔍 Query Patterns

### **Get all questions for a department:**
```typescript
const deptQuestions = questions.filter(q => q.departmentId === departmentId);
```

### **Get all campaigns for a department:**
```typescript
const deptCampaigns = campaigns.filter(c => c.departmentId === departmentId);
```

### **Get all questions for a campaign:**
```typescript
const campaign = campaigns.find(c => c.id === campaignId);
const campaignQuestions = questions.filter(q => 
  campaign.questionSetIds.includes(q.id)
);
```

### **Get all candidates for a campaign:**
```typescript
const campaignCandidates = candidates.filter(c => c.campaignId === campaignId);
```

### **Get candidate's questions:**
```typescript
const candidate = candidates.find(c => c.id === candidateId);
const candidateQuestions = questions.filter(q =>
  candidate.assignedQuestions.includes(q.id)
);
```

---

## 🎯 Mappings Page Features

### **Access:**
**URL:** http://localhost:3001/admin/mappings

### **Views:**

#### **1. Overview**
- Statistics (total depts, campaigns, questions, candidates)
- Relationship flow diagram
- Department summary table

#### **2. By Department**
- Select a department
- View all questions in that department
- View all campaigns for that department
- See total items

#### **3. By Campaign**
- Select a campaign
- View campaign's department
- View available questions from that department
- View all candidates in the campaign

#### **4. By Question**
- List all questions
- Show which department each belongs to
- Show how many campaigns use each question

---

## 📋 Example Mapping Scenario

### **Setup:**

**1. Create Department:**
```typescript
{
  id: 'd1',
  name: 'Engineering'
}
```

**2. Create Questions for Department:**
```typescript
[
  { id: 'q1', title: 'Binary Search', departmentId: 'd1' },
  { id: 'q2', title: 'React Hooks', departmentId: 'd1' },
  { id: 'q3', title: 'SQL Query', departmentId: 'd1' }
]
```

**3. Create Campaign for Department:**
```typescript
{
  id: 'c1',
  name: 'Frontend Developer Hiring',
  departmentId: 'd1',  // Engineering
  questionSetIds: ['q1', 'q2'],  // Uses 2 out of 3 questions
  questionsPerCandidate: 2,
  isRandomized: false
}
```

**4. Add Candidates to Campaign:**
```typescript
[
  {
    id: 'can1',
    name: 'Sarah Johnson',
    campaignId: 'c1',
    preferredDepartmentId: 'd1',
    assignedQuestions: ['q1', 'q2']  // Gets campaign questions
  },
  {
    id: 'can2',
    name: 'John Smith',
    campaignId: 'c1',
    preferredDepartmentId: 'd1',
    assignedQuestions: ['q1', 'q2']  // Same questions
  }
]
```

---

## 🔐 Business Rules

### **Rule 1: Question Department Constraint**
- Questions can **only** be added to campaigns of the **same department**
- Example: Engineering question cannot be in Marketing campaign

### **Rule 2: Candidate Assignment**
- Candidates receive questions from their campaign's `questionSetIds`
- If `isRandomized = true`, questions can be shuffled per candidate

### **Rule 3: Question Pool**
- Campaign shows all questions from its department
- Admin selects which questions to include in `questionSetIds`

### **Rule 4: Department Preference**
- Candidate's `preferredDepartmentId` should match campaign's `departmentId`
- Used for validation and reporting

---

## 📊 Mapping Statistics

### **Department Level:**
```typescript
{
  department: 'Engineering',
  questionCount: 25,
  campaignCount: 3,
  candidateCount: 45
}
```

### **Campaign Level:**
```typescript
{
  campaign: 'Frontend Developer Hiring',
  department: 'Engineering',
  availableQuestions: 25,  // All dept questions
  selectedQuestions: 8,    // In questionSetIds
  candidateCount: 25
}
```

### **Question Level:**
```typescript
{
  question: 'Binary Search',
  department: 'Engineering',
  usedInCampaigns: 3,  // Number of campaigns using this
  candidatesAnswered: 45  // Total candidates who received it
}
```

---

## 🎨 Visual Representation

### **Flow:**
```
┌─────────────────┐
│   Engineering   │ ← Department
└────────┬────────┘
         │
    ┌────┴─────┬──────────┐
    ↓          ↓          ↓
┌──────┐  ┌──────┐  ┌──────┐
│  Q1  │  │  Q2  │  │  Q3  │ ← Questions
└───┬──┘  └───┬──┘  └───┬──┘
    │         │         │
    └────┬────┴────┬────┘
         ↓         ↓
    ┌──────────────────┐
    │  Campaign: FE    │ ← Campaign
    │  (uses Q1, Q2)   │
    └─────────┬────────┘
              │
       ┌──────┴──────┐
       ↓             ↓
   ┌──────┐      ┌──────┐
   │Sarah │      │ John │ ← Candidates
   └──────┘      └──────┘
```

---

## 🔧 Implementation in Forms

### **Question Form:**
```typescript
// When creating question
<select name="departmentId">
  <option>Engineering</option>
  <option>Marketing</option>
</select>
```

### **Campaign Form:**
```typescript
// Step 1: Select department
<select name="departmentId">
  <option>Engineering</option>
</select>

// Step 2: Select questions from that department
const availableQuestions = questions.filter(
  q => q.departmentId === form.departmentId
);

<MultiSelect
  options={availableQuestions}
  selected={form.questionSetIds}
/>
```

### **Candidate Form:**
```typescript
// Select campaign (determines department and questions)
<select name="campaignId">
  <option>Frontend Developer Hiring (Engineering)</option>
</select>

// Auto-assign department from campaign
preferredDepartmentId = campaign.departmentId;

// Auto-assign questions from campaign
assignedQuestions = campaign.questionSetIds;
```

---

## ✅ Benefits of This Mapping

1. **Organization**: Questions grouped by department
2. **Reusability**: Questions can be used in multiple campaigns
3. **Consistency**: Campaign only uses questions from its department
4. **Flexibility**: Can select subset of questions per campaign
5. **Scalability**: Easy to add new departments, questions, campaigns
6. **Traceability**: Can track which questions are used where

---

## 📍 Where to See Mappings

### **Admin Dashboard:**
```
Sidebar → Mappings
```

### **URLs:**
```
Overview: http://localhost:3001/admin/mappings
By Department: http://localhost:3001/admin/mappings (select dept)
By Campaign: http://localhost:3001/admin/mappings (select campaign)
By Question: http://localhost:3001/admin/mappings (view questions)
```

---

## 🎯 Quick Test

```bash
1. Go to: http://localhost:3001/admin/login
2. Login: admin@demo.com / demo123
3. Click "Mappings" in sidebar
4. See relationship overview ✅
5. Switch views: Department / Campaign / Question
6. See all connections ✅
```

---

**Now you have a complete view of how Questions, Departments, Campaigns, and Candidates are all connected!** 🔗✅

