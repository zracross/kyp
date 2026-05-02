const API = "https://script.google.com/macros/s/AKfycbykc_NTr5rPCV-DV8LS4s-t_oqxG4Jxk04skl2ZXbmmah9OySxgZND73-_3Ypg7LDVHbA/exec";

let userName = "";
let userEmail = "";

async function sendOTP() {
  userName = document.getElementById("name").value;
  userEmail = document.getElementById("email").value;

  // Check user
  let res = await fetch(API, {
    method: "POST",
    body: JSON.stringify({
      action: "getUser",
      name: userName,
      email: userEmail
    })
  });

  let data = await res.json();

  if (!data.success) {
    alert("User not found!");
    return;
  }

  // Send OTP
  await fetch(API, {
    method: "POST",
    body: JSON.stringify({
      action: "sendOTP",
      email: userEmail
    })
  });

  document.getElementById("login").style.display = "none";
  document.getElementById("otpBox").style.display = "block";

  startTimer();
}

async function verifyOTP() {
  let otp = document.getElementById("otp").value;

  let res = await fetch(API, {
    method: "POST",
    body: JSON.stringify({
      action: "verifyOTP",
      email: userEmail,
      otp: otp
    })
  });

  let data = await res.json();

  if (!data.success) {
    alert("Wrong OTP");
    return;
  }

  loadDashboard();
}

async function loadDashboard() {
  let res = await fetch(API, {
    method: "POST",
    body: JSON.stringify({
      action: "getUserData",
      name: userName,
      email: userEmail
    })
  });

  let d = await res.json();

  document.getElementById("otpBox").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  document.getElementById("userName").innerText = d.name;
  document.getElementById("userEmail").innerText = d.email;
  document.getElementById("amount").innerText = "₹ " + d.amount;

  function status(v) {
    return v ? "done" : "pending";
  }

  document.getElementById("workflow").innerHTML = `
    <div class="step ${status(d.info)}">✔ Info Checked</div>
    <div class="step ${status(d.received)}">✔ Payment Received</div>
    <div class="step ${status(d.methodCheck)}">✔ Method Selected (${d.method})</div>
    <div class="step ${status(d.process)}">✔ Processing</div>
    <div class="step ${status(d.done)}">✔ Payment Done</div>
    <div class="step">📅 ${d.date}</div>
    <div class="step">🔢 ${d.tid}</div>
  `;
}

function startTimer() {
  let time = 60;
  let timer = setInterval(() => {
    document.getElementById("timer").innerText =
      "Resend in " + time + " sec";
    time--;

    if (time < 0) {
      clearInterval(timer);
      document.getElementById("timer").innerText = "";
    }
  }, 1000);
}

function resendOTP() {
  sendOTP();
}
