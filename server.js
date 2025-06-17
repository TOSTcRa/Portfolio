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

function requireAdmin(req, res, next) {
	if (req.user.role !== "admin") {
		return res.status(403).json({error: "Admin access only"});
	}
	next();
}

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

const storage = multer.memoryStorage();
const upload = multer({storage});

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

app.get("/image/:filename", async (req, res) => {
	try {
		const filesCursor = gfsBucket.find({filename: req.params.filename});
		const files = await filesCursor.toArray();
		if (!files || files.length === 0) {
			return res.status(404).send("File not found");
		}
		const file = files[0];

		res.set("Content-Type", file.contentType); // Важно!
		gfsBucket.openDownloadStreamByName(req.params.filename).pipe(res);
	} catch (err) {
		console.error("Error retrieving file:", err);
		res.status(500).send("Server error");
	}
});

app.get("/files", async (req, res) => {
	const {category, type} = req.query;
	const query = {};

	if (category) {
		query["metadata.category"] = category;
	}

	if (type === "image") {
		query.contentType = {$regex: "^image/"};
	} else if (type === "video") {
		query.contentType = {$regex: "^video/"};
	}

	try {
		const files = [];
		await gfsBucket.find(query).forEach((file) => files.push(file));
		res.json(files);
	} catch (err) {
		console.error(err);
		res.status(500).json({error: "Failed to fetch files"});
	}
});

app.delete("/image/:id", authenticate, requireAdmin, async (req, res) => {
	try {
		const fileId = new ObjectId(req.params.id);
		await gfsBucket.delete(fileId);
		console.log(`🗑️ Deleted file: ${fileId}`);
		res.json({message: "File deleted"});
	} catch (err) {
		console.error(err);
		res.status(500).json({error: "Failed to delete file"});
	}
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
