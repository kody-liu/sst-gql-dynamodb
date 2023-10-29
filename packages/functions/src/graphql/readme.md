Queries tend to be a bit more straight forward. You typically are just describing all the entities in your system and how they relate.

While, mutations can be a bit trickier to design. It makes more sense to provide specific mutations that correlate to business actions.

For example, instead of a generic updateArticle method, it makes more sense to write specific mutations like updateArticleTitle and updateArticleUrl. This is because:

Our frontend can make granular changes.
And if we trigger both the mutations, the frontend GraphQL client can just batch them together.
So we get the best of both worlds!

If you want to learn more about GraphQL schema design, make sure to check out this fantastic video.