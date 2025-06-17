import React from "react";
import "../../styles/header.scss";
export default function Header() {
	return (
		<div className='header container'>
			<h1 className='header__title'>Yaroslav S.</h1>
			<button className='header__button'>Download CV</button>
		</div>
	);
}
