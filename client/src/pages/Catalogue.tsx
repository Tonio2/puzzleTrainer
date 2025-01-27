import React, { useState, useEffect } from 'react';
import API from 'services/api';
import { useAuth } from '../hooks/useAuth';
import { Puzzle } from '../interfaces';
import { showToast } from 'services/toast';

function Library() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [puzzles, setPuzzles] = useState<(Puzzle)[]>([]);

    async function fetchPuzzles() {
        try {
            const response = await API.get('/puzzles/public');
            setPuzzles(response.data);
            console.log(response.data);
        } catch (error: any) {
            showToast(error.response.data.message, 'error');
        }

        setLoading(false);
    }

    const add = async (puzzle: Puzzle) => {
        try {
            const puzzleData = {
                theme: puzzle.theme,
                details: puzzle.details,
                setup: puzzle.setup,
                moves: puzzle.moves,
            };
            await API.post('/puzzles', puzzleData);
            showToast('Puzzle added successfully', 'success');
        } catch (error: any) {
            showToast(error.response.data.message, 'error');
        }
    };


    useEffect(() => {
        fetchPuzzles();
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
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Author</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Theme</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-medium">Details</th>
                            <th className="px-4 py-2 text-center text-gray-700 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {puzzles.map((puzzle) => (
                            <tr key={puzzle._id} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-2">TODO</td>
                                <td className="px-4 py-2">{puzzle.theme}</td>
                                <td className="px-4 py-2">{puzzle.details}</td>
                                <td className="px-4 py-2 flex justify-center space-x-2">

                                    <button
                                        onClick={() => add(puzzle)}
                                        className="px-2 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">
                                        Add
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