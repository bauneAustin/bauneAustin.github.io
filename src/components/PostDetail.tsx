import { useMemo } from 'react';
import type { FC } from 'react';
import { marked } from 'marked';
import type { BlogPost } from '../lib/blog';

interface PostDetailProps {
  post: BlogPost;
  onBack: () => void;
}

export const PostDetail: FC<PostDetailProps> = ({ post, onBack }) => {
  // Convert Markdown body to HTML
  const parsedHtml = useMemo(() => {
    try {
      // marked.parse returns a string synchronously by default in modern marked
      return marked.parse(post.body) as string;
    } catch (e) {
      console.error('Failed to parse markdown', e);
      return post.body;
    }
  }, [post.body]);

  return (
    <div className="cozy-panel fade-in" style={{ maxWidth: '750px' }}>
      <div className="back-header">
        <button className="cozy-button" onClick={onBack}>
          ⬅️ Back to Bookshelf
        </button>
      </div>

      <header>
        <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          📅 Published on {post.date}
        </div>
        <h2 style={{ marginBottom: '8px' }}>{post.title}</h2>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {post.tags.map(tag => (
            <span key={tag} style={{ color: 'var(--sage-accent)', fontWeight: 600 }}>
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <div className="cozy-divider"></div>

      <article 
        className="blog-post-content"
        dangerouslySetInnerHTML={{ __html: parsedHtml }}
      />

      <div className="cozy-divider"></div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button className="cozy-button" onClick={onBack}>
          📖 Return to Bookshelf
        </button>
      </div>
    </div>
  );
};
