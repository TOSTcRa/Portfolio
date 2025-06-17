import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Link} from "react-router-dom";
import ImageUploader from "../components/ImageUploader/ImageUploader";
import LoginForm from "../components/LoginForm/LoginForm";
import "@/styles/admin.scss";
import ImageDeleter from "../components/ImageDeleter/ImageDeleter";

export default function Admin() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsAuthenticated(true);
		}
	}, []);

	const handleLogin = () => {
		setIsAuthenticated(true);
	};

	return (
		<div className='admin'>
			<Link to='/' className='home-link'>
				Home
			</Link>

			{isAuthenticated ? (
				<div className='admin__content'>
					<ImageUploader />
					<ImageDeleter />
				</div>
			) : (
				<LoginForm onLogin={handleLogin} />
			)}
		</div>
	);
}
