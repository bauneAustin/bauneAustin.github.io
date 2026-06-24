---
title: "Why TypeScript fits static sites"
date: "2026-06-22"
tags: ["tech", "typescript"]
description: "Even simple landing pages benefit from compile-time safety and self-documenting code structures."
---

It is common to hear developers say: *"If it's just a static landing page, why use TypeScript? Isn't vanilla JavaScript or plain HTML enough?"*

While raw HTML and JS are great, TypeScript offers major advantages even for a simple, zero-database profile page:

1. **Self-Documenting Content Structure:**
   When loading blog posts from Markdown, we parse metadata fields. TypeScript lets us define a strict `Post` interface:
   ```typescript
   interface Post {
     slug: string;
     title: string;
     date: string;
     tags: string[];
     description: string;
     body: string;
   }
   ```
   If we write a markdown post and forget a required frontmatter field (like the title or date), our IDE and compiler catch the error instantly.

2. **Refactoring confidence:**
   If we change the way tags are modeled, TS ensures we update the tag filter component and the list renderer without breaking anything in production.
