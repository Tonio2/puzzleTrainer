import express from 'express';
import { authenticate } from '../middleware/auth';
import asyncHandler from 'express-async-handler';
import { createPuzzle, deletePuzzle, editPuzzle, fetchMyPuzzles, fetchOnePuzzle, fetchPublicPuzzles, handleReviewResult, togglePublic } from '../controllers/puzzle';

const router = express.Router();

router.use(authenticate);

router.post('/', asyncHandler(createPuzzle));
router.get('/mine', asyncHandler(fetchMyPuzzles));
router.get('/public', asyncHandler(fetchPublicPuzzles));
router.get('/:id', asyncHandler(fetchOnePuzzle));
router.patch('/:id', asyncHandler(editPuzzle));
router.patch('/toggle_public/:id', asyncHandler(togglePublic));
router.put('/review/:id', asyncHandler(handleReviewResult));
router.delete('/:id', asyncHandler(deletePuzzle));


export default router;
