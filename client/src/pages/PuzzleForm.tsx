import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from 'services/api';
import { showToast } from 'services/toast';

interface PuzzleForm {
    theme: string;
    details: string;
    setup: string;
    moves: string;
}

function PuzzleForm() {
    const { puzzle_id } = useParams(); // `id` will be present in the URL for editing
    const navigate = useNavigate();
    const [formData, setFormData] = useState<PuzzleForm>({ theme: '', details: '', setup: '', moves: '' });
    const [loading, setLoading] = useState(false);

    // Fetch puzzle if an `id` is present
    useEffect(() => {
        const fetchPuzzle = async () => {
            if (!puzzle_id) return;

            setLoading(true);
            try {
                const response = await API.get(`/puzzles/${puzzle_id}`);
                // Set relevant data to the form
                setFormData({
                    theme: response.data.theme,
                    details: response.data.details,
                    setup: response.data.setup,
                    moves: response.data.moves
                });
            } catch (error: any) {
                showToast(error.response.data.message, 'error');
            }

            setLoading(false);
        };

        console.log(puzzle_id);
        fetchPuzzle();
    }, [puzzle_id]);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        const setup = formData.setup === '' ? null : formData.setup;

        try {
            if (puzzle_id) {
                await API.patch(`/puzzles/${puzzle_id}`, {
                    ...formData,
                    setup
                });
            } else {
                await API.post('/puzzles', {
                    ...formData,
                    setup
                });
            }
            showToast('Puzzle saved successfully', 'success');
        } catch (error: any) {
            showToast(error.response.data.message, 'error');
        }

        setLoading(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{puzzle_id ? 'Edit Puzzle' : 'Create Puzzle'}</h1>
            {loading && (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}
            {!loading && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Theme</label>
                        <input
                            type="text"
                            name="theme"
                            value={formData.theme}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Details</label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Setup</label>
                        <input
                            type="text"
                            name="setup"
                            value={formData.setup}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Moves</label>
                        <input
                            type="text"
                            name="moves"
                            value={formData.moves}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)} // Go back to list
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {puzzle_id ? 'Update Puzzle' : 'Create Puzzle'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default PuzzleForm;