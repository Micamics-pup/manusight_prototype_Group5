import type {
  User,
  Manuscript,
  Review,
  Comment,
  DesignFile,
  Notification,
} from '../types';

/**
 * MANUSCRIPT MANAGEMENT SYSTEM - MOCK DATA
 *
 * This file maintains manuscripts at different workflow stages to ensure all features remain accessible.
 *
 * WORKFLOW STAGES & MANUSCRIPT ASSIGNMENTS:
 *
 * 1. EDITORIAL ASSESSMENT (Editor-in-Chief)
 *    - ms-002: "Quantum Computing and Cryptography" - status: 'pending'
 *    - Accessible via: Editor-in-Chief Dashboard → "Assess" button
 *    - Flow: Assessment → Editor Assignment
 *
 * 2. REVIEWER MATCHMAKING (Editor)
 *    - ms-003: "Neuroplasticity in Adult Learning" - status: 'copyediting' (Jane Smith's copyediting demo)
 *    - Accessible via: Editor Dashboard → "Assign Reviewers" button
 *    - Flow: Select reviewers → Send invitations
 *
 * 3. REVIEWER RESPONSE (Reviewer)
 *    - ms-001: "Machine Learning Applications in Climate Science" - status: 'review', assignedReviewers: ['4', '5']
 *    - Has pending review record (rev-005 - Dr. Emily Brown)
 *    - Accessible via: Reviewer Dashboard → "View Invitation" button
 *    - Flow: Accept/Decline/Clarification → Response submitted
 *
 * 3b. REVIEW EVALUATION & FEEDBACK SUBMISSION (Reviewer)
 *    - ms-004: "Sustainable Urban Architecture" - status: 'review', assignedReviewers: ['4', '5']
 *    - Review status: in_progress for Dr. Emily Brown (rev-006)
 *    - Accessible via: Reviewer Dashboard → "Submit Review" button (green)
 *    - Features: Evaluation dropdowns, comments, file upload, deadline monitoring
 *    - Flow: Complete evaluation → Upload annotated files → Submit review
 *
 * 3c. REVIEW CONSOLIDATION & AUTHOR FEEDBACK (Editor)
 *    - ms-001: "Machine Learning Applications in Climate Science"
 *    - Has completed review from Dr. Michael Chen (rev-004)
 *    - Accessible via: Editor Dashboard → "Consolidate Reviews" button (green)
 *    - Features: View all reviews, compare, consolidate feedback, set deadline
 *    - Flow: Review feedback → Consolidate → Send to author
 *
 * 4. REVIEWER ASSIGNMENT CONFIRMATION (Editor)
 *    - ms-001: Same manuscript as above (after reviewers respond)
 *    - Accessible via: Editor Dashboard → "Confirm Reviewers" button
 *    - Flow: Confirm assignments → Finalize review panel
 *
 * 5. DYNAMIC TIMELINE RECOMMENDATION (Editor)
 *    - ms-001: Accessible via "View Timeline" button or from Reviewer Assignment page
 *    - Flow: View stage breakdown → Accept/Adjust timeline
 *
 * 6. UPLOAD REVISED MANUSCRIPT (Author)
 *    - ms-001: "Machine Learning Applications in Climate Science"
 *    - Has completed review with "minor_revision" decision
 *    - Accessible via: Author Dashboard → "Submit Revision" button
 *    - Features: Upload revised files, response document, revision notes, checklist
 *    - Flow: Upload files → Complete checklist → Submit revision
 *
 * 7. REVISED MANUSCRIPT EVALUATION & RE-REVIEW ASSIGNMENT (Editor)
 *    - ms-001: Same manuscript after author submits revision
 *    - Accessible via: Editor Dashboard → "Evaluate Revision" button (amber section)
 *    - Features: Review revised files, assess compliance, decide on re-review or acceptance
 *    - Flow: Review revision → Evaluate compliance → Select decision → [Optional: Assign re-reviewers]
 *
 * 8. EDITORIAL RECOMMENDATION & FINAL PUBLICATION DECISION (Editor)
 *    - ms-006: "AI in Healthcare Diagnostics" - status: 'copyediting'
 *    - Accessible via: Editor Dashboard → "Make Recommendation" button (green section)
 *    - Features: Publication readiness evaluation, compliance validation, final decision
 *    - Flow: Review all sections → Complete evaluation → Select decision → Submit recommendation
 *
 * 9. FINAL DECISION REVIEW & PUBLICATION APPROVAL (Editor-in-Chief)
 *    - ms-006: "AI in Healthcare Diagnostics" - status: 'copyediting'
 *    - Accessible via: Editor-in-Chief Dashboard → "Review & Decide" button (purple section)
 *    - Features: Complete review history analysis, cross-stage comparison, policy verification (6 checks)
 *    - Flow: Review all sections → Complete validation → Verify compliance → Select final decision → Issue approval
 *
 * 10. MANUSCRIPT ENDORSEMENT TO TWG (Editor)
 *    - ms-005: "Blockchain Technology" - status: 'production'
 *    - Accessible via: Editor Dashboard → "Endorse to TWG" button (indigo section)
 *    - Features: Technical readiness assessment, TWG member assignment, endorsement decision
 *    - Flow: Review compliance → Select TWG members → Provide instructions → Submit endorsement
 *
 * USER CREDENTIALS FOR TESTING:
 * - Editor-in-Chief: robert.williams@publisher.com
 * - Editor: sarah.johnson@publisher.com
 * - Reviewer: michael.chen@reviewer.org OR emily.brown@reviewer.org
 * - Author: jane.smith@university.edu OR john.doe@university.edu
 *
 * DO NOT modify manuscript statuses without ensuring workflow features remain accessible.
 */

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    email: 'jane.smith@university.edu',
    role: 'author',
    active: true,
  },
  {
    id: '2',
    name: 'Prof. John Doe',
    email: 'john.doe@university.edu',
    role: 'author',
    active: true,
  },
  {
    id: '3',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@publisher.com',
    role: 'editor',
    active: true,
  },
  {
    id: '4',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@reviewer.org',
    role: 'reviewer',
    active: true,
  },
  {
    id: '5',
    name: 'Dr. Emily Brown',
    email: 'emily.brown@reviewer.org',
    role: 'reviewer',
    active: true,
  },
  {
    id: '6',
    name: 'Alex Martinez',
    email: 'alex.martinez@design.com',
    role: 'layout_artist',
    active: true,
  },
  {
    id: '7',
    name: 'Admin User',
    email: 'admin@system.com',
    role: 'admin',
    active: true,
  },
  {
    id: '8',
    name: 'Prof. Robert Williams',
    email: 'robert.williams@publisher.com',
    role: 'editor_in_chief',
    active: true,
  },
  {
    id: '9',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@publisher.com',
    role: 'twg_coordinator',
    active: true,
  },
  {
    id: '10',
    name: 'Sarah Martinez',
    email: 'sarah.martinez@publisher.com',
    role: 'twg_copyeditor',
    active: true,
  },
  {
    id: '11',
    name: 'Emma Thompson',
    email: 'emma.thompson@publisher.com',
    role: 'twg_layout',
    active: true,
  },
  {
    id: '12',
    name: 'Rachel Foster',
    email: 'rachel.foster@publisher.com',
    role: 'twg_production_coordinator',
    active: true,
  },
  {
    id: '13',
    name: 'James Wilson',
    email: 'james.wilson@publisher.com',
    role: 'twg_print_coordinator',
    active: true,
  },
  {
    id: '14',
    name: 'Robert Chen',
    email: 'robert.chen@publisher.com',
    role: 'twg_distribution',
    active: true,
  },
];

export const mockManuscripts: Manuscript[] = [
  {
    id: 'ms-001',
    title: 'Machine Learning Applications in Climate Science',
    authorId: '1',
    authorName: 'Dr. Jane Smith',
    abstract:
      'This paper explores the use of machine learning algorithms to predict climate patterns and extreme weather events. We present a novel approach combining deep learning with traditional climate models.',
    content: 'Full manuscript content would be here...',
    status: 'review',
    submittedAt: new Date('2026-05-08'),
    updatedAt: new Date('2026-05-08'),
    assignedEditorId: '3',
    assignedReviewers: ['4', '5'],
    category: 'Environmental Science',
    files: [
      {
        id: 'file-001',
        fileName: 'climate-ml-manuscript-v1.pdf',
        fileUrl: 'https://example.com/files/climate-ml-v1.pdf',
        uploadedAt: new Date('2026-05-08'),
        uploadedBy: '1',
        uploadedByName: 'Dr. Jane Smith',
        version: 1,
        fileType: 'original',
        notes: 'Initial submission',
      },
    ],
    revisionHistory: [
      {
        id: 'rev-hist-001',
        date: new Date('2026-05-08'),
        status: 'pending',
        changedBy: '1',
        changedByName: 'Dr. Jane Smith',
        notes: 'Initial manuscript submission',
      },
    ],
  },
  {
    id: 'ms-002',
    title: 'Quantum Computing and Cryptography',
    authorId: '2',
    authorName: 'Prof. John Doe',
    abstract:
      'An investigation into post-quantum cryptographic algorithms and their implementation on current quantum computing platforms.',
    content: 'Full manuscript content would be here...',
    status: 'pending',
    submittedAt: new Date('2026-05-06'),
    updatedAt: new Date('2026-05-06'),
    assignedEditorId: undefined,
    assignedReviewers: [],
    category: 'Computer Science',
    files: [
      {
        id: 'file-002',
        fileName: 'quantum-crypto-v1.pdf',
        fileUrl: 'https://example.com/files/quantum-crypto-v1.pdf',
        uploadedAt: new Date('2026-05-06'),
        uploadedBy: '2',
        uploadedByName: 'Prof. John Doe',
        version: 1,
        fileType: 'original',
        notes: 'Initial submission',
      },
    ],
    revisionHistory: [
      {
        id: 'rev-hist-002',
        date: new Date('2026-05-06'),
        status: 'pending',
        changedBy: '2',
        changedByName: 'Prof. John Doe',
        notes: 'Manuscript submitted - awaiting initial assessment',
      },
    ],
  },
  {
    id: 'ms-003',
    title: 'Neuroplasticity in Adult Learning',
    authorId: '1',
    authorName: 'Dr. Jane Smith',
    abstract:
      'A comprehensive study on brain plasticity and its implications for adult education and skill acquisition.',
    content: 'Full manuscript content would be here...',
    status: 'copyediting',
    submittedAt: new Date('2026-05-01'),
    updatedAt: new Date('2026-05-20'),
    assignedEditorId: '3',
    assignedReviewers: ['4', '5'],
    category: 'Neuroscience',
    files: [
      {
        id: 'file-003',
        fileName: 'neuroplasticity-study-v1.pdf',
        fileUrl: 'https://example.com/files/neuroplasticity-v1.pdf',
        uploadedAt: new Date('2026-05-01'),
        uploadedBy: '1',
        uploadedByName: 'Dr. Jane Smith',
        version: 1,
        fileType: 'original',
        notes: 'Original submission',
      },
    ],
    revisionHistory: [
      {
        id: 'rev-hist-004',
        date: new Date('2026-05-01'),
        status: 'pending',
        changedBy: '1',
        changedByName: 'Dr. Jane Smith',
        notes: 'Submitted for review',
      },
      {
        id: 'rev-hist-005',
        date: new Date('2026-05-05'),
        status: 'review',
        changedBy: '3',
        changedByName: 'Dr. Sarah Johnson',
        notes: 'Editor assigned - sent to reviewers',
      },
      {
        id: 'rev-hist-006b',
        date: new Date('2026-05-20'),
        status: 'copyediting',
        changedBy: '3',
        changedByName: 'Dr. Sarah Johnson',
        notes: 'All reviews completed - moved to copyediting',
      },
    ],
  },
  {
    id: 'ms-004',
    title: 'Sustainable Urban Architecture',
    authorId: '2',
    authorName: 'Prof. John Doe',
    abstract:
      'Exploring innovative architectural designs that promote sustainability in urban environments.',
    content: 'Full manuscript content would be here...',
    status: 'review',
    submittedAt: new Date('2026-04-20'),
    updatedAt: new Date('2026-05-05'),
    assignedEditorId: '3',
    assignedReviewers: ['4', '5'],
    category: 'Architecture',
    files: [
      {
        id: 'file-004',
        fileName: 'urban-architecture-v1.pdf',
        fileUrl: 'https://example.com/files/urban-arch-v1.pdf',
        uploadedAt: new Date('2026-04-20'),
        uploadedBy: '2',
        uploadedByName: 'Prof. John Doe',
        version: 1,
        fileType: 'original',
        notes: 'First draft',
      },
      {
        id: 'file-005',
        fileName: 'reviewer-feedback-chen.pdf',
        fileUrl: 'https://example.com/files/feedback-chen.pdf',
        uploadedAt: new Date('2026-05-03'),
        uploadedBy: '4',
        uploadedByName: 'Dr. Michael Chen',
        version: 1,
        fileType: 'reviewer_feedback',
        notes: 'Detailed review comments and suggested changes',
      },
    ],
    revisionHistory: [
      {
        id: 'rev-hist-007',
        date: new Date('2026-04-20'),
        status: 'pending',
        changedBy: '2',
        changedByName: 'Prof. John Doe',
        notes: 'Initial submission',
      },
      {
        id: 'rev-hist-008',
        date: new Date('2026-04-25'),
        status: 'review',
        changedBy: '3',
        changedByName: 'Dr. Sarah Johnson',
        notes: 'Assigned to Dr. Michael Chen and Dr. Emily Brown for review',
      },
    ],
  },
  {
    id: 'ms-005',
    title: 'Blockchain Technology in Supply Chain Management',
    authorId: '1',
    authorName: 'Dr. Jane Smith',
    abstract:
      'An analysis of how blockchain technology can revolutionize supply chain transparency and efficiency.',
    content: 'Full manuscript content would be here...',
    status: 'production',
    submittedAt: new Date('2026-03-15'),
    updatedAt: new Date('2026-04-30'),
    assignedEditorId: '3',
    assignedReviewers: ['4'],
    category: 'Technology',
    files: [
      {
        id: 'file-006',
        fileName: 'blockchain-supply-chain-v1.pdf',
        fileUrl: 'https://example.com/files/blockchain-v1.pdf',
        uploadedAt: new Date('2026-03-15'),
        uploadedBy: '1',
        uploadedByName: 'Dr. Jane Smith',
        version: 1,
        fileType: 'original',
        notes: 'Initial submission',
      },
      {
        id: 'file-007',
        fileName: 'blockchain-supply-chain-v2.pdf',
        fileUrl: 'https://example.com/files/blockchain-v2.pdf',
        uploadedAt: new Date('2026-04-10'),
        uploadedBy: '1',
        uploadedByName: 'Dr. Jane Smith',
        version: 2,
        fileType: 'revision',
        notes: 'Revised version with expanded case studies',
      },
      {
        id: 'file-008',
        fileName: 'editor-notes.pdf',
        fileUrl: 'https://example.com/files/editor-notes.pdf',
        uploadedAt: new Date('2026-04-05'),
        uploadedBy: '3',
        uploadedByName: 'Dr. Sarah Johnson',
        version: 1,
        fileType: 'editor_feedback',
        notes: 'Editorial suggestions for improvement',
      },
    ],
    revisionHistory: [
      {
        id: 'rev-hist-010',
        date: new Date('2026-03-15'),
        status: 'pending',
        changedBy: '1',
        changedByName: 'Dr. Jane Smith',
        notes: 'First submission',
      },
      {
        id: 'rev-hist-011',
        date: new Date('2026-03-20'),
        status: 'review',
        changedBy: '3',
        changedByName: 'Dr. Sarah Johnson',
        notes: 'Moved to review stage',
      },
      {
        id: 'rev-hist-012',
        date: new Date('2026-04-05'),
        status: 'copyediting',
        changedBy: '3',
        changedByName: 'Dr. Sarah Johnson',
        notes: 'Moved to copyediting stage',
      },
      {
        id: 'rev-hist-013',
        date: new Date('2026-04-10'),
        status: 'copyediting',
        changedBy: '1',
        changedByName: 'Dr. Jane Smith',
        notes: 'Submitted revised version with additional case studies',
      },
      {
        id: 'rev-hist-014',
        date: new Date('2026-04-30'),
        status: 'production',
        changedBy: '3',
        changedByName: 'Dr. Sarah Johnson',
        notes: 'Moved to production',
      },
    ],
  },
  {
    id: 'ms-006',
    title: 'Artificial Intelligence in Healthcare Diagnostics',
    authorId: '2',
    authorName: 'Prof. John Doe',
    abstract:
      'A comprehensive analysis of AI-powered diagnostic tools and their impact on early disease detection and treatment outcomes.',
    content: 'Full manuscript content would be here...',
    status: 'copyediting',
    submittedAt: new Date('2026-04-01'),
    updatedAt: new Date('2026-05-20'),
    assignedEditorId: '3',
    assignedReviewers: ['4', '5'],
    category: 'Medical Technology',
    files: [
      {
        id: 'file-009',
        fileName: 'ai-healthcare-v1.pdf',
        fileUrl: 'https://example.com/files/ai-healthcare-v1.pdf',
        uploadedAt: new Date('2026-04-01'),
        uploadedBy: '2',
        uploadedByName: 'Prof. John Doe',
        version: 1,
        fileType: 'original',
        notes: 'Initial submission',
      },
      {
        id: 'file-010',
        fileName: 'ai-healthcare-v2.pdf',
        fileUrl: 'https://example.com/files/ai-healthcare-v2.pdf',
        uploadedAt: new Date('2026-05-15'),
        uploadedBy: '2',
        uploadedByName: 'Prof. John Doe',
        version: 2,
        fileType: 'revision',
        notes: 'Revised version incorporating reviewer feedback',
      },
    ],
    revisionHistory: [
      {
        id: 'rev-hist-015',
        date: new Date('2026-04-01'),
        status: 'pending',
        changedBy: '2',
        changedByName: 'Prof. John Doe',
        notes: 'Initial submission',
      },
      {
        id: 'rev-hist-016',
        date: new Date('2026-04-05'),
        status: 'review',
        changedBy: '3',
        changedByName: 'Dr. Sarah Johnson',
        notes: 'Assigned to reviewers',
      },
      {
        id: 'rev-hist-017',
        date: new Date('2026-05-20'),
        status: 'copyediting',
        changedBy: '3',
        changedByName: 'Dr. Sarah Johnson',
        notes: 'All reviews completed - moved to copyediting for final editorial recommendation',
      },
    ],
  },
  {
    id: 'ms-007',
    title: 'Renewable Energy Systems and Smart Grid Integration',
    authorId: '2',
    authorName: 'Prof. John Doe',
    abstract:
      'This study examines the integration of renewable energy sources into smart grid infrastructure, analyzing efficiency improvements and load balancing strategies.',
    content: 'Full manuscript content would be here...',
    status: 'review',
    submittedAt: new Date('2026-05-15'),
    updatedAt: new Date('2026-05-20'),
    assignedEditorId: '3',
    assignedReviewers: ['4', '5'],
    category: 'Energy Systems',
    files: [
      {
        id: 'file-011',
        fileName: 'renewable-energy-smartgrid-v1.pdf',
        fileUrl: 'https://example.com/files/renewable-energy-v1.pdf',
        uploadedAt: new Date('2026-05-15'),
        uploadedBy: '2',
        uploadedByName: 'Prof. John Doe',
        version: 1,
        fileType: 'original',
        notes: 'Initial submission',
      },
    ],
    revisionHistory: [
      {
        id: 'rev-hist-018',
        date: new Date('2026-05-15'),
        status: 'pending',
        changedBy: '2',
        changedByName: 'Prof. John Doe',
        notes: 'Manuscript submitted',
      },
      {
        id: 'rev-hist-019',
        date: new Date('2026-05-18'),
        status: 'review',
        changedBy: '3',
        changedByName: 'Dr. Sarah Johnson',
        notes: 'Reviewers invited - awaiting response',
      },
    ],
  },
];

export const mockReviews: Review[] = [
  {
    id: 'rev-002',
    manuscriptId: 'ms-004',
    reviewerId: '4',
    reviewerName: 'Dr. Michael Chen',
    decision: 'major_revision',
    comments:
      'The research is promising but needs significant improvements. The methodology section lacks detail, and more case studies are needed to support the conclusions.',
    grammaticalCorrections: 'Several grammatical issues in sections 2 and 4',
    suggestedRevisions: 'Expand methodology, add 3-4 case studies, strengthen the conclusion',
    submittedAt: new Date('2026-05-03'),
    deadline: new Date('2026-05-05'),
    status: 'completed',
  },
  {
    id: 'rev-003',
    manuscriptId: 'ms-005',
    reviewerId: '4',
    reviewerName: 'Dr. Michael Chen',
    decision: 'accept',
    comments:
      'Outstanding contribution to the field. The methodology is sound and the results are significant.',
    submittedAt: new Date('2026-04-25'),
    deadline: new Date('2026-04-30'),
    status: 'completed',
  },
  {
    id: 'rev-008',
    manuscriptId: 'ms-006',
    reviewerId: '4',
    reviewerName: 'Dr. Michael Chen',
    decision: 'accept',
    comments:
      'Excellent research with significant clinical implications. The AI models are well-validated and the methodology is robust. Highly recommend for publication.',
    grammaticalCorrections: 'Minor typos in section 4',
    suggestedRevisions: 'Consider adding a brief discussion on ethical considerations',
    submittedAt: new Date('2026-05-10'),
    deadline: new Date('2026-05-15'),
    status: 'completed',
  },
  {
    id: 'rev-009',
    manuscriptId: 'ms-006',
    reviewerId: '5',
    reviewerName: 'Dr. Emily Brown',
    decision: 'accept_with_minor_changes',
    comments:
      'Strong contribution to medical AI research. The diagnostic accuracy results are impressive. Minor revisions needed to strengthen the discussion section.',
    grammaticalCorrections: 'None noted',
    suggestedRevisions: 'Expand discussion on limitations and future research directions',
    submittedAt: new Date('2026-05-12'),
    deadline: new Date('2026-05-15'),
    status: 'completed',
  },
  {
    id: 'rev-004',
    manuscriptId: 'ms-001',
    reviewerId: '4',
    reviewerName: 'Dr. Michael Chen',
    decision: 'minor_revision',
    comments: 'The manuscript presents promising research but requires some improvements. The methodology is sound, but the results section needs more detailed analysis. I recommend minor revisions before acceptance.',
    grammaticalCorrections: 'Minor grammatical issues in sections 3 and 4',
    suggestedRevisions: 'Expand the results analysis, add statistical significance tests, and improve figure captions',
    submittedAt: new Date('2026-05-26'),
    deadline: new Date('2026-06-08'),
    status: 'completed',
  },
  {
    id: 'rev-005',
    manuscriptId: 'ms-001',
    reviewerId: '5',
    reviewerName: 'Dr. Emily Brown',
    decision: 'pending',
    comments: '',
    deadline: new Date('2026-06-08'),
    status: 'pending',
  },
  {
    id: 'rev-006',
    manuscriptId: 'ms-004',
    reviewerId: '5',
    reviewerName: 'Dr. Emily Brown',
    decision: 'pending',
    comments: '',
    deadline: new Date('2026-06-05'),
    status: 'in_progress',
  },
  {
    id: 'rev-007',
    manuscriptId: 'ms-005',
    reviewerId: '5',
    reviewerName: 'Dr. Emily Brown',
    decision: 'accept_with_minor_changes',
    comments: 'This is a well-researched paper with significant contributions. The blockchain implementation examples are practical and well-documented. I recommend acceptance with minor editorial changes to improve clarity in sections 4 and 5.',
    grammaticalCorrections: 'Minor typos in sections 4 and 5, some figure captions need refinement',
    suggestedRevisions: 'Clarify the implementation details in section 4, add more discussion on scalability challenges',
    submittedAt: new Date('2026-04-20'),
    deadline: new Date('2026-04-30'),
    status: 'completed',
  },
  {
    id: 'rev-010',
    manuscriptId: 'ms-007',
    reviewerId: '4',
    reviewerName: 'Dr. Michael Chen',
    decision: 'pending',
    comments: '',
    deadline: new Date('2026-06-05'),
    status: 'pending',
  },
  {
    id: 'rev-011',
    manuscriptId: 'ms-007',
    reviewerId: '5',
    reviewerName: 'Dr. Emily Brown',
    decision: 'pending',
    comments: '',
    deadline: new Date('2026-06-05'),
    status: 'pending',
  },
];

export const mockComments: Comment[] = [
  {
    id: 'com-001',
    manuscriptId: 'ms-004',
    userId: '3',
    userName: 'Dr. Sarah Johnson',
    userRole: 'editor',
    content:
      'Please address the reviewer comments by June 5th. Focus particularly on expanding the methodology section and adding more case studies as suggested by Dr. Chen.',
    createdAt: new Date('2026-05-05'),
  },
  {
    id: 'com-002',
    manuscriptId: 'ms-005',
    userId: '3',
    userName: 'Dr. Sarah Johnson',
    userRole: 'editor',
    content: 'Excellent work! The revisions have significantly strengthened the paper. Approved for publication.',
    createdAt: new Date('2026-04-30'),
  },
  {
    id: 'com-003',
    manuscriptId: 'ms-003',
    userId: '3',
    userName: 'Dr. Sarah Johnson',
    userRole: 'editor',
    content: 'Your manuscript is currently under review. Dr. Emily Brown will provide feedback by May 15th.',
    createdAt: new Date('2026-05-05'),
  },
];

export const mockDesignFiles: DesignFile[] = [
  {
    id: 'design-001',
    manuscriptId: 'ms-002',
    layoutArtistId: '6',
    coverDesignUrl: 'https://via.placeholder.com/400x600?text=Book+Cover',
    layoutUrl: 'https://via.placeholder.com/800x1000?text=Layout+Preview',
    status: 'submitted',
    submittedAt: new Date('2026-04-30'),
  },
  {
    id: 'design-002',
    manuscriptId: 'ms-004',
    layoutArtistId: '6',
    status: 'pending',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    userId: '2',
    message: 'Revision requested for "Sustainable Urban Architecture"',
    type: 'warning',
    read: false,
    createdAt: new Date('2026-05-05'),
    relatedManuscriptId: 'ms-004',
  },
  {
    id: 'notif-002',
    userId: '1',
    message: 'Your manuscript "Blockchain Technology" has been approved!',
    type: 'success',
    read: false,
    createdAt: new Date('2026-04-30'),
    relatedManuscriptId: 'ms-005',
  },
  {
    id: 'notif-003',
    userId: '5',
    message: 'Review deadline approaching for "Neuroplasticity in Adult Learning"',
    type: 'warning',
    read: false,
    createdAt: new Date('2026-05-08'),
    relatedManuscriptId: 'ms-003',
  },
  {
    id: 'notif-004',
    userId: '3',
    message: 'New manuscript submitted: "Machine Learning Applications in Climate Science"',
    type: 'info',
    read: false,
    createdAt: new Date('2026-05-08'),
    relatedManuscriptId: 'ms-001',
  },
];
