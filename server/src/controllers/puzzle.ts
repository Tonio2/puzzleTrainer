// controllers/puzzleController.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Puzzle from '../models/Puzzle';
import PuzzleReview from '../models/PuzzleReview';
import Joi from 'joi';
import { AuthenticatedRequest } from '../types';

// Create Puzzle
export const createPuzzle = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const createPuzzleSchema = Joi.object({
        theme: Joi.string().required(),
        details: Joi.string().required(),
        setup: Joi.string().required(),
        moves: Joi.string().required(),
        is_public: Joi.boolean(),
    });
    const { error } = createPuzzleSchema.validate(req.body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }

    // TODO: Validate setup and moves

    const puzzle = new Puzzle({
        user_id: req.user!.id,
        ...req.body,
    });

    const createdPuzzle = await puzzle.save();
    res.status(201).json(createdPuzzle);
});

// Edit Puzzle
export const editPuzzle = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const updatePuzzleSchema = Joi.object({
        theme: Joi.string().required(),
        details: Joi.string().required(),
        setup: Joi.string().required(),
        moves: Joi.string().required(),
    });
    const { error } = updatePuzzleSchema.validate(req.body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }

    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) {
        res.status(404).json({ message: 'Puzzle not found' });
        return;
    }

    if (puzzle.user_id.toString() !== req.user!.id.toString()) {
        res.status(403).json({ message: 'Not authorized to edit this puzzle' });
        return;
    }

    Object.assign(puzzle, req.body);
    const updatedPuzzle = await puzzle.save();
    res.json(updatedPuzzle);
});

export const togglePublic = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) {
        res.status(404).json({ message: 'Puzzle not found' });
        return;
    }

    if (puzzle.user_id.toString() !== req.user!.id.toString()) {
        res.status(403).json({ message: 'Not authorized to edit this puzzle' });
        return;
    }

    puzzle.is_public = !puzzle.is_public;
    await puzzle.save();
    console.log(puzzle);
    res.status(200).json({ message: 'Public status toggled' });
});

// Fetch My Puzzles
export const fetchMyPuzzles = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const puzzles = await Puzzle.find({ user_id: req.user!.id });
    res.json(puzzles);
});

// Fetch Public Puzzles
export const fetchPublicPuzzles = asyncHandler(async (req: Request, res: Response) => {
    const puzzles = await Puzzle.find({is_public: true}).select('-interval_days -next_review_date');
    res.json(puzzles);
});

// Fetch One Puzzle
export const fetchOnePuzzle = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) {
        res.status(404).json({ message: 'Puzzle not found' });
        return;
    }
    if (!puzzle.is_public && puzzle.user_id.toString() !== req.user!.id.toString()) {
        res.status(403).json({ message: 'Not authorized to view this puzzle' });
        return;
    }
    res.json(puzzle);
});

// Delete Puzzle
export const deletePuzzle = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) {
        res.status(404).json({ message: 'Puzzle not found' });
        return;
    }

    if (puzzle.user_id.toString() !== req.user!.id.toString()) {
        res.status(403).json({ message: 'Not authorized to delete this puzzle' });
        return;
    }

    await Puzzle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Puzzle removed' });
});

// Handle Review Success
export const handleReviewResult = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const ReviewResultSchema = Joi.object({
        success: Joi.boolean().required(),
    });
    const { error } = ReviewResultSchema.validate(req.body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }

    const success = req.body.success;

    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) {
        res.status(404).json({ message: 'Puzzle not found' });
        return;
    }

    if (puzzle.user_id.toString() !== req.user!.id.toString()) {
        res.status(403).json({ message: 'Not authorized to delete this puzzle' });
        return;
    }
    
    const new_interval_days = success ? puzzle.interval_days == 0 ? 1 : puzzle.interval_days * 2 : 0;

    const review = new PuzzleReview({
        user_id: req.user!.id,
        puzzle_id: puzzle._id,
        success,
        interval_days: puzzle.interval_days,
    });

    await review.save();

    puzzle.interval_days = new_interval_days;
    puzzle.next_review_date = new Date(Date.now() + new_interval_days * 24 * 60 * 60 * 1000);
    await puzzle.save();

    res.json({ message: 'Review success handled' });
});