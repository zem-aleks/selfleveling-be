export const getXpForLevel = (level: number): number => {
  if (level <= 0) {
    return 0;
  }
  const xpRequired = 100 * (Math.log(level) + 1);
  return Math.round(xpRequired);
};
