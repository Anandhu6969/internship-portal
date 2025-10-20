// src/Home.js
import { useState } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Home({ onLogin, showToast }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("intern");

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role,
        });

        showToast(`🎉 Signed up successfully as ${role === "intern" ? "Intern" : "Recruiter"}!`);
        onLogin(role, user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const userRole = docSnap.data().role;
          showToast(`✅ Logged in as ${userRole === "intern" ? "Intern" : "Recruiter"}!`);
          onLogin(userRole, user);
        } else {
          showToast("No account found. Please sign up first.", "error");
        }
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        if (!isSignUp) {
          showToast("No account found. Please Sign Up first using Google.", "error");
          return;
        }

        // Use the slider role when signing up
        await setDoc(docRef, { email: user.email, role });
        showToast(`🎉 Signed up successfully as ${role === "intern" ? "Intern" : "Recruiter"}!`);
        onLogin(role, user);
      } else {
        const userRole = docSnap.data().role;
        showToast(`✅ Logged in as ${userRole === "intern" ? "Intern" : "Recruiter"}!`);
        onLogin(userRole, user);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    
    <div className="home-container">
      <div className="home-left">
        <h1 className="brand">Welcome to <span>InternSphere</span></h1>
        <p className="tagline">Your gateway to internships that build your career.</p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
          alt="InternSphere Logo"
          className="home-img"
        />
      </div>

      <div className={`auth-panel ${isSignUp ? "slide-signup" : "slide-login"}`}>
        <h2>{isSignUp ? "Create Account" : "Welcome Back"}</h2>

        <form onSubmit={handleEmailAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><br />

          {isSignUp && (
            <div className="role-slider">
              <span className={role === "intern" ? "active" : ""}>Intern</span>
              <div
                className="slider-toggle"
                onClick={() => setRole(role === "intern" ? "recruiter" : "intern")}
              >
                <div className={`thumb ${role}`}></div>
              </div>
              <span className={role === "recruiter" ? "active" : ""}>Recruiter</span>
            </div>
          )}

          <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
        </form>

        <hr />
        <button className="google-btn" onClick={handleGoogleAuth}>
          {isSignUp ? "Sign Up with Google" : "Login with Google"}
        </button>

        <p className="switch-text" style={{paddingTop:"10px"}}>
          {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span onClick={toggleMode}>
            {isSignUp ? "Login" : "Sign Up"}
          </span>
        </p>
        
      </div>
    </div>
  );
}
