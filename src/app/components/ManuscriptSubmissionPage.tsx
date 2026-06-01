import React, { useState } from 'react';
import {
  Upload,
  X,
  Plus,
  FileText,
  Image as ImageIcon,
  Paperclip,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Users,
} from 'lucide-react';

interface CoAuthor {
  id: string;
  name: string;
  email: string;
  affiliation: string;
  role: string;
}

interface ManuscriptSubmissionPageProps {
  onBack?: () => void;
  onSubmit?: (data: any) => void;
}

export function ManuscriptSubmissionPage({ onBack, onSubmit }: ManuscriptSubmissionPageProps) {
  // Manuscript Metadata
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [manuscriptType, setManuscriptType] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('English');
  const [targetPublication, setTargetPublication] = useState('');
  const [wordCount, setWordCount] = useState('');

  // Author Information
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorContact, setAuthorContact] = useState('');
  const [authorAffiliation, setAuthorAffiliation] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [authorOrcid, setAuthorOrcid] = useState('');
  const [authorAddress, setAuthorAddress] = useState('');

  // Co-authors
  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([]);
  const [showAddCoAuthor, setShowAddCoAuthor] = useState(false);

  // File Uploads
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [supplementaryFiles, setSupplementaryFiles] = useState<File[]>([]);
  const [figuresFiles, setFiguresFiles] = useState<File[]>([]);

  // Submission Agreements
  const [originalityConfirmed, setOriginalityConfirmed] = useState(false);
  const [copyrightAgreed, setCopyrightAgreed] = useState(false);
  const [dataPrivacyConsent, setDataPrivacyConsent] = useState(false);
  const [conflictOfInterest, setConflictOfInterest] = useState(false);
  const [ethicalCompliance, setEthicalCompliance] = useState(false);

  // Form State
  const [currentSection, setCurrentSection] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const addCoAuthor = (coAuthor: CoAuthor) => {
    setCoAuthors([...coAuthors, coAuthor]);
    setShowAddCoAuthor(false);
  };

  const removeCoAuthor = (id: string) => {
    setCoAuthors(coAuthors.filter((ca) => ca.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleMultipleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (files: File[]) => void, existingFiles: File[]) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setter([...existingFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number, files: File[], setter: (files: File[]) => void) => {
    setter(files.filter((_, i) => i !== index));
  };

  const allAgreementsChecked = originalityConfirmed && copyrightAgreed && dataPrivacyConsent && conflictOfInterest && ethicalCompliance;

  const handleSubmit = () => {
    if (!allAgreementsChecked) {
      alert('Please accept all submission agreements before submitting.');
      return;
    }

    const submissionData = {
      manuscript: { title, subtitle, abstract, keywords, manuscriptType, genre, language, targetPublication, wordCount },
      author: { authorName, authorEmail, authorContact, authorAffiliation, authorBio, authorOrcid, authorAddress },
      coAuthors,
      files: { manuscriptFile, coverLetter, coverLetterFile, supplementaryFiles, figuresFiles },
      agreements: { originalityConfirmed, copyrightAgreed, dataPrivacyConsent, conflictOfInterest, ethicalCompliance },
    };

    if (onSubmit) {
      onSubmit(submissionData);
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F7F8FA' }}>
        <div className="max-w-2xl w-full bg-white rounded-xl p-12 text-center" style={{ border: '0.5px solid #EAEDF2' }}>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-[32px] font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif', color: '#2C2C2A' }}>
            Submission Successful
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            Your manuscript "<strong>{title}</strong>" has been successfully submitted.
          </p>
          <p className="text-gray-600 mb-8">
            You will receive a confirmation email shortly. Our editorial team will review your submission and contact you within 5-7 business days.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-sm p-4 mb-8">
            <p className="text-sm text-blue-900">
              <strong>Manuscript ID:</strong> MS-{Date.now().toString().slice(-6)}
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-8 py-3 bg-[#0F2D5E] text-white rounded-sm hover:bg-[#1A4A8A] transition-colors font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 1, title: 'Manuscript Details' },
    { id: 2, title: 'Author Information' },
    { id: 3, title: 'Co-Authors' },
    { id: 4, title: 'File Uploads' },
    { id: 5, title: 'Review & Submit' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <div className="bg-[#0F2D5E] text-white py-6 px-6 shadow-md">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-sm transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-serif font-semibold">Submit New Manuscript</h1>
              <p className="text-sm text-gray-300 mt-1">
                Complete all sections to submit your manuscript for review
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-6">
            {sections.map((section, index) => (
              <React.Fragment key={section.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentSection === section.id
                        ? 'bg-white text-[#1a1f2e]'
                        : currentSection > section.id
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 text-white/60'
                    }`}
                  >
                    {currentSection > section.id ? <CheckCircle className="w-5 h-5" /> : section.id}
                  </div>
                  <span className="hidden md:inline text-sm">{section.title}</span>
                </div>
                {index < sections.length - 1 && (
                  <div className={`h-0.5 w-8 ${currentSection > section.id ? 'bg-green-500' : 'bg-white/20'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto py-8 px-6">
        <div className="bg-white rounded-lg shadow-md border border-[#EAEDF2] p-8">
          {/* Section 1: Manuscript Details */}
          {currentSection === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-[#1a1f2e] mb-6">
                  Manuscript Details
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manuscript Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
                  placeholder="Enter the main title of your manuscript"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
                  placeholder="Enter subtitle if applicable"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abstract <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent resize-none"
                  placeholder="Provide a concise summary of your manuscript (150-250 words recommended)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{abstract.length} characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
                    placeholder="Type a keyword and press Enter or click Add"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="px-4 py-2.5 bg-[#0F2D5E] text-white rounded-sm hover:bg-[#1A4A8A] transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-full text-sm"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                {keywords.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2">Add 3-6 keywords to help categorize your manuscript</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manuscript Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={manuscriptType}
                    onChange={(e) => setManuscriptType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="research_article">Research Article</option>
                    <option value="review">Review</option>
                    <option value="case_study">Case Study</option>
                    <option value="short_communication">Short Communication</option>
                    <option value="editorial">Editorial</option>
                    <option value="letter">Letter</option>
                    <option value="book_chapter">Book Chapter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre/Category/Research Area <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="environmental_science">Environmental Science</option>
                    <option value="computer_science">Computer Science</option>
                    <option value="medicine">Medicine</option>
                    <option value="biology">Biology</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="social_sciences">Social Sciences</option>
                    <option value="engineering">Engineering</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="humanities">Humanities</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
                    required
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Word Count <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
                    placeholder="e.g., 5000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Publication/Journal <span className="text-gray-400">(optional)</span>
                </label>
                <select
                  value={targetPublication}
                  onChange={(e) => setTargetPublication(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
                >
                  <option value="">Select target publication</option>
                  <option value="journal_a">Journal of Advanced Research</option>
                  <option value="journal_b">International Journal of Science</option>
                  <option value="journal_c">Academic Review Quarterly</option>
                  <option value="journal_d">Scientific Reports</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Section 2: Author Information */}
          {currentSection === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-[#1a1f2e] mb-2">
                  Author Information
                </h2>
                <p className="text-sm text-gray-600">
                  Provide your details as the primary author of this manuscript
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
                  placeholder="Dr. Jane Smith"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
                    placeholder="jane.smith@university.edu"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={authorContact}
                    onChange={(e) => setAuthorContact(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Affiliation/Institution <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={authorAffiliation}
                  onChange={(e) => setAuthorAffiliation(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
                  placeholder="Department of Computer Science, University Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Biography <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent resize-none"
                  placeholder="Brief professional biography (100-150 words)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ORCID ID <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={authorOrcid}
                  onChange={(e) => setAuthorOrcid(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
                  placeholder="0000-0000-0000-0000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  <a href="https://orcid.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Don't have an ORCID? Register here
                  </a>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={authorAddress}
                  onChange={(e) => setAuthorAddress(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent resize-none"
                  placeholder="Full mailing address"
                />
              </div>
            </div>
          )}

          {/* Section 3: Co-Authors */}
          {currentSection === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-[#1a1f2e] mb-2">
                  Co-Authors
                </h2>
                <p className="text-sm text-gray-600">
                  Add any co-authors who contributed to this manuscript
                </p>
              </div>

              {coAuthors.length === 0 && !showAddCoAuthor && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No co-authors added yet</p>
                  <button
                    type="button"
                    onClick={() => setShowAddCoAuthor(true)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F2D5E] text-white rounded-sm hover:bg-[#1A4A8A] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Co-Author
                  </button>
                </div>
              )}

              {coAuthors.map((coAuthor) => (
                <div key={coAuthor.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{coAuthor.name}</h3>
                      <p className="text-sm text-gray-600">{coAuthor.email}</p>
                      <p className="text-sm text-gray-600">{coAuthor.affiliation}</p>
                      <p className="text-xs text-gray-500 mt-1">Role: {coAuthor.role}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCoAuthor(coAuthor.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {coAuthors.length > 0 && !showAddCoAuthor && (
                <button
                  type="button"
                  onClick={() => setShowAddCoAuthor(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F2D5E] text-white rounded-sm hover:bg-[#1A4A8A] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Co-Author
                </button>
              )}

              {showAddCoAuthor && (
                <CoAuthorForm
                  onAdd={addCoAuthor}
                  onCancel={() => setShowAddCoAuthor(false)}
                />
              )}
            </div>
          )}

          {/* Section 4: File Uploads */}
          {currentSection === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-[#1a1f2e] mb-2">
                  File Uploads
                </h2>
                <p className="text-sm text-gray-600">
                  Upload all required files for your manuscript submission
                </p>
              </div>

              {/* Manuscript File */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manuscript File <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1a1f2e] transition-colors">
                  <input
                    type="file"
                    id="manuscript-file"
                    onChange={(e) => handleFileChange(e, setManuscriptFile)}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <label htmlFor="manuscript-file" className="cursor-pointer">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    {manuscriptFile ? (
                      <p className="text-sm text-gray-700 font-medium">{manuscriptFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-700 font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX (Max 20MB)</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <div className="mb-3">
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setCoverLetterFile(null)}
                      className={`px-4 py-2 rounded-sm text-sm ${!coverLetterFile ? 'bg-[#0F2D5E] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      Write Text
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverLetter('')}
                      className={`px-4 py-2 rounded-sm text-sm ${coverLetterFile ? 'bg-[#0F2D5E] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      Upload File
                    </button>
                  </div>

                  {!coverLetterFile ? (
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent resize-none"
                      placeholder="Dear Editor,&#10;&#10;I am submitting my manuscript titled..."
                      required={!coverLetterFile}
                    />
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1a1f2e] transition-colors">
                      <input
                        type="file"
                        id="cover-letter-file"
                        onChange={(e) => handleFileChange(e, setCoverLetterFile)}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                      <label htmlFor="cover-letter-file" className="cursor-pointer">
                        <Paperclip className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        {coverLetterFile ? (
                          <p className="text-sm text-gray-700 font-medium">{coverLetterFile.name}</p>
                        ) : (
                          <>
                            <p className="text-sm text-gray-700 font-medium">Click to upload cover letter</p>
                            <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX</p>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Supplementary Files */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplementary Files <span className="text-gray-400">(optional)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1a1f2e] transition-colors">
                  <input
                    type="file"
                    id="supplementary-files"
                    onChange={(e) => handleMultipleFileChange(e, setSupplementaryFiles, supplementaryFiles)}
                    multiple
                    className="hidden"
                  />
                  <label htmlFor="supplementary-files" className="cursor-pointer">
                    <Paperclip className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-700 font-medium">Click to upload supplementary files</p>
                    <p className="text-xs text-gray-500 mt-1">Data sets, appendices, code, etc.</p>
                  </label>
                </div>
                {supplementaryFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {supplementaryFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-sm">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index, supplementaryFiles, setSupplementaryFiles)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Figures/Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Figures/Images <span className="text-gray-400">(optional)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1a1f2e] transition-colors">
                  <input
                    type="file"
                    id="figures-files"
                    onChange={(e) => handleMultipleFileChange(e, setFiguresFiles, figuresFiles)}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <label htmlFor="figures-files" className="cursor-pointer">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-700 font-medium">Click to upload figures or images</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, TIFF (High resolution recommended)</p>
                  </label>
                </div>
                {figuresFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {figuresFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-sm">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index, figuresFiles, setFiguresFiles)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 5: Review & Submit */}
          {currentSection === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-[#1a1f2e] mb-2">
                  Review & Submit
                </h2>
                <p className="text-sm text-gray-600">
                  Please review your submission and accept the agreements below
                </p>
              </div>

              {/* Summary */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Manuscript Title</h3>
                  <p className="text-sm text-gray-700">{title || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Author</h3>
                  <p className="text-sm text-gray-700">{authorName || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Co-Authors</h3>
                  <p className="text-sm text-gray-700">{coAuthors.length > 0 ? `${coAuthors.length} co-author(s) added` : 'None'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Files</h3>
                  <p className="text-sm text-gray-700">
                    Manuscript: {manuscriptFile ? '✓' : '✗'} |
                    Cover Letter: {coverLetter || coverLetterFile ? '✓' : '✗'} |
                    Supplementary: {supplementaryFiles.length} |
                    Figures: {figuresFiles.length}
                  </p>
                </div>
              </div>

              {/* Submission Agreements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Submission Agreements</h3>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={originalityConfirmed}
                    onChange={(e) => setOriginalityConfirmed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#1a1f2e] rounded focus:ring-2 focus:ring-[#1a1f2e]"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    I confirm this manuscript is original and unpublished. It is not currently under consideration by any other journal or publication.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={copyrightAgreed}
                    onChange={(e) => setCopyrightAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#1a1f2e] rounded focus:ring-2 focus:ring-[#1a1f2e]"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    I agree to the copyright terms and conditions. I understand that if accepted, copyright will be transferred to the publisher.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={dataPrivacyConsent}
                    onChange={(e) => setDataPrivacyConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#1a1f2e] rounded focus:ring-2 focus:ring-[#1a1f2e]"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    I consent to the collection and processing of my personal data in accordance with the privacy policy.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={conflictOfInterest}
                    onChange={(e) => setConflictOfInterest(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#1a1f2e] rounded focus:ring-2 focus:ring-[#1a1f2e]"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    I declare that there are no conflicts of interest related to this manuscript, or any conflicts have been disclosed in the manuscript.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={ethicalCompliance}
                    onChange={(e) => setEthicalCompliance(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#1a1f2e] rounded focus:ring-2 focus:ring-[#1a1f2e]"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    I confirm that this research complies with all applicable ethical standards and that appropriate approvals were obtained where required.
                  </span>
                </label>
              </div>

              {!allAgreementsChecked && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-900">
                    You must accept all submission agreements before you can submit your manuscript.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
              disabled={currentSection === 1}
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentSection < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentSection(Math.min(5, currentSection + 1))}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F2D5E] text-white rounded-sm hover:bg-[#1A4A8A] transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!allAgreementsChecked}
                className="inline-flex items-center gap-2 px-8 py-2.5 bg-green-600 text-white rounded-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                Submit Manuscript
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Co-Author Form Component
function CoAuthorForm({ onAdd, onCancel }: { onAdd: (coAuthor: CoAuthor) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [role, setRole] = useState('');

  const handleAdd = () => {
    if (!name || !email || !affiliation || !role) {
      alert('Please fill in all co-author fields');
      return;
    }

    onAdd({
      id: `coauthor-${Date.now()}`,
      name,
      email,
      affiliation,
      role,
    });
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Add Co-Author</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Co-author Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
          placeholder="Dr. John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Co-author Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
          placeholder="john.doe@university.edu"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Co-author Affiliation <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={affiliation}
          onChange={(e) => setAffiliation(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
          placeholder="Department, Institution"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contribution Role <span className="text-red-500">*</span>
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent"
        >
          <option value="">Select role</option>
          <option value="Co-investigator">Co-investigator</option>
          <option value="Data Analyst">Data Analyst</option>
          <option value="Methodology">Methodology</option>
          <option value="Writing - Review & Editing">Writing - Review & Editing</option>
          <option value="Supervision">Supervision</option>
          <option value="Funding Acquisition">Funding Acquisition</option>
          <option value="Resources">Resources</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 px-6 py-2.5 bg-[#0F2D5E] text-white rounded-sm hover:bg-[#1A4A8A] transition-colors"
        >
          Add Co-Author
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-2.5 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
