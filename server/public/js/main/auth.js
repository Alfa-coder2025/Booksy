



export const signup = async (event) => {
  event.preventDefault();

sessionStorage.removeItem("forgotEmail");

const username=event.target.username.value.trim();
const phone=event.target.phone.value.trim();
const email=event.target.email.value.trim();
const password=event.target.password.value.trim();
const confirmpassword=event.target.confirmpassword.value.trim();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const user = {
  username: username,
  phone: phone,
  email: email,
  password: password,
  confirmpassword: confirmpassword
};

//form validation

if(username.length<4){
  alert("Username must contain atleast 4 characters");
  return;
}
if(phone.length!==10||isNaN(phone)){
  alert("Phone number must be exactly 10 digits and contain only numbers");
  return;
}
if (!emailRegex.test(email)) {
  alert("Please enter a valid email address");
  return;
}
if(password.length<4){
  alert("Password must be atleast 4 characters");
  return;
}
if(password!==confirmpassword){
  alert("Passwords must match");
  return;
}


try{


  const response=await fetch("http://localhost:8000/api/auth/send-otp",{
  method:"POST",
  credentials: "include",
  headers:{
    "Content-Type":"application/json",
  },
  body:JSON.stringify({identifier:email,user}),//add other details also

});

const result=await response.json();
  if(result.success){
    sessionStorage.setItem('tempUser', JSON.stringify({
        username,
        phone,
        email,
        password,
      }));
    // sessionStorage.setItem('tempUser', JSON.stringify(user));
    window.location.href = "/enterotp"; 
  }
  else{
    alert(result.message||"Failed to send OTP");
  }
}
catch(error){
  alert("An error occured.Please try again");
}

};
//verifyotp
export const verifyotp = async (event) => {
  event.preventDefault();
  stopOtpTimer(); 
  const otp = event.target.otp.value.trim();
  const tempUser = JSON.parse(sessionStorage.getItem('tempUser'));
  // // const email = document.querySelector("#email").value;

  if (!tempUser) {
    alert("Session expired. Please sign up again.");
    window.location.href = "/signup";
    return;
  }
   console.log(`Verifying OTP: ${otp} for ${tempUser.email}`);

  try {
    const response = await fetch("http://localhost:8000/api/auth/verify-otp", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
         identifier: tempUser.email,
        otp: otp,
        user: tempUser 
      }),
    });

    const result = await response.json();
    if(result.success) {
      // OTP verified, creating user in database
      alert("Account created successfully!,Click on the login");
      window.location.href = "/login";
  
    } else {
      alert(result.message || "OTP verification failed");
    }
  } catch(error) {
    alert("An error occurred. Please try again");
  }
};
//verify forgot otp
export const verifyForgotOtp = async (event) => {
  event.preventDefault();
  const otp = event.target.otp.value.trim();
  const email = sessionStorage.getItem('forgotEmail');

  if (!email) {
    alert("Session expired. Please try again.");
    window.location.href = "/forgotpassword";
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/auth/verify-forgot-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, otp }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      alert("OTP verified! Please reset your password.");
      window.location.href = "/changepassword";
    } else {
      alert(result.message || "OTP verification failed");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again");
  }
};

//timer
// otpTimer.js
let countdown = 60;
let timerInterval = null;

export const startOtpTimer = () => {
  const resendBtn = document.getElementById("resendBtn");
  const timerText = document.getElementById("otpTimer");
   const otpInput = document.querySelector("input[name='otp']");
  const verifyBtn = document.querySelector("#verifyotpform button[type='submit']");


  if (!resendBtn || !timerText || !otpInput || !verifyBtn) return;

  resendBtn.disabled = true;
 
  countdown = 60;
  timerText.textContent = `0:${countdown < 10 ? '0' : ''}${countdown} seconds remaining`;

  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    countdown--;
    timerText.textContent = `0:${countdown < 10 ? '0' : ''}${countdown} seconds remaining`;

    if (countdown <= 0) {
      clearInterval(timerInterval);
      resendBtn.disabled = false;
      otpInput.disabled = false;
      verifyBtn.disabled = false;
      timerText.textContent = "You can resend the OTP now";
    }
  }, 1000);
};
// Stop the timer immediately (call this on Verify click)
export const stopOtpTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    const timerText = document.getElementById("otpTimer");
    const resendBtn = document.getElementById("resendBtn");
    if (timerText) timerText.textContent = "";
    if (resendBtn) resendBtn.disabled = false;
  }
};

// Optional: reset timer manually (if needed elsewhere)
export const resetOtpTimer = () => {
  clearInterval(timerInterval);
  startOtpTimer();
};


// login
export const login = async (event) => {
  event.preventDefault();
  const email = event.target.email.value.trim();
  const password = event.target.password.value.trim();

  try {
    
    const response = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });

    const result = await response.json();
    
    if (response.ok) {
      // // Save token & role
      // localStorage.setItem("token", result.token);
      // localStorage.setItem("user", JSON.stringify(result.user));

      // Redirect based on role
      if (result.user.role === "admin") {
        window.location.href = "/admindashboard";
      } else {
        window.location.href = "/landingpage";
      }
    } else {
      alert(result.message || "Login failed");
    }
  } catch (error) {
    alert("An error occurred. Please try again");
  }
};

export const resendOtp=async()=>{
  const tempUser=JSON.parse(sessionStorage.getItem("tempUser"));
  if(!tempUser){
    alert("Session expired :Please try again");
    window.location.href="/signup";
  }
  try{
    const response=await fetch("http://localhost:8000/api/auth/resend-otp",{
      method:"POST",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify({identifier:tempUser.email}),
    });
    const result=await response.json();
    if(response.ok&&result.success){
      alert("OTP sent successfully to your email");
    }
    else{
      alert(result.message||"Failed to send otp");
    }
     
    
  }
  catch(error){
    alert("An error occcured.Please try again");
  }
}


//forgotpassword

export const forgotpassword=async(event)=>{
  event.preventDefault();
  const email = event.target.email.value.trim();
if (!email) {
    alert("Please enter your email");
    return;
  }
  try{
    const response=await fetch("http://localhost:8000/api/auth/check-email",{
    method:"POST",
    headers:{"Content-type":"application/json"},
    body:JSON.stringify({email}),
    });

    const result=await response.json();
    if (!result.exists) {
      alert("No account found with this email");
      return;
    }
    const otpResponse=await fetch("http://localhost:8000/api/auth/send-otp",{
      method:"POST",
    headers:{"Content-type":"application/json"},
    body:JSON.stringify({identifier:email}),
    })

    const otpResult=await otpResponse.json();
     if (otpResult.success) {
      sessionStorage.setItem("forgotEmail", email);
      alert("OTP sent to your email!");
      window.location.href = "/enterotp"; 
    } else {
      alert(otpResult.message || "Failed to send OTP");
    }

  }
  catch(error){
    alert("An error occcured.Please try again");
  }

}

//logout
export const logout = () => {
  sessionStorage.clear();
  window.location.href = "/login";
};




document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  if (signupForm) signupForm.addEventListener("submit", signup);

  const verifyOtpForm = document.getElementById("verifyotpform");
  if (verifyOtpForm) {
    if (sessionStorage.getItem("forgotEmail")) {
    // User came from forgot-password flow
    verifyOtpForm.addEventListener("submit", verifyForgotOtp);
  } else {
    // User came from signup flow
    verifyOtpForm.addEventListener("submit", verifyotp);
     console.log("Signup OTP flow active");
  }
  
    
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", login);

  const resendBtn=document.getElementById("resendBtn");
  
  if (resendBtn) {
    resendBtn.addEventListener("click", async () => {
      await resendOtp();    
      startOtpTimer();      // restart the timer
    });
  }

  const forgotPasswordForm=document.getElementById("forgotPasswordForm");
  if(forgotPasswordForm) forgotPasswordForm.addEventListener("submit",forgotpassword);

  startOtpTimer();

  const form = document.getElementById("changePasswordForm");
  if (form) {
    form.addEventListener("submit", changePassword);
  }

});



// change password
export const changePassword = async (event) => {
  event.preventDefault();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const email = sessionStorage.getItem("forgotEmail");

  if (!email) {
    alert("Session expired. Please try again.");
    window.location.href = "/forgotpassword";
    return;
  }

  if (newPassword.length < 4) {
    alert("Password must be at least 4 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords must match");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      alert("Password changed successfully! Please login.");
      sessionStorage.removeItem("forgotEmail");
      window.location.href = "/login";
    } else {
      alert(result.message || "Failed to change password");
    }
  } catch (error) {
    alert("An error occurred. Please try again");
  }
};

// document.getElementById("changePasswordForm").addEventListener("submit", changePassword);




//1.implement stock
//2.check resend not working..why?
//3. display link and login page(forgot password? login)=> connect to forgot password page
//3.1 understand the sessonStorage flow in the signup
//3.2 how expressSession is used
//4. when clicked on verify, it should trigger sendotp=> go to verifyotp page,
//5. if verify otp returns true,it should navigate to changepassword UI
//6.WHEN CLICKED ON CONFIRM PASSWORD,trigger api


//4.implement offer managemnet UI ,then scHema
//5.implement bacend API for offer






