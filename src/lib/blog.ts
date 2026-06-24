// Simple frontmatter and markdown loader for client-side Vite

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  body: string;
}

// Regex to parse YAML frontmatter
// Format:
// ---
// title: "My Post"
// date: "2026-06-23"
// tags: ["test", "tag"]
// description: "Some description"
// ---
// Body content...
function parsePost(filename: string, rawContent: string): BlogPost {
  const slug = filename.replace(/^.*[\\/]/, '').replace(/\.md$/, '');
  
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.match(frontmatterRegex);
  
  if (!match) {
    return {
      slug,
      title: slug.replace(/-/g, ' '),
      date: new Date().toISOString().split('T')[0],
      tags: [],
      description: '',
      body: rawContent
    };
  }
  
  const yamlBlock = match[1];
  const body = match[2].trim();
  const metadata: Record<string, any> = {};
  
  yamlBlock.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Parse arrays (e.g. ["design", "cozy"])
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          // Replace single quotes with double quotes for valid JSON
          const jsonVal = value.replace(/'/g, '"');
          metadata[key] = JSON.parse(jsonVal);
        } catch {
          // Fallback parsing
          metadata[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
        }
      } else {
        // Remove surrounding quotes if any
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        metadata[key] = value;
      }
    }
  });
  
  return {
    slug,
    title: metadata.title || slug.replace(/-/g, ' '),
    date: metadata.date || new Date().toISOString().split('T')[0],
    tags: Array.isArray(metadata.tags) ? metadata.tags : [],
    description: metadata.description || '',
    body
  };
}

export function getAllPosts(): BlogPost[] {
  // Use Vite's import.meta.glob to load all markdown files under /src/content/blog/
  const modules = import.meta.glob('/src/content/blog/*.md', { query: '?raw', eager: true }) as Record<string, { default: string }>;
  
  const posts = Object.entries(modules).map(([filepath, module]) => {
    return parsePost(filepath, module.default);
  });
  
  // Sort posts by date descending (latest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
