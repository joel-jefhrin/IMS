# 🎯 Quick Reference - Current Scoring System

## ⚡ TL;DR

```
✅ Questions: 10 points each (fixed)
✅ Campaign Duration: Manual (e.g., 60 min)
✅ Passing Score: Percentage (e.g., 70%)
✅ No per-question time limits
```

---

## 📊 Current System At A Glance

### **Question Scoring:**
```
Every question = 10 points (cannot change)
```

### **Campaign Setup:**
```
1. Select department
2. Pick questions (e.g., 10 questions = 100 points)
3. Set duration manually (e.g., 60 minutes)
4. Set pass % (e.g., 70% = need 70/100 points)
```

### **Candidate Assessment:**
```
Questions answered: 8/10
Correct: 7
Score: 7 × 10 = 70 points
Pass threshold: 100 × 70% = 70 points
Result: ✅ PASS (70 ≥ 70)
```

---

## 🎯 Quick Examples

### **Example 1: Junior Dev**
```
Questions: 5 (= 50 points)
Duration: 30 minutes
Pass %: 60%
Need: 30 points to pass
```

### **Example 2: Mid-Level**
```
Questions: 10 (= 100 points)
Duration: 60 minutes
Pass %: 70%
Need: 70 points to pass
```

### **Example 3: Senior**
```
Questions: 15 (= 150 points)
Duration: 90 minutes
Pass %: 80%
Need: 120 points to pass
```

---

## 🔧 How To Use

### **Creating Questions:**
1. Questions → Create Question
2. Fill in details (title, description, type, etc.)
3. See "10 points (Fixed)" - automatic
4. Save

### **Creating Campaigns:**
1. Campaigns → Create Campaign
2. Select department
3. Pick questions (shows: "5 selected • 50 points total")
4. **Set duration manually** (e.g., 60)
5. **Set pass %** (e.g., 70)
6. Save

---

## 📈 Calculations

### **Total Points:**
```typescript
totalPoints = numberOfQuestions × 10
```

### **Points Needed to Pass:**
```typescript
pointsToPass = totalPoints × (passingScore / 100)
```

### **Example:**
```
10 questions × 10 = 100 points
Pass %: 70%
Need: 100 × 0.70 = 70 points
```

---

## ✅ What's Fixed vs What's Flexible

### **Fixed:**
- ✅ Question points: Always 10
- ✅ Calculation: Count × 10

### **Flexible:**
- ✏️ Campaign duration: Set manually
- ✏️ Passing percentage: 0-100%
- ✏️ Number of questions: Any amount

---

## 🎨 UI Indicators

### **Question Form:**
```
Points: [10 points (Fixed per question)]
       ↑ Gray background = non-editable
```

### **Campaign Form:**
```
Duration (min): [___] ← White = editable
Passing Score (%): [___] ← White = editable

Select Questions (5 selected • 50 points total)
                              ↑ Auto-calculated
```

---

## 📝 Key Changes from Previous System

### **Before:**
- ❌ Variable scores per question (25, 50, 100, etc.)
- ❌ Auto-calculated campaign duration
- ❌ Per-question time limits

### **Now:**
- ✅ Fixed 10 points per question
- ✅ Manual campaign duration
- ✅ No per-question times

---

## 🧪 Quick Test

### **Test Flow:**
```
1. Create Question
   ✓ See "10 points (Fixed)"
   ✓ No time limit field

2. Create Campaign
   ✓ Select 5 questions
   ✓ See "(5 selected • 50 points total)"
   ✓ Enter duration: 45 min
   ✓ Enter pass %: 70
   ✓ Save

3. Verify
   ✓ Campaign shows: 45 min, 70%, 50 total points
```

---

## 💡 Pro Tips

### **Setting Duration:**
- Consider: Question count + complexity + reading time
- Example: 10 questions = 5-6 min per question
- Add buffer for reviewing answers

### **Setting Pass %:**
- Entry-level: 60-65%
- Mid-level: 70-75%
- Senior: 80-85%

### **Question Count:**
- Short screening: 5 questions (30 min)
- Standard interview: 10 questions (60 min)
- Comprehensive: 15-20 questions (90-120 min)

---

## 🔍 Where to Find Info

### **In Code:**
- Types: `src/types/index.ts`
- Question form: `src/components/admin/QuestionForm.tsx`
- Campaign form: `src/components/admin/CampaignForm.tsx`

### **Documentation:**
- Full details: `SIMPLIFIED_SCORING.md`
- This reference: `QUICK_REFERENCE.md`

---

## ✅ Status: LIVE

All changes implemented and ready to use! 🚀

**URL:** http://localhost:3000
**Admin Login:** `/admin/login`
**Server Status:** ✅ Running

---

Need more details? See `SIMPLIFIED_SCORING.md` for comprehensive documentation.

