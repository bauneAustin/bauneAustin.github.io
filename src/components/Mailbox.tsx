import { useState } from 'react';
import type { FC, FormEvent } from 'react';

interface MailboxProps {
    onBack: () => void;
}

export const Mailbox: FC<MailboxProps> = ({ onBack }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Simulate sending mail
        setSent(true);
    };

    return (
        <div className="cozy-panel fade-in">
            <div className="back-header">
                <button className="cozy-button" onClick={onBack}>
                    ⬅️ Back to Menu
                </button>
            </div>

            <h2>✉️ Send a Letter</h2>
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '24px' }}>
                Drop a letter in the mailbox. A carrier pigeon will deliver it.
            </p>

            <div className="cozy-divider"></div>

            {sent ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                    <span style={{ fontSize: '3rem' }}>🕊️</span>
                    <h3 style={{ marginTop: '12px' }}>Letter Sent!</h3>
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        The carrier pigeon has taken flight. Thank you for your note!
                    </p>
                    <button
                        className="cozy-button primary"
                        style={{ marginTop: '20px' }}
                        onClick={() => {
                            setSent(false);
                            setName('');
                            setEmail('');
                            setMessage('');
                        }}
                    >
                        Send Another Letter
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Your Name:</label>
                        <input
                            type="text"
                            required
                            className="cozy-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. User"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Your Email:</label>
                        <input
                            type="email"
                            required
                            className="cozy-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. user@email.com"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Your Message:</label>
                        <textarea
                            rows={5}
                            required
                            className="cozy-input"
                            style={{ resize: 'vertical' }}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your note here..."
                        />
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <button type="submit" className="cozy-button primary" style={{ width: '100%', maxWidth: '250px' }}>
                            🕊️ Launch Pigeon
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
