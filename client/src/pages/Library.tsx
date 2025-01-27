import React, { useState, useEffect } from 'react';
import API from 'services/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Puzzle } from '../interfaces';
import { showToast } from 'services/toast';

function Library() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [puzzles, setPuzzles] = useState<(Puzzle)[]>([]);

    const navigate = useNavigate();

    async function fetchProgresses() {
        if (!user) return;

        try {
            const response = await API.get('/puzzles/mine');
            setPuzzles(response.data);
        } catch (error: any) {
            showToast(error.response.data.message, 'error');
        }

        setLoading(false);
    }

    const handleReset = async (puzzle: Puzzle) => {
        //TODO: Implement reset
        console.log(puzzle);
        return;
    };

    const handleRepeat = (puzzle: Puzzle) => {
        navigate(`/training/specific/${puzzle._id}`);
    };

    const handleEdit = (puzzle: Puzzle) => {
        navigate(`/puzzleForm/${puzzle._id}`);
    };

    const switchPublic = async (puzzle: Puzzle) => {
        try {
            await API.patch(`/puzzles/toggle_public/${puzzle._id}`);
            setPuzzles((prevPuzzles) =>
                prevPuzzles.map((p) => (p._id === puzzle._id ? { ...puzzle, is_public: !puzzle.is_public } : puzzle))
            );
            showToast('Public status toggled', 'success');
        } catch (error: any) {
            showToast(error.response.data.message, 'error');
        }
    };

    const handleDelete = async (puzzle: Puzzle) => {
        try {
            await API.delete(`/puzzles/${puzzle._id}`);
            setPuzzles((prevPuzzles) => prevPuzzles.filter((p) => p._id !== puzzle._id));
            showToast('Puzzle removed', 'success');
        } catch (error: any) {
            showToast(error.response.data.message, 'error');
        }
    };

    useEffect(() => {
        fetchProgresses();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-center mb-4">My Catalogue</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Opening Name</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Description</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Interval</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Next Repetition</th>
                            <th className="px-4 py-2 text-center text-gray-700 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {puzzles.map((puzzle) => (
                            <tr key={puzzle._id} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-2">{puzzle.theme}</td>
                                <td className="px-4 py-2">{puzzle.details}</td>
                                <td className="px-4 py-2">{puzzle.interval_days}</td>
                                <td className="px-4 py-2">{new Date(puzzle.next_review_date).toLocaleDateString()}</td>
                                <td className="px-4 py-2 flex justify-center space-x-2">
                                    <button
                                        onClick={() => handleReset(puzzle)}
                                        className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => handleRepeat(puzzle)}
                                        className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                                        Repeat
                                    </button>
                                    <button
                                        onClick={() => handleEdit(puzzle)}
                                        className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => switchPublic(puzzle)}
                                        className="px-2 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">
                                        {puzzle.is_public ? "Make private" : "Make public"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(puzzle)}
                                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Library;