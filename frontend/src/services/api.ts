import axios from 'axios';
import type { AnalysisResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const analyzeContent = async (
  file: File,
  campaignGoal?: string,
  targetAudience?: string,
  tonePreference?: string
): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  if (campaignGoal) formData.append('campaignGoal', campaignGoal);
  if (targetAudience) formData.append('targetAudience', targetAudience);
  if (tonePreference) formData.append('tonePreference', tonePreference);

  const response = await api.post<AnalysisResponse>('/analyze', formData);
  return response.data;
};
