(() => {
  "use strict";

  const state = {
    catalog: [],
    feelings: new Set()
  };

  const dangerPattern = /\b(suicid(?:e|al)?|kill myself|hurt myself|self[- ]?harm|overdose|kill someone|hurt someone)\b/i;

  function byId(id) {
    return document.getElementById(id);
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function selectedFeelings() {
    return Array.from(state.feelings);
  }

  function scoreSkill(skill, feelings, text, intensity) {
    let score = 0;
    let matches = 0;

    for (const feeling of feelings) {
      if ((skill.feelings || []).includes(feeling)) {
        score += 5;
        matches += 1;
      }
    }

    for (const keyword of skill.keywords || []) {
      if (text && text.includes(normalize(keyword))) {
        score += 3;
        matches += 1;
      }
    }

    const range = Array.isArray(skill.intensity) ? skill.intensity : [1, 10];
    if (intensity >= range[0] && intensity <= range[1]) {
      score += 2;
    } else if (Math.abs(intensity - Math.max(range[0], Math.min(range[1], intensity))) <= 2) {
      score += 1;
    }

    return { score, matches };
  }

  function resultReason(skill, feelings, text) {
    const feelingMatches = feelings.filter((feeling) => (skill.feelings || []).includes(feeling));
    const keywordMatches = (skill.keywords || []).filter((keyword) => text.includes(normalize(keyword)));

    if (feelingMatches.length) {
      return `Matched: ${feelingMatches.join(", ")}`;
    }
    if (keywordMatches.length) {
      return `Matched your description: ${keywordMatches.slice(0, 2).join(", ")}`;
    }
    return `From ${skill.category}`;
  }

  function renderSafetyMessage() {
    const results = byId("skill-results");
    results.innerHTML = "";

    const item = document.createElement("section");
    item.className = "tsk-result";

    const heading = document.createElement("h3");
    heading.textContent = "Use immediate human support for immediate danger";

    const body = document.createElement("p");
    body.textContent = "The Skills Finder is an educational tool and cannot assess or manage immediate risk. If you may act on thoughts of harming yourself or someone else, contact local emergency services or an appropriate crisis service in your location now, and involve a trusted person if you can do so safely.";

    item.append(heading, body);
    results.append(item);
  }

  function renderResults(items, feelings, text) {
    const results = byId("skill-results");
    results.innerHTML = "";

    if (!items.length) {
      const item = document.createElement("section");
      item.className = "tsk-result";
      item.innerHTML = '<h3>Start with the tools overview</h3><p>There was not a strong match. Use the overview to identify whether you need stabilization, understanding, communication, or a next action.</p><p><a href="../learn/tools-overview.html#choosing-a-tool">Open tools overview</a></p>';
      results.append(item);
      return;
    }

    items.forEach(({ skill }) => {
      const item = document.createElement("article");
      item.className = "tsk-result";

      const heading = document.createElement("h3");
      heading.textContent = skill.title;

      const body = document.createElement("p");
      body.textContent = skill.description;

      const meta = document.createElement("div");
      meta.className = "tsk-result-meta";
      meta.textContent = resultReason(skill, feelings, text);

      const linkWrap = document.createElement("p");
      const link = document.createElement("a");
      link.href = skill.href;
      link.textContent = `Learn ${skill.title}`;
      linkWrap.append(link);

      item.append(heading, body, meta, linkWrap);
      results.append(item);
    });
  }

  function findSkills() {
    const text = normalize(byId("situation").value);
    const intensity = Number(byId("intensity").value || 5);
    const feelings = selectedFeelings();

    if (dangerPattern.test(text)) {
      renderSafetyMessage();
      return;
    }

    const ranked = state.catalog
      .map((skill) => ({ skill, ...scoreSkill(skill, feelings, text, intensity) }))
      .filter((item) => item.score > 1 || (!feelings.length && !text))
      .sort((a, b) => b.score - a.score || b.matches - a.matches || a.skill.title.localeCompare(b.skill.title))
      .slice(0, 5);

    renderResults(ranked, feelings, text);
  }

  function wireFeelingChips() {
    document.querySelectorAll("[data-feeling]").forEach((button) => {
      button.addEventListener("click", () => {
        const feeling = normalize(button.dataset.feeling);
        const pressed = button.getAttribute("aria-pressed") === "true";
        button.setAttribute("aria-pressed", pressed ? "false" : "true");

        if (pressed) {
          state.feelings.delete(feeling);
        } else {
          state.feelings.add(feeling);
        }
      });
    });
  }

  function wireIntensity() {
    const range = byId("intensity");
    const output = byId("intensity-value");
    const sync = () => {
      output.textContent = range.value;
    };
    range.addEventListener("input", sync);
    sync();
  }

  async function init() {
    const form = byId("skills-finder-form");
    if (!form) return;

    wireFeelingChips();
    wireIntensity();

    try {
      const response = await fetch("../data/skills.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
      state.catalog = await response.json();
    } catch (error) {
      console.error(error);
      const results = byId("skill-results");
      results.innerHTML = '<section class="tsk-result"><h3>Skills catalog unavailable</h3><p>Open the Learn section directly while the catalog is unavailable.</p><p><a href="../learn/">Go to Learn</a></p></section>';
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      findSkills();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
