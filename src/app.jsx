import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/home";
import "./styles/main.scss";
import Admin from "./pages/admin";

function App() {
	return (
		<Router>
			<Link to='/admin'></Link>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/admin' element={<Admin />} />
			</Routes>
		</Router>
	);
}

export default App;
