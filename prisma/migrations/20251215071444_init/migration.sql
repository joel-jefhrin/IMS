-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "answerType" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "skillType" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "marks" INTEGER NOT NULL DEFAULT 10,
    "options" TEXT,
    "correctAnswer" TEXT,
    "codeTemplate" TEXT,
    "rubric" TEXT,
    "fileTypes" TEXT,
    "ratingScale" INTEGER,
    "solutionTemplate" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Question_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "durationPerCandidate" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "questionSetIds" TEXT NOT NULL,
    "questionsPerCandidate" INTEGER NOT NULL,
    "isRandomized" BOOLEAN NOT NULL DEFAULT true,
    "passingScore" INTEGER NOT NULL,
    "passingCriteria" TEXT,
    "totalCandidates" INTEGER NOT NULL DEFAULT 0,
    "completedCandidates" INTEGER NOT NULL DEFAULT 0,
    "averageScore" REAL NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Campaign_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "education" TEXT NOT NULL,
    "preferredDepartmentId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "assignedQuestions" TEXT,
    "answers" TEXT,
    "score" REAL NOT NULL DEFAULT 0,
    "tempPassword" TEXT NOT NULL,
    "interviewStartedAt" TEXT,
    "interviewCompletedAt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Candidate_preferredDepartmentId_fkey" FOREIGN KEY ("preferredDepartmentId") REFERENCES "Department" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Candidate_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Question_departmentId_idx" ON "Question"("departmentId");

-- CreateIndex
CREATE INDEX "Campaign_departmentId_idx" ON "Campaign"("departmentId");

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");

-- CreateIndex
CREATE INDEX "Candidate_preferredDepartmentId_idx" ON "Candidate"("preferredDepartmentId");

-- CreateIndex
CREATE INDEX "Candidate_campaignId_idx" ON "Candidate"("campaignId");

-- CreateIndex
CREATE INDEX "Candidate_status_idx" ON "Candidate"("status");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
