function normalizeHex(input) {
  return input.replace(/^0x/i, "").replace(/\s+/g, "").toLowerCase();
}
function hexToBytes(hex) {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) {
    throw new Error("十六进制格式不合法（必须为偶数位 0-9a-f）");
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}
function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function hexToFloat(hex, bits = 32, littleEndian = false) {
  const bytes = hexToBytes(normalizeHex(hex));
  if ((bits === 32 && bytes.length !== 4) || (bits === 64 && bytes.length !== 8)) {
    throw new Error(bits === 32 ? "float32 需要 8 位十六进制" : "float64 需要 16 位十六进制");
  }
  const buffer = new ArrayBuffer(bytes.length);
  const view = new DataView(buffer);
  bytes.forEach((b, i) => view.setUint8(i, b));
  return bits === 32 ? view.getFloat32(0, littleEndian) : view.getFloat64(0, littleEndian);
}
function floatToHex(num, bits = 32, littleEndian = false) {
  const buffer = new ArrayBuffer(bits === 32 ? 4 : 8);
  const view = new DataView(buffer);
  if (bits === 32) view.setFloat32(0, num, littleEndian);
  else view.setFloat64(0, num, littleEndian);
  return bytesToHex(new Uint8Array(buffer));
}
export const hexFloatTool = {
  id: "hex-float",
  name: "16进制 ⇄ 浮点数",
  render(container) {
    container.innerHTML = `
      <h2>16进制 ⇄ 浮点数</h2>
      <div class="form-row">
        <label>位宽</label>
        <select id="bits"><option value="32">float32</option><option value="64">float64</option></select>
      </div>
      <div class="form-row">
        <label>字节序</label>
        <select id="endian"><option value="be">大端 (Big Endian)</option><option value="le">小端 (Little Endian)</option></select>
      </div>
      <hr />
      <div class="form-row">
        <label>十六进制转浮点数</label>
        <input id="hexInput" placeholder="例如: 3f800000 或 0x3f800000" />
        <button class="action" id="hexToFloatBtn">转换</button>
      </div>
      <div class="form-row">
        <label>浮点数转十六进制</label>
        <input id="floatInput" placeholder="例如: 1.0" />
        <button class="action" id="floatToHexBtn">转换</button>
      </div>
      <div id="result" class="result">结果会显示在这里</div>
    `;
    const bitsEl = container.querySelector("#bits");
    const endianEl = container.querySelector("#endian");
    const hexInputEl = container.querySelector("#hexInput");
    const floatInputEl = container.querySelector("#floatInput");
    const resultEl = container.querySelector("#result");
    container.querySelector("#hexToFloatBtn").onclick = () => {
      try {
        const bits = Number(bitsEl.value);
        const littleEndian = endianEl.value === "le";
        resultEl.textContent = `浮点值: ${hexToFloat(hexInputEl.value, bits, littleEndian)}`;
      } catch (e) {
        resultEl.textContent = `错误: ${e.message}`;
      }
    };
    container.querySelector("#floatToHexBtn").onclick = () => {
      try {
        const bits = Number(bitsEl.value);
        const littleEndian = endianEl.value === "le";
        const num = Number(floatInputEl.value);
        if (!Number.isFinite(num)) throw new Error("请输入合法数字");
        resultEl.textContent = `16进制: 0x${floatToHex(num, bits, littleEndian)}`;
      } catch (e) {
        resultEl.textContent = `错误: ${e.message}`;
      }
    };
  }
};
