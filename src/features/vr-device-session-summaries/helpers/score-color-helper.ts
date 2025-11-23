// --- Dynamic Color Theme Helper ---
export const getScoreTheme = (score: number) => {
    if (score >= 8.0) return {
      headerBg: 'bg-green-50/50',
      borderColor: 'border-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-700',
      subTextColor: 'text-green-600/70',
      barFill: 'bg-green-500',
      barTrack: 'bg-green-100' // Track color matches the theme
    };
    if (score >= 5.0) return {
      headerBg: 'bg-orange-50/50',
      borderColor: 'border-orange-100',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-700',
      subTextColor: 'text-orange-600/70',
      barFill: 'bg-orange-500',
      barTrack: 'bg-orange-100'
    };
    return {
      headerBg: 'bg-red-50/50',
      borderColor: 'border-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-700',
      subTextColor: 'text-red-600/70',
      barFill: 'bg-red-500',
      barTrack: 'bg-red-100'
    };
  };