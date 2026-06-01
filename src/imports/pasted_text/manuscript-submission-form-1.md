GUI-MS01 — Manuscript Submission Form
Prompt:

Design a Manuscript Submission Form for the Centralized Manuscript Management System. This is the primary form Authors use to submit a new manuscript (UC01, UC03).
Layout: Multi-step form with a step indicator at the top showing 3 steps: ① Manuscript Details → ② File Upload → ③ Review & Confirm.
Step 1 — Manuscript Details & Metadata (UC03):

Manuscript Title (text input, required)
Abstract (textarea, max 250 words, live word counter)
Keywords (tag-input style, min 5, with add/remove chips)
Manuscript Category (dropdown: e.g., Research Article, Review, Case Study, etc.)
Author(s) Information: Primary Author (pre-filled from logged-in account), Co-Author fields (add/remove dynamically)
Corresponding Author (radio: same as primary / other)
Suggested Reviewers (optional, add up to 3)

Step 2 — File Upload:

Main Manuscript File (drag-and-drop zone, accepted: .docx, .pdf)
Supplementary Files (optional, multiple allowed)
File validation: format check, size limit display (e.g., max 20MB)

Step 3 — Review & Confirm:

Read-only summary of all submitted data
Checklist of submission requirements (checkboxes the author must tick before final submit)
"Submit Manuscript" primary button
"Save as Draft" secondary button

Interactions: Step navigation (Next/Back), inline field validation, upload progress bar, duplicate-title warning alert, success notification with reference number on submit.
Aesthetic: Clean, form-focused editorial layout. Generous whitespace. Step indicator uses a horizontal progress bar with numbered nodes. Muted navy and white palette. Serif label for form section headings, clean sans-serif for inputs.

GUI-MS02 — Manuscript List Page
Prompt:

Design a Manuscript List Page for the Centralized Manuscript Management System, accessible by Authors, Editors, and TWG (UC02).
Layout: Full-width table/list view with a top toolbar.
Toolbar (top):

Page title: "Manuscripts"
Search bar (search by title, author, reference number)
Filter dropdowns: Status (All / Under Review / Revision Required / Accepted / Rejected / Published), Category, Date Submitted (date range picker)
Sort: Newest / Oldest / Title A–Z
"Submit New Manuscript" button (Authors only)

Manuscript Table columns:

Reference No.
Manuscript Title (clickable, links to GUI-MS03)
Author(s)
Category
Date Submitted
Current Stage (badge: Editorial Assessment / Peer Review / Revision / Copyediting / Published)
Status (color-coded badge: Pending / In Progress / Requires Action / Completed)
Actions (View, Track)

Role differences:

Authors: see only their own manuscripts
Editors & TWG: see all manuscripts with additional columns (Assigned Reviewer, Days in Stage)

Interactions: Click row to open Manuscript Details. Status badges color-coded (amber = pending, blue = in progress, red = requires action, green = completed). Pagination at bottom.
Aesthetic: Dense but breathable data table. Subtle row hover highlight. Status badges as small rounded pills. Monospace reference numbers. Clean top toolbar with clear visual hierarchy.


GUI-MS03 — Manuscript Details Page
Prompt:

Design a Manuscript Details Page for the Centralized Manuscript Management System, accessible by Authors, Editors, and TWG (UC04).
Layout: Two-column layout. Left (wider): manuscript content and timeline. Right (narrower): action panel and metadata sidebar.
Left column:

Manuscript Title (large heading)
Reference number, submission date, category, keywords (as tags)
Abstract (collapsible)
Authors list
Tabbed sections below: Overview | Revision History | Reviewer Feedback | Files

Right sidebar:

Current Stage card (large badge showing stage name + icon)
Status indicator (Pending / In Progress / Requires Action / Completed)
Assigned Reviewers (names + status chips: Invited / Accepted / Submitted)
Estimated Timeline (from Timeline Recommender — shows expected completion date per stage)
Action buttons (context-sensitive by role):

Author: "Submit Revision", "Download Manuscript"
Editor: "Assign Reviewer", "Move to Next Stage", "Send Back for Revision"
TWG: "View Reports", "Download"



Interactions: Tab switching (no page reload). Revision History tab shows version list. Files tab shows uploaded file list with download links. Stage badge updates dynamically.
Aesthetic: Editorial two-column layout. Generous line-height for text sections. Sidebar cards use subtle background separation. Stage badge is prominent with color-coded accent (amber = in progress, green = accepted, red = rejected).


GUI-MS04 — Manuscript Status Tracker
Prompt:

Design a Manuscript Status Tracker Page for the Centralized Manuscript Management System, accessible by Authors, Editors, and TWG (UC04).
Layout: Centered single-manuscript view with a prominent visual workflow tracker.
Top section:

Manuscript title, reference number, submission date
Current status badge (large, color-coded)

Workflow Stage Tracker (main element):

Horizontal stepper with 6 stages:

Manuscript Submission
Editorial Assessment
Peer Review
Manuscript Revision
Copyediting & Production
Publication


Each stage node shows: stage name, date entered, date completed (or "In Progress" / "Pending")
Completed stages: filled circle with checkmark, green accent
Current stage: pulsing/highlighted node, amber accent
Pending stages: unfilled circle, muted gray
Connector lines between nodes (solid for completed, dashed for pending)

Below the stepper — Stage Detail Card:

Shows details of the currently active stage: what is happening, who is responsible, deadline, and any required actions
For Authors: shows if action is needed (e.g., "Revision required — due [date]")
For Editors: shows pending tasks

Recent Activity Feed (bottom):

Chronological list of status changes and events (e.g., "Reviewer A accepted invitation — May 10, 2026")

Aesthetic: Clean, process-oriented layout. The stepper is the hero element — large, clear, visually satisfying. Use teal for completed, amber for in-progress, gray for pending. Timeline feel with editorial typography.


GUI-MS05 — Manuscript Workflow Progress Page
Prompt:

Design a Manuscript Workflow Progress Page for the Centralized Manuscript Management System, accessible by Editors and TWG (UC05).
Purpose: A bird's-eye view of ALL manuscripts currently in the workflow — where each one is, what's delayed, and what needs attention.
Layout: Dashboard-style with summary metric cards at top, followed by a filterable Kanban-style board or grouped table below.
Top Metric Cards (4 cards in a row):

Total Manuscripts in Workflow
Manuscripts Awaiting Action (Editor or TWG)
Overdue / Delayed Manuscripts (flagged in red)
Manuscripts Completed This Month

Main View — Kanban Board (switchable to table view):

One column per workflow stage (6 stages)
Each card in a column: Manuscript Title, Reference No., Author, Days in Stage, Status chip
Cards with exceeded deadlines shown with a red left-border accent
Cards close to deadline shown with amber accent

Toolbar:

Search by manuscript title or reference
Filter by: Stage, Status, Category, Assigned Editor
Toggle: Kanban View / Table View
Export button (PDF/CSV report)

Interactions: Click any manuscript card to open GUI-MS03. Drag-and-drop on Kanban (Editors only) to move stage manually with confirmation dialog. Delayed manuscripts trigger a visible alert badge on the column header.
Aesthetic: Operational dashboard feel. Compact, information-dense but organized. Kanban columns have subtle header color per stage. Red/amber accent borders for deadline states. Metric cards use muted background with bold numbers. Clean sans-serif throughout.

