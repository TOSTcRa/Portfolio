require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const {MongoClient, GridFSBucket, ObjectId} = require("mongodb");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
let gfsBucket;

mongoose.connect(mongoURI).then(() => {
	console.log("✅ Mongoose connected");
});

MongoClient.connect(mongoURI).then((client) => {
	const db = client.db();
	gfsBucket = new GridFSBucket(db, {
		bucketName: "uploads",
	});
	console.log("✅ GridFS Bucket initialized");
});

const JWT_SECRET = process.env.JWT_SECRET;
const USERS = [
	{
		username: process.env.ADMIN_USERNAME,
		password: process.env.ADMIN_PASSWORD,
		role: "admin",
	},
	{
		username: process.env.USER_USERNAME,
		password: process.env.USER_PASSWORD,
		role: "user",
	},
];

// Middleware: JWT аутентификация
function authenticate(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({error: "No token provided"});
	}
	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({error: "Invalid token"});
	}
}

// Middleware: Только для админов
function requireAdmin(req, res, next) {
	if (req.user.role !== "admin") {
		return res.status(403).json({error: "Admin access only"});
	}
	next();
}

// Авторизация
app.post("/login", (req, res) => {
	const {username, password} = req.body;
	const user = USERS.find(
		(u) => u.username === username && u.password === password
	);

	if (user) {
		const token = jwt.sign(
			{username: user.username, role: user.role},
			JWT_SECRET,
			{
				expiresIn: "6h",
			}
		);
		return res.json({token});
	}

	res.status(401).json({error: "Invalid credentials"});
});

// Настройка multer
const storage = multer.memoryStorage();
const upload = multer({storage});

// Загрузка изображений (только админ)
app.post(
	"/upload",
	authenticate,
	requireAdmin,
	upload.array("files"),
	async (req, res) => {
		const category = req.body.category;
		if (!req.files || req.files.length === 0 || !category) {
			return res.status(400).json({error: "Files and category are required"});
		}

		const results = [];

		for (const file of req.files) {
			const filename = `${Date.now()}-${file.originalname}`;

			const uploadStream = gfsBucket.openUploadStream(filename, {
				contentType: file.mimetype,
				metadata: {
					category,
					user: req.user.username,
				},
			});

			const result = await new Promise((resolve, reject) => {
				uploadStream.end(file.buffer);
				uploadStream.on("finish", () => {
					console.log(`📁 Uploaded: ${filename} by ${req.user.username}`);
					resolve({filename, fileId: uploadStream.id, category});
				});
				uploadStream.on("error", reject);
			});

			results.push(result);
		}

		res.status(201).json({uploaded: results});
	}
);

// Получение изображения
app.get("/image/:filename", (req, res) => {
	gfsBucket
		.openDownloadStreamByName(req.params.filename)
		.on("error", () => res.status(404).send("Image not found"))
		.pipe(res);
});

// Получение списка файлов
app.get("/files", async (req, res) => {
	const category = req.query.category;
	const query = category ? {"metadata.category": category} : {};

	try {
		const files = [];
		await gfsBucket.find(query).forEach((file) => files.push(file));
		res.json(files);
	} catch (err) {
		console.error(err);
		res.status(500).json({error: "Failed to fetch files"});
	}
});

// Удаление изображения (только админ)
app.delete("/image/:id", authenticate, requireAdmin, async (req, res) => {
	try {
		const fileId = new ObjectId(req.params.id);
		await gfsBucket.delete(fileId);
		console.log(`🗑️ Deleted file: ${fileId}`);
		res.json({message: "Image deleted"});
	} catch (err) {
		console.error(err);
		res.status(500).json({error: "Failed to delete image"});
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
