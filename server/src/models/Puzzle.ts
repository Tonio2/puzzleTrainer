import mongoose, { Document, Schema } from 'mongoose';

export interface IPuzzle extends Document {
    user_id: mongoose.Types.ObjectId;
    theme: string;
    details: string;
    setup: string;
    moves: string;
    is_public: boolean;
    interval_days: number;
    next_review_date: Date;
    created_at: Date;
    updated_at: Date;
}

const PuzzleSchema: Schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    theme: { type: String, required: true },
    details: { type: String, required: true },
    setup: { type: String, required: true },
    moves: { type: String, required: true },
    is_public: { type: Boolean, required: true, default: false },
    interval_days: { type: Number, required: true, default: 0 },
    next_review_date: { type: Date, required: true, default: Date.now },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

export default mongoose.model<IPuzzle>('Puzzle', PuzzleSchema);
