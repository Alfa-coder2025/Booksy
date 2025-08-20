



export const signup = async (event) => {
  event.preventDefault();



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
  const otp = event.target.otp.value.trim();
  const tempUser = JSON.parse(sessionStorage.getItem('tempUser'));

  if (!tempUser) {
    alert("Session expired. Please sign up again.");
    window.location.href = "/signup";
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: tempUser.email,
        otp
      }),
    });

    const result = await response.json();
    if(response.ok) {
      // OTP verified, creating user in database
      alert("Account created successfully!,Click on the login");
  
    } else {
      alert(result.message || "OTP verification failed");
    }
  } catch(error) {
    alert("An error occurred. Please try again");
  }
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
    });

    const result = await response.json();
    
    if (response.ok) {
      // Save token & role
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

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


/*export const login = async (event) => {
  event.preventDefault();
  const email = event.target.email.value.trim();
  const password = event.target.password.value.trim();

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      alert("User not found. Please sign up first.");
      return;
    }
   // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      alert("Invalid credentials");
      return;
    }

    // Login successful
    // Store user data in session/local storage as needed
    sessionStorage.setItem('user', JSON.stringify({
      id: user._id,
      username: user.username,
      email: user.email,
      role: 'user'
    }));

    window.location.href = "/dashboard";
  } catch (error) {
    alert("An error occurred. Please try again");
  }
};*/
//admin login


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
    verifyOtpForm.addEventListener("submit", verifyotp);

  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", login);

});


//1. Add Product -sync the backend with UI : updateProduct, deleteproduct
//2.category is not added to products(check)
//3. product images path has to be checked.
//4.implement offer managemnet UI ,then scema
//5.implement bacend API for offer






