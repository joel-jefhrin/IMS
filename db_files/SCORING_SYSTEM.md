# 📊 Scoring System Documentation

## ✅ Current System (ACTIVE)

### **Variable Scores per Question**
- Each question can have a **different max score**
- Set per question when creating/editing
- Flexible scoring based on question complexity

### **Campaign-Level Passing Criteria**
- Each campaign sets its own **passing percentage**
- Set when creating/editing campaign
- Flexible per hiring need

---

## 🎯 How It Works

### **1. Question Scoring**

When creating a question:
```typescript
{
  id: 'q1',
  title: 'Binary Search Algorithm',
  maxScore: 100, // ← Variable score
  difficulty: 'intermediate'
}
```

**Examples:**
- Easy question: `maxScore: 50`
- Medium question: `maxScore: 100`
- Hard question: `maxScore: 150`
- Critical question: `maxScore: 200`

---

### **2. Campaign Passing Criteria**

When creating a campaign:
```typescript
{
  id: 'c1',
  name: 'Senior Developer Hiring',
  passingScore: 80, // ← Percentage required to pass
  departmentId: 'd1'
}
```

**Examples:**
- Junior role: `passingScore: 60%`
- Mid-level: `passingScore: 70%`
- Senior role: `passingScore: 80%`
- Principal role: `passingScore: 90%`

---

## 📋 Scoring Calculation

### **Total Score Calculation:**

```typescript
// Campaign has 3 questions
const questions = [
  { id: 'q1', maxScore: 100 }, // Easy
  { id: 'q2', maxScore: 150 }, // Medium
  { id: 'q3', maxScore: 200 }, // Hard
];

// Total possible score
const totalMaxScore = 100 + 150 + 200 = 450;

// Candidate answers
const candidateScores = [
  { questionId: 'q1', score: 95 },  // 95/100
  { questionId: 'q2', score: 120 }, // 120/150
  { questionId: 'q3', score: 160 }, // 160/200
];

// Total achieved
const totalScore = 95 + 120 + 160 = 375;

// Percentage
const percentage = (375 / 450) * 100 = 83.3%;

// Campaign passing score: 80%
// Result: PASSED ✅ (83.3% > 80%)
```

---

## 🎨 UI Fields

### **Question Form:**
```
┌─────────────────────────────┐
│ Create Question             │
├─────────────────────────────┤
│ Title: Binary Search        │
│ Department: Engineering     │
│ Answer Type: Code Editor    │
│ Difficulty: Intermediate    │
│ Skill Type: Technical       │
│                             │
│ Max Score: [100]  ← EDITABLE│
│ Time Limit: [30] min        │
└─────────────────────────────┘
```

### **Campaign Form:**
```
┌─────────────────────────────┐
│ Create Campaign             │
├─────────────────────────────┤
│ Name: Senior Dev Hiring     │
│ Department: Engineering     │
│ [Select Questions Grid]     │
│                             │
│ Duration: [90] min          │
│ Questions/Candidate: [10]   │
│ Passing Score %: [80]  ← SET│
└─────────────────────────────┘
```

---

## ✅ Benefits

### **Variable Scoring:**
- ✅ Reward complex questions with higher scores
- ✅ Weight important topics more heavily
- ✅ Flexible evaluation
- ✅ Fair assessment based on difficulty

### **Campaign-Level Passing:**
- ✅ Different standards per role
- ✅ Junior vs Senior requirements
- ✅ Flexible hiring criteria
- ✅ Easy to adjust per campaign

---

## 📊 Example Scenarios

### **Scenario 1: Mixed Difficulty**
```
Campaign: "Full Stack Developer"
Questions:
  - HTML/CSS Basics (maxScore: 50)
  - JavaScript ES6 (maxScore: 100)
  - React Hooks (maxScore: 150)
  - System Design (maxScore: 200)

Total Possible: 500 points
Passing: 70% = 350 points

Candidate Score: 380 points (76%)
Result: PASSED ✅
```

### **Scenario 2: All Equal Weight**
```
Campaign: "Junior Developer"
Questions:
  - Q1 (maxScore: 100)
  - Q2 (maxScore: 100)
  - Q3 (maxScore: 100)
  - Q4 (maxScore: 100)

Total Possible: 400 points
Passing: 60% = 240 points

Candidate Score: 270 points (67.5%)
Result: PASSED ✅
```

### **Scenario 3: High Bar for Seniors**
```
Campaign: "Senior Architect"
Questions:
  - Architecture Design (maxScore: 300)
  - Scalability (maxScore: 200)
  - Security (maxScore: 200)

Total Possible: 700 points
Passing: 85% = 595 points

Candidate Score: 610 points (87%)
Result: PASSED ✅
```

---

## 🔧 Implementation

### **Types:**
```typescript
interface Question {
  maxScore: number; // Variable score
  // ...
}

interface Campaign {
  passingScore: number; // Percentage (0-100)
  // ...
}
```

### **Forms:**
- Question Form: Input field for `maxScore`
- Campaign Form: Input field for `passingScore`

### **Validation:**
- maxScore: min=1, no max
- passingScore: min=0, max=100

---

## 🎯 Current Status

✅ **ACTIVE SYSTEM:**
- ✅ Variable scores per question
- ✅ Campaign-level passing percentage
- ✅ Forms updated
- ✅ Types updated
- ✅ No linter errors

**Ready to use!** 🚀

---

## 📝 Notes

This is the **CURRENT** active system. Questions have variable `maxScore`, and campaigns have `passingScore` percentage.

For future reference:
- To change to fixed 1-mark system: Update Question.marks = 1
- To move passing to department: Add Department.passingScore

