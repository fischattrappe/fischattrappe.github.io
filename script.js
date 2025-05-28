const abilities = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
const skills = {
  "Acrobatics": "Dexterity",
  "Animal Handling": "Wisdom",
  "Arcana": "Intelligence",
  "Athletics": "Strength",
  "Deception": "Charisma",
  "History": "Intelligence",
  "Insight": "Wisdom",
  "Intimidation": "Charisma",
  "Investigation": "Intelligence",
  "Medicine": "Wisdom",
  "Nature": "Intelligence",
  "Perception": "Wisdom",
  "Performance": "Charisma",
  "Persuasion": "Charisma",
  "Religion": "Intelligence",
  "Sleight of Hand": "Dexterity",
  "Stealth": "Dexterity",
  "Survival": "Wisdom"
};

let proficiencyBonus = 2;

function getProficiencyBonus() {
  const input = document.getElementById("profBonus");
  return input ? parseInt(input.value) || 0 : proficiencyBonus;
}

function getMod(score) {
  return Math.floor((score - 10) / 2);
}

function createAbilityInputs() {
  const container = document.getElementById("abilities");
  abilities.forEach(ability => {
    const label = document.createElement("label");
    label.innerText = `${ability}:`;

    const input = document.createElement("input");
    input.type = "number";
    input.id = `score-${ability}`;
    input.value = 10;
    input.oninput = updateAll;

    const mod = document.createElement("span");
    mod.id = `mod-${ability}`;
    mod.innerText = "+0";

    label.appendChild(input);
    label.appendChild(mod);
    container.appendChild(label);
  });
}

function createSavingThrows() {
  const container = document.getElementById("saves");

  // Optional: Leeren, falls neu erzeugt wird
  container.innerHTML = '<h2>Saving Throws</h2>';

  // Dynamisch alle Saving Throws erzeugen
  abilities.forEach(ability => {
    const label = document.createElement("label");
    label.classList.add("skill-label");

    const name = document.createElement("span");
    name.innerText = ability;

    const prof = document.createElement("input");
    prof.type = "checkbox";
    prof.id = `save-prof-${ability}`;
    prof.onchange = updateAll;

    const bonus = document.createElement("span");
    bonus.id = `save-${ability}`;
    bonus.innerText = "+0";

    label.append(name, prof, bonus);
    container.appendChild(label);
  });

  //Am Ende: Zusätzliche Infos-Textbox einfügen (nur wenn noch nicht vorhanden)
  if (!document.getElementById("save-notes")) {
    const notesContainer = document.createElement("div");
    notesContainer.id = "save-notes-container";

    const label = document.createElement("label");
    label.setAttribute("for", "save-notes");
    label.innerText = "Additional Save Features:";

    const textarea = document.createElement("textarea");
    textarea.id = "save-notes";
    textarea.rows = 3;
    textarea.style = "width: 100%; resize: vertical;";
    textarea.placeholder = "e.g. Evasion, advantage vs. charm, etc.";

    notesContainer.appendChild(label);
    notesContainer.appendChild(document.createElement("br"));
    notesContainer.appendChild(textarea);

    container.appendChild(notesContainer);
  }
}



function createSkills() {
  const container = document.getElementById("skills");
  for (const [skill, base] of Object.entries(skills)) {
    const label = document.createElement("label");
    label.classList.add("skill-label");

    const name = document.createElement("span");
    name.innerText = skill;

    const select = document.createElement("select");
    select.id = `skill-select-${skill}`;
    select.onchange = updateAll;

    const optionNone = document.createElement("option");
    optionNone.value = "none";
    optionNone.innerText = "keine";

    const optionProf = document.createElement("option");
    optionProf.value = "proficient";
    optionProf.innerText = "Proficiency";

    const optionExpert = document.createElement("option");
    optionExpert.value = "expertise";
    optionExpert.innerText = "Expertise";

    select.append(optionNone, optionProf, optionExpert);

    const bonus = document.createElement("span");
    bonus.id = `skill-${skill}`;
    bonus.innerText = "+0";

    label.append(name, select, bonus);
    container.appendChild(label);
  }
}


function updateAll() {
  abilities.forEach(ability => {
    const score = parseInt(document.getElementById(`score-${ability}`).value);
    const mod = getMod(score);
    document.getElementById(`mod-${ability}`).innerText = mod >= 0 ? `+${mod}` : `${mod}`;

    const prof = document.getElementById(`save-prof-${ability}`).checked;
    const bonus = mod + (prof ? getProficiencyBonus() : 0);
    document.getElementById(`save-${ability}`).innerText = bonus >= 0 ? `+${bonus}` : `${bonus}`;
  });

  for (const [skill, base] of Object.entries(skills)) {
    const mod = getMod(parseInt(document.getElementById(`score-${base}`).value));
    const select = document.getElementById(`skill-select-${skill}`);
    const value = select.value;
    let multiplier = 0;
    if (value === "proficient") multiplier = 1;
    else if (value === "expertise") multiplier = 2;

    const bonus = mod + getProficiencyBonus() * multiplier;
    document.getElementById(`skill-${skill}`).innerText = bonus >= 0 ? `+${bonus}` : `${bonus}`;
  }

  // Passive Senses
  const perceptionMod = parseInt(document.getElementById("skill-Perception").innerText);
  const insightMod = parseInt(document.getElementById("skill-Insight").innerText);
  const investigationMod = parseInt(document.getElementById("skill-Investigation").innerText);
  
  document.getElementById("passive-perception").innerText = 10 + perceptionMod;
  document.getElementById("passive-insight").innerText = 10 + insightMod;
  document.getElementById("passive-investigation").innerText = 10 + investigationMod;


  
}


function renderEntries(entries, parent = null) {
  const container = parent || document.createElement("div");

  entries.forEach(entry => {
    if (typeof entry === "string") {
      const p = document.createElement("p");
      p.innerText = entry;
      container.appendChild(p);
    } else if (entry.name && entry.entries) {
      const section = document.createElement("div");
      const h3 = document.createElement("h3");
      h3.innerText = entry.name;
      section.appendChild(h3);
      renderEntries(entry.entries, section);
      container.appendChild(section);
    } else if (entry.type === "list" && Array.isArray(entry.items)) {
      const ul = document.createElement("ul");
      entry.items.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item;
        ul.appendChild(li);
      });
      container.appendChild(ul);
    } else if (entry.type === "table" && entry.colLabels && entry.rows) {
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      entry.colLabels.forEach(label => {
        const th = document.createElement("th");
        th.innerText = label;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      entry.rows.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
          const td = document.createElement("td");
          td.innerText = typeof cell === "string" ? cell : JSON.stringify(cell);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      container.appendChild(table);
    }
  });

  return container;
}




async function pasteRace() {
  try {
    const text = await navigator.clipboard.readText();
    const data = JSON.parse(text);

    let speedText = "";
    const translations = {
      //walk: "walk",
      fly: "fly",
      swim: "swim",
      climb: "climb",
      burrow: "burrow"
    };

    if (typeof data.speed === "number") {
      speedText = `${data.speed} ft`;
    } else if (typeof data.speed === "object") {
      const entries = Object.entries(data.speed).map(([type, value]) => {
        const label = translations[type] || type;
        if (typeof value === "number") {
          return `${label}: ${value} ft`;
        } else if (value === true) {
          return `${label}: gleich Gehgeschwindigkeit`;
        } else {
          return `${label}: ?`;
        }
      });

      const walkSpeed = data.speed.walk;
      if (typeof walkSpeed === "number") {
        speedText = `${walkSpeed} ft`;
        const otherSpeeds = entries.filter(e => !e.startsWith("Gehen:"));
        if (otherSpeeds.length > 0) {
          speedText += ` (${otherSpeeds.join(", ")})`;
        }
      } else {
        speedText = entries.join(", ");
      }
    } else {
      speedText = "Unbekannt";
    }

    const raceInfo = document.getElementById("raceInfo");
    raceInfo.innerHTML = `<strong>Rasse:</strong> ${data.name}<br><strong>Speed:</strong> ${speedText}<br><br>`;
    if (Array.isArray(data.entries)) {
      raceInfo.appendChild(renderEntries(data.entries));
    } else {
      raceInfo.innerHTML += data.entries || "Keine Einträge.";
    }
  } catch (e) {
    alert("Fehler beim Einfügen der Rasse: " + e.message);
  }
}



document.addEventListener("DOMContentLoaded", () => {
  createAbilityInputs();
  createSavingThrows();
  createSkills();
  updateAll();
  document.getElementById("race-import-button").addEventListener("click", pasteRace);
});


