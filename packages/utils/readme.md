# Good object mapper for dynamodb
https://stackoverflow.com/questions/23785158/is-there-a-good-object-mapper-for-amazons-dynamodbthrough-aws-sdk-which-can-be

# Choosing the Right DynamoDB Partition Key
https://aws.amazon.com/blogs/database/choosing-the-right-dynamodb-partition-key/#:~:text=Why%20do%20I%20need%20a,value%2C%20which%20must%20be%20unique.

# Optimize MongoDB query
https://www.mongodb.com/docs/manual/core/query-optimization/#covered-query

While MongoDB's explain output doesn't directly provide information about whether your query follows the specific optimization strategies I mentioned earlier, you can still use the explain output to identify areas where your query can be optimized and indirectly evaluate whether it aligns with these strategies. Here's how you can analyze the explain output for optimization opportunities:

1. Check for Index Usage:

Look for "IXSCAN" stages in the winningPlan or executionStages sections. This indicates that an index is being used, which aligns with the first optimization strategy of utilizing indexes.

2. Covered Queries:

In the winningPlan, check if the "inputStage" is "FETCH". If it's not present, it means the query might be a covered query, where all data is retrieved from the index without fetching the documents.

If the data we need all exist in index, we should not let "FETCH" stage exist.

https://studio3t.com/whats-new/whats-a-covered-query-in-mongodb_studio3t_ama/

3. Sorting:

Look for "SORT" stages in the query execution plan. If you see "SORT" stages, consider whether an index-backed sort is being used, which can align with the optimization strategy for sorting.

4. Geospatial and Text Indexes:

For geospatial or text queries, look for specific index types like "2dsphere" or "text" in the winningPlan or executionStages. This indicates that specialized indexes are being utilized.

https://www.mongodb.com/docs/manual/core/indexes/index-types/geospatial/2dsphere/create/#std-label-2dsphere-index-create

```json
"winningPlan": {
   "stage": "GEO_NEAR_2DSPHERE",
   "indexName": "your_2dsphere_index_name"
   // Other relevant information about the 2dsphere index usage
}
```

```json
"winningPlan": {
   "stage": "TEXT",
   "indexName": "your_text_index_name"
   // Other relevant information about the text index usage
}
```

5. Aggregation Framework:

If your query involves aggregation, consider whether it's using the Aggregation Framework. The use of aggregation stages in the plan indicates the application of aggregation-based optimization.

6. Index Hints:

Check if there's an "indexName" specified in the "inputStage" of the winningPlan. If you've used an index hint in your query, it will be reflected here.

```json
"queryPlanner": {
  // Other query planner information
  "indexName": "indexField_1"
}
```
If you see an "indexName" attribute that matches the index you hinted in your query, it means that the index hint has been applied, and MongoDB is using the specified index for query execution.

7. Query Filters:

Examine the filter section in the "command" part of the output. Ensure that your query filter aligns with your optimization goals, such as using indexed fields efficiently.

8. ESR rule (equality-sort-range rule)

If don't follow ESR rule to build index, or the query is against the index design, the explain result will shows "Sorted in Memory: yes"

https://ithelp.ithome.com.tw/articles/10289322

9.  Schema Design:

Schema design optimization often involves denormalization and embedding related data. This may not be directly visible in the explain output but can impact query performance significantly based on how documents are structured.

10. Caching:

Caching strategies like in-memory caches or result caches are external to MongoDB and are typically not reflected in the explain output.

11. Sharding:

Sharding decisions impact query performance at a broader architectural level and may not be evident in the explain output of individual queries.

12. NLJ

In MongoDB's query execution plan (explain()), the stage "nlj" stands for "Nested Loop Join." It is a type of join operation used to combine data from two collections or indexes when there is no suitable index to perform an efficient "Merge" or "Hash" join.

Here's what it means:

Nested Loop Join (NLJ): In this stage, MongoDB iterates over each document in the first collection (the left-hand side of the join) and for each document, it scans the entire second collection (the right-hand side of the join) to find matching documents. This is essentially a nested loop where each document from the first collection is compared with every document in the second collection.

Use Cases: NLJ is typically used when there is no appropriate index to perform a more efficient join operation like "Merge" or "Hash" join. It's the least efficient join operation and can be very slow for large datasets.

Performance Impact: NLJ can have a significant performance impact, especially for large collections, because it involves scanning the entire right-hand collection for each document in the left-hand collection. This can result in a high number of document examinations and can be slow.

Considerations: To optimize queries and avoid NLJ, it's essential to design your database schema, create appropriate indexes, and structure your queries to take advantage of available indexes. Avoiding NLJ is a common optimization goal in MongoDB query performance tuning.

In summary, when you see "stage": "nlj" in a MongoDB query execution plan, it indicates that a nested loop join is being used for the particular query, which may not be optimal for performance, especially with large datasets. Consider improving your indexing and query structure to avoid this join type whenever possible.


# MongoDB optimize by refer explain result

The goal of query optimization in MongoDB, as indicated by the attributes in the .explain output, is to achieve efficient query execution. This means reducing the time and resources required to retrieve the desired data while ensuring that the queries are responsive and performant. Let's break down the key attributes in the .explain output and how they relate to the optimization goal:

1. queryPlanner Section:

winningPlan: The optimization goal is to have a winning plan that utilizes indexes (IXSCAN) or other efficient methods to retrieve data. An efficient plan typically involves using indexes whenever possible.

2. executionStats Section:

executionTimeMillis: The goal is to minimize the execution time, which represents how long it takes to execute the query. Lower execution time is desirable.

totalDocsExamined: The goal is to minimize the number of documents examined during the query. Fewer documents examined indicate more efficient query execution.

3. command Section:

filter: The optimization goal is to have filters that use indexes efficiently. A well-designed filter that leverages indexes can significantly improve query performance.

limit: Limiting the number of documents returned (limit) is a common optimization strategy to reduce the amount of data transferred and processed.

Index Usage:

The presence of "IXSCAN" (index scan) in the winning plan indicates that an index is being used efficiently. The goal is to see "IXSCAN" for queries that can benefit from index usage.
Rejected Plans:

The absence of alternative plans that involve a full collection scan (COLLSCAN) in the rejectedPlans section is often a goal. If all alternative plans involve indexes or more efficient methods, it means the query planner is making optimal choices.
Overall, the primary goal of query optimization is to minimize the use of full collection scans (COLLSCAN) and maximize the use of indexes (IXSCAN) or other efficient query execution strategies. This reduces the amount of data scanned, improves query response times, and lowers resource consumption. By analyzing and fine-tuning queries based on the attributes in the .explain output, you can work towards achieving this optimization goal and ensuring your MongoDB queries perform efficiently.


## Open Local MongoDB console
http://localhost:8081/


## Other resources:
https://medium.com/starbugs/optimize-index-with-mongodb-explain-2337ef50a601