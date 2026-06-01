export type UserRole = 'author' | 'editor' | 'reviewer' | 'layout_artist' | 'admin' | 'editor_in_chief' | 'twg_coordinator' | 'twg_copyeditor' | 'twg_layout' | 'twg_production_coordinator' | 'twg_print_coordinator' | 'twg_distribution';

export type ManuscriptStatus =
  | 'pending'
  | 'review'
  | 'copyediting'
  | 'production'
  | 'rejected';

export type ReviewDecision = 'accept' | 'minor_revision' | 'major_revision' | 'reject' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
}

export interface ManuscriptFile {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
  uploadedByName: string;
  version: number;
  fileType: 'original' | 'revision' | 'reviewer_feedback' | 'editor_feedback';
  notes?: string;
}

export interface Manuscript {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  abstract: string;
  content: string;
  status: ManuscriptStatus;
  submittedAt: Date;
  updatedAt: Date;
  assignedEditorId?: string;
  assignedReviewers: string[];
  category: string;
  fileUrl?: string;
  files: ManuscriptFile[];
  revisionHistory: Array<{
    id: string;
    date: Date;
    status: ManuscriptStatus;
    changedBy: string;
    changedByName: string;
    notes: string;
  }>;
}

export interface Review {
  id: string;
  manuscriptId: string;
  reviewerId: string;
  reviewerName: string;
  decision: ReviewDecision;
  comments: string;
  grammaticalCorrections?: string;
  suggestedRevisions?: string;
  submittedAt?: Date;
  deadline: Date;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Comment {
  id: string;
  manuscriptId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  createdAt: Date;
}

export interface DesignFile {
  id: string;
  manuscriptId: string;
  layoutArtistId: string;
  coverDesignUrl?: string;
  layoutUrl?: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved';
  submittedAt?: Date;
  approvedAt?: Date;
  revisionNotes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: Date;
  relatedManuscriptId?: string;
}

// ML Data Types

export type ComplexityLevel = 'low' | 'medium' | 'high';
export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';
export type MethodologyType = 'qualitative' | 'quantitative' | 'mixed' | 'theoretical' | 'empirical';

export interface ManuscriptComplexity {
  id: string;
  manuscriptId: string;
  category: string;
  submissionType: string;
  researchArea: string;
  subfield: string;
  pageCount: number;
  wordCount: number;
  authorCount: number;
  chapterCount: number;
  referenceCount: number;
  figureCount: number;
  tableCount: number;
  methodologyType: MethodologyType;
  complexityScore: number;
  complexityLevel: ComplexityLevel;
  reviewDifficulty: number;
  productionDifficulty: number;
  calculatedAt: Date;
}

export interface ReviewerProfile {
  id: string;
  name: string;
  email: string;
  institution: string;
  department: string;
  position: string;
  highestDegree: string;
  expertiseAreas: string[];
  researchInterests: string[];
  yearsOfExperience: number;
  averageReviewDays: number;
  currentWorkload: number;
  maximumWorkload: number;
  availabilityStatus: AvailabilityStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewerPerformance {
  id: string;
  reviewerId: string;
  reviewsCompleted: number;
  averageReviewDuration: number;
  onTimeCompletionRate: number;
  overdueReviews: number;
  activeAssignments: number;
  performanceRating: number;
  reliabilityScore: number;
  efficiencyScore: number;
  lastReviewDate?: Date;
  updatedAt: Date;
}

export interface WorkflowHistory {
  id: string;
  manuscriptId: string;
  category: string;
  complexityScore: number;
  editorialAssessmentDays: number;
  reviewerInvitationDays: number;
  reviewDays: number;
  revisionDays: number;
  reReviewDays: number;
  copyeditingDays: number;
  layoutDays: number;
  publicationDays: number;
  totalProcessingDays: number;
  completedAt: Date;
}

export interface ProductionWorkload {
  id: string;
  role: 'copyeditor' | 'layout_artist' | 'production_coordinator';
  userId: string;
  userName: string;
  activeTasks: number;
  pendingTasks: number;
  averageCompletionDays: number;
  currentCapacity: number;
  maxCapacity: number;
  updatedAt: Date;
}

export interface ReviewerMatchScore {
  reviewerId: string;
  reviewerName: string;
  expertiseMatch: number;
  workloadScore: number;
  availabilityScore: number;
  performanceScore: number;
  finalMatchScore: number;
  recommendationRank: number;
}

export interface TimelinePrediction {
  manuscriptId: string;
  editorialAssessmentDuration: number;
  reviewDuration: number;
  revisionDuration: number;
  reReviewDuration: number;
  copyeditingDuration: number;
  layoutDuration: number;
  publicationDuration: number;
  forecastPublicationDate: Date;
  riskLevel: 'low' | 'medium' | 'high';
  confidenceScore: number;
  calculatedAt: Date;
}
