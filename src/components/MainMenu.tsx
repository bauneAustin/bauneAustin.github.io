import type { FC } from 'react';

interface MainMenuProps {
    onNavigate: (view: 'about' | 'blog' | 'quests' | 'mailbox') => void;
}

export const MainMenu: FC<MainMenuProps> = ({ onNavigate }) => {
    return (
        <div className="cozy-panel slide-in-menu">
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ marginBottom: '12px' }}>Austin Baune</h1>
                <p style={{ fontStyle: 'italic', marginBottom: '32px' }}>
                    Welcome, traveler. What shall we discover next.
                </p>
            </div>

            <div className="cozy-divider"></div>

            <div className="menu-grid">
                <button
                    className="cozy-button primary"
                    onClick={() => onNavigate('about')}
                >
                    🌳 About Me
                </button>

                <button
                    className="cozy-button secondary"
                    onClick={() => onNavigate('blog')}
                >
                    📖 Blog
                </button>

                <button
                    className="cozy-button tertiary"
                    onClick={() => onNavigate('quests')}
                >
                    ⚔️ Projects
                </button>

                <button
                    className="cozy-button"
                    onClick={() => onNavigate('mailbox')}
                >
                    ✉️ Contact
                </button>
            </div>

            <div className="cozy-divider"></div>

            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Press any button to explore.
            </div>
        </div>
    );
};
