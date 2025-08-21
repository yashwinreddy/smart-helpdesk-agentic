import Article from "../models/article.js";

// Create article
export const createArticle = async (req, res) => {
    try {
        const { title, body, tags, status } = req.body;
        if (!title || !body) return res.status(400).json({ error: "Title and body required" });

        const article = new Article({ title, body, tags, status });
        await article.save();
        res.status(201).json(article);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all articles
export const getArticles = async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single article by ID
export const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ error: "Article not found" });
        res.json(article);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update article
export const updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!article) return res.status(404).json({ error: "Article not found" });
        res.json(article);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete article
export const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) return res.status(404).json({ error: "Article not found" });
        res.json({ message: "Article deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
