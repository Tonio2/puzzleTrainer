import mongoose, { Document, Schema } from 'mongoose';

export interface IPuzzleReview extends Document {
    user_id: mongoose.Types.ObjectId;
    puzzle_id: mongoose.Types.ObjectId;
    reviewed_at: Date;
    success: boolean;
    interval_days: number;
}

const PuzzleReviewSchema: Schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    puzzle_id: { type: Schema.Types.ObjectId, ref: 'Puzzle', required: true },
    reviewed_at: { type: Date, default: Date.now },
    success: { type: Boolean, required: true },
    interval_days: { type: Number, required: true },
});

export default mongoose.model<IPuzzleReview>('PuzzleReview', PuzzleReviewSchema);
