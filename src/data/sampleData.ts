export interface HealthData {
  name: string;
  value: number;
}

export interface AgeData {
  age: string;
  count: number;
}

export interface ExposureData {
  month: string;
  pesticides: number;
  fertilizers: number;
}

export interface EmploymentData {
  name: string;
  value: number;
}

export interface BPData {
  systolic: number;
  diastolic: number;
  issues: number;
}

export interface PCAData {
  component: number;
  variance: number;
}

export interface FeatureData {
  feature: string;
  importance: number;
}

export const healthData: HealthData[] = [
  { name: 'Respiratory Issues', value: 30 },
  { name: 'Neurological Issues', value: 20 },
  { name: 'Cognitive Issues', value: 15 },
  { name: 'Skin Issues', value: 25 },
];

export const protectionData: HealthData[] = [
  { name: 'Never', value: 40 },
  { name: 'Sometimes', value: 30 },
  { name: 'Often', value: 20 },
  { name: 'Always', value: 10 },
];

export const ageData: AgeData[] = [
  { age: '20-30', count: 12 },
  { age: '30-40', count: 22 },
  { age: '40-50', count: 28 },
  { age: '50-60', count: 15 },
  { age: '60+', count: 4 },
];

export const exposureData: ExposureData[] = [
  { month: 'Jan', pesticides: 65, fertilizers: 45 },
  { month: 'Feb', pesticides: 59, fertilizers: 49 },
  { month: 'Mar', pesticides: 80, fertilizers: 72 },
  { month: 'Apr', pesticides: 81, fertilizers: 68 },
  { month: 'May', pesticides: 56, fertilizers: 49 },
  { month: 'Jun', pesticides: 55, fertilizers: 51 },
];

export const employmentData: EmploymentData[] = [
  { name: 'Permanent', value: 45 },
  { name: 'Seasonal', value: 50 },
  { name: 'Unspecified', value: 5 },
];

export const bpData: BPData[] = [
  { systolic: 110, diastolic: 75, issues: 0 },
  { systolic: 120, diastolic: 80, issues: 0 },
  { systolic: 115, diastolic: 78, issues: 0 },
  { systolic: 135, diastolic: 88, issues: 1 },
  { systolic: 145, diastolic: 95, issues: 1 },
  { systolic: 125, diastolic: 82, issues: 0 },
  { systolic: 118, diastolic: 75, issues: 0 },
  { systolic: 142, diastolic: 92, issues: 1 },
  { systolic: 128, diastolic: 84, issues: 0 },
  { systolic: 138, diastolic: 87, issues: 1 },
];

export const pcaData: PCAData[] = [
  { component: 1, variance: 15 },
  { component: 2, variance: 28 },
  { component: 3, variance: 38 },
  { component: 4, variance: 46 },
  { component: 5, variance: 53 },
  { component: 6, variance: 59 },
  { component: 7, variance: 64 },
  { component: 8, variance: 68 },
  { component: 9, variance: 72 },
];

export const featureData: FeatureData[] = [
  { feature: 'Pesticide Exposure', importance: 0.28 },
  { feature: 'Age', importance: 0.21 },
  { feature: 'Working Hours', importance: 0.18 },
  { feature: 'Experience', importance: 0.15 },
  { feature: 'Mask Usage', importance: 0.10 },
  { feature: 'Socioeconomic', importance: 0.08 },
];