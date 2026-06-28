export const ISSUE_STATUS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

export const ISSUE_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export const ISSUE_SEVERITY = {
  MINOR: 'Minor',
  MAJOR: 'Major',
  CRITICAL: 'Critical',
  BLOCKER: 'Blocker',
};

export const STATUS_OPTIONS = Object.values(ISSUE_STATUS).map(s => ({ value: s, label: s }));
export const PRIORITY_OPTIONS = Object.values(ISSUE_PRIORITY).map(p => ({ value: p, label: p }));
export const SEVERITY_OPTIONS = Object.values(ISSUE_SEVERITY).map(s => ({ value: s, label: s }));
