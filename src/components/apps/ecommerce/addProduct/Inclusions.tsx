import { Icon } from '@iconify/react';
import CardBox from 'src/components/shared/CardBox';
import { useState } from 'react';

interface InclusionItem {
    id: string;
    text: string;
}

interface InclusionsProps {
    eventData: {
        inclusions: InclusionItem[];
        exclusions: InclusionItem[];
    };
    setEventData: (data: any) => void;
}

const Inclusions = ({ eventData, setEventData }: InclusionsProps) => {
    const [newInclusion, setNewInclusion] = useState('');
    const [newExclusion, setNewExclusion] = useState('');
    const [editingInclusion, setEditingInclusion] = useState<string | null>(null);
    const [editingExclusion, setEditingExclusion] = useState<string | null>(null);
    const [editInclusionText, setEditInclusionText] = useState('');
    const [editExclusionText, setEditExclusionText] = useState('');

    // Inclusions handlers
    const addInclusion = () => {
        if (newInclusion.trim()) {
            const newItem: InclusionItem = {
                id: `inc_${Date.now()}`,
                text: newInclusion.trim(),
            };
            setEventData({
                ...eventData,
                inclusions: [...(eventData.inclusions || []), newItem],
            });
            setNewInclusion('');
        }
    };

    const deleteInclusion = (id: string) => {
        setEventData({
            ...eventData,
            inclusions: eventData.inclusions.filter((item) => item.id !== id),
        });
    };

    const startEditInclusion = (item: InclusionItem) => {
        setEditingInclusion(item.id);
        setEditInclusionText(item.text);
    };

    const saveEditInclusion = () => {
        if (editInclusionText.trim() && editingInclusion) {
            setEventData({
                ...eventData,
                inclusions: eventData.inclusions.map((item) =>
                    item.id === editingInclusion ? { ...item, text: editInclusionText.trim() } : item
                ),
            });
            setEditingInclusion(null);
            setEditInclusionText('');
        }
    };

    const cancelEditInclusion = () => {
        setEditingInclusion(null);
        setEditInclusionText('');
    };

    // Exclusions handlers
    const addExclusion = () => {
        if (newExclusion.trim()) {
            const newItem: InclusionItem = {
                id: `exc_${Date.now()}`,
                text: newExclusion.trim(),
            };
            setEventData({
                ...eventData,
                exclusions: [...(eventData.exclusions || []), newItem],
            });
            setNewExclusion('');
        }
    };

    const deleteExclusion = (id: string) => {
        setEventData({
            ...eventData,
            exclusions: eventData.exclusions.filter((item) => item.id !== id),
        });
    };

    const startEditExclusion = (item: InclusionItem) => {
        setEditingExclusion(item.id);
        setEditExclusionText(item.text);
    };

    const saveEditExclusion = () => {
        if (editExclusionText.trim() && editingExclusion) {
            setEventData({
                ...eventData,
                exclusions: eventData.exclusions.map((item) =>
                    item.id === editingExclusion ? { ...item, text: editExclusionText.trim() } : item
                ),
            });
            setEditingExclusion(null);
            setEditExclusionText('');
        }
    };

    const cancelEditExclusion = () => {
        setEditingExclusion(null);
        setEditExclusionText('');
    };

    const handleKeyPress = (e: React.KeyboardEvent, type: 'inclusion' | 'exclusion') => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (type === 'inclusion') {
                addInclusion();
            } else {
                addExclusion();
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* What's Included Card */}
            <CardBox>
                <div className="">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#e8f5e9] flex items-center justify-center">
                            <Icon icon="tabler:circle-check" className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">What's Included</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Items or services included in the event
                            </p>
                        </div>
                    </div>

                    {/* Add New Item */}
                    <div className="flex gap-3 mb-4">
                        <div className="relative flex-1">
                            <Icon
                                icon="tabler:plus"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            />
                            <input
                                type="text"
                                value={newInclusion}
                                onChange={(e) => setNewInclusion(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, 'inclusion')}
                                placeholder="Add an inclusion (e.g., Lunch included)"
                                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 
                bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 
                transition-all duration-200"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={addInclusion}
                            disabled={!newInclusion.trim()}
                            className="px-4 py- rounded-sm bg-primary hover:bg-primary/80 disabled:bg-gray-300 
              dark:disabled:bg-gray-700 text-white font-medium transition-all duration-200 
              disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Icon icon="tabler:plus" className="w-5 h-5" />
                            <span className="hidden sm:inline">Add</span>
                        </button>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                        {(!eventData.inclusions || eventData.inclusions.length === 0) ? (
                            <div className="text-center py-8 text-gray-400">
                                <Icon icon="tabler:list-check" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No inclusions added yet</p>
                            </div>
                        ) : (
                            eventData.inclusions.map((item) => (
                                <div
                                    key={item.id}
                                    className="group flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 
                  border border-green-100 dark:border-green-800/30 hover:shadow-md transition-all duration-200"
                                >
                                    <Icon icon="tabler:circle-check-filled" className="w-5 h-5 text-green-500 flex-shrink-0" />

                                    {editingInclusion === item.id ? (
                                        <div className="flex-1 flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={editInclusionText}
                                                onChange={(e) => setEditInclusionText(e.target.value)}
                                                className="flex-1 px-3 py-1.5 rounded-lg border border-green-300 dark:border-green-700 
                        bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm
                        focus:outline-none focus:ring-2 focus:ring-green-500/30"
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                onClick={saveEditInclusion}
                                                className="p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                                            >
                                                <Icon icon="tabler:check" className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEditInclusion}
                                                className="p-1.5 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 
                        hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                                            >
                                                <Icon icon="tabler:x" className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="flex-1 text-gray-700 dark:text-gray-200 text-sm">{item.text}</span>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={() => startEditInclusion(item)}
                                                    className="p-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/30 
                          text-gray-500 hover:text-green-600 transition-all"
                                                >
                                                    <Icon icon="tabler:edit" className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteInclusion(item.id)}
                                                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/30 
                          text-gray-500 hover:text-red-500 transition-all"
                                                >
                                                    <Icon icon="tabler:trash" className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Counter */}
                    {eventData.inclusions && eventData.inclusions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {eventData.inclusions.length} item{eventData.inclusions.length !== 1 ? 's' : ''} added
                            </p>
                        </div>
                    )}
                </div>
            </CardBox>

            {/* What's Not Included Card */}
            <CardBox>
                <div className="">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#ffebee] flex items-center justify-center">
                            <Icon icon="tabler:circle-x" className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">What's Not Included</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Items or services not part of the event
                            </p>
                        </div>
                    </div>

                    {/* Add New Item */}
                    <div className="flex gap-3 mb-4">
                        <div className="relative flex-1">
                            <Icon
                                icon="tabler:plus"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            />
                            <input
                                type="text"
                                value={newExclusion}
                                onChange={(e) => setNewExclusion(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, 'exclusion')}
                                placeholder="Add an exclusion (e.g., Transportation)"
                                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 
                bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 
                transition-all duration-200"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={addExclusion}
                            disabled={!newExclusion.trim()}
                            className="px-4 py-1 rounded-sm bg-primary hover:bg-primary/80 disabled:bg-gray-300 
              dark:disabled:bg-gray-700 text-white font-medium transition-all duration-200 
              disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Icon icon="tabler:plus" className="w-5 h-5" />
                            <span className="hidden sm:inline">Add</span>
                        </button>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                        {(!eventData.exclusions || eventData.exclusions.length === 0) ? (
                            <div className="text-center py-8 text-gray-400">
                                <Icon icon="tabler:list" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No exclusions added yet</p>
                            </div>
                        ) : (
                            eventData.exclusions.map((item) => (
                                <div
                                    key={item.id}
                                    className="group flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 
                  border border-red-100 dark:border-red-800/30 hover:shadow-md transition-all duration-200"
                                >
                                    <Icon icon="tabler:circle-x-filled" className="w-5 h-5 text-red-500 flex-shrink-0" />

                                    {editingExclusion === item.id ? (
                                        <div className="flex-1 flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={editExclusionText}
                                                onChange={(e) => setEditExclusionText(e.target.value)}
                                                className="flex-1 px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-700 
                        bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm
                        focus:outline-none focus:ring-2 focus:ring-red-500/30"
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                onClick={saveEditExclusion}
                                                className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                            >
                                                <Icon icon="tabler:check" className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEditExclusion}
                                                className="p-1.5 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 
                        hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                                            >
                                                <Icon icon="tabler:x" className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="flex-1 text-gray-700 dark:text-gray-200 text-sm">{item.text}</span>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={() => startEditExclusion(item)}
                                                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/30 
                          text-gray-500 hover:text-red-600 transition-all"
                                                >
                                                    <Icon icon="tabler:edit" className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteExclusion(item.id)}
                                                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/30 
                          text-gray-500 hover:text-red-500 transition-all"
                                                >
                                                    <Icon icon="tabler:trash" className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Counter */}
                    {eventData.exclusions && eventData.exclusions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {eventData.exclusions.length} item{eventData.exclusions.length !== 1 ? 's' : ''} added
                            </p>
                        </div>
                    )}
                </div>
            </CardBox>

            {/* Custom Scrollbar Style */}
            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
        </div>
    );
};

export default Inclusions;
