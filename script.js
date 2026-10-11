const container = document.querySelector(".box-grid");
let radio_value = "all";
let extensions_data, extensions_actives, extensions_inactives;

async function load_data() {
  try {
    const response = await fetch("./data.json");
    return await response.json();
  } catch (error) {
    console.error("Erro ao carregar o JSON: ", error);
  }
}
function dynamic_cards(data) {
  const template_cards = document.getElementById("extension_card");
  const fragment = document.createDocumentFragment();

  data.forEach((extension, index) => {
    const clone = template_cards.content.cloneNode(true);

    const img = clone.querySelector(".logo-extension");
    img.src = extension.logo;

    clone.querySelector(".title").textContent = extension.name;
    clone.querySelector(".text").textContent = extension.description;

    clone
      .querySelector(".btn-remove")
      .setAttribute("data-extension-index", index);

    const checkbox = clone.querySelector(".toggle-input");
    const label = clone.querySelector(".toggle-label");

    checkbox.id = `toggle_${extension.name.replaceAll(" ", "_")}`;
    label.setAttribute("for", `toggle_${extension.name.replaceAll(" ", "_")}`);

    checkbox.checked = extension.isActive;

    checkbox.addEventListener("change", () => {
      if (event.target.checked) {
        extension.isActive = true;
        reload_cards(radio_value);
      } else {
        extension.isActive = false;
        reload_cards(radio_value);
      }
    });

    fragment.appendChild(clone);
  });

  container.appendChild(fragment);
}

function reload_cards(radio_value) {
  extensions_actives = extensions_data.filter((item) => {
    return item.isActive === true;
  });
  extensions_inactives = extensions_data.filter((item) => {
    return item.isActive === false;
  });

  container.innerHTML = "";

  if (radio_value === "all") {
    dynamic_cards(extensions_data);
  } else if (radio_value === "inactives") {
    dynamic_cards(extensions_inactives);
  } else if (radio_value === "actives") {
    dynamic_cards(extensions_actives);
  }
}
const radios_list_extensions = document.querySelectorAll(
  "input[name=list-extensions]",
);

radios_list_extensions.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (event.target.checked) {
      radio_value = radio.value;
      console.log(radio_value);
      reload_cards(radio_value);
    }
  });
});

load_data().then((data) => {
  extensions_data = data;
  reload_cards(radio_value);
});
