export interface User {
    email: string;
    id: string;
    role: string;
};

export interface Puzzle {
    _id: string;
    theme: string;
    details: string | null;
    setup: string;
    moves: string;
    interval_days: number;
    next_review_date: string;
    created_at: string;
    created_by: string;
    is_public: boolean;
  }