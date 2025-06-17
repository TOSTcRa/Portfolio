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
						? `http://localhost:5000/files?category=${encodeURIComponent(
								category
						  )}`
						: "http://localhost:5000/files";

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
						<img
							src={`http://localhost:5000/image/${file.filename}`}
							alt={file.filename}
							loading='lazy'
						/>
					</div>
				))}
			</div>
		</div>
	);
}
