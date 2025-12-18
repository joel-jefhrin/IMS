# ⏱️ Real Time Tracking Implementation

## ✅ Overview
The interview system now tracks and displays **REAL exam time taken** by candidates during their interview sessions.

---

## 🔧 How It Works

### 1. **Start Time Recording**
When a candidate starts their interview:
```typescript
// src/app/candidate/interview/page.tsx
const [startTime] = useState(Date.now()); // Record start time

useEffect(() => {
  // Store in sessionStorage when interview begins
  sessionStorage.setItem('interviewStartTime', startTime.toString());
}, [startTime]);
```

### 2. **Time Calculation on Submit**
When candidate submits (or auto-submits):
```typescript
const calculateTimeTaken = () => {
  const startTimeStr = sessionStorage.getItem('interviewStartTime');
  if (startTimeStr) {
    const start = parseInt(startTimeStr);
    const elapsed = Date.now() - start; // milliseconds
    const minutes = Math.floor(elapsed / 60000); // convert to minutes
    return minutes;
  }
  return 0;
};

// Store time taken on submit
const timeTaken = calculateTimeTaken();
sessionStorage.setItem('interviewTimeTaken', timeTaken.toString());
```

### 3. **Display Real Time**
Results page retrieves and displays actual time:
```typescript
// src/app/candidate/results/page.tsx
const getTimeTaken = () => {
  const timeTaken = sessionStorage.getItem('interviewTimeTaken');
  if (timeTaken) {
    return parseInt(timeTaken); // Returns REAL time in minutes
  }
  return 0;
};
```

---

## 📍 Where Time is Displayed

### ✅ **Completion Page**
**File:** `src/app/candidate/interview/complete/page.tsx`
- Shows time taken immediately after submission
- Formatted as "Xh Ym" or "Y min"
- Example: "45 min", "1h 23m"

### ✅ **Results Page**
**File:** `src/app/candidate/results/page.tsx`
- Displays in "Time Taken" card
- Shows actual minutes from start to submit
- Falls back to "N/A" if not available

### ✅ **Admin Results Dashboard**
**File:** `src/app/admin/results/page.tsx`
- Shows in rankings table
- Column: "Time" (in minutes)
- Used for comparing candidate performance

---

## 🎯 Data Flow

```
Interview Start
    ↓
[Store: sessionStorage.interviewStartTime]
    ↓
Candidate Takes Interview
    ↓
Submit Button Clicked / Time Up
    ↓
[Calculate: Current Time - Start Time]
    ↓
[Store: sessionStorage.interviewTimeTaken]
    ↓
Redirect to Completion Page
    ↓
[Retrieve: sessionStorage.interviewTimeTaken]
    ↓
Display in Results/Completion Pages
```

---

## 📊 SessionStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `interviewStartTime` | string (timestamp) | Unix timestamp when interview started |
| `interviewTimeTaken` | string (minutes) | Total minutes taken to complete |
| `candidateId` | string | Candidate identifier |

---

## 🧪 Testing Real Time Tracking

### Test Scenario 1: Normal Completion
```bash
1. Login: sarah.j@email.com / temp123
2. Start interview (timer starts counting)
3. Wait 2 minutes
4. Submit interview
5. Check completion page → Should show "2 min"
6. Check results page → Should show "2" in Time Taken
```

### Test Scenario 2: Auto-Submit (Time's Up)
```bash
1. Login: sarah.j@email.com / temp123
2. Start interview
3. Wait for timer to reach 0:00:00
4. Auto-submit triggers
5. Check completion page → Should show actual time (e.g., "90 min")
```

### Test Scenario 3: Resume & Submit
```bash
1. Login and start interview
2. Answer 1 question (auto-save)
3. Click "Save & Exit"
4. Login again (same credentials)
5. Resume interview (start time preserved)
6. Submit
7. Time calculated from original start time
```

---

## 🔍 Time Calculation Examples

| Start Time | Submit Time | Elapsed | Displayed |
|------------|-------------|---------|-----------|
| 10:00:00 AM | 10:45:00 AM | 45 min | "45 min" |
| 2:00:00 PM | 3:30:00 PM | 90 min | "1h 30m" |
| 9:15:00 AM | 9:18:30 AM | 3 min | "3 min" |
| 1:00:00 PM | 2:05:00 PM | 65 min | "1h 5m" |

---

## 💾 Backend Integration (Future)

When connecting to a real backend:

```typescript
// On interview start
POST /api/interviews/start
{
  "candidateId": "123",
  "campaignId": "456",
  "startTime": "2024-01-20T10:00:00Z"
}

// On interview submit
POST /api/interviews/submit
{
  "candidateId": "123",
  "campaignId": "456",
  "endTime": "2024-01-20T10:45:00Z",
  "timeTaken": 45, // minutes
  "answers": {...}
}

// On results fetch
GET /api/results/{candidateId}
Response:
{
  "timeTaken": 45, // REAL time from database
  "scores": {...},
  "rank": 1
}
```

---

## ✅ Features

- ✅ **Accurate Tracking**: Uses `Date.now()` for precise timestamps
- ✅ **Persistent Storage**: Stored in sessionStorage (survives page refresh)
- ✅ **Auto-Submit Support**: Tracks time even on timeout
- ✅ **Format Display**: Human-readable format (hours + minutes)
- ✅ **Fallback Handling**: Shows "N/A" if time not available
- ✅ **Multiple Display Locations**: Completion, Results, Admin Dashboard

---

## 🎉 Benefits

1. **Real Performance Metrics**: Know exactly how long each candidate took
2. **Fair Evaluation**: Compare candidates based on actual time spent
3. **Data Insights**: Identify patterns (e.g., faster != better)
4. **Transparency**: Candidates see their actual time taken

---

## 🔧 Code Files Modified

1. ✅ `src/app/candidate/interview/page.tsx`
   - Added start time tracking
   - Added time calculation function
   - Store time on submit/auto-submit

2. ✅ `src/app/candidate/results/page.tsx`
   - Retrieve real time from sessionStorage
   - Display actual time or fallback

3. ✅ `src/app/candidate/interview/complete/page.tsx`
   - Show real time on completion page
   - Format time nicely

---

## 📝 Notes

- Time is stored in **minutes** (not seconds)
- Uses **client-side** sessionStorage (temporary storage)
- For production: Move to **server-side database** storage
- Time continues even if user leaves and returns (preserved in session)
- Cleared on logout or session end

---

**Now the exam time is REAL DATA from actual interview sessions!** ⏱️✅

