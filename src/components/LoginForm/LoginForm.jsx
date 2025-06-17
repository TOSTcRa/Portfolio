import React, {useState} from "react";
import axios from "axios";
import "@/styles/login.scss";

export default function LoginForm({onLogin}) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("http://localhost:10000/login", {
				username,
				password,
			});

			localStorage.setItem("token", res.data.token);
			const payload = JSON.parse(atob(res.data.token.split(".")[1]));
			localStorage.setItem("role", payload.role);
			onLogin();
		} catch (err) {
			console.error("Login failed", err);
			setError("Неверные учетные данные");
		}
	};

	return (
		<div className='login'>
			<h2 className='login__title'>Login</h2>
			<form onSubmit={handleLogin} className='login__form'>
				<input
					className='login__form-input'
					type='text'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder='Username'
					required
				/>
				<input
					className='login__form-input'
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder='Password'
					required
				/>
				<button type='submit' className='upload-btn'>
					Login
				</button>
			</form>
			{error && <p style={{color: "red"}}>{error}</p>}
		</div>
	);
}
