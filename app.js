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
    let div = document.createElement("div");
    div.className = "card";
    div.innerText = p;
    div.onclick = () => openProduct(p);
    list.appendChild(div);
  });
}

function openProduct(name) {
  currentProduct = name;
  document.getElementById("productView").style.display = "block";
  document.getElementById("currentProduct").innerText = name;
  renderAccounts();
}

function toggleForm() {
  let f = document.getElementById("form");
  f.style.display = f.style.display === "block" ? "none" : "block";
}

function addAccount() {
  let email = document.getElementById("email").value;

  if (data[currentProduct].some(a => a.email === email)) {
    alert("Already used for this product");
    return;
  }

  let duration = parseInt(document.getElementById("duration").value);
  let type = document.getElementById("durationType").value;

  let now = new Date();
  let expire = new Date();

  if (type === "days") expire.setDate(now.getDate() + duration);
  if (type === "weeks") expire.setDate(now.getDate() + duration * 7);
  if (type === "months") expire.setMonth(now.getMonth() + duration);

  let acc = {
    email,
    password: document.getElementById("password").value,
    statusTag: document.getElementById("statusTag").value,
    expire
  };

  data[currentProduct].push(acc);
  save();
  toggleForm();
  renderAccounts();
}

function renderAccounts() {
  let list = document.getElementById("accountList");
  list.innerHTML = "";

  let total = 0, active = 0, expired = 0;

  data[currentProduct].forEach((a,i)=>{
    total++;

    let now = new Date();
    let exp = new Date(a.expire);
    let days = Math.ceil((exp-now)/(1000*60*60*24));

    if(days > 0) active++; else expired++;

    let div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <b>#${i+1}</b><br>
      ${a.email} <button onclick="copy('${a.email}')">📋</button><br>
      ${a.password} <button onclick="copy('${a.password}')">📋</button><br>
      ⏳ ${days} days left<br>
      <span class="tag ${a.statusTag.toLowerCase()}">${a.statusTag}</span>
    `;

    list.appendChild(div);
  });

  document.getElementById("total").innerText = total;
  document.getElementById("active").innerText = active;
  document.getElementById("expired").innerText = expired;
}

function copy(text){
  navigator.clipboard.writeText(text);
}

function exportData(){
  let blob = new Blob([JSON.stringify(data)],{type:"application/json"});
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "backup.json";
  a.click();
}

renderProducts();
