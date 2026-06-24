import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { getAllPosts } from '../lib/blog';

interface BlogProps {
    onBack: () => void;
    onSelectPost: (slug: string) => void;
}

export const Blog: FC<BlogProps> = ({ onBack, onSelectPost }) => {
    const allPosts = useMemo(() => getAllPosts(), []);

    const [searchText, setSearchText] = useState('');
    const [dateSort, setDateSort] = useState<'newest' | 'oldest'>('newest');
    const [selectedTag, setSelectedTag] = useState<string>('all');

    // Extract all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        allPosts.forEach(post => {
            post.tags.forEach(tag => tags.add(tag));
        });
        return ['all', ...Array.from(tags)];
    }, [allPosts]);

    // Filter and sort posts
    const filteredPosts = useMemo(() => {
        let result = [...allPosts];

        // Text Filter
        if (searchText.trim() !== '') {
            const query = searchText.toLowerCase();
            result = result.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.description.toLowerCase().includes(query) ||
                post.body.toLowerCase().includes(query) ||
                post.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Tag Filter
        if (selectedTag !== 'all') {
            result = result.filter(post => post.tags.includes(selectedTag));
        }

        // Date Sorting
        result.sort((a, b) => {
            const timeA = new Date(a.date).getTime();
            const timeB = new Date(b.date).getTime();
            return dateSort === 'newest' ? timeB - timeA : timeA - timeB;
        });

        return result;
    }, [allPosts, searchText, dateSort, selectedTag]);

    return (
        <div className="cozy-panel fade-in" style={{ maxWidth: '750px' }}>
            <div className="back-header">
                <button className="cozy-button" onClick={onBack}>
                    ⬅️ Back to Menu
                </button>
            </div>

            <h2>📖 The Bookshelf</h2>
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '36px' }}>
                A collection of thoughts, designs, and field notes.
            </p>

            <div className="cozy-divider"></div>

            {/* Filter and Search Box */}
            <div className="search-filter-box" style={{ marginBottom: '24px' }}>
                <input
                    type="text"
                    placeholder="🔍 Search entries by text..."
                    className="cozy-input"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <div className="filter-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sort by Date:</span>
                        <select
                            className="filter-select"
                            value={dateSort}
                            onChange={(e) => setDateSort(e.target.value as 'newest' | 'oldest')}
                        >
                            <option value="newest">📅 Newest First</option>
                            <option value="oldest">⏳ Oldest First</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Tag:</span>
                        <select
                            className="filter-select"
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                        >
                            {allTags.map(tag => (
                                <option key={tag} value={tag}>
                                    {tag === 'all' ? '🏷️ All Tags' : `#${tag}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="cozy-divider"></div>

            {/* Blog Post List */}
            <div className="blog-list" style={{ marginTop: '24px' }}>
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <article key={post.slug} className="blog-item">
                            <div className="blog-meta">
                                <span>📅 {post.date}</span>
                                <span>•</span>
                                <span>🏷️ {post.tags.map(t => `#${t}`).join(', ')}</span>
                            </div>
                            <a
                                href={`#post-${post.slug}`}
                                className="blog-title-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSelectPost(post.slug);
                                }}
                            >
                                {post.title}
                            </a>
                            <p className="blog-summary">{post.description}</p>
                        </article>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No journal entries match your search. Try another path.
                    </div>
                )}
            </div>
        </div>
    );
};
