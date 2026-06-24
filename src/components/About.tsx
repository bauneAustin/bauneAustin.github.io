import type { FC } from 'react';

interface AboutProps {
    onBack: () => void;
}

export const About: FC<AboutProps> = ({ onBack }) => {
    return (
        <div className="cozy-panel fade-in">
            <div className="back-header">
                <button className="cozy-button" onClick={onBack}>
                    ⬅️ Back to Menu
                </button>
            </div>

            <h2>🌳 Austin Baune</h2>

            <div className="cozy-divider"></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p>
                    Hello! I'm **Austin**, a fullstack software engineer.
                    I am interested in crafting tools, web dev, agentic coding, and designing valuable experiences for users.
                    When I'm not staring at a screen, I'm usually golfing, reading,
                    or messing around with some new tech.
                </p>

                <div className="character-sheet">
                    <div className="stat-item">
                        <span className="stat-label">Level</span>
                        <span className="stat-value">99 Developer (10 years professional experience)</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Current Tools</span>
                        <span className="stat-value">Agentic tooling, React, Typescript, Node, RsPack, Vite</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Active Buff</span>
                        <span className="stat-value">☕ Hot Coffee (+20 Focus, +5 Cozy)</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Main Skill</span>
                        <span className="stat-value">Fullstack Engineering</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Stamina</span>
                        <span className="stat-value">120 / 120</span>
                    </div>
                </div>

                <div className="cozy-divider"></div>

                <h3 style={{ textAlign: 'center', marginBottom: '8px' }}>Find Me Online</h3>
                <div className="signpost-container">
                    <a
                        href="https://github.com/bauneAustin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="signpost-link"
                    >
                        🐙 GitHub
                    </a>
                    <a
                        href="https://linkedin.com/in/austin-baune-2b19577b"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="signpost-link"
                    >
                        👔 LinkedIn
                    </a>
                </div>
            </div>
        </div>
    );
};
