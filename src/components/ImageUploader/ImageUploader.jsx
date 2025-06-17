import React, {useState} from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";

export default function ImageUploader() {
	const [files, setFiles] = useState([]);
	const [uploaded, setUploaded] = useState([]);
	const [category, setCategory] = useState("");

	const handleUpload = async (e) => {
		e.preventDefault();

		const role = localStorage.getItem("role");
		if (role !== "admin") {
			alert("Only admins can upload images.");
			return;
		}

		if (!files.length || !category) {
			alert("Выберите файлы и категорию");
			return;
		}

		try {
			// Сжатие изображений
			const compressedFiles = await Promise.all(
				files.map((file) =>
					imageCompression(file, {
						maxSizeMB: 0.5,
						maxWidthOrHeight: 1200,
						useWebWorker: true,
					})
				)
			);

			// Формируем FormData
			const formData = new FormData();
			for (const file of compressedFiles) {
				formData.append("files", file);
			}
			formData.append("category", category);

			// Отправка
			const token = localStorage.getItem("token");
			const res = await axios.post("http://localhost:5000/upload", formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			});

			setUploaded(res.data.uploaded);
			alert("Upload successful");
		} catch (err) {
			console.error("Upload failed", err);
			alert("Upload failed");
		}
	};

	return (
		<div className='upload'>
			<h2 className='upload__title'>Upload Images</h2>
			<form className='upload__form' onSubmit={handleUpload}>
				<div>
					<input
						type='file'
						multiple
						onChange={(e) => setFiles(Array.from(e.target.files))}
						className='upload__form-btn'
					/>
				</div>

				<div style={{margin: "10px 0"}}>
					<label className='label'>Category: </label>
					<select
						className='select'
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						required>
						<option value=''>-- Select --</option>
						<option value='Tools'>Tools</option>
						<option value='Architecture'>Architecture</option>
						<option value='Hard Surface'>Hard Surface</option>
						<option value='Machines'>Machines</option>
						<option value='Unspecified'>Unspecified</option>
						<option value='Animation'>Animation</option>
					</select>
				</div>

				<button type='submit' className='upload-btn'>
					Upload
				</button>
			</form>

			{uploaded.length > 0 && (
				<div>
					<h3>Uploaded Files:</h3>
					{uploaded.map((file) => (
						<div key={file.fileId}>
							<img
								src={`http://localhost:5000/image/${file.filename}`}
								alt={file.filename}
								style={{maxWidth: "200px", margin: "10px"}}
							/>
							<p>Category: {file.category}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
