let data = JSON.parse(localStorage.getItem("data")) || {};
let currentProduct = null;

function save(){
  localStorage.setItem("data", JSON.stringify(data));
}

function addProduct(){
  let p = document.getElementById("productInput").value;
  if(!data[p]){
    data[p]=[];
    save();
    renderProducts();
  }
}

function renderProducts(){
  let list = document.getElementById("productList");
  list.innerHTML="";
  Object.keys(data).forEach(p=>{
    let div=document.createElement("div");
    div.className="card";
    div.innerText=p;
    div.onclick=()=>openProduct(p);
    list.appendChild(div);
  });
}

function openProduct(p){
  currentProduct=p;
  document.getElementById("currentProduct").innerText=p;
  renderAccounts();
}

function toggleForm(){
  let f=document.getElementById("form");
  f.style.display = f.style.display==="block"?"none":"block";
}

function addAccount(){

  let email=document.getElementById("email").value;

  if(data[currentProduct].some(a=>a.email===email)){
    alert("Already used for this product");
    return;
  }

  let claimedDate=new Date(document.getElementById("claimedDate").value || new Date());
  let duration=parseInt(document.getElementById("duration").value)||0;
  let type=document.getElementById("durationType").value;

  let expire=new Date(claimedDate);

  if(type==="days") expire.setDate(expire.getDate()+duration);
  if(type==="weeks") expire.setDate(expire.getDate()+duration*7);
  if(type==="months") expire.setMonth(expire.getMonth()+duration);

  let acc={
    id: Date.now(),
    subName: document.getElementById("subName").value,
    subStatus: document.getElementById("subStatus").value,
    claimedDate,
    duration,
    durationType:type,
    expire,
    username: document.getElementById("username").value,
    email,
    password: document.getElementById("password").value,
    type: document.getElementById("type").value,
    statusTag: document.getElementById("statusTag").value,
    note: document.getElementById("note").value,
    added: new Date()
  };

  data[currentProduct].push(acc);
  save();
  toggleForm();
  renderAccounts();
}

function renderAccounts(){

  let list=document.getElementById("accountList");
  list.innerHTML="";

  let total=0,active=0,expired=0;

  data[currentProduct].forEach((a,i)=>{

    total++;

    let now=new Date();
    let days=Math.ceil((new Date(a.expire)-now)/(1000*60*60*24));

    if(days>0) active++; else expired++;

    let div=document.createElement("div");
    div.className="card";

    div.innerHTML=`
    #${i+1}<br>
    ${a.email} <button onclick="copy('${a.email}')">📋</button><br>
    ${a.password} <button onclick="copy('${a.password}')">📋</button><br>
    ${a.subName} (${a.subStatus})<br>
    ⏳ ${days} days left<br>
    Status: ${a.statusTag}
    `;

    list.appendChild(div);
  });

  document.getElementById("total").innerText=total;
  document.getElementById("active").innerText=active;
  document.getElementById("expired").innerText=expired;
}

function copy(t){
  navigator.clipboard.writeText(t);
}

function exportData(){
  let blob=new Blob([JSON.stringify(data)],{type:"application/json"});
  let a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="backup.json";
  a.click();
}

renderProducts();
