const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://localhost:5173','https://productrecommendationsite-nirob.netlify.app'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const logger = (req, res, next) => {
    console.log('inside the logger middleware');
    next();
}

const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;
    if (!token) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m9ucvt5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        //await client.connect();
        const queryCollection = client.db('queryDB').collection('queries');
        const recommendationCollection = client.db('queryDB').collection('recommendations');

        // Create a query
        app.post('/addquery', async (req, res) => {
            const newQuery = { ...req.body, likes: [], comments: [], recommendationCount: 0 };
            const result = await queryCollection.insertOne(newQuery);
            res.send(result);
        });

        //jwt
        app.post('/jwt', async (req, res) => {
            const userInfo = req.body;
            const token = jwt.sign(userInfo, process.env.JWT_ACCESS_SECRET, { expiresIn: '2h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: false
            })
            res.send({ success: true });
        })

        // Get all queries
        app.get('/addquery', async (req, res) => {
            const result = await queryCollection.find(req.query).toArray();
            res.send(result);
        });

        // Get single query
        app.get('/addquery/:id', async (req, res) => {
            const id = req.params.id;
            const result = await queryCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // Update a query
        app.put('/addquery/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = { $set: req.body };
            const result = await queryCollection.updateOne(filter, updatedDoc);
            res.send(result);
        });

        // Delete a query
        app.delete('/addquery/:id', async (req, res) => {
            const id = req.params.id;
            const result = await queryCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // Like/Unlike a query
        app.patch('/addquery/:id/like', async (req, res) => {
            const id = req.params.id;
            const { userId } = req.body;

            try {
                const doc = await queryCollection.findOne({ _id: new ObjectId(id) });
                const hasLiked = doc.likes?.includes(userId);
                const update = hasLiked
                    ? { $pull: { likes: userId } }
                    : { $addToSet: { likes: userId } };

                const result = await queryCollection.updateOne({ _id: new ObjectId(id) }, update);
                res.send({ success: true, liked: !hasLiked });
            } catch (err) {
                res.status(500).send({ success: false, error: err.message });
            }
        });

        // Add a comment
        app.post('/addquery/:id/comment', async (req, res) => {
            const id = req.params.id;
            const { userId, username, text } = req.body;

            const newComment = {
                _id: new ObjectId(),
                userId,
                username,
                text,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            try {
                const result = await queryCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $push: { comments: newComment } }
                );
                res.send({ success: true, comment: newComment });
            } catch (err) {
                res.status(500).send({ success: false, error: err.message });
            }
        });

        // Edit a comment
        app.put('/addquery/:queryId/comment/:commentId', async (req, res) => {
            const { queryId, commentId } = req.params;
            const { text } = req.body;

            try {
                const result = await queryCollection.updateOne(
                    { _id: new ObjectId(queryId), "comments._id": new ObjectId(commentId) },
                    {
                        $set: {
                            "comments.$.text": text,
                            "comments.$.updatedAt": new Date(),
                        },
                    }
                );
                res.send({ success: true, result });
            } catch (err) {
                res.status(500).send({ success: false, error: err.message });
            }
        });

        // Delete a comment
        app.delete('/addquery/:queryId/comment/:commentId', async (req, res) => {
            const { queryId, commentId } = req.params;

            try {
                const result = await queryCollection.updateOne(
                    { _id: new ObjectId(queryId) },
                    { $pull: { comments: { _id: new ObjectId(commentId) } } }
                );
                res.send({ success: true, result });
            } catch (err) {
                res.status(500).send({ success: false, error: err.message });
            }
        });

        // ========= NEW RECOMMENDATION ROUTES ==========

        // Add a recommendation
        app.post('/recommendations', async (req, res) => {
            const recommendation = { ...req.body, date: new Date() };
            const result = await recommendationCollection.insertOne(recommendation);

            // Increase recommendation count on the related query
            if (recommendation.queryId) {
                await queryCollection.updateOne(
                    { _id: new ObjectId(recommendation.queryId) },
                    { $inc: { recommendationCount: 1 } }
                );
            }

            res.send(result);
        });

        // Get recommendations by user email
        app.get('/recommendations', async (req, res) => {
            const { email } = req.query;
            const result = await recommendationCollection.find({ userEmail: email }).toArray();
            res.send(result);
        });

        // Delete a recommendation and decrease query count
        app.delete('/recommendations/:id', async (req, res) => {
            const id = req.params.id;
            const recommendation = await recommendationCollection.findOne({ _id: new ObjectId(id) });

            if (recommendation) {
                await recommendationCollection.deleteOne({ _id: new ObjectId(id) });

                if (recommendation.queryId) {
                    await queryCollection.updateOne(
                        { _id: new ObjectId(recommendation.queryId) },
                        { $inc: { recommendationCount: -1 } }
                    );
                }

                res.send({ success: true });
            } else {
                res.status(404).send({ success: false, message: "Recommendation not found" });
            }
        });

        //await client.db("admin").command({ ping: 1 });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Product Recommendation Server is Running!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});