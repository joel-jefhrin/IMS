# 🔗 Entity Relationship Diagram

## Complete System Mapping

```
┌─────────────────────────────────────────────────────────────────────┐
│                      INTERVIEW MANAGEMENT SYSTEM                     │
│                         Data Flow & Relationships                    │
└─────────────────────────────────────────────────────────────────────┘


        ┌────────────────────────────┐
        │      🏢 DEPARTMENT         │
        │                            │
        │  - id                      │
        │  - name                    │
        │  - evaluationCriteria      │
        └──────────┬─────────────────┘
                   │
                   │ 1:N (One Department has Many Questions)
                   │
        ┌──────────▼─────────────────┐
        │    📄 QUESTIONS             │
        │                             │
        │  - id                       │
        │  - title                    │
        │  - departmentId ────────────┼─────► Links to Department
        │  - answerType               │
        │  - difficulty               │
        │  - skillType                │
        │  - tags                     │
        └──────────┬──────────────────┘
                   │
                   │ M:N (Questions used in Multiple Campaigns)
                   │
        ┌──────────▼──────────────────┐
        │    📋 CAMPAIGN               │
        │                              │
        │  - id                        │
        │  - name                      │
        │  - departmentId ─────────────┼─────► Links to Department
        │  - questionSetIds ───────────┼─────► Links to Questions[]
        │  - startDate                 │
        │  - endDate                   │
        │  - passingScore              │
        └──────────┬───────────────────┘
                   │
                   │ 1:N (One Campaign has Many Candidates)
                   │
        ┌──────────▼───────────────────┐
        │    👤 CANDIDATES              │
        │                               │
        │  - id                         │
        │  - name                       │
        │  - email                      │
        │  - campaignId ────────────────┼─────► Links to Campaign
        │  - preferredDepartmentId ─────┼─────► Links to Department
        │  - assignedQuestions ─────────┼─────► Links to Questions[]
        │  - answers                    │
        │  - score                      │
        │  - rank                       │
        └───────────────────────────────┘


═══════════════════════════════════════════════════════════════════════

                    DETAILED RELATIONSHIP MAPPING

═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│                    DEPARTMENT → QUESTIONS                            │
└─────────────────────────────────────────────────────────────────────┘

    Department: "Engineering" (d1)
            │
            ├──► Question 1: "Binary Search Algorithm" (q1)
            ├──► Question 2: "React Hooks Explanation" (q2)
            ├──► Question 3: "SQL Query Optimization" (q3)
            ├──► Question 4: "System Design" (q4)
            └──► Question 5: "Data Structures" (q5)

    Department: "Product Design" (d2)
            │
            ├──► Question 6: "UI/UX Principles" (q6)
            ├──► Question 7: "Figma Prototyping" (q7)
            └──► Question 8: "Design Thinking" (q8)


┌─────────────────────────────────────────────────────────────────────┐
│                    DEPARTMENT → CAMPAIGNS                            │
└─────────────────────────────────────────────────────────────────────┘

    Department: "Engineering" (d1)
            │
            ├──► Campaign 1: "Frontend Developer Hiring" (c1)
            │         questionSetIds: [q1, q2, q3]
            │
            └──► Campaign 2: "Backend Engineer Role" (c2)
                  questionSetIds: [q3, q4, q5]

    Department: "Product Design" (d2)
            │
            └──► Campaign 3: "Product Designer" (c3)
                  questionSetIds: [q6, q7, q8]


┌─────────────────────────────────────────────────────────────────────┐
│                    CAMPAIGN → CANDIDATES                             │
└─────────────────────────────────────────────────────────────────────┘

    Campaign: "Frontend Developer Hiring" (c1)
    Department: Engineering
    Question Pool: [q1, q2, q3]
            │
            ├──► Candidate 1: "Sarah Johnson"
            │         assignedQuestions: [q1, q2, q3]
            │         status: completed
            │
            ├──► Candidate 2: "John Smith"
            │         assignedQuestions: [q1, q2, q3]
            │         status: in_progress
            │
            └──► Candidate 3: "Mike Brown"
                  assignedQuestions: [q1, q2, q3]
                  status: invited


═══════════════════════════════════════════════════════════════════════

                    DATA FLOW: CREATE TO COMPLETE

═══════════════════════════════════════════════════════════════════════

STEP 1: Admin Creates Department
────────────────────────────────
┌────────────────┐
│ Engineering    │
│ ID: d1         │
└────────────────┘


STEP 2: Admin Adds Questions to Department
───────────────────────────────────────────
┌────────────────┐
│ Engineering    │
│ ID: d1         │
└───────┬────────┘
        │
        ├─► Question: "Binary Search" (q1, dept: d1)
        ├─► Question: "React Hooks" (q2, dept: d1)
        └─► Question: "SQL Query" (q3, dept: d1)


STEP 3: Admin Creates Campaign
───────────────────────────────
┌───────────────────────────┐
│ Campaign: "Frontend Dev"  │
│ ID: c1                    │
│ Department: d1            │
│ Questions: [q1, q2, q3]   │
└───────────────────────────┘


STEP 4: Admin Adds Candidates to Campaign
──────────────────────────────────────────
┌───────────────────────────┐
│ Campaign: "Frontend Dev"  │
└──────────┬────────────────┘
           │
           ├─► Candidate: Sarah (campaignId: c1, questions: [q1, q2, q3])
           └─► Candidate: John (campaignId: c1, questions: [q1, q2, q3])


STEP 5: Candidates Take Interview
──────────────────────────────────
Sarah logs in → Gets questions [q1, q2, q3] → Answers → Submit


STEP 6: Results Generated
──────────────────────────
Sarah's Results:
  - Questions answered: 3
  - Score: 92.8%
  - Rank: #1
  - Campaign: Frontend Dev
  - Department: Engineering


═══════════════════════════════════════════════════════════════════════

                    MAPPING CONSTRAINTS & RULES

═══════════════════════════════════════════════════════════════════════

✅ CONSTRAINT 1: Department-Question Binding
   - Each Question MUST belong to exactly ONE department
   - Question.departmentId is required

✅ CONSTRAINT 2: Campaign-Department Binding
   - Each Campaign MUST belong to exactly ONE department
   - Campaign.departmentId is required

✅ CONSTRAINT 3: Campaign-Question Constraint
   - Campaign can ONLY use questions from its own department
   - Campaign.questionSetIds contains Question IDs where:
     Question.departmentId === Campaign.departmentId

✅ CONSTRAINT 4: Candidate-Campaign Binding
   - Each Candidate MUST belong to exactly ONE campaign
   - Candidate.campaignId is required

✅ CONSTRAINT 5: Candidate Question Assignment
   - Candidate.assignedQuestions is subset of Campaign.questionSetIds
   - System auto-assigns from campaign's question pool

✅ CONSTRAINT 6: Department Preference
   - Candidate.preferredDepartmentId should match Campaign.departmentId
   - Used for validation & reporting


═══════════════════════════════════════════════════════════════════════

                    EXAMPLE: COMPLETE MAPPING

═══════════════════════════════════════════════════════════════════════

Department: Engineering (d1)
    │
    ├─ Questions:
    │   ├─ Q1: Binary Search (q1) ─────────┐
    │   ├─ Q2: React Hooks (q2) ───────────┤
    │   ├─ Q3: SQL Query (q3) ─────────────┤
    │   ├─ Q4: System Design (q4) ─────────┤
    │   └─ Q5: Data Structures (q5) ───────┤
    │                                       │
    └─ Campaigns:                           │
        ├─ Campaign 1: Frontend Dev (c1)    │
        │   │  questionSetIds: [q1, q2, q3] ◄┘
        │   │
        │   ├─ Candidates:
        │   │   ├─ Sarah Johnson (can1)
        │   │   │   assignedQuestions: [q1, q2, q3]
        │   │   │   status: completed
        │   │   │   score: 92.8%
        │   │   │
        │   │   └─ John Smith (can2)
        │   │       assignedQuestions: [q1, q2, q3]
        │   │       status: in_progress
        │   │       score: -
        │   │
        │   └─ Stats:
        │       Total Candidates: 2
        │       Completed: 1
        │       Avg Score: 92.8%
        │
        └─ Campaign 2: Backend Engineer (c2)
            │  questionSetIds: [q3, q4, q5]
            │
            └─ Candidates:
                └─ Mike Brown (can3)
                    assignedQuestions: [q3, q4, q5]
                    status: invited


═══════════════════════════════════════════════════════════════════════

                    MAPPING PAGE VIEWS

═══════════════════════════════════════════════════════════════════════

VIEW 1: OVERVIEW
────────────────
Shows:
  - Total departments, campaigns, questions, candidates
  - Relationship flow diagram
  - Department summary table


VIEW 2: BY DEPARTMENT
─────────────────────
Select: "Engineering"
Shows:
  - All questions in Engineering (25 questions)
  - All campaigns for Engineering (3 campaigns)
  - Total candidates (45)


VIEW 3: BY CAMPAIGN
───────────────────
Select: "Frontend Developer Hiring"
Shows:
  - Campaign department (Engineering)
  - Available question pool (all Engineering questions)
  - Selected questions for this campaign (8 questions)
  - Candidates in this campaign (25 candidates)


VIEW 4: BY QUESTION
───────────────────
Shows:
  - All questions
  - Which department each belongs to
  - How many campaigns use each question
  - Total candidates who answered


═══════════════════════════════════════════════════════════════════════

                    KEY METRICS

═══════════════════════════════════════════════════════════════════════

Per Department:
  📊 Question Count: Number of questions in this department
  📊 Campaign Count: Number of active campaigns
  📊 Candidate Count: Total candidates across all campaigns

Per Campaign:
  📊 Question Pool: Total questions available from department
  📊 Selected Questions: Questions actually used (questionSetIds)
  📊 Candidate Count: Number of candidates assigned
  📊 Completion Rate: % of candidates who completed

Per Question:
  📊 Department: Which department owns this question
  📊 Usage Count: How many campaigns use this question
  📊 Answer Count: How many candidates answered this


═══════════════════════════════════════════════════════════════════════

** This diagram shows the complete relationship mapping in the system! **


