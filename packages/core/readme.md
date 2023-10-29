# Rich domain model
This core packages follow the DDD's rich domain model design:

The DDD's rich domain model design have three parts: Model, Service and Repository

The Model class is focus on representing the business logic and state, it have these features:

1. The Model is a class, not just a TypeScript interface or type.
2. The model is similar to Vuex's mutation and state parts; it stores data and only exposes valid ways to update/read it through setters/getters to prevent unexpected data updates.
3. It cannot receive another model to prevent circular and endless update loops.
4. It can receive another model's read-only DTO (ensuring not to modify the other model) and update itself.
5. It has no ability to directly access the database.
6. It has a "toDTO" function to generate a read-only DTO JSON object, which can be sent to the client or other services.
7. It has a "toPersistence" function to generate a read-only persistence JSON object that needs to be stored in the database.

The Repository class is focus on data persistence and retrieval, it have these features:

1. It has a "create" method that receives an input JSON, creates an item in the database, and returns an instance of the Model class.
2. It has an "update" method that receives an instance of the Model class, calls the item's "toPersistence" method, and saves the JSON data into the database.
3. It has a "delete" method that receives an instance of the Model class and returns true when the deletion is successful.

The Service class is focus on coordinating actions between models and repositories, it have these features:

1. The service is a class that receives a repository instance in its constructor. The separation of service and repository provides convenience for testing, as we can inject a mock repository during testing.
2. It can receive another model's read-only DTO (ensuring not to modify the other model) and update the model using the model's methods, then use the repository to write the changes to the database.
3. It cannot receive another model to prevent circular and endless update loops.
4. It cannot import another service to prevent circlar and endless update loops.


# Is rich domain model more messy than anemic domain model because rich domain model's business logic is in both service and model?

No, a rich domain model design is not necessarily more messy than an anemic domain model. In fact, the goal of a rich domain model is to create a more expressive and cohesive representation of the business domain by encapsulating both data and behavior within the model.

In an anemic domain model, the data is separated from the behavior, typically resulting in entities that are primarily data structures with little or no business logic. The business logic is usually placed in service or procedural layers outside of the model.

On the other hand, a rich domain model aims to place the business logic directly within the model itself, making the model responsible for enforcing invariants, maintaining consistency, and representing the behavior specific to the domain. This approach can lead to a more understandable and maintainable codebase because the behavior is closely aligned with the data it operates on.

While it's true that some business logic may also reside within the service layer in a rich domain model design, the key principle is to keep the core business logic within the model. The service layer is responsible for coordinating interactions between models, handling use cases that involve multiple models, and managing cross-cutting concerns.

By having the business logic within the model, a rich domain model can provide benefits such as improved encapsulation, higher cohesion, and increased reusability. It can also lead to code that is easier to reason about, understand, and evolve as the business requirements change.

Ultimately, whether a rich domain model design becomes messy or not depends on the implementation and organization of the codebase. Properly applying the principles of domain-driven design, including maintaining clear responsibilities between the model and service layers, can help mitigate any potential messiness and lead to a well-structured and maintainable codebase.


Article: "Have You Anemic or Rich Domain Model?" by Crovitz (https://dev.to/crovitz/have-you-anemic-or-rich-domain-model-2ala)
Article: "Anemic Domain Model vs Rich Domain Model" by Regionbbs (https://dotblogs.com.tw/regionbbs/2021/05/29/anemicdomainmodel)
The rich model can prevent data set in wrong way in service class https://www.youtube.com/watch?v=6gwIDiUk2h4


// TODO: Generate question content
// Prompt: This is my type, write me the questions in JSON format, 1 category have 3 question, and each question have maximun 4 sub question:
