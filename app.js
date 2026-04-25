let data = JSON.parse(localStorage.getItem("data")) || {};
let currentProduct = null;

function save() {
  localStorage.setItem("data", JSON.stringify(data));
}

function addProduct() {
  let name = document.getElementById("productInput").value;
  if (!data[name]) {
    data[name] = [];
    save();
    renderProducts();
  }
}

function renderProducts() {
  let list = document.getElementById("productList");
  list.innerHTML = "";

  Object.keys(data).forEach(p => {
    let btn = document.createElement("button");
    btn.innerText = p;
    btn.onclick = () => openProduct(p);
    list.appendChild(btn);
  });
}

function openProduct(name) {
  currentProduct = name;
  document.getElementById("currentProduct").innerText = name;
  renderAccounts();
}

function showAddForm() {
  document.getElementById("form").style.display = "block";
}

function addAccount() {
  let email = document.getElementById("email").value;

  // Duplicate check
  if (data[currentProduct].some(a => a.email === email)) {
    alert("Already used for this product");
    return;
  }

  let password = document.getElementById("password").value;
  let duration = parseInt(document.getElementById("duration").value);
  let durationType = document.getElementById("durationType").value;

  let now = new Date();
  let expire = new Date();

  if (durationType === "days") expire.setDate(now.getDate() + duration);
  if (durationType === "weeks") expire.setDate(now.getDate() + duration * 7);
  if (durationType === "months") expire.setMonth(now.getMonth() + duration);

  let account = {
    email,
    password,
    type: document.getElementById("type").value,
    statusTag: document.getElementById("statusTag").value,
    note: document.getElementById("note").value,
    added: now,
    expire: expire
  };

  data[currentProduct].push(account);
  save();
  renderAccounts();
}

function renderAccounts() {
  let list = document.getElementById("accountList");
  list.innerHTML = "";

  data[currentProduct].forEach((a, i) => {
    let now = new Date();
    let expire = new Date(a.expire);
    let daysLeft = Math.ceil((expire - now) / (1000 * 60 * 60 * 24));

    let div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <b>#${i+1}</b><br>
      ${a.email} 
      <button onclick="copy('${a.email}')">Copy</button><br>
      ${a.password}
      <button onclick="copy('${a.password}')">Copy</button><br>
      Days Left: ${daysLeft}<br>
      Status: ${a.statusTag}
    `;

    list.appendChild(div);
  });
}

function copy(text) {
  navigator.clipboard.writeText(text);
  alert("Copied!");
}

function exportData() {
  let blob = new Blob([JSON.stringify(data)], {type:"application/json"});
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "accounts.json";
  a.click();
}

renderProducts();
