export type SuggestedKpi = {
  title: string;
  description: string;
  targetValue: string;
};

export type SuggestKpisEvent = {
  suggestKpis: { kpis: { kpis: SuggestedKpi[] } };
};
