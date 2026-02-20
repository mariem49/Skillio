export interface TrainingContent {
  id: number;
  title: string;
  contentUrl: string;
}

export interface Training {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  thumbnailUrl: string;
  language: string;
  status: string;
  contents: TrainingContent[];
}

