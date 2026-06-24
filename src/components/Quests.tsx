import type { FC } from 'react';

interface QuestsProps {
  onBack: () => void;
}

interface Quest {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'active';
  reward: string;
  url?: string;
}

export const Quests: FC<QuestsProps> = ({ onBack }) => {
  const quests: Quest[] = [
    {
      id: 'habitown',
      name: "Habitown: Pixel Habit RPG",
      description: "A pixel-art habit-tracking game where tasks build a custom virtual village.",
      status: 'completed',
      reward: "⭐ 50 EXP & 10 Gold",
      url: "https://github.com"
    },
    {
      id: 'aseprite-mcp',
      name: "Aseprite MCP Tooling",
      description: "An MCP server linking pixel art workflows in Aseprite directly to developer environments.",
      status: 'completed',
      reward: "🎨 +5 Paint Skill",
      url: "https://github.com"
    },
    {
      id: 'portfolio-blog',
      name: "Construct the Valley Portfolio",
      description: "Build a cozy static portfolio landing page using Vite, React, and TypeScript.",
      status: 'active',
      reward: "🏠 +1 Home Comfort",
      url: "#"
    }
  ];

  return (
    <div className="cozy-panel fade-in">
      <div className="back-header">
        <button className="cozy-button" onClick={onBack}>
          ⬅️ Back to Menu
        </button>
      </div>

      <h2>⚔️ Quest Log</h2>
      <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '24px' }}>
        A list of completed ventures and active projects.
      </p>

      <div className="cozy-divider"></div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {quests.map(quest => (
          <div 
            key={quest.id} 
            style={{ 
              border: '2px solid var(--border-color)', 
              borderRadius: '8px', 
              padding: '16px',
              backgroundColor: quest.status === 'completed' ? '#fbf8f0' : '#fffdf9',
              opacity: quest.status === 'completed' ? 0.95 : 1
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
              <strong style={{ fontSize: '1.15rem' }}>
                {quest.name}
              </strong>
              <span 
                style={{ 
                  fontSize: '0.85rem', 
                  padding: '2px 8px', 
                  border: '2px solid var(--border-color)',
                  borderRadius: '4px',
                  backgroundColor: quest.status === 'completed' ? 'var(--sage-accent)' : 'var(--terracotta)',
                  color: '#ffffff',
                  fontWeight: 600,
                  marginLeft: 'auto'
                }}
              >
                {quest.status === 'completed' ? '✅ COMPLETED' : '🕒 IN PROGRESS'}
              </span>
            </div>
            
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              {quest.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
              <span>🏆 Reward: <strong>{quest.reward}</strong></span>
              {quest.url && quest.url !== '#' && (
                <a 
                  href={quest.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: 'var(--sage-accent)', fontWeight: 600, textDecoration: 'underline' }}
                >
                  View Details
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
