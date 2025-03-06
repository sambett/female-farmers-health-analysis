export interface HealthData {
    name: string;
    value: number;
  }
  
  export const healthData: HealthData[] = [
    { name: 'Respiratory Issues', value: 30 },
    { name: 'Neurological Issues', value: 20 },
    { name: 'Cognitive Issues', value: 15 },
    { name: 'Skin Issues', value: 25 },
  ];