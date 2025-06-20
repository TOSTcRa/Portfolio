import React, {useEffect, useState} from "react";
import axios from "axios";
import "@/styles/delete.scss";

export default function ImageDeleter() {
	const [images, setImages] = useState([]);
	const token = localStorage.getItem("token");
	const role = localStorage.getItem("role"); // Добавили роль

	useEffect(() => {
		fetchImages();
	}, []);

	const fetchImages = async () => {
		try {
			const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/files`);
			setImages(res.data);
		} catch (err) {
			console.error("Error fetching images", err);
		}
	};

	const handleDelete = async (id) => {
		if (role !== "admin") {
			alert("Only admin can delete images.");
			return;
		}

		if (!window.confirm("Are you sure you want to delete this image?")) return;

		try {
			await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/image/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setImages((prev) => prev.filter((img) => img._id !== id));
		} catch (err) {
			console.error("Failed to delete image", err);
		}
	};

	return (
		<div className='image-deleter container'>
			<h2>Delete Images</h2>
			<div className='grid'>
				{images.map((img) => (
					<div className='item' key={img._id}>
						{img.contentType.startsWith("image/") ? (
							<img
								src={`${import.meta.env.VITE_API_BASE_URL}/image/${
									img.filename
								}`}
								alt={img.filename}
								loading='lazy'
							/>
						) : img.contentType.startsWith("video/") ? (
							<video
								autoPlay
								loop
								muted
								playsInline
								src={`${import.meta.env.VITE_API_BASE_URL}/image/${
									img.filename
								}`}
								width='100%'>
								Your browser does not support the video tag.
							</video>
						) : (
							<p>Unsupported file type</p>
						)}
						<p>Category: {img.metadata?.category || "Unknown"}</p>
						<button onClick={() => handleDelete(img._id)}>Delete</button>
					</div>
				))}
			</div>
		</div>
	);
}
