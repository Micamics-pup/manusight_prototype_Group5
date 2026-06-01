# Quick Reference Card

## 🔐 Login Credentials (No Password Required)

| Role | Email |
|------|-------|
| Editor-in-Chief | `robert.williams@publisher.com` |
| Editor | `sarah.johnson@publisher.com` |
| Reviewer | `michael.chen@reviewer.org` |
| Author | `jane.smith@university.edu` |
| TWG Coordinator | `maria.rodriguez@publisher.com` |
| TWG Copyeditor | `sarah.martinez@publisher.com` |
| TWG Layout Artist | `emma.thompson@publisher.com` |
| TWG Production Coordinator | `rachel.foster@publisher.com` |
| TWG Print Coordinator | `james.wilson@publisher.com` |
| TWG Distribution | `robert.chen@publisher.com` |

---

## 📋 Feature Access Cheat Sheet

### Editor-in-Chief Features

| Feature | Access Path | Test Manuscript |
|---------|-------------|-----------------|
| Editorial Assessment | Dashboard → "Assess" button | ms-002 (Quantum Computing) |
| Editor Assignment | After assessment → "Assign Editor" | Any accepted manuscript |

### Editor Features

| Feature | Access Path | Test Manuscript |
|---------|-------------|-----------------|
| Reviewer Matchmaking | Dashboard → "Assign Reviewers" | ms-003 (Neuroplasticity) |
| Reviewer Assignment | Dashboard → "Confirm Reviewers" | ms-001 (Machine Learning) |
| Reviewer Assignment Confirmation | Dashboard → Table → "Confirm Reviewers" | ms-007 (Renewable Energy) |
| Review Consolidation | Dashboard → "Consolidate Reviews" | ms-001 (Machine Learning) |
| Revised Manuscript Evaluation | Dashboard → "Revised Manuscripts Awaiting Evaluation" → "Evaluate Revision" | ms-001 (Machine Learning) |
| Timeline Recommendation | Dashboard → "View Timeline" OR from Assignment page | ms-007 (Renewable Energy) |
| Editorial Recommendation | Dashboard → "Manuscripts Ready for Editorial Recommendation" → "Make Recommendation" | ms-006 (AI Healthcare) |

### Reviewer Features

| Feature | Access Path | Test Manuscript |
|---------|-------------|-----------------|
| Reviewer Response | Dashboard → Pending Invitations → "View Invitation" | ms-001 (Machine Learning) |
| Review Evaluation | Dashboard → In Progress Reviews → "Submit Review" | ms-004 (Sustainable Architecture) |

### Author Features

| Feature | Access Path | Test Manuscript |
|---------|-------------|-----------------|
| Upload Revised Manuscript | Dashboard → Manuscripts Requiring Action → "Submit Revision" | ms-001 (Machine Learning) |

### TWG Coordinator Features

| Feature | Access Path | Test Manuscript |
|---------|-------------|-----------------|
| Task Assignment | Dashboard → "Assign Tasks" | ms-005 (Blockchain Technology) |

### TWG Copyeditor Features

| Feature | Access Path | Test Manuscript |
|---------|-------------|-----------------|
| Manuscript List | Dashboard → View all assigned manuscripts | All assigned manuscripts |
| Copyediting Task | Dashboard → Table → "View Task" | Individual manuscript |
| Progress Tracking | Dashboard → Progress bars per manuscript | All assigned manuscripts |
| Plagiarism Check | Dashboard → Plagiarism status badges | Individual manuscript |

---

## 📊 Test Manuscripts at a Glance

| ID | Title | Status | Purpose |
|----|-------|--------|---------|
| **ms-001** | Machine Learning Applications | `review` + revision needed | Reviewer Response, Assignment, Consolidation, Timeline, Revision Upload |
| **ms-002** | Quantum Computing | `pending` | Editorial Assessment |
| **ms-003** | Neuroplasticity | `review` - no reviewers | Reviewer Matchmaking |
| **ms-004** | Sustainable Architecture | `review` + in_progress | Review Evaluation |
| **ms-005** | Blockchain Technology | `production` | TWG Endorsement |
| **ms-006** | AI in Healthcare Diagnostics | `copyediting` | Editorial Recommendation & Final Publication Decision |
| **ms-007** | Renewable Energy Systems | `review` + reviewers assigned | **Reviewer Assignment Confirmation** |

---

## 🔄 Complete Test Flow (12 Steps)

1. **Login:** `robert.williams@publisher.com`
   - Click "Assess" on ms-002 → Accept → Assign Editor

2. **Login:** `sarah.johnson@publisher.com`
   - Click "Assign Reviewers" on ms-003 → Select 2 reviewers → Send

3. **Login:** `emily.brown@reviewer.org`
   - Click "View Invitation" on ms-001 → Accept

4. **Login:** `sarah.johnson@publisher.com` (again)
   - Click "Confirm Reviewers" on ms-001 → Confirm

5. **From same page:** Click "View Full Dynamic Timeline Recommendation"
   - Review 10 stages → Accept timeline

6. **Login:** `emily.brown@reviewer.org`
   - Click "Submit Review" on ms-004 → Complete evaluation → Submit

7. **Login:** `sarah.johnson@publisher.com` (again)
   - Click "Consolidate Reviews" on ms-001 → Review feedback → Send to author

8. **Login:** `jane.smith@university.edu`
   - Click "Submit Revision" on ms-001 → Upload revised files → Complete checklist → Submit

9. **Login:** `sarah.johnson@publisher.com` (again)
   - Click "Evaluate Revision" on ms-001 → Assess compliance → Select decision → Submit

10. **Login:** `sarah.johnson@publisher.com` (again)
    - Click "Make Recommendation" on ms-006 → Complete evaluation → Make final decision → Submit

11. **Login:** `sarah.johnson@publisher.com` (again)
    - Click "Endorse to TWG" on ms-005 → Select TWG members → Provide instructions → Submit endorsement

12. **Login:** `maria.rodriguez@publisher.com`
    - Click "Assign Tasks" on ms-005 → Assign TWG members to tasks → Set deadlines → Notify all

---

## 🎨 Page Color Schemes

| Page Type | Background | Header | Aesthetic |
|-----------|-----------|--------|-----------|
| Assessment/Assignment Pages | Cream (#f5f1e8) | Navy (#1a1f2e) | Editorial Academic |
| Dashboards | Gradient (slate-blue) | White/Glass | Modern Gradient |

---

## ⚡ Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| No pending manuscripts | ms-002 should be `status: 'pending'` |
| No reviewers to assign | ms-003 should have `assignedReviewers: []` |
| No pending invitations | ms-001 should have rev-005 with `status: 'pending'` |
| No in-progress reviews | ms-004 should have rev-006 with `status: 'in_progress'` |
| Features not visible | Check manuscript statuses in `mockData.ts` |

---

## 📚 Full Documentation

- **Complete Guide:** [WORKFLOWS.md](./WORKFLOWS.md)
- **Project Overview:** [README.md](./README.md)
- **Mock Data Reference:** `src/app/data/mockData.ts` (see header comments)

---

**Remember:** All features are designed to coexist. The mock data maintains manuscripts at different stages so you can access any workflow feature at any time without re-prompting!
