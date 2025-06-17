import React from "react";
import {Link} from "react-router-dom";
import "../../styles/header.scss";
export default function Header() {
	return (
		<div className='header container'>
			<h1 className='header__title'>Yaroslav S.</h1>
			<Link to='/admin' style={{color: "white", textDecoration: "none"}}>
				Admin link
			</Link>
			<button className='header__button'>Download CV</button>
		</div>
	);
}
