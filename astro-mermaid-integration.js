/**
 * Helper function to HTML-escape text content
 * This ensures HTML tags in mermaid diagrams are preserved as text
 */
function escapeHtml(text) {
  const htmlEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

function visit(tree, type, visitor) {
  if (!tree.children) {
    return;
  }
  for (const [index, child] of tree.children.entries()) {
    if (child.type === type) {
      visitor(child, index, tree);
    }
    visit(child, type, visitor);
  }
}

/**
 * Remark plugin to transform mermaid code blocks at the markdown level
 */
function remarkMermaidPlugin(options = {}) {
  return async function transformer(tree, file) {
    let mermaidCount = 0;

    visit(tree, "code", (node, index, parent) => {
      if (node.lang === "mermaid") {
        mermaidCount++;

        // Transform to html node with pre.mermaid, escaping HTML content
        const escaped = escapeHtml(node.value);
        const htmlNode = {
          type: "html",
          value: `<pre class="mermaid">${escaped}</pre>`,
        };

        // Replace the code node with html node
        if (parent && typeof index === "number") {
          parent.children[index] = htmlNode;
        }

        if (options.logger) {
          options.logger.info(
            `Remark transformed mermaid block #${mermaidCount} in ${file.path || "unknown file"}`,
          );
        }
      }
    });

    if (mermaidCount > 0 && options.logger) {
      options.logger.info(
        `Remark total mermaid blocks transformed: ${mermaidCount}`,
      );
    }
  };
}

/**
 * Helper function to serialize HAST nodes back to HTML text
 * This preserves HTML tags within the mermaid content
 */
function serializeHastChildren(children) {
  let result = "";

  for (const child of children) {
    if (child.type === "text") {
      result += child.value;
    } else if (child.type === "element") {
      // Reconstruct the HTML tag
      const tagName = child.tagName;
      const selfClosing = ["br", "hr", "img", "input", "meta", "link"].includes(
        tagName,
      );

      result += `<${tagName}`;

      // Add attributes if any
      if (child.properties) {
        for (const [key, value] of Object.entries(child.properties)) {
          if (key !== "className") {
            result += ` ${key}="${value}"`;
          } else if (Array.isArray(value)) {
            result += ` class="${value.join(" ")}"`;
          }
        }
      }

      if (selfClosing) {
        result += "/>";
      } else {
        result += ">";
        if (child.children && child.children.length > 0) {
          result += serializeHastChildren(child.children);
        }
        result += `</${tagName}>`;
      }
    }
  }

  return result;
}

/**
 * Rehype plugin to transform mermaid code blocks
 * Converts ```mermaid code blocks to <pre class="mermaid">
 */
function rehypeMermaidPlugin(options = {}) {
  return async function transformer(tree, file) {
    let mermaidCount = 0;

    visit(tree, "element", (node, index, parent) => {
      // Look for <pre><code class="language-mermaid">
      if (
        node.tagName === "pre" &&
        node.children?.length === 1 &&
        node.children[0].tagName === "code"
      ) {
        const codeNode = node.children[0];
        const className = codeNode.properties?.className;

        if (
          Array.isArray(className) &&
          className.includes("language-mermaid")
        ) {
          mermaidCount++;
          // Get the mermaid diagram content, preserving HTML tags
          const diagramContent = serializeHastChildren(codeNode.children || []);

          // Transform to <pre class="mermaid">
          node.properties = {
            ...node.properties,
            className: ["mermaid"],
          };

          // Escape HTML to preserve it as text content
          node.children = [
            {
              type: "text",
              value: escapeHtml(diagramContent),
            },
          ];

          if (options.logger) {
            options.logger.info(
              `Rehype transformed mermaid block #${mermaidCount} in ${file.path || "unknown file"}`,
            );
          }
        }
      }
    });

    if (mermaidCount > 0 && options.logger) {
      options.logger.info(
        `Rehype total mermaid blocks transformed: ${mermaidCount}`,
      );
    }
  };
}

/**
 * Astro integration for rendering Mermaid diagrams
 * Supports automatic theme switching and client-side rendering
 *
 * @param {Object} options - Configuration options
 * @param {string} [options.theme='default'] - Default theme ('default', 'dark', 'forest', 'neutral')
 * @param {boolean} [options.autoTheme=true] - Enable automatic theme switching based on data-theme attribute
 * @param {Object} [options.mermaidConfig={}] - Additional mermaid configuration options
 * @param {boolean} [options.enableLog=true] - Enable client-side logging
 * @returns {import('astro').AstroIntegration}
 */
export default function astroMermaid(options = {}) {
  const {
    theme = "default",
    autoTheme = true,
    mermaidConfig = {},
    iconPacks = [],
    enableLog = true,
  } = options;

  return {
    name: "astro-mermaid",
    hooks: {
      "astro:config:setup": async ({
        config,
        updateConfig,
        addWatchFile,
        injectScript,
        logger,
        command,
      }) => {
        logger.info("Setting up Mermaid integration");

        // Log existing rehype plugins
        logger.info(
          "Existing rehype plugins:",
          config.markdown?.rehypePlugins?.length || 0,
        );

        // Always include mermaid.
        const viteOptimizeDepsInclude = ["mermaid"];

        // Conditionally include ELK
        const useElk = false;

        // Update markdown config to use both remark and rehype plugins
        updateConfig({
          markdown: {
            remarkPlugins: [
              ...(config.markdown?.remarkPlugins || []),
              [remarkMermaidPlugin, { logger }],
            ],
            rehypePlugins: [
              ...(config.markdown?.rehypePlugins || []),
              [rehypeMermaidPlugin, { logger }],
            ],
          },
          vite: {
            optimizeDeps: {
              include: viteOptimizeDepsInclude,
            },
          },
        });
      },
    },
  };
}
