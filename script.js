const container = document.querySelector(".box-grid");
let radio_value = "all";
let extensions_data, extensions_actives, extensions_inactives;

// _______________________________________________________________

const modal_remove = document.getElementById("modal_remove");
const confirm_remove = document.getElementById("confirm_remove");
const close_modal = document.getElementById("close_modal");
let last_extension_remove;
// _______________________________________________________________

confirm_remove.addEventListener("click", () => {
  modal_remove.close();

  for (let i = 0; i < extensions_data.length; i++) {
    if (extensions_data[i].name === last_extension_remove) {
      extensions_data.splice(i, 1);
    }
  }
  reload_cards();
});
// _______________________________________________________________

close_modal.addEventListener("click", () => {
  modal_remove.close();
});
// _______________________________________________________________

async function load_data() {
  try {
    const response = await fetch("./data.json");
    return await response.json();
  } catch (error) {
    console.error("Erro ao carregar o JSON: ", error);
    const empty_response = [];
    return empty_response;
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

    const btn_remove = clone.querySelector(".btn-remove");
    btn_remove.setAttribute("data-extension-index", index);

    btn_remove.addEventListener("click", () => {
      last_extension_remove = extension.name;
      modal_remove.showModal();
    });

    const checkbox = clone.querySelector(".toggle-input");
    const label = clone.querySelector(".toggle-label");

    checkbox.id = `toggle_${extension.name.replaceAll(" ", "_")}`;
    label.setAttribute("for", `toggle_${extension.name.replaceAll(" ", "_")}`);

    checkbox.checked = extension.isActive;

    checkbox.addEventListener("change", (event) => {
      if (event.target.checked) {
        extension.isActive = true;
        setTimeout(() => {
          reload_cards();
        }, 500);
      } else {
        extension.isActive = false;
        setTimeout(() => {
          reload_cards();
        }, 500);
      }
    });

    fragment.appendChild(clone);
  });

  container.appendChild(fragment);
}

function reload_cards() {
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
  radio.addEventListener("change", (event) => {
    if (event.target.checked) {
      radio_value = radio.value;
      console.log(radio_value);
      reload_cards(radio_value);
    }
  });
});

load_data().then((data) => {
  extensions_data = data;
  reload_cards();
});

const input_mode = document.querySelector("#dark_light_input");
const body = document.querySelector("body");
input_mode.addEventListener("change", () => {
  body.classList.toggle("dark-mode");
});
