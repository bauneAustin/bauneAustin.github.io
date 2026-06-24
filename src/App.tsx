import { useState, useMemo } from 'react';
import './App.css';
import { MainMenu } from './components/MainMenu';
import { About } from './components/About';
import { Blog } from './components/Blog';
import { PostDetail } from './components/PostDetail';
import { Quests } from './components/Quests';
import { Mailbox } from './components/Mailbox';
import { AmbienceControl } from './components/AmbienceControl';
import { getAllPosts } from './lib/blog';

type ViewState = 'home' | 'about' | 'blog' | 'quests' | 'mailbox';

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [activePostSlug, setActivePostSlug] = useState<string | null>(null);

  // Load posts once
  const posts = useMemo(() => getAllPosts(), []);

  // Find active post
  const activePost = useMemo(() => {
    if (!activePostSlug) return null;
    return posts.find(p => p.slug === activePostSlug) || null;
  }, [posts, activePostSlug]);

  const handleNavigate = (nextView: ViewState) => {
    setView(nextView);
    setActivePostSlug(null);
  };

  const handleSelectPost = (slug: string) => {
    setActivePostSlug(slug);
  };

  const handleBackToBlog = () => {
    setActivePostSlug(null);
  };

  return (
    <>
      <main style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {view === 'home' && (
          <MainMenu onNavigate={handleNavigate} />
        )}
        
        {view === 'about' && (
          <About onBack={() => handleNavigate('home')} />
        )}
        
        {view === 'blog' && !activePost && (
          <Blog 
            onBack={() => handleNavigate('home')} 
            onSelectPost={handleSelectPost} 
          />
        )}
        
        {view === 'blog' && activePost && (
          <PostDetail 
            post={activePost} 
            onBack={handleBackToBlog} 
          />
        )}

        {view === 'quests' && (
          <Quests onBack={() => handleNavigate('home')} />
        )}

        {view === 'mailbox' && (
          <Mailbox onBack={() => handleNavigate('home')} />
        )}
      </main>

      {/* Floating sound control */}
      <AmbienceControl />
    </>
  );
}

export default App;
