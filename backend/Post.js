class Post {
    /**
     * Constructs a new Post object representing a user post in the potluck app.
     *
     * @param {string} id - Unique identifier for the post.
     * @param {string} poster - Username or handle of the user who created the post.
     * @param {Array<Object>} media - Array of media objects associated with the post. Each object contains:
     *   - url {string}: URL to the media BLOB
     *   - type {string}: Type of media ('image' or 'video')
     *   - displayOrder {number}: Order in which media should be displayed
     * @param {string} text - Main text content of the post.
     * @param {Object} [recipe] - Optional recipe details. Contains:
     *   - contentChunks {Array<Object>}: Array of content chunk objects, each with:
     *       - type {string}: Chunk type ('media', 'ingredients', 'nutrition')
     *       - displayOrder {number}: Display order for the chunk
     *       - data {any}: Data varies by type:
     *           - If type = 'media': {string} URL to BLOB
     *           - If type = 'ingredients': {Object} { servingSize: number, ingredients: string[] }
     * Initializes likes, dislikes, replies, and timestamps.
     */
    constructor(id, poster, media, text, recipe) {
        this.id = id;
        this.poster = poster;
        this.media = media;
        this.text = text;
        this.recipe = recipe;
        this.likes = 0;
        this.dislikes = 0;
        this.replies = [];
        this.dateCreated = new Date().toISOString().split('T')[0];
        this.dateUpdated = this.dateCreated;
    }
}