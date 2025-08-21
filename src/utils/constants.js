export const ZODIAC_SIGNS = [
  {label: 'Aries ♈', value: 'aries', emoji: '♈', dates: 'Mar 21 - Apr 19'},
  {label: 'Taurus ♉', value: 'taurus', emoji: '♉', dates: 'Apr 20 - May 20'},
  {label: 'Gemini ♊', value: 'gemini', emoji: '♊', dates: 'May 21 - Jun 20'},
  {label: 'Cancer ♋', value: 'cancer', emoji: '♋', dates: 'Jun 21 - Jul 22'},
  {label: 'Leo ♌', value: 'leo', emoji: '♌', dates: 'Jul 23 - Aug 22'},
  {label: 'Virgo ♍', value: 'virgo', emoji: '♍', dates: 'Aug 23 - Sep 22'},
  {label: 'Libra ♎', value: 'libra', emoji: '♎', dates: 'Sep 23 - Oct 22'},
  {label: 'Scorpio ♏', value: 'scorpio', emoji: '♏', dates: 'Oct 23 - Nov 21'},
  {label: 'Sagittarius ♐', value: 'sagittarius', emoji: '♐', dates: 'Nov 22 - Dec 21'},
  {label: 'Capricorn ♑', value: 'capricorn', emoji: '♑', dates: 'Dec 22 - Jan 19'},
  {label: 'Aquarius ♒', value: 'aquarius', emoji: '♒', dates: 'Jan 20 - Feb 18'},
  {label: 'Pisces ♓', value: 'pisces', emoji: '♓', dates: 'Feb 19 - Mar 20'},
];

export const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#ec4899',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1e293b',
  textLight: '#64748b',
  textMuted: '#94a3b8',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  white: '#ffffff',
  black: '#000000',
  gradient: ['#6366f1', '#8b5cf6', '#ec4899'],
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


export const getToday = () => {
    return new Date().toISOString().split('T')[0];
}

export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};


export const getDaysAgo = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};