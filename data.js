// ============================
// HELPHUB AI - DATA STORE
// ============================

const REQUESTS = [
  {
    id: 1,
    title: "Need help",
    description: "helpn needed",
    category: "Web Development",
    urgency: "High",
    status: "Solved",
    tags: ["HTML/CSS", "JavaScript"],
    author: "Ayesha Khan",
    location: "Karachi",
    helpers: 1,
    aiSummary: "Web Development request with high urgency. Best suited for members with relevant expertise.",
    aiTags: ["Web Development", "High"]
  },
  {
    id: 2,
    title: "Need help making my portfolio responsive before demo day",
    description: "My HTML/CSS portfolio breaks on tablets and I need layout guidance before tomorrow evening.",
    category: "Web Development",
    urgency: "High",
    status: "Solved",
    tags: ["HTML/CSS", "Responsive", "Portfolio"],
    author: "Sara Noor",
    location: "Karachi",
    helpers: 1,
    aiSummary: "Responsive layout issue with a short deadline. Best helpers are frontend mentors comfortable with CSS grids and media queries.",
    aiTags: ["Web Development", "High"]
  },
  {
    id: 3,
    title: "Looking for Figma feedback on a volunteer event poster",
    description: "I have a draft poster for a campus community event and want sharper hierarchy, spacing, and CTA copy.",
    category: "Design",
    urgency: "Medium",
    status: "Open",
    tags: ["Figma", "Poster", "Design Review"],
    author: "Ayesha Khan",
    location: "Lahore",
    helpers: 1,
    aiSummary: "A visual design critique request where feedback on hierarchy, spacing, and messaging would create the most value.",
    aiTags: ["Design", "Medium"]
  },
  {
    id: 4,
    title: "Need mock interview support for internship applications",
    description: "Applying to frontend internships and need someone to practice behavioral and technical interview questions with me.",
    category: "Career",
    urgency: "Low",
    status: "Solved",
    tags: ["Interview Prep", "Career", "Frontend"],
    author: "Sara Noor",
    location: "Remote",
    helpers: 2,
    aiSummary: "Career coaching request focused on confidence-building, behavioral answers, and entry-level frontend interviews.",
    aiTags: ["Career", "Low"]
  }
];

const USERS = [
  {
    id: 1,
    name: "Ayesha Khan",
    initials: "AK",
    color: "#f97316",
    role: "Both",
    location: "Karachi",
    trust: 100,
    contributions: 35,
    skills: ["Figma", "UI/UX", "HTML/CSS", "Career Guidance"],
    interests: ["Hackathons", "UI/UX", "Community Building"],
    badges: ["Design Ally", "Fast Responder", "Top Mentor"],
    email: "ayesha@helphub.ai"
  },
  {
    id: 2,
    name: "Hassan Ali",
    initials: "HA",
    color: "#2563eb",
    role: "Can Help",
    location: "Karachi",
    trust: 88,
    contributions: 24,
    skills: ["JavaScript", "React", "Git/GitHub"],
    interests: ["Open Source", "Web Apps"],
    badges: ["Code Rescuer", "Bug Hunter"],
    email: "hassan@helphub.ai"
  },
  {
    id: 3,
    name: "Sara Noor",
    initials: "SN",
    color: "#ef4444",
    role: "Need Help",
    location: "Lahore",
    trust: 74,
    contributions: 11,
    skills: ["Python", "Data Analysis"],
    interests: ["Data Science", "ML"],
    badges: ["Community Voice"],
    email: "sara@helphub.ai"
  }
];

const NOTIFICATIONS = [
  { id: 1, title: '"Need help" was marked as solved', type: "Status", time: "Just now", read: false },
  { id: 2, title: 'Ayesha Khan offered help on "Need help"', type: "Match", time: "Just now", read: false },
  { id: 3, title: 'Your request "Need help" is now live in the community feed', type: "Request", time: "Just now", read: false },
  { id: 4, title: '"Need help making my portfolio responsive before demo day" was marked as solved', type: "Status", time: "Just now", read: false },
  { id: 5, title: '"Need help making my portfolio responsive before demo day" was marked as solved', type: "Status", time: "Just now", read: false },
  { id: 6, title: '"Need help making my portfolio responsive before demo day" was marked as solved', type: "Status", time: "Just now", read: false },
  { id: 7, title: 'New helper matched to your responsive portfolio request', type: "Match", time: "12 min ago", read: false },
  { id: 8, title: 'Your trust score increased after a solved request', type: "Reputation", time: "1 hr ago", read: false },
  { id: 9, title: 'AI Center detected rising demand for interview prep', type: "Insight", time: "Today", read: true }
];

const MESSAGES = [
  { from: "Ayesha Khan", to: "Sara Noor", text: "I checked your portfolio request. Share the breakpoint screenshots and I can suggest fixes.", time: "09:45 AM" },
  { from: "Hassan Ali", to: "Ayesha Khan", text: "Your event poster concept is solid. I would tighten the CTA and reduce the background texture.", time: "11:10 AM" }
];

// Session storage helpers
function getSession() {
  try { return JSON.parse(localStorage.getItem('helphub_session')) || null; } catch { return null; }
}
function setSession(data) {
  localStorage.setItem('helphub_session', JSON.stringify(data));
}
function clearSession() {
  localStorage.removeItem('helphub_session');
}

function getCurrentUser() {
  const session = getSession();
  if (!session) return USERS[0]; // Default to Ayesha
  return USERS.find(u => u.name === session.user) || USERS[0];
}

// Utility: tag class mapping
function tagClass(text) {
  const t = text.toLowerCase();
  if (t === 'high') return 'high';
  if (t === 'medium') return 'medium';
  if (t === 'low') return 'low';
  if (t === 'solved') return 'solved';
  if (t === 'open') return 'open';
  if (t.includes('design') || t.includes('figma') || t.includes('ui')) return 'design';
  if (t.includes('career') || t.includes('interview')) return 'career';
  return '';
}