import React, {useEffect, useState} from "react";
import axios from "axios";
import "@/styles/gallery.scss";

export default function Gallery({category}) {
	const [files, setFiles] = useState([]);

	useEffect(() => {
		const fetchFiles = async () => {
			try {
				const url =
					category && category !== "All"
						? `${
								import.meta.env.VITE_API_BASE_URL
						  }/files?category=${encodeURIComponent(category)}`
						: `${import.meta.env.VITE_API_BASE_URL}/files`;

				const res = await axios.get(url);
				setFiles(res.data);
			} catch (err) {
				console.error("Failed to fetch files", err);
			}
		};

		fetchFiles();
	}, [category]);

	return (
		<div className='gallery'>
			<div className='gallery__grid'>
				{files.map((file) => (
					<div key={file._id} className='gallery__item'>
						{file.contentType.startsWith("image/") ? (
							<img
								src={`${import.meta.env.VITE_API_BASE_URL}/image/${
									file.filename
								}`}
								alt={file.filename}
								loading='lazy'
							/>
						) : file.contentType.startsWith("video/") ? (
							<video
								autoPlay
								loop
								muted
								playsInline
								src={`${import.meta.env.VITE_API_BASE_URL}/image/${
									file.filename
								}`}
								width='100%'>
								Your browser does not support the video tag.
							</video>
						) : (
							<p>Unsupported file type</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
