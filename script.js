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

    const expert = document.createElement("input");
    expert.type = "checkbox";
    expert.id = `save-expert-${ability}`;
    expert.onchange = updateAll;

    const bonus = document.createElement("span");
    bonus.id = `save-${ability}`;
    bonus.innerText = "+0";

    label.append(name, prof, expert, bonus);
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

    const prof = document.createElement("input");
    prof.type = "checkbox";
    prof.id = `skill-prof-${skill}`;
    prof.onchange = updateAll;

    const expert = document.createElement("input");
    expert.type = "checkbox";
    expert.id = `skill-expert-${skill}`;
    expert.onchange = updateAll;

    const bonus = document.createElement("span");
    bonus.id = `skill-${skill}`;
    bonus.innerText = "+0";

    label.append(name, prof, expert, bonus);
    container.appendChild(label);
  }
}

function updateAll() {
  abilities.forEach(ability => {
    const score = parseInt(document.getElementById(`score-${ability}`).value);
    const mod = getMod(score);
    document.getElementById(`mod-${ability}`).innerText = mod >= 0 ? `+${mod}` : `${mod}`;

    const prof = document.getElementById(`save-prof-${ability}`).checked;
    const expert = document.getElementById(`save-expert-${ability}`).checked;
    let bonus = mod + (prof ? proficiencyBonus * (expert ? 2 : 1) : 0);
    document.getElementById(`save-${ability}`).innerText = bonus >= 0 ? `+${bonus}` : `${bonus}`;
  });

  for (const [skill, base] of Object.entries(skills)) {
    const mod = getMod(parseInt(document.getElementById(`score-${base}`).value));
    const prof = document.getElementById(`skill-prof-${skill}`).checked;
    const expert = document.getElementById(`skill-expert-${skill}`).checked;
    let bonus = mod + (prof ? proficiencyBonus * (expert ? 2 : 1) : 0);
    document.getElementById(`skill-${skill}`).innerText = bonus >= 0 ? `+${bonus}` : `${bonus}`;
  }
}

async function pasteRace() {
  try {
    const text = await navigator.clipboard.readText();
    const data = JSON.parse(text);
    document.getElementById("raceInfo").innerText =
      `Rasse: ${data.name}\n\nGeschwindigkeit: ${data.speed} ft.\n\nEigenschaften:\n${data.abilities}`;
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


