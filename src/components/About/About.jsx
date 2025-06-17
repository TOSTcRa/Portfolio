import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
	faTelegram,
	faSquareUpwork,
	faSquareInstagram,
} from "@fortawesome/free-brands-svg-icons";
import about from "@/assets/about/about.png";
import "../../styles/about.scss";

export default function About() {
	return (
		<div className='about container'>
			<div className='about__photo'>
				<img src={about} alt='My Photo' className='about__img' />
			</div>
			<div className='about__text'>
				<h2 className='about__title'>About Me</h2>
				<p className='about__desc'>
					I'm a 3D designer with experience in some sh alalalallalal yarik
					sportivniy samiy ktruoi i tuta pudg estche takoi on krut daaaa ahahah
					blya ya bi yego trrahnul haknul tam v ocheche blyaaa cho bi eshche
					napisat tuta nu karoch chota ti pridumai shob norm bilo pzh a to ya
					zaebalsya pisat tuta uzhe
				</p>
				<div className='about__socials'>
					<a
						href='https://t.me/soyarke'
						target='_blank'
						className='social telegram'>
						<FontAwesomeIcon icon={faTelegram} />
					</a>
					<a
						href='https://www.instagram.com/soyarke'
						target='_blank'
						className='social instagram'>
						<FontAwesomeIcon icon={faSquareInstagram} />
					</a>
					<a
						href='https://upwork.com'
						target='_blank'
						className='social upwork'>
						<FontAwesomeIcon icon={faSquareUpwork} />
					</a>
				</div>
			</div>
		</div>
	);
}
