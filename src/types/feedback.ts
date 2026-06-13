export interface FeedbackProgram {
  uid: string;
  name: string;
  mode: string;
  program_type: string;
  price: string;
}

export interface Feedback {
  uid: string;
  name: string;
  email: string;
  message: string;
  rating: number;
  position: string;
  program: FeedbackProgram | null;
  created_at: string;
}

export interface PaginatedFeedbacks {
  count: number;
  next: string | null;
  previous: string | null;
  results: Feedback[];
}

export interface FeedbacksParams {
  email?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  program__uid?: string;
  search?: string;
}

export interface CreateFeedbackPayload {
  name: string;
  email: string;
  message: string;
  rating: number;
  position?: string;
  program_uid?: string;
}

export type UpdateFeedbackPayload = Partial<CreateFeedbackPayload>;
