import fs from "fs";
import path from "path";

import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import Prism from "prismjs";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-diff.js";
import "prismjs/components/prism-java.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-markup.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-yaml.js";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { visit } from "unist-util-visit";

const BLOGS_DIR = path.join(process.cwd(), "content/blogs");

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface BlogFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  coverImage?: string;
  readingTime?: number;
  featured?: boolean;
  showToc?: boolean;
}

export interface BlogMeta extends BlogFrontmatter {
  slug: string;
}

export interface BlogPost extends BlogMeta {
  contentHtml: string;
  toc: TocItem[];
}

function ensureBlogsDir() {
  if (!fs.existsSync(BLOGS_DIR)) {
    fs.mkdirSync(BLOGS_DIR, { recursive: true });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Extracts h2 and h3 headings into TocItem[] and injects deterministic IDs */
function remarkHeadingExtractor(options: { tocOut: TocItem[] }) {
  const { tocOut } = options;
  return (tree: any) => {
    const slugger = new GithubSlugger();
    const toRemove: number[] = [];

    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type === "heading" && (node.depth === 2 || node.depth === 3)) {
        let id = "";

        // Check if previous sibling was a standalone <a id="..."> (HTML or paragraph wrapping HTML)
        if (i > 0) {
          const prev = tree.children[i - 1];
          let anchorVal = "";
          if (prev.type === "html") {
            anchorVal = prev.value;
          } else if (
            prev.type === "paragraph" &&
            prev.children?.[0]?.type === "html"
          ) {
            anchorVal = prev.children[0].value;
          }

          if (anchorVal) {
            const match = anchorVal.match(
              /<a\s+id=["']([^"']+)["']/i
            );
            if (match) {
              id = match[1];
              toRemove.push(i - 1);
            }
          }
        }

        // Check inside heading children for manual <a id="...">
        for (const child of node.children) {
          if (child.type === "html") {
            const match = child.value.match(
              /<a\s+id=["']([^"']+)["']/i
            );
            if (match) id = match[1];
          }
        }

        // Strip manual <a> and </a> tags from heading children to prevent duplicate IDs
        node.children = node.children.filter(
          (c: any) => !(c.type === "html" && /<a\b|<\/a>/i.test(c.value))
        );

        const text = node.children
          .map((c: any) =>
            c.type === "text" || c.type === "inlineCode" ? c.value : ""
          )
          .join("")
          .trim();

        if (!id) {
          id = slugger.slug(text);
        }

        node.data = node.data || {};
        node.data.hProperties = { ...(node.data.hProperties || {}), id };

        tocOut.push({ id, text, level: node.depth as 2 | 3 });
      }
    }

    tree.children = tree.children.filter(
      (_: any, idx: number) => !toRemove.includes(idx)
    );
  };
}

/** Highlights code blocks with Prism and wraps in .code-block-wrapper chrome */
function remarkCodeBlockHighlight() {
  return (tree: any) => {
    visit(tree, "code", (node: any, index: number | undefined, parent: any) => {
      if (!parent || typeof index !== "number") return;

      const langRaw = (node.lang || "text").toLowerCase();
      const langMap: Record<string, string> = {
        ts: "typescript",
        js: "javascript",
        sh: "bash",
        shell: "bash",
        env: "bash",
        yml: "yaml",
        html: "markup",
        xml: "markup",
        svg: "markup",
      };
      const lang = langMap[langRaw] || langRaw;

      let highlighted = "";
      if (Prism.languages[lang]) {
        try {
          highlighted = Prism.highlight(node.value, Prism.languages[lang], lang);
        } catch {
          highlighted = escapeHtml(node.value);
        }
      } else {
        highlighted = escapeHtml(node.value);
      }

      const copySvg = `<svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
      const checkSvg = `<svg class="check-icon hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
      const headerHtml = `<div class="code-header"><span class="code-lang">${escapeHtml(node.lang || "text")}</span><button class="copy-code-btn" data-copy-code="true" aria-label="Copy code" type="button">${copySvg}${checkSvg}</button></div>`;

      const htmlValue = `<div class="code-block-wrapper">${headerHtml}<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre></div>`;

      parent.children.splice(index, 1, {
        type: "html",
        value: htmlValue,
      });

      return index + 1;
    });
  };
}

/** Transforms GFM alert tags and recognized emoji prefixes into accessible callout cards */
function remarkAlertTransformer() {
  const ALERT_MAP: Record<string, { type: string; label: string }> = {
    "[!NOTE]": { type: "note", label: "Note" },
    "[!TIP]": { type: "tip", label: "Tip" },
    "[!WARNING]": { type: "warning", label: "Warning" },
    "[!IMPORTANT]": { type: "important", label: "Important" },
    "💡": { type: "tip", label: "Tip" },
    "⚠️": { type: "warning", label: "Warning" },
    "🧠": { type: "note", label: "Note" },
    "✅": { type: "tip", label: "Tip" },
  };

  return (tree: any) => {
    visit(tree, "blockquote", (node: any) => {
      const firstChild = node.children && node.children[0];
      if (!firstChild || firstChild.type !== "paragraph") return;
      const firstInline = firstChild.children && firstChild.children[0];
      if (!firstInline || firstInline.type !== "text") return;

      let matched: { type: string; label: string } | null = null;
      let matchKey = "";
      for (const [key, config] of Object.entries(ALERT_MAP)) {
        if (firstInline.value.trim().startsWith(key)) {
          matched = config;
          matchKey = key;
          break;
        }
      }

      if (!matched) return;

      firstInline.value = firstInline.value
        .trim()
        .slice(matchKey.length)
        .replace(/^[:\s-]+/, "");

      node.data = node.data || {};
      node.data.hName = "div";
      node.data.hProperties = {
        className: `callout callout-${matched.type}`,
        role: "note",
        "aria-label": matched.label,
      };
    });
  };
}

/** Returns all blog slugs (file names without .md) */
export function getAllBlogSlugs(): string[] {
  ensureBlogsDir();
  return fs
    .readdirSync(BLOGS_DIR)
    .filter(
      (f) =>
        f.endsWith(".md") &&
        !f.startsWith("_") &&
        f.toLowerCase() !== "readme.md" &&
        f.toLowerCase() !== "skill.md"
    )
    .map((f) => f.replace(/\.md$/, ""));
}

/** Returns metadata for all blogs, sorted newest first */
export function getAllBlogsMeta(): BlogMeta[] {
  ensureBlogsDir();
  const slugs = getAllBlogSlugs();

  const blogs = slugs.map((slug) => {
    const filePath = path.join(BLOGS_DIR, `${slug}.md`);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    return {
      slug,
      ...(data as BlogFrontmatter),
    } as BlogMeta;
  });

  return blogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/** Returns full blog post (metadata + parsed HTML content + table of contents) */
export async function getBlogPost(slug: string): Promise<BlogPost> {
  const filePath = path.join(BLOGS_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const toc: TocItem[] = [];

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHeadingExtractor, { tocOut: toc })
    .use(remarkAlertTransformer)
    .use(remarkCodeBlockHighlight)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  const contentHtml = processed.toString();

  return {
    slug,
    ...(data as BlogFrontmatter),
    contentHtml,
    toc,
  };
}

/** Returns the featured blogs (marked featured: true), falling back to the latest 3 */
export function getFeaturedBlogs(): BlogMeta[] {
  const all = getAllBlogsMeta();
  const featured = all.filter((b) => b.featured);
  return featured.length > 0 ? featured.slice(0, 3) : all.slice(0, 3);
}

/** Estimates reading time from raw markdown content */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
