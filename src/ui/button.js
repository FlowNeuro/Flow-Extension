export function createButton({ icon, label = "", variant = "default", title, onClick }) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `flow-btn flow-btn--${variant}`;
  if (title) btn.title = title;

  const iconEl = document.createElement("span");
  iconEl.className = "flow-btn__icon";
  iconEl.innerHTML = icon;
  btn.appendChild(iconEl);

  const labelEl = document.createElement("span");
  labelEl.className = "flow-btn__label";
  labelEl.textContent = label;
  btn.appendChild(labelEl);

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(e);
  });

  return btn;
}
