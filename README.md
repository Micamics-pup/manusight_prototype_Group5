# Manuscript Management System

A comprehensive manuscript submission, review, and publication management system built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Login Credentials

| Role | Email | Purpose |
|------|-------|---------|
| **Editor-in-Chief** | `robert.williams@publisher.com` | Editorial assessment, editor assignment |
| **Editor** | `sarah.johnson@publisher.com` | Reviewer matchmaking, assignment confirmation, timeline management |
| **Reviewer** | `michael.chen@reviewer.org` | Review invitations and submissions |
| **Author** | `jane.smith@university.edu` | Manuscript submissions |
| **TWG Coordinator** | `maria.rodriguez@publisher.com` | Production task assignment and monitoring |
| **TWG Copyeditor** | `sarah.martinez@publisher.com` | Copyediting and plagiarism checking |
| **TWG Layout Artist** | `emma.thompson@publisher.com` | Cover design and book layout |
| **TWG Production Coordinator** | `rachel.foster@publisher.com` | ISBN application and copyright |
| **TWG Print Coordinator** | `james.wilson@publisher.com` | Galley proof and final print |
| **TWG Distribution** | `robert.chen@publisher.com` | Sorting, inventory, and distribution |

**Note:** No password required - just enter the email address.

## 📚 Complete Feature Documentation

**See [WORKFLOWS.md](./WORKFLOWS.md) for:**
- Complete workflow descriptions
- Step-by-step testing guide
- Feature access instructions
- Manuscript status reference
- System design notes

## ✨ Key Features

### For Editor-in-Chief
- ✅ Editorial Assessment with system recommendations
- ✅ Editor Assignment with workload monitoring
- ✅ Manuscript screening and initial review

### For Editors
- ✅ AI-Powered Reviewer Matchmaking
- ✅ Reviewer Assignment Confirmation
- ✅ Review Consolidation & Author Feedback
- ✅ Side-by-side reviewer comparison
- ✅ Conflict detection in reviews
- ✅ Unified feedback preparation
- ✅ Revised Manuscript Evaluation & Re-review Assignment
- ✅ Revision compliance assessment
- ✅ Re-review workflow management
- ✅ Dynamic Timeline Recommendation (10-stage breakdown)
- ✅ Delay factor detection and risk analysis
- ✅ Reviewer performance impact analysis
- ✅ Timeline adjustment and optimization
- ✅ Editorial Recommendation & Final Publication Decision
- ✅ Publication readiness evaluation (5 criteria)
- ✅ Compliance validation (ethical, citation, formatting)
- ✅ Decision justification and strengths/weaknesses analysis
- ✅ Publication timeline estimation
- ✅ Manuscript Endorsement to TWG
- ✅ Technical readiness assessment (5 categories)
- ✅ TWG member assignment with expertise matching
- ✅ Endorsement decision workflow (6 decision options)
- ✅ TWG evaluation instructions and focus areas
- ✅ Auto-save draft functionality

### For Reviewers
- ✅ Invitation response (Accept/Decline/Clarification)
- ✅ Review Evaluation & Feedback Submission
- ✅ Comprehensive evaluation form with 4 assessment categories
- ✅ Timeline monitoring with deadline countdown
- ✅ Annotated file upload (PDF/DOCX/ZIP)
- ✅ Comments to author and confidential comments to editor
- ✅ Ethical confirmation and validation
- ✅ Auto-save draft functionality
- ✅ Review workspace
- ✅ Manuscript access and evaluation

### For Authors
- ✅ Manuscript submission
- ✅ Upload revised manuscript with reviewer response
- ✅ Revision tracking and deadline monitoring
- ✅ Status tracking
- ✅ Dashboard with metrics

### For TWG Coordinator
- ✅ Production Task Assignment
- ✅ TWG member workload monitoring
- ✅ Task deadline management
- ✅ Production timeline tracking
- ✅ Role-based task assignment (Copyeditor, TWG, Production Coordinator, Print Coordinator, Distribution)
- ✅ Batch notification system
- ✅ Assignment confirmation workflow

### For TWG Members
- ✅ Personal task dashboard
- ✅ Assigned task overview
- ✅ Task status tracking
- ✅ Deadline monitoring
- ✅ Priority indicators
- ✅ Role-specific workload view

### For TWG Copyeditor (Enhanced Dashboard)
- ✅ Comprehensive manuscript list table
- ✅ Summary statistics (Total, In Progress, Submitted, Overdue)
- ✅ Copyediting progress tracking with progress bars
- ✅ Plagiarism check status monitoring
- ✅ File submission status tracking
- ✅ Priority and deadline alerts panel
- ✅ Recent activity timeline
- ✅ Search and filter functionality (by status, category, deadline)
- ✅ Sort options (deadline, date assigned, progress)
- ✅ Days remaining countdown with color-coded alerts
- ✅ Quick stats (avg. completion time, success rate)

## 🎨 Design System

- **Assessment Pages:** Editorial academic aesthetic (cream/navy, serif fonts)
- **Dashboards:** Modern gradient UI with glassmorphism
- **Icons:** Lucide React
- **Styling:** Tailwind CSS v4

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboards/          # Role-specific dashboards
│   │   ├── auth/                # Authentication pages
│   │   ├── EditorialAssessmentPage.tsx
│   │   ├── EditorAssignmentPage.tsx
│   │   ├── ReviewerMatchmakingPage.tsx
│   │   ├── ReviewerResponsePage.tsx
│   │   ├── ReviewerAssignmentPage.tsx
│   │   ├── TimelineRecommendationPage.tsx
│   │   ├── ReviewConsolidationPage.tsx
│   │   ├── RevisedManuscriptEvaluationPage.tsx
│   │   ├── EditorialRecommendationPage.tsx
│   │   └── TWGEndorsementPage.tsx
│   ├── context/                 # React Context (Auth, Data)
│   ├── data/
│   │   └── mockData.ts          # Mock data with workflow states
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── App.tsx                  # Main application component
└── styles/                       # CSS and theme files
```

## 🔄 Complete Workflow

```
Manuscript Submission
       ↓
Editorial Assessment (Editor-in-Chief)
       ↓
Editor Assignment (Editor-in-Chief)
       ↓
Reviewer Matchmaking (Editor)
       ↓
Reviewer Invitation Sent
       ↓
Reviewer Response (Reviewer)
       ↓
Reviewer Assignment Confirmation (Editor)
       ↓
Dynamic Timeline Recommendation (Editor)
       ↓
Review Stage Activated
       ↓
Review Evaluation & Feedback Submission (Reviewer)
       ↓
Review Consolidation & Author Feedback (Editor)
       ↓
Upload Revised Manuscript (Author)
       ↓
Revised Manuscript Evaluation (Editor)
       ↓
[Conditional: Re-review Assignment (Editor) → Re-review (Reviewer)]
       ↓
Editorial Recommendation & Final Publication Decision (Editor)
       ↓
Copyediting & Production Preparation
       ↓
Manuscript Endorsement to TWG (Editor)
       ↓
[Future: TWG Validation → Publication]
```

## 🧪 Testing All Features

1. **Login as Editor-in-Chief** (`robert.williams@publisher.com`) → Assess ms-002 → Assign Editor
2. **Login as Editor** (`sarah.johnson@publisher.com`) → Open ms-003 → Assign Reviewers
3. **Login as Reviewer** (`emily.brown@reviewer.org`) → View ms-001 invitation → Accept
4. **Login as Editor** → Confirm ms-001 reviewers → View Timeline
5. **Explore Timeline Page** → View 10 stages → Check delay factors
6. **Login as Reviewer** (`emily.brown@reviewer.org`) → Submit review on ms-004 → Complete evaluation
7. **Login as Editor** → Consolidate reviews on ms-001 → Send to author
8. **Login as Author** (`jane.smith@university.edu`) → Click "Submit Revision" on ms-001 → Upload revised files → Submit
9. **Login as Editor** → Evaluate revised ms-001 → Assess compliance → Decide on re-review or acceptance
10. **Login as Editor** → Click "Make Recommendation" on ms-006 → Complete editorial recommendation → Make final decision
11. **Login as Editor** → Click "Endorse to TWG" on ms-005 → Select TWG members → Provide instructions → Submit endorsement
12. **Login as TWG Coordinator** (`maria.rodriguez@publisher.com`) → Click "Assign Tasks" on ms-005 → Assign TWG members to tasks → Set deadlines → Notify all

See [WORKFLOWS.md](./WORKFLOWS.md) for detailed testing instructions.

## ⚙️ Technical Stack

- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **State Management:** React Context API
- **Build Tool:** Vite
- **Package Manager:** pnpm

## 📊 Manuscript Status States

| Status | Description | Accessible By |
|--------|-------------|---------------|
| `pending` | Awaiting initial assessment | Editor-in-Chief |
| `review` | Under peer review | Editor, Reviewers |
| `copyediting` | In copyediting stage | Editor, Copyeditor |
| `production` | Ready for publication | All |
| `rejected` | Manuscript rejected | Author, Editor-in-Chief |

## 🎯 Current Test Data

- **ms-001:** Review stage with assigned reviewers (for Reviewer Response/Assignment/Consolidation/Timeline/Revision Upload/Revision Evaluation)
  - Dr. Michael Chen: completed with "minor_revision" decision (triggers revision request)
  - Dr. Emily Brown: pending (invitation not yet responded)
  - Author: Dr. Jane Smith - can submit revised manuscript
  - Editor: Dr. Sarah Johnson - can evaluate revised manuscript and assign for re-review
- **ms-002:** Pending assessment (for Editorial Assessment)
- **ms-003:** Review stage without reviewers (for Reviewer Matchmaking)
- **ms-004:** Review stage with in-progress review (for Review Evaluation)
  - Dr. Michael Chen: completed
  - Dr. Emily Brown: in_progress (ready for review submission)
- **ms-005:** Production stage (for TWG Endorsement)
  - Dr. Michael Chen: completed with "accept" decision
  - Ready for technical working group validation
- **ms-006:** Copyediting stage (for Editorial Recommendation & Final Publication Decision)
  - Dr. Michael Chen: completed with "accept" decision
  - Dr. Emily Brown: completed with "accept_with_minor_changes" decision

## 🔒 Data Integrity

**⚠️ IMPORTANT:** Mock data is configured to maintain all workflow states. Do not modify manuscript statuses in `src/app/data/mockData.ts` without ensuring all features remain accessible.

See the comprehensive documentation in `mockData.ts` for data structure details.

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 📝 Notes

- All features are fully functional with mock data
- No backend required - uses in-memory state management
- Designed for easy extension with real API integration
- Responsive design for desktop and tablet
- Accessibility considerations built-in

---

**For complete workflow documentation, testing guides, and feature descriptions, see [WORKFLOWS.md](./WORKFLOWS.md)**
