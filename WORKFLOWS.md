# Manuscript Management System - Complete Workflow Guide

This document describes all implemented features and how to access them.

---

## USER ROLES & CREDENTIALS

### Editor-in-Chief
**Email:** `robert.williams@publisher.com`  
**Responsibilities:** Initial assessment, editor assignment

### Editor
**Email:** `sarah.johnson@publisher.com`  
**Responsibilities:** Reviewer matchmaking, reviewer assignment confirmation, timeline management

### Reviewers
**Email:** `michael.chen@reviewer.org` OR `emily.brown@reviewer.org`  
**Responsibilities:** Accept/decline invitations, submit reviews

### Authors
**Email:** `jane.smith@university.edu` OR `john.doe@university.edu`  
**Responsibilities:** Submit manuscripts, respond to revisions

---

## COMPLETE WORKFLOW STAGES

### 1. EDITORIAL ASSESSMENT (Editor-in-Chief)

**Purpose:** Initial screening and assessment of submitted manuscripts

**Access:**
1. Login as Editor-in-Chief: `robert.williams@publisher.com`
2. View manuscripts with status "Awaiting Assessment"
3. Click **"Assess"** button

**Test Manuscript:**
- **ID:** ms-002
- **Title:** "Quantum Computing and Cryptography"
- **Status:** pending

**Features:**
- Manuscript information display
- Author information
- Uploaded files list
- System assessment metrics
- Assessment form with dropdowns:
  - Scope relevance
  - Completeness
  - Writing quality
  - Ethical compliance
  - Plagiarism status
- Three decision outcomes:
  - Accept (proceed to editor assignment)
  - Request Revision
  - Reject
- Success screen with "Assign Editor" button

**Flow:** Assessment → Editor Assignment

---

### 2. EDITOR ASSIGNMENT (Editor-in-Chief)

**Purpose:** Assign an editor to handle the manuscript's review process

**Access:**
1. Complete Editorial Assessment with "Accept" decision
2. Click **"Assign Editor"** button on success screen

**Features:**
- Manuscript info & assessment summary
- Available editors list with:
  - Current workload
  - Availability status
  - Average review time
- Assignment form:
  - Priority level
  - Deadline
  - Assignment notes
- Success confirmation with system outputs

**Flow:** Editor Assignment → (Manuscript moves to Editor Dashboard)

---

### 3. REVIEWER MATCHMAKING (Editor)

**Purpose:** Select and invite reviewers with AI-powered recommendations

**Access:**
1. Login as Editor: `sarah.johnson@publisher.com`
2. View manuscripts with no assigned reviewers
3. Click **"Assign Reviewers"** button

**Test Manuscript:**
- **ID:** ms-003
- **Title:** "Neuroplasticity in Adult Learning"
- **Status:** review (no assigned reviewers)

**Features:**
- Search and filter reviewer pool
- Reviewer cards showing:
  - Name, specialization, expertise tags
  - Current workload (progress bar)
  - Average review duration
  - On-time rate percentage
  - Quality score (star rating)
  - Completed reviews count
- AI recommendations panel:
  - Suggested reviewer count
  - Estimated review duration
  - Reviewer delay risk (Low/Medium/High)
  - Workload warnings
- Assignment form:
  - Review priority
  - Deadline
  - Review type (single/double-blind/open)
  - Reviewer instructions
- Success screen with system outputs

**Flow:** Reviewer Selection → Invitation Sent → (Reviewers see pending invitations)

---

### 4. REVIEWER RESPONSE (Reviewer)

**Purpose:** Reviewers accept, decline, or request clarification on review invitations

**Access:**
1. Login as Reviewer: `emily.brown@reviewer.org`
2. View "Pending Invitations" section
3. Click **"View Invitation"** button

**Test Manuscript:**
- **ID:** ms-001
- **Title:** "Machine Learning Applications in Climate Science"
- **Status:** review (assigned reviewers: Dr. Michael Chen [completed], Dr. Emily Brown [pending])

**Features:**
- Three main sections:
  - Invitation Info (deadline, review type, priority)
  - Manuscript Summary (title, abstract, category)
  - Assignment Details (instructions, timeline)
- Three decision options (visual cards):
  - **Accept Review Assignment**
    - Availability confirmation dropdown
    - Optional extension request (date picker)
  - **Decline Review Assignment**
    - Reason for declining (dropdown)
  - **Request Clarification**
    - Clarification message (text area)
- Reviewer message text area
- Success screens for all three decision types

**Flow:** Accept Invitation → (Editor sees accepted reviewers)

---

### 5. REVIEW EVALUATION & FEEDBACK SUBMISSION (Reviewer)

**Purpose:** Complete comprehensive review evaluation and submit formal feedback

**Access:**
1. Login as Reviewer: `michael.chen@reviewer.org`
2. View manuscripts with status "In Progress"
3. Click **"Submit Review"** button (green button)

**Test Manuscript:**
- **ID:** ms-004
- **Title:** "Sustainable Urban Architecture"
- **Review Status:** in_progress (Dr. Emily Brown)

**Features:**
- **Header Section:**
  - Page title with breadcrumb navigation
  - Status badge: "Under Review"
  - Deadline countdown timer (urgent warnings if < 3 days)
- **Manuscript Information Panel:**
  - Read-only manuscript details (ID, title, category, type)
  - Keywords display with chips
  - Expandable abstract section
  - Assigned deadline and submission date
- **Manuscript File Viewer:**
  - File list with preview/download buttons
  - Supplementary materials access
- **Timeline Monitoring Panel:**
  - Review deadline card
  - Remaining days counter
  - Timeline status (On Schedule/Approaching/Urgent/Overdue)
  - Progress bar visualization
  - Deadline warning alerts
- **Review Evaluation Section** (4 required dropdowns):
  1. **Overall Recommendation:** Accept / Minor Revision / Major Revision / Reject
  2. **Manuscript Quality:** Excellent / Good / Fair / Poor
  3. **Originality Assessment:** Highly Original / Moderately Original / Limited Originality / Similarity Concern
  4. **Methodology Evaluation:** Strong / Acceptable / Needs Improvement / Weak
- **Reviewer Comments Section:**
  - **Comments to Author** (required) - shared with author
  - **Confidential Comments to Editor** (optional) - editor only
  - Character counters
  - Auto-save draft every 30 seconds
- **Annotated File Upload Section:**
  - Drag-and-drop upload area
  - Supported formats: PDF, DOCX, ZIP
  - Multiple file upload
  - File validation and progress tracking
  - File removal option
- **Ethical Confirmation:**
  - Required checkbox: "I confirm that this review was completed objectively and ethically"
  - Conflict of interest declaration
- **Submission Controls:**
  - Save Draft button (saves to localStorage)
  - Submit Review Feedback button
  - Cancel Review button
  - Form validation with error messages
  - Confirmation modal before submission
- **Success Screen with System Actions:**
  - Review feedback forwarded to editor
  - Review inputs locked (read-only)
  - Workflow status updated to "Awaiting Editorial Consolidation"
  - Completion timestamp recorded
  - Editor notification sent
  - Activity log updated

**Validation:**
- All evaluation dropdowns must be selected
- Comments to Author cannot be empty
- Ethical confirmation must be checked
- Missing fields shown in error banner

**Flow:** Complete Evaluation → Upload Files → Ethical Confirmation → Submit → (Review forwarded to editor)

---

### 6. REVIEW CONSOLIDATION & AUTHOR FEEDBACK (Editor)

**Purpose:** Consolidate all reviewer feedback and send unified review package to author

**Access:**
1. Login as Editor: `sarah.johnson@publisher.com`
2. View manuscripts with completed reviews
3. Click **"Consolidate Reviews"** button (green button)

**Test Manuscript:**
- **ID:** ms-001
- **Title:** "Machine Learning Applications in Climate Science"
- **Completed Reviews:** Dr. Michael Chen (completed)

**Features:**
- **Review Status Summary:**
  - Completed reviews count
  - Pending reviews count
  - Conflict detection alert if reviewers disagree
- **Reviewer Feedback Cards:**
  - Expandable review cards with full comments
  - Reviewer name, submission date, decision
  - Review comments, corrections, suggested revisions
  - View/download annotated files
- **Side-by-Side Comparison:**
  - Toggle between card view and comparison view
  - Compare multiple reviewer recommendations
  - Identify conflicting opinions
- **Editorial Decision:**
  - Select: Accept / Minor Revision / Major Revision / Reject
- **Consolidated Feedback:**
  - Summarize all reviewer feedback
  - Prepare unified revision instructions
  - Add additional editor notes (optional)
- **Revision Timeline:**
  - Set revision deadline
  - Recommended duration: 30 days
- **Draft Save:**
  - Auto-save to localStorage
  - Continue editing later
- **Success Screen:**
  - Confirmation of package delivery
  - System actions completed
  - Status updates shown

**Automated Actions:**
- Review package sent to author dashboard
- Author notified of revision requirements
- Manuscript status updated
- Revision stage activated
- Activity logs updated

**Flow:** View Reviews → Compare Feedback → Consolidate → Set Deadline → Send to Author

---

### 7. REVIEWER ASSIGNMENT CONFIRMATION (Editor)

**Purpose:** Confirm reviewer assignments after receiving responses

**Access:**
1. Login as Editor: `sarah.johnson@publisher.com`
2. View manuscripts with assigned reviewers in review status
3. Click **"Confirm Reviewers"** button

**Test Manuscript:**
- **ID:** ms-001 (same as Reviewer Response)
- **Reviewers:** Dr. Michael Chen, Dr. Emily Brown (with pending status)

**Features:**
- Manuscript information section
- Timeline analytics:
  - Original timeline
  - Adjusted timeline
  - Delay risk level (Low/Moderate/High)
  - Estimated completion date
- Reviewer response monitoring table:
  - Reviewer name, expertise
  - Invitation status
  - Response (accepted/declined/pending)
  - Availability status
  - Response timestamp
  - Action (replace declined reviewers)
- Dynamic Timeline Recommendation preview with button to full analysis
- Assignment configuration:
  - Timeline decision (accept/adjust/escalate)
  - Manual deadline adjustment
  - Additional reviewer request
  - Assignment notes
  - Timeline notes
- Success screen with complete system outputs

**Flow:** Confirm Assignment → Review Stage Activated → (Timeline tracking begins)

---

### 8. DYNAMIC TIMELINE RECOMMENDATION (Editor)

**Purpose:** AI-powered timeline analysis with stage-by-stage breakdown and delay detection

**Access:**
1. From Reviewer Assignment page: Click **"View Full Dynamic Timeline Recommendation"** button
2. OR from Editor Dashboard: Click **"View Timeline"** button on manuscripts in review

**Test Manuscript:**
- **ID:** ms-001 (any manuscript in review status)

**Features:**
- Timeline summary cards:
  - Original timeline (days)
  - Adjusted timeline (days)
  - Delay risk (Low/Moderate/High)
  - Projected publication date
- Current workflow status indicator
- **Stage-by-Stage Duration Breakdown** (10 stages):
  1. Reviewer Confirmation (2 days)
  2. Initial Review Stage (14 days)
  3. Review Consolidation (3 days)
  4. Author Revision (10 days)
  5. Re-review Stage (7 days)
  6. Editorial Recommendation (2 days)
  7. Copyediting (5 days)
  8. Layout & Typesetting (4 days)
  9. Final Proof Approval (3 days)
  10. Publication Preparation (2 days)
- Manual stage duration adjustment (if timeline decision = "adjust")
- Timeline adjustment summary (original vs adjusted vs difference)
- **Detected Delay Factors:**
  - Reviewer declined invitation
  - Pending reviewer responses
  - Slow reviewer performance
  - High manuscript complexity
  - Multiple revision cycles
- **Reviewer Performance Impact Table:**
  - Reviewer name
  - Status
  - Average review time
  - Impact level (Low/Moderate/High)
- **Projected Publication Date** (large visual display)
- Timeline decision options:
  - Accept recommended timeline
  - Adjust timeline manually
  - Escalate delay concern
- Additional reviewer request (if escalating)
- Timeline notes
- Success screen with system outputs

**Flow:** View Analysis → Accept/Adjust Timeline → System Updates All Stakeholders

---

### 9. UPLOAD REVISED MANUSCRIPT (Author)

**Purpose:** Allow authors to submit revised manuscripts based on reviewer and editorial feedback

**Access:**
1. Login as Author: `jane.smith@university.edu`
2. View "Manuscripts Requiring Action" section on dashboard
3. Click **"Submit Revision"** button

**Test Manuscript:**
- **ID:** ms-001
- **Title:** "Machine Learning Applications in Climate Science"
- **Has completed review:** Dr. Michael Chen with decision "minor_revision"

**Features:**
- **Timeline Monitoring Panel:**
  - Revision deadline countdown
  - Days remaining indicator
  - Color-coded progress bar (green/amber/red)
  - Overdue alerts
- **Revision Request Details:**
  - Editorial decision display
  - Consolidated feedback from editor
  - Expandable reviewer feedback cards
  - Individual reviewer comments and suggested revisions
- **Previous Submission Information:**
  - Original submission date
  - Original file listing with download buttons
- **Upload Revised Manuscript:**
  - Drag-and-drop file upload area
  - Multiple file upload support
  - Accepted formats: PDF, DOC, DOCX
  - File list with remove option
  - File size display
- **Upload Response to Reviewers:**
  - Upload response document
  - Explain how each comment was addressed
- **Revision Notes:**
  - Multi-line text area for additional notes
  - Character counter
  - Auto-save draft every 30 seconds
- **Revision Checklist:**
  - Confirm all revisions addressed
  - Confirm files are final versions
  - Confirm responses are complete
- **Action Buttons:**
  - Save Draft
  - Submit Revised Manuscript (requires checklist confirmation)
  - Cancel
- **Submission Guidelines Panel:**
  - Important reminders about submission
- **Confirmation Modal:**
  - Review submission summary before final submit
  - Display file counts and inclusion status
- **Success Screen:**
  - Editor notification confirmation
  - Files locked status
  - Status updated confirmation
  - Timeline activated
  - Submission timestamp

**Automated Actions After Submission:**
- Editor notified of revised submission
- Revised files locked (read-only)
- Manuscript status updated to re-evaluation
- Revision timeline reassessment triggered
- Activity logs recorded
- Re-review workflow activated

**Validation:**
- At least one revised file must be uploaded
- All checklist items must be confirmed before submission

**Flow:** View Revision Request → Upload Files → Upload Response → Add Notes → Confirm Checklist → Submit → (Editor Re-evaluates)

---

### 10. REVISED MANUSCRIPT EVALUATION & RE-REVIEW ASSIGNMENT (Editor)

**Purpose:** Evaluate author's revised manuscript, assess revision compliance, and decide on next steps including re-review assignment

**Access:**
1. Login as Editor: `sarah.johnson@publisher.com`
2. View "Revised Manuscripts Awaiting Evaluation" section on dashboard
3. Click **"Evaluate Revision"** button

**Test Manuscript:**
- **ID:** ms-001
- **Title:** "Machine Learning Applications in Climate Science"
- **Has completed review with revision request:** Dr. Michael Chen (minor_revision decision)
- **Author has submitted revised manuscript**

**Features:**

**Revised Manuscript Information Panel:**
- Manuscript details (ID, author, category)
- Revision submission date and version number
- Author revision notes display
- Previous submission information

**File Preview & Download Section:**
- Revised manuscript files with download/preview
- File size and upload date display
- Response-to-reviewers document (highlighted)
- Supplementary materials list

**Previous Review Records (Expandable):**
- Reviewer feedback history for each reviewer
- Decision badges (color-coded)
- Comments and suggested revisions
- Review submission dates

**Revision Compliance Evaluation:**
- **Reviewer Comments Addressed** (dropdown):
  - Fully Addressed
  - Mostly Addressed
  - Partially Addressed
  - Inadequately Addressed
- **Revision Completeness** (dropdown):
  - Complete
  - Mostly Complete
  - Incomplete
  - Requires Major Work
- **Manuscript Improvement** (dropdown):
  - Significant Improvement
  - Moderate Improvement
  - Minor Improvement
  - No Improvement

**Evaluation Decision Section:**
- **Decision dropdown** (required):
  - Proceed to Re-review
  - Proceed to Editorial Recommendation
  - Request Additional Revision
  - Reject Revised Submission
- Evaluation notes textarea
- Character counter
- Auto-save draft every 30 seconds

**Re-review Assignment** (conditional - shown if "Proceed to Re-review" selected):
- Reviewer selection with checkboxes
- Reviewer cards showing:
  - Name and specialization
  - "Previous Reviewer" badge for original reviewers
  - Current workload count
  - Average review time
  - On-time rate percentage
- Multi-select capability

**Re-review Instructions** (conditional):
- Instructions for reviewers textarea
- Focus areas textarea
- Specific guidance for re-evaluation

**Timeline Reassessment** (conditional):
- Estimated duration input (days)
- Re-review deadline date picker
- Projected completion date display

**File Attachment Section:**
- Upload additional editorial files
- Attached files list with remove option

**Action Buttons:**
- Save Draft
- Submit Evaluation (requires compliance fields and decision)
- Cancel

**Confirmation Modal:**
- Review submission summary
- Decision display
- Reviewer count (if re-review)
- Confirm/Cancel options

**Success Screen:**
- Status Updated confirmation
- Reviewers Notified (if re-review)
- Evaluation Locked status
- Timeline Updated confirmation
- Submission timestamp

**Automated Actions After Submission:**
- Manuscript status updated based on decision
- Assigned reviewers notified (if re-review)
- Re-review stage activated (if applicable)
- Timeline reassessed and updated
- Activity logs recorded
- Audit trail maintained

**Validation:**
- All compliance evaluation fields must be completed
- Decision must be selected
- If "Proceed to Re-review": At least one reviewer must be selected

**Decision Outcomes:**
1. **Proceed to Re-review:** Assigns selected reviewers for re-evaluation
2. **Proceed to Editorial Recommendation:** Moves to final editorial decision
3. **Request Additional Revision:** Returns to author with feedback
4. **Reject Revised Submission:** Terminates manuscript with rejection

**Flow:** View Revised Files → Review Previous Feedback → Evaluate Compliance → Select Decision → [If Re-review: Assign Reviewers + Set Timeline] → Submit → (System Updates Workflow)

---

### 11. EDITORIAL RECOMMENDATION & FINAL PUBLICATION DECISION (Editor)

**Purpose:** Make the final editorial decision on manuscripts that have completed the review and revision process

**Access:**
1. Login as Editor: `sarah.johnson@publisher.com`
2. View "Manuscripts Ready for Editorial Recommendation" section
3. Click **"Make Recommendation"** button

**Test Manuscript:**
- **ID:** ms-005
- **Title:** "Blockchain Technology in Supply Chain"
- **Status:** copyediting (ready for final decision)

**Features:**

**Section 1 - Manuscript Information (Expandable):**
- Manuscript ID and title
- Author information
- Subject area and keywords
- Submission date
- Abstract display
- Current status

**Section 2 - Review History (Expandable):**
- All completed reviews listed
- Reviewer names and decisions
- Review dates
- Overall scores
- Key comments from reviewers
- Recommendation summary

**Section 3 - Revision Summary (Expandable):**
- Revision requests sent to author
- Author responses and changes made
- Major changes list with checkmarks:
  - Updated methodology section
  - Addressed statistical concerns
  - Added additional references
  - Revised discussion section
  - Improved figure quality
  - Clarified limitations
  - Enhanced conclusion
  - Fixed formatting issues
- Comments addressed percentage (e.g., "8 out of 10 comments addressed (80%)")

**Section 4 - Publication Readiness Evaluation (Required Fields):**
1. **Suitability Assessment** (dropdown): Exceptional fit / Strong fit / Good fit / Marginal fit
2. **Research Quality** (dropdown): Outstanding / Excellent / Good / Adequate / Inadequate
3. **Journal Fit** (dropdown): Perfect alignment / Strong alignment / Moderate alignment / Weak alignment
4. **Publication Priority** (dropdown): Urgent / High / Normal / Low
5. **Impact Assessment** (textarea): Expected impact and contribution to the field

**Section 5 - Compliance Validation:**
1. **Reviewer Concerns Addressed** (dropdown): Fully addressed / Mostly addressed / Partially addressed / Not addressed
2. **Revision Completeness** (checkbox): All requested revisions completed
3. **Ethical Compliance** (checkbox): Meets all ethical standards
4. **Citation Accuracy** (checkbox): References properly formatted and accurate
5. **Formatting Compliance** (checkbox): Follows journal formatting guidelines

**Section 6 - Editorial Decision (Required):**
- **Accept for Publication** - Manuscript ready for publication
- **Accept with Minor Editorial Changes** - Needs minor copyediting
- **Minor Revision (Final Round)** - Last revision opportunity
- **Major Revision Required** - Substantial changes needed
- **Reject** - Does not meet publication standards

**Section 7 - Justification & Analysis (Required):**
1. **Editorial Justification** (textarea, required): Detailed reasoning for decision
2. **Strengths** (textarea): Key strengths of the manuscript
3. **Weaknesses** (textarea): Remaining concerns or limitations

**Section 8 - Publication Timeline (Conditional - shown for accepted manuscripts):**
- Estimated publication timeline (dropdown): 20-90 days
- Auto-calculated based on copyediting queue and production schedule

**Quick Stats Sidebar:**
- Total Reviews: X
- Average Score: X.X/5.0
- Avg Review Time: X days
- Revision Rounds: X
- Time in Review: X days

**Action Buttons:**
- Save Draft
- Submit Recommendation (requires all fields)
- Cancel

**Confirmation Modal:**
- Decision summary display
- Publication timeline (if accepted)
- Impact on author and system
- Confirm/Cancel options

**Success Screen:**
- Decision Recorded confirmation
- Author Notified status
- Next Steps display (varies by decision)
- Timeline Activated (if accepted)
- Submission timestamp

**Automated Actions After Submission:**
1. **If Accept/Accept with Minor Editorial:**
   - Manuscript status updated to 'production'
   - Author notified of acceptance
   - Copyediting team notified
   - Publication timeline activated
   - DOI reservation initiated

2. **If Minor/Major Revision:**
   - Author notified with detailed feedback
   - Revision deadline set
   - Manuscript remains in editor queue
   - Tracking activated for resubmission

3. **If Reject:**
   - Author notified with detailed explanation
   - Manuscript status updated to 'rejected'
   - Reviewer contributors acknowledged
   - Archive for future reference

**Validation:**
- All publication readiness fields must be completed
- Editorial justification required
- All compliance checkboxes must be checked for acceptance
- Timeline must be set for accepted manuscripts

**Decision Outcomes:**
1. **Accept for Publication:** Moves to copyediting and production
2. **Accept with Minor Editorial Changes:** Minor copyediting before publication
3. **Minor Revision (Final Round):** Last opportunity for author to revise
4. **Major Revision Required:** Substantial changes needed, returns to author
5. **Reject:** Manuscript terminated

**Flow:** Review All Sections → Complete Publication Readiness Evaluation → Validate Compliance → Select Decision → Provide Justification → [If Accept: Set Timeline] → Submit → (System Updates Workflow) → Author Notification

---

## MANUSCRIPT STATUS REFERENCE

| Status | Meaning | Visible To | Actions Available |
|--------|---------|-----------|-------------------|
| **pending** | Awaiting initial assessment | Editor-in-Chief | Assess |
| **review** (no reviewers) | Editor assigned, needs reviewers | Editor | Assign Reviewers |
| **review** (with reviewers) | Reviewers invited/assigned | Editor, Reviewers | Confirm Reviewers, View Timeline |
| **copyediting** | Editorial decision complete, ready for final approval | Editor-in-Chief | Final Decision Review |
| **production** | Ready for publication | All | (Future features) |
| **rejected** | Manuscript rejected | Author, Editor-in-Chief | (Archive) |

---

## SYSTEM DESIGN AESTHETIC

All assessment/assignment pages use **Editorial Academic Aesthetic:**
- Background: Cream (#f5f1e8)
- Header: Deep Navy (#1a1f2e)
- Cards: White with border (#d1c7b3)
- Icons: Navy background with white icons
- Typography: Serif fonts
- Sharp corners (rounded-sm)

Editor Dashboard uses **Modern Gradient UI:**
- Gradient backgrounds (slate-to-blue)
- Glassmorphism effects
- Rounded corners
- Purple/Blue/Indigo accent colors

---

## TESTING THE COMPLETE WORKFLOW

### End-to-End Test Scenario:

1. **Login as Editor-in-Chief** (`robert.williams@publisher.com`)
   - Assess manuscript ms-002
   - Choose "Accept" decision
   - Assign editor Dr. Sarah Johnson

2. **Login as Editor** (`sarah.johnson@publisher.com`)
   - Open manuscript ms-003 (or the one just assigned)
   - Click "Assign Reviewers"
   - Select 2 reviewers
   - Send invitations

3. **Login as Reviewer** (`michael.chen@reviewer.org`)
   - View pending invitation
   - Click "View Invitation"
   - Select "Accept Review Assignment"
   - Confirm availability

4. **Login as Editor** (again)
   - Open manuscript with accepted reviewers
   - Click "Confirm Reviewers"
   - View Dynamic Timeline Recommendation
   - Adjust timeline if needed
   - Confirm reviewer assignment

5. **View Timeline Analysis**
   - From Reviewer Assignment page or Editor Dashboard
   - Review all 10 workflow stages
   - Check detected delay factors
   - Review reviewer performance impact
   - Accept or adjust recommended timeline

6. **Login as Reviewer** (`emily.brown@reviewer.org`)
   - Click "Submit Review" on ms-004
   - Complete all evaluation sections
   - Upload annotated files
   - Submit review

7. **Login as Editor** (again)
   - Click "Consolidate Reviews" on ms-001
   - Review all feedback
   - Prepare unified feedback package
   - Send to author

8. **Login as Author** (`jane.smith@university.edu`)
   - Click "Submit Revision" on ms-001
   - Upload revised manuscript files
   - Upload response-to-reviewers document
   - Complete checklist
   - Submit revision

9. **Login as Editor** (again)
   - Click "Evaluate Revision" on ms-001
   - Review revised manuscript
   - Assess compliance with all criteria
   - Select decision (re-review or proceed)
   - Submit evaluation

10. **Login as Editor** (again)
    - Click "Make Recommendation" on ms-005
    - Review all sections (manuscript info, review history, revision summary)
    - Complete publication readiness evaluation
    - Validate compliance
    - Select final editorial decision
    - Provide justification and analysis
    - Submit recommendation

11. **Login as Editor-in-Chief** (`robert.williams@publisher.com`)
    - Click "Review & Decide" on ms-005
    - Review manuscript summary and complete review history
    - Review editorial recommendation summary
    - Complete final manuscript validation checklist (6 items)
    - Review version comparison
    - Complete publication approval assessment (4 fields)
    - Verify policy and compliance (6 checks)
    - Select final editorial decision
    - Provide decision justification, executive summary, and risk notes
    - Set publication timeline (if accepting)
    - Confirm and submit final decision

---

## DATA INTEGRITY NOTES

The mock data is configured to maintain all workflow states simultaneously:

- **ms-001:** In review with assigned reviewers (for Reviewer Response, Reviewer Assignment, Review Consolidation, Timeline, Revision Upload, Revision Evaluation)
  - Has completed review with "minor_revision" decision from Dr. Michael Chen
  - Triggers revision request for author
  - After author submits revision, enables revision evaluation workflow
  - Editor can assess compliance and assign for re-review
- **ms-002:** Pending status (for Editorial Assessment)
- **ms-003:** In review with NO reviewers (for Reviewer Matchmaking)
- **ms-004:** In review with in-progress review (for Review Evaluation)
- **ms-005:** In copyediting status (for Editorial Recommendation & Final Publication Decision)

**⚠️ IMPORTANT:** Do not modify manuscript statuses in `mockData.ts` without ensuring all workflow features remain accessible.

---

## FUTURE ENHANCEMENTS

The system is designed to support:
- Copyediting workflows (post-acceptance)
- Layout & typesetting workflows
- Publication queue management
- Author communication system
- Reviewer recognition and analytics
- Document version control
- Collaborative review features
- Advanced analytics dashboards
- Automated plagiarism detection
- Reference validation tools

---

## TECHNICAL NOTES

- All pages use React with TypeScript
- State management via Context API (AuthContext, DataContext)
- Styling with Tailwind CSS v4
- Icons from lucide-react
- Mock data in `/src/app/data/mockData.ts`
- Component files in `/src/app/components/`
- Dashboard files in `/src/app/components/dashboards/`

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-26  
**System Status:** All features operational and accessible
