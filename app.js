const $ = (selector) => document.querySelector(selector);

const renderList = (items = [], createItem) => {
  const fragment = document.createDocumentFragment();
  items.forEach((item, index) => {
    const node = createItem(item, index);
    if (node) fragment.appendChild(node);
  });
  return fragment;
};

const createSection = (title) => {
  const section = document.createElement("div");
  section.className = "reveal";
  const heading = document.createElement("h2");
  heading.textContent = title;
  section.appendChild(heading);
  return section;
};

const createItem = ({ title, subtitle, meta, bullets }) => {
  const wrapper = document.createElement("div");
  wrapper.className = "item";
  const heading = document.createElement("h3");
  heading.textContent = title;
  wrapper.appendChild(heading);

  if (subtitle || meta) {
    const info = document.createElement("div");
    info.className = "meta";
    info.textContent = [subtitle, meta].filter(Boolean).join(" | ");
    wrapper.appendChild(info);
  }

  if (bullets && bullets.length) {
    const list = document.createElement("ul");
    bullets.forEach((bullet) => {
      const li = document.createElement("li");
      li.textContent = bullet;
      list.appendChild(li);
    });
    wrapper.appendChild(list);
  }

  return wrapper;
};

const fillContacts = (contacts = []) => {
  const list = $("#contacts");
  list.innerHTML = "";
  list.appendChild(
    renderList(contacts, (item) => {
      const li = document.createElement("li");
      const label = document.createElement("span");
      label.className = "label";
      label.textContent = item.label;
      li.appendChild(label);

      if (item.href) {
        const link = document.createElement("a");
        link.href = item.href;
        link.textContent = item.value;
        link.target = "_blank";
        link.rel = "noreferrer";
        li.appendChild(link);
      } else {
        const text = document.createElement("span");
        text.textContent = item.value;
        li.appendChild(text);
      }

      return li;
    })
  );
};

const fillChips = (targetId, title, items = []) => {
  const target = $(targetId);
  target.innerHTML = "";
  const section = createSection(title);

  const hasGroups = items.some(
    (item) => typeof item === "object" && item !== null && Array.isArray(item.items)
  );

  if (hasGroups) {
    items.forEach((group) => {
      if (!group || typeof group !== "object" || !Array.isArray(group.items)) return;
      const groupWrap = document.createElement("div");
      groupWrap.className = "skill-group";

      const groupTitle = document.createElement("h3");
      groupTitle.className = "skill-group-title";
      groupTitle.textContent = group.category || "";
      groupWrap.appendChild(groupTitle);

      const chips = document.createElement("div");
      chips.className = "chips";
      group.items.forEach((item) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = item;
        chips.appendChild(chip);
      });
      groupWrap.appendChild(chips);
      section.appendChild(groupWrap);
    });
  } else {
    const wrapper = document.createElement("div");
    wrapper.className = "chips";
    items.forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = item;
      wrapper.appendChild(chip);
    });
    section.appendChild(wrapper);
  }

  target.appendChild(section);
};

const fillListSection = (targetId, title, items = []) => {
  const target = $(targetId);
  target.innerHTML = "";
  const section = createSection(title);
  section.appendChild(renderList(items, createItem));
  target.appendChild(section);
};

const setPhoto = (photo) => {
  const img = $("#photo");
  const fallback = $("#photo-fallback");
  if (!photo) {
    img.style.display = "none";
    fallback.style.display = "grid";
    return;
  }
  img.src = photo;
  img.style.display = "block";
  fallback.style.display = "none";
};

fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    $("#name").textContent = data.basics.name;
    $("#title").textContent = data.basics.title;
    $("#summary").textContent = data.basics.summary;

    setPhoto(data.basics.photo);
    fillContacts(data.basics.contacts);

    fillListSection("#experience", "Work Experience", data.experience);
    fillListSection("#projects", "Projects", data.projects);
    fillChips("#skills", "Technical Skills", data.skills);
    fillListSection("#education", "Educational Background", data.education);
    fillListSection("#courses", "Additional Training", data.courses);
    fillChips("#languages", "Languages", data.languages);
    fillChips("#interests", "Interests", data.interests);

    document.body.classList.add("ready");
  })
  .catch((error) => {
    console.error("Failed to load CV data", error);
  });

const printBtn = document.querySelector("#print-btn");
if (printBtn) {
  printBtn.addEventListener("click", () => window.print());
}
