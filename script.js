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
    const bonus = mod + (prof ?  : 0);
    document.getElementById(`save-${ability}`).innerText = bonus >= 0 ? `+${bonus}` : `${bonus}`;
  });

  for (const [skill, base] of Object.entries(skills)) {
    const mod = getMod(parseInt(document.getElementById(`score-${base}`).value));
    const select = document.getElementById(`skill-select-${skill}`);
    const value = select.value;
    let multiplier = 0;
    if (value === "proficient") multiplier = 1;
    else if (value === "expertise") multiplier = 2;

    const bonus = mod +  * multiplier;
    document.getElementById(`skill-${skill}`).innerText = bonus >= 0 ? `+${bonus}` : `${bonus}`;
  }
}


async function pasteRace() {
  try {
    const text = await navigator.clipboard.readText();
    const data = JSON.parse(text);

    let speedText = "";
    const translations = {
      walk: "Gehen",
      fly: "Flug",
      swim: "Schwimmen",
      climb: "Klettern",
      burrow: "Graben"
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

      // Format wie: "30 ft (Flug: 30 ft, Schwimmen: ...)"
      const walkSpeed = data.speed.walk;
      if (typeof walkSpeed === "number") {
        speedText = `${walkSpeed} ft`;
        const otherSpeeds = entries.filter(e => !e.startsWith("Gehen:"));
        if (otherSpeeds.length > 0) {
          speedText += ` (${otherSpeeds.join(", ")})`;
        }
      } else {
        // Kein walk-Speed vorhanden – gib alles aus
        speedText = entries.join(", ");
      }
    } else {
      speedText = "Unbekannt";
    }

    document.getElementById("raceInfo").innerText =
      `RACE: ${data.name}\n\nSpeed: ${speedText}\n\nAbilities:\n${data.abilities}`;
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


