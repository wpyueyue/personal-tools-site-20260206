import { hexFloatTool } from "./tools/hex-float.js";

const tools = [hexFloatTool];
const toolListEl = document.getElementById("tool-list");
const toolContainerEl = document.getElementById("tool-container");
let activeToolName = "";

function renderToolList() {
  toolListEl.innerHTML = "";
  tools.forEach((tool) => {
    const btn = document.createElement("button");
    btn.className = "tool-btn";
    btn.textContent = tool.name;
    if (tool.name === activeToolName) {
      btn.classList.add("active");
    }
    btn.onclick = () => renderTool(tool);
    toolListEl.appendChild(btn);
  });
}
function renderTool(tool) {
  activeToolName = tool.name;
  renderToolList();
  toolContainerEl.innerHTML = "";
  tool.render(toolContainerEl);
}
renderToolList();
if (tools.length > 0) {
  renderTool(tools[0]);
}
