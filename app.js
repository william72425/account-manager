let data = JSON.parse(localStorage.getItem("data")) || {};
let currentProduct = null;
let editId = null;

function save(){
  localStorage.setItem("data", JSON.stringify(data));
}

function addProduct(){
  let p=document.getElementById("productInput").value;
  if(!data[p]){
    data[p]=[];
    save();
    renderProducts();
  }
}

function renderProducts(){
  let list=document.getElementById("productList");
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

function openForm(acc=null){
  document.getElementById("formModal").style.display="block";

  if(acc){
    editId=acc.id;
    document.getElementById("formTitle").innerText="Edit Account";

    document.getElementById("email").value=acc.email;
    document.getElementById("password").value=acc.password;
    document.getElementById("username").value=acc.username;
  }else{
    editId=null;
  }
}

function closeForm(){
  document.getElementById("formModal").style.display="none";
}

function calcExpire(date, duration, type){
  if(!duration || duration<=0) return null;

  let d=new Date(date);
  if(type==="days") d.setDate(d.getDate()+duration);
  if(type==="weeks") d.setDate(d.getDate()+duration*7);
  if(type==="months") d.setMonth(d.getMonth()+duration);

  return d;
}

function getDaysLeft(exp){
  if(!exp) return "-";

  let now=new Date();
  let days=Math.ceil((new Date(exp)-now)/(1000*60*60*24));

  if(isNaN(days)) return "-";

  return days;
}

function saveAccount(){

  let email=document.getElementById("email").value;

  if(!editId && data[currentProduct].some(a=>a.email===email)){
    alert("Already used for this product");
    return;
  }

  let claimedDate=document.getElementById("claimedDate").value || new Date();
  let duration=parseInt(document.getElementById("duration").value)||0;
  let type=document.getElementById("durationType").value;

  let expire=calcExpire(claimedDate, duration, type);

  let acc={
    id: editId || Date.now(),
    email,
    password: document.getElementById("password").value,
    username: document.getElementById("username").value,
    subName: document.getElementById("subName").value,
    subStatus: document.getElementById("subStatus").value,
    claimedDate,
    duration,
    durationType:type,
    expire,
    type: document.getElementById("type").value,
    statusTag: document.getElementById("statusTag").value,
    note: document.getElementById("note").value,
    added: new Date()
  };

  if(editId){
    let index=data[currentProduct].findIndex(a=>a.id===editId);
    data[currentProduct][index]=acc;
  }else{
    data[currentProduct].push(acc);
  }

  save();
  closeForm();
  renderAccounts();
}

function renderAccounts(){

  let list=document.getElementById("accountList");
  list.innerHTML="";

  let total=0,active=0,expired=0;

  data[currentProduct].forEach(a=>{
    total++;

    let days=getDaysLeft(a.expire);

    if(days==="-" || days>0) active++; else expired++;

    let div=document.createElement("div");
    div.className="card";

    div.innerHTML=`
      ${a.email}<br>
      ⏳ ${days} days<br>
      <button onclick='showDetail(${JSON.stringify(a)})'>View</button>
    `;

    list.appendChild(div);
  });

  document.getElementById("total").innerText=total;
  document.getElementById("active").innerText=active;
  document.getElementById("expired").innerText=expired;
}

function showDetail(a){
  let box=document.getElementById("detailContent");
  box.innerHTML=`
    <h3>${a.email}</h3>
    Username: ${a.username}<br>
    Password: ${a.password}<br>
    Type: ${a.type}<br>
    Status: ${a.statusTag}<br>
    Note: ${a.note}<br><br>

    <button onclick='openForm(${JSON.stringify(a)})'>Edit</button>
    <button onclick='deleteAcc(${a.id})'>Delete</button>
    <button onclick='closeDetail()'>Close</button>
  `;
  document.getElementById("detailModal").style.display="block";
}

function closeDetail(){
  document.getElementById("detailModal").style.display="none";
}

function deleteAcc(id){
  data[currentProduct]=data[currentProduct].filter(a=>a.id!==id);
  save();
  closeDetail();
  renderAccounts();
}

renderProducts();
