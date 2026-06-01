import React, { createContext, useContext, useState, ReactNode } from 'react';
import type {
  Manuscript,
  Review,
  Comment,
  DesignFile,
  Notification,
  User,
  ManuscriptStatus,
  ReviewDecision,
  ManuscriptFile,
  ManuscriptComplexity,
  ReviewerProfile,
  ReviewerPerformance,
  WorkflowHistory,
  ProductionWorkload,
} from '../types';
import {
  mockManuscripts,
  mockReviews,
  mockComments,
  mockDesignFiles,
  mockNotifications,
  mockUsers,
} from '../data/mockData';
import {
  mockReviewerProfiles,
  mockReviewerPerformance,
  mockManuscriptComplexities,
  mockWorkflowHistory,
  mockProductionWorkload,
} from '../data/mockMLData';

interface DataContextType {
  manuscripts: Manuscript[];
  reviews: Review[];
  comments: Comment[];
  designFiles: DesignFile[];
  notifications: Notification[];
  users: User[];
  reviewerProfiles: ReviewerProfile[];
  reviewerPerformance: ReviewerPerformance[];
  manuscriptComplexities: ManuscriptComplexity[];
  workflowHistory: WorkflowHistory[];
  productionWorkload: ProductionWorkload[];
  addManuscript: (manuscript: Omit<Manuscript, 'id' | 'submittedAt' | 'updatedAt'>) => void;
  updateManuscriptStatus: (manuscriptId: string, status: ManuscriptStatus) => void;
  assignReviewer: (manuscriptId: string, reviewerId: string) => void;
  submitReview: (review: Omit<Review, 'id' | 'submittedAt'>) => void;
  updateReview: (reviewId: string, decision: ReviewDecision, comments: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  updateDesignFile: (designFileId: string, updates: Partial<DesignFile>) => void;
  markNotificationRead: (notificationId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  uploadManuscriptFile: (
    manuscriptId: string,
    file: Omit<ManuscriptFile, 'id' | 'uploadedAt'>
  ) => void;
  addReviewerProfile: (profile: Omit<ReviewerProfile, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReviewerProfile: (reviewerId: string, updates: Partial<ReviewerProfile>) => void;
  addManuscriptComplexity: (complexity: Omit<ManuscriptComplexity, 'id' | 'calculatedAt'>) => void;
  updateProductionWorkload: (workloadId: string, updates: Partial<ProductionWorkload>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>(mockManuscripts);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [designFiles, setDesignFiles] = useState<DesignFile[]>(mockDesignFiles);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [reviewerProfiles, setReviewerProfiles] = useState<ReviewerProfile[]>(mockReviewerProfiles);
  const [reviewerPerformance, setReviewerPerformance] = useState<ReviewerPerformance[]>(mockReviewerPerformance);
  const [manuscriptComplexities, setManuscriptComplexities] = useState<ManuscriptComplexity[]>(mockManuscriptComplexities);
  const [workflowHistory, setWorkflowHistory] = useState<WorkflowHistory[]>(mockWorkflowHistory);
  const [productionWorkload, setProductionWorkload] = useState<ProductionWorkload[]>(mockProductionWorkload);

  const addManuscript = (manuscript: Omit<Manuscript, 'id' | 'submittedAt' | 'updatedAt' | 'files' | 'revisionHistory'>) => {
    const newManuscript: Manuscript = {
      ...manuscript,
      id: `ms-${String(manuscripts.length + 1).padStart(3, '0')}`,
      submittedAt: new Date(),
      updatedAt: new Date(),
      status: 'pending',
      files: [],
      revisionHistory: [
        {
          id: `rev-hist-${Date.now()}`,
          date: new Date(),
          status: 'pending',
          changedBy: manuscript.authorId,
          changedByName: manuscript.authorName,
          notes: 'Initial manuscript submission',
        },
      ],
    };
    setManuscripts([...manuscripts, newManuscript]);
  };

  const updateManuscriptStatus = (manuscriptId: string, status: ManuscriptStatus) => {
    setManuscripts(
      manuscripts.map((ms) =>
        ms.id === manuscriptId ? { ...ms, status, updatedAt: new Date() } : ms
      )
    );
  };

  const assignReviewer = (manuscriptId: string, reviewerId: string) => {
    setManuscripts(
      manuscripts.map((ms) =>
        ms.id === manuscriptId
          ? {
              ...ms,
              assignedReviewers: [...ms.assignedReviewers, reviewerId],
              updatedAt: new Date(),
            }
          : ms
      )
    );
  };

  const submitReview = (review: Omit<Review, 'id' | 'submittedAt'>) => {
    const newReview: Review = {
      ...review,
      id: `rev-${String(reviews.length + 1).padStart(3, '0')}`,
      submittedAt: new Date(),
      status: 'completed',
    };
    setReviews([...reviews, newReview]);
  };

  const updateReview = (reviewId: string, decision: ReviewDecision, reviewComments: string) => {
    setReviews(
      reviews.map((rev) =>
        rev.id === reviewId
          ? { ...rev, decision, comments: reviewComments, submittedAt: new Date(), status: 'completed' }
          : rev
      )
    );
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: `com-${String(comments.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
    };
    setComments([...comments, newComment]);
  };

  const updateDesignFile = (designFileId: string, updates: Partial<DesignFile>) => {
    setDesignFiles(
      designFiles.map((df) => (df.id === designFileId ? { ...df, ...updates } : df))
    );
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(
      notifications.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif))
    );
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, ...updates } : user)));
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
    };
    setUsers([...users, newUser]);
  };

  const uploadManuscriptFile = (
    manuscriptId: string,
    file: Omit<ManuscriptFile, 'id' | 'uploadedAt'>
  ) => {
    const newFile: ManuscriptFile = {
      ...file,
      id: `file-${Date.now()}`,
      uploadedAt: new Date(),
    };

    setManuscripts(
      manuscripts.map((ms) =>
        ms.id === manuscriptId
          ? {
              ...ms,
              files: [...ms.files, newFile],
              updatedAt: new Date(),
            }
          : ms
      )
    );
  };

  const addReviewerProfile = (profile: Omit<ReviewerProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProfile: ReviewerProfile = {
      ...profile,
      id: `rev-${String(reviewerProfiles.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setReviewerProfiles([...reviewerProfiles, newProfile]);
  };

  const updateReviewerProfile = (reviewerId: string, updates: Partial<ReviewerProfile>) => {
    setReviewerProfiles(
      reviewerProfiles.map((profile) =>
        profile.id === reviewerId ? { ...profile, ...updates, updatedAt: new Date() } : profile
      )
    );
  };

  const addManuscriptComplexity = (complexity: Omit<ManuscriptComplexity, 'id' | 'calculatedAt'>) => {
    const newComplexity: ManuscriptComplexity = {
      ...complexity,
      id: `comp-${String(manuscriptComplexities.length + 1).padStart(3, '0')}`,
      calculatedAt: new Date(),
    };
    setManuscriptComplexities([...manuscriptComplexities, newComplexity]);
  };

  const updateProductionWorkload = (workloadId: string, updates: Partial<ProductionWorkload>) => {
    setProductionWorkload(
      productionWorkload.map((workload) =>
        workload.id === workloadId ? { ...workload, ...updates, updatedAt: new Date() } : workload
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        manuscripts,
        reviews,
        comments,
        designFiles,
        notifications,
        users,
        reviewerProfiles,
        reviewerPerformance,
        manuscriptComplexities,
        workflowHistory,
        productionWorkload,
        addManuscript,
        updateManuscriptStatus,
        assignReviewer,
        submitReview,
        updateReview,
        addComment,
        updateDesignFile,
        markNotificationRead,
        updateUser,
        addUser,
        uploadManuscriptFile,
        addReviewerProfile,
        updateReviewerProfile,
        addManuscriptComplexity,
        updateProductionWorkload,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
