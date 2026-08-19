(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('[data-current-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const finderForm = document.querySelector('#skills-finder-form');
  const results = document.querySelector('#finder-results');
  if (!finderForm || !results) return;

  const skills = [
    {
      title: 'STOP skill',
      url: '../learn/#stop-skill',
      category: 'Distress Tolerance',
      reason: 'Create a pause before acting when emotion or urges are running high.',
      tags: ['overwhelmed', 'angry', 'urges', 'anxious'],
      keywords: ['panic', 'spiral', 'impulsive', 'urge', 'explode', 'overwhelm', 'too much']
    },
    {
      title: 'Ground through the five senses',
      url: '../learn/#grounding',
      category: 'Distress Tolerance',
      reason: 'Shift attention from a mental spiral toward concrete sensory information in the present.',
      tags: ['overwhelmed', 'anxious', 'numb', 'urges'],
      keywords: ['panic', 'dissociate', 'unreal', 'racing', 'spiral', 'numb', 'detached']
    },
    {
      title: 'Paced breathing and body reset',
      url: '../learn/#body-reset',
      category: 'Distress Tolerance',
      reason: 'Lower physiological activation so it is easier to choose what to do next.',
      tags: ['anxious', 'angry', 'overwhelmed'],
      keywords: ['heart', 'shaking', 'tense', 'panic', 'activated', 'agitated']
    },
    {
      title: 'Wise mind pause',
      url: '../learn/#wise-mind',
      category: 'Mindfulness',
      reason: 'Make room for both emotion and facts before deciding what matters next.',
      tags: ['anxious', 'angry', 'conflict', 'shame'],
      keywords: ['confused', 'decision', 'reacting', 'emotion', 'facts']
    },
    {
      title: 'Observe, describe, participate',
      url: '../learn/#observe-describe-participate',
      category: 'Mindfulness',
      reason: 'Notice the experience clearly without needing to solve it immediately.',
      tags: ['anxious', 'numb', 'overwhelmed'],
      keywords: ['racing', 'stuck in my head', 'ruminating', 'numb', 'present']
    },
    {
      title: 'DEAR MAN',
      url: '../learn/#dear-man',
      category: 'Interpersonal Effectiveness',
      reason: 'Structure a clear request, boundary, or negotiation during conflict.',
      tags: ['conflict', 'angry', 'lonely'],
      keywords: ['argument', 'boundary', 'ask', 'request', 'conflict', 'relationship', 'say no']
    },
    {
      title: 'GIVE relationship skill',
      url: '../learn/#give',
      category: 'Interpersonal Effectiveness',
      reason: 'Protect connection through gentleness, interest, validation, and an easier manner.',
      tags: ['conflict', 'lonely'],
      keywords: ['friend', 'partner', 'connection', 'misunderstood', 'relationship']
    },
    {
      title: 'FAST self-respect skill',
      url: '../learn/#fast',
      category: 'Interpersonal Effectiveness',
      reason: 'Keep self-respect in view when pressure, guilt, or conflict makes boundaries harder.',
      tags: ['conflict', 'shame'],
      keywords: ['guilt', 'people pleasing', 'boundary', 'apologize', 'values']
    },
    {
      title: 'Check the facts',
      url: '../learn/#check-the-facts',
      category: 'Emotional Regulation',
      reason: 'Separate what happened from assumptions so the emotion can better match the situation.',
      tags: ['anxious', 'angry', 'shame'],
      keywords: ['assume', 'worst', 'catastrophe', 'rejected', 'judging', 'fear']
    },
    {
      title: 'Opposite action',
      url: '../learn/#opposite-action',
      category: 'Emotional Regulation',
      reason: 'When an emotion does not fit the facts or acting on it would make things worse, try the opposite behavior.',
      tags: ['sad', 'angry', 'shame', 'stuck'],
      keywords: ['avoid', 'withdraw', 'hide', 'stuck', 'angry', 'sad']
    },
    {
      title: 'Thought record',
      url: '../learn/#thought-record',
      category: 'CBT Skills',
      reason: 'Slow down a distressing thought and compare it with evidence, alternatives, and a more balanced view.',
      tags: ['anxious', 'shame', 'sad'],
      keywords: ['failure', 'worthless', 'everyone', 'always', 'never', 'thought', 'ruminate']
    },
    {
      title: 'Behavioral activation',
      url: '../learn/#behavioral-activation',
      category: 'CBT Skills',
      reason: 'Use a small, scheduled action to create momentum when mood and motivation are low.',
      tags: ['sad', 'stuck', 'numb'],
      keywords: ['unmotivated', 'bed', 'nothing', 'low', 'stuck', 'avoid']
    },
    {
      title: 'Tiny next step',
      url: '../learn/#tiny-next-step',
      category: 'Goal Setting',
      reason: 'Shrink a goal until the next action is clear enough to start without needing more motivation first.',
      tags: ['stuck', 'overwhelmed'],
      keywords: ['procrastinate', 'goal', 'task', 'behind', 'start', 'too big']
    },
    {
      title: 'If-then plan',
      url: '../learn/#if-then-plan',
      category: 'Goal Setting',
      reason: 'Link a situation you can recognize with a specific action you want to take.',
      tags: ['stuck'],
      keywords: ['habit', 'routine', 'remember', 'goal', 'plan']
    },
    {
      title: 'Wellness basics check',
      url: '../learn/#wellness-basics',
      category: 'Wellness',
      reason: 'Check sleep, food, hydration, movement, medication routines, and connection before adding a more complex strategy.',
      tags: ['sad', 'stuck', 'overwhelmed', 'numb'],
      keywords: ['tired', 'exhausted', 'sleep', 'hungry', 'burnout', 'drained']
    },
    {
      title: 'Two-minute creative reset',
      url: '../learn/#creative-reset',
      category: 'Recreativity',
      reason: 'Use low-pressure play or making to shift gears and reconnect with curiosity.',
      tags: ['numb', 'stuck', 'sad', 'lonely'],
      keywords: ['bored', 'flat', 'creative', 'play', 'joy', 'numb']
    }
  ];

  const urgentPhrases = [
    'suicide', 'suicidal', 'kill myself', 'end my life', 'self harm', 'self-harm', 'hurt myself',
    'overdose', 'cannot go on', "can't go on", 'want to die', 'better off dead'
  ];

  function getSelectedTags() {
    return Array.from(finderForm.querySelectorAll('input[name="feeling"]:checked')).map((input) => input.value);
  }

  function scoreSkill(skill, tags, text, intensity) {
    let score = 0;
    tags.forEach((tag) => {
      if (skill.tags.includes(tag)) score += 4;
    });
    skill.keywords.forEach((keyword) => {
      if (text.includes(keyword)) score += 3;
    });
    if (intensity >= 4 && ['Distress Tolerance', 'Mindfulness'].includes(skill.category)) score += 2;
    if (intensity <= 2 && ['Goal Setting', 'Wellness', 'Recreativity'].includes(skill.category)) score += 1;
    return score;
  }

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
  }

  function renderResults(items, urgent) {
    const urgentHtml = urgent ? `
      <div class="crisis-panel" role="alert">
        <strong>Please prioritize immediate safety.</strong>
        If you may act on thoughts of suicide or self-harm, contact your local emergency services or go to the nearest emergency department. If possible, stay with a trusted person while you get help.
      </div>` : '';

    const cards = items.map((item) => `
      <article class="result-card">
        <p class="skill-label">${escapeHtml(item.category)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.reason)}</p>
        <a href="${item.url}">Open this skill <span aria-hidden="true">→</span></a>
      </article>`).join('');

    results.innerHTML = `
      ${urgentHtml}
      <p class="eyebrow">YOUR STARTING POINTS</p>
      <h2>Try one of these skills</h2>
      <p>These suggestions are based only on what you entered. They are not a diagnosis.</p>
      <div class="result-list">${cards}</div>
      <p class="finder-disclaimer">If a skill does not fit, return to the Learn library or try the finder again with different words.</p>`;
  }

  finderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const tags = getSelectedTags();
    const text = String(finderForm.elements.notes.value || '').trim().toLowerCase();
    const intensity = Number(finderForm.elements.intensity.value || 3);
    const urgent = urgentPhrases.some((phrase) => text.includes(phrase));

    const ranked = skills
      .map((skill) => ({ ...skill, score: scoreSkill(skill, tags, text, intensity) }))
      .sort((a, b) => b.score - a.score);

    let selected = ranked.filter((skill) => skill.score > 0).slice(0, 4);
    if (selected.length < 3) {
      const fallback = skills.filter((skill) => !selected.some((item) => item.title === skill.title));
      const fallbackOrder = intensity >= 4
        ? ['STOP skill', 'Ground through the five senses', 'Wise mind pause']
        : ['Tiny next step', 'Wellness basics check', 'Observe, describe, participate'];
      fallbackOrder.forEach((title) => {
        const match = fallback.find((skill) => skill.title === title);
        if (match && selected.length < 3) selected.push(match);
      });
    }

    if (urgent && !selected.some((item) => item.title === 'STOP skill')) {
      const stop = skills.find((skill) => skill.title === 'STOP skill');
      selected = [stop, ...selected].slice(0, 4);
    }

    renderResults(selected, urgent);
    results.focus({ preventScroll: true });
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  finderForm.addEventListener('reset', () => {
    window.setTimeout(() => {
      results.innerHTML = '<p class="eyebrow">RESULTS</p><h2>Your suggestions will appear here</h2><p class="results-empty">Choose any feelings that fit, add a few words if you want, then select “Find skills.”</p>';
    }, 0);
  });
})();
