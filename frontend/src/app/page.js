'use client';
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import style from "./page.module.css";

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toasts, setToasts] = useState([]);
  
  const router = useRouter(); 

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const BASE_API = "http://localhost:5000/api";
      const response = await fetch(`${BASE_API}/logincustomer`, {
        method: "POST",
        credentials: "include",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();

      if (response.ok && result.msg === "Login Sucessfully") {
        showToast("Login Successful!", "success");
        
        setTimeout(() => {
          router.push("/Dashboard"); 
        }, 2000);

      } else {
        showToast(result.msg || "Invalid credentials", "error");
      }
    } catch (error) {
      showToast("Server error. Please try again.", "error");
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      window.location.href = "http://localhost:5000/auth/google"; 
    } catch (error) {
      showToast("Google login failed. Try again.", "error");
    }
  };

  return (
    <div className={style.container}>
      <div className={style.toastContainer}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`${style.toast} ${style[toast.type]}`}>
            {toast.message}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={style.form}>
        <h2 className={style.h2}>Customer Login</h2>
        <input
          type="email"
          value={email}
          className={style.input}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
          required
        />
        <input
          type="password"
          value={password}
          className={style.input}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          required
        />
        <button type="submit" className={style.btn}>Login Now</button>

        <div className={style.divider}>or</div>
        
        <button 
          type="button"   
          onClick={handleGoogleLogin} 
          className={`${style.googleBtn}`}
        >
          <svg className={style.googleIcon} viewBox="0 0 24 24" width="30" height="15">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-1.14 2.76-2.4 3.6v3h3.86c2.26-2.09 3.67-5.17 3.67-8.45z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01H1.33v3.1A11.995 11.995 0 0 0 12 24z"/>
            <path fill="#FBBC05" d="M5.24 14.24a7.15 7.15 0 0 1 0-4.48v-3.1H1.33a11.986 11.986 0 0 0 0 10.68l3.91-3.1z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.33 0 3.33 2.69 1.33 6.65l3.91 3.1c.95-2.88 3.61-5.01 6.76-5.01z"/>
          </svg>
          Sign in with Google
        </button>
      </form>
    </div>
  );
}