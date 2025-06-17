import React from "react";
import Header from "../components/Header/Header";
import About from "../components/About/About";
import Portfolio from "../components/Portfolio/Portfolio";

export default function Home() {
	return (
		<div className='app'>
			<Header />
			<About />
			<Portfolio />
		</div>
	);
}
