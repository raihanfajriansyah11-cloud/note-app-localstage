const STORAGE_KEY = "siswa";
const form = document.getElementById("note-form");
const list = document.getElementById("data-tampil");

function getData() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(data)) throw new Error("Format data tidak valid.");
    return data.filter(
      (item) =>
        item &&
        typeof item.note === "string" &&
        typeof item.label === "string",
    );
  } catch (error) {
    console.error("Gagal membaca data:", error);
    alert("Data tidak dapat dibaca dari penyimpanan browser.");
    return [];
  }
}

function simpanData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    alert("Data gagal disimpan. Periksa penyimpanan browser.");
    return false;
  }
}

function tampilkan() {
  if (!list) return;
  list.replaceChildren();
  getData().forEach((item, index) => {
    const li = document.createElement("li");
    const text = document.createElement("span");
    const button = document.createElement("button");
    text.textContent = `Note: ${item.note}, Label: ${item.label}`;
    button.type = "button";
    button.textContent = "Hapus";
    button.dataset.removeIndex = index;
    li.append(text, button);
    list.append(li);
  });
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const note = document.getElementById("note")?.value.trim();
  const label = document.getElementById("label")?.value;
  if (!note || !label) return;

  const data = getData();
  data.push({ note, label });
  if (simpanData(data)) {
    form.reset();
    tampilkan();
  }
});

list?.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("button[data-remove-index]");
  if (!button || !confirm("Yakin ingin menghapus data ini?")) return;

  const data = getData();
  const index = Number(button.dataset.removeIndex);
  if (!Number.isInteger(index) || index < 0 || index >= data.length) return;
  data.splice(index, 1);
  if (simpanData(data)) {
    tampilkan();
    alert("Data berhasil dihapus!");
  }
});

document.getElementById("delete-all")?.addEventListener("click", () => {
  if (getData().length === 0) return alert("Belum ada data untuk dihapus.");
  if (!confirm("Yakin ingin menghapus semua data?")) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    tampilkan();
    alert("Semua data berhasil dihapus!");
  } catch (error) {
    console.error("Gagal menghapus data:", error);
    alert("Data gagal dihapus. Periksa penyimpanan browser.");
  }
});

tampilkan();
