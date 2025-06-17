import React, {useState} from "react";
import Gallery from "../Gallery/Gallery";
import "../../styles/portfolio.scss";

export default function Portfolio() {
	const [selectedCategory, setSelectedCategory] = useState("All");

	const categories = [
		"All",
		"Tools",
		"Architecture",
		"Hard Surface",
		"Machines",
		"Animation",
		"Unspecified",
	];

	return (
		<div className='portfolio container'>
			<h2 className='portfolio__title'>Portfolio</h2>
			<select
				value={selectedCategory}
				onChange={(e) => setSelectedCategory(e.target.value)}
				className='portfolio__dropdown'>
				{categories.map((cat) => (
					<option key={cat} value={cat}>
						{cat}
					</option>
				))}
			</select>
			<ul className='portfolio__switches'>
				{categories.map((cat) => (
					<li
						key={cat}
						className={`portfolio__switch ${
							selectedCategory === cat ? "active" : ""
						}`}
						onClick={() => setSelectedCategory(cat)}>
						{cat}
					</li>
				))}
			</ul>
			<Gallery category={selectedCategory} />
		</div>
	);
}
