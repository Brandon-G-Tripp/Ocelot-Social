# Middleware

## Middleware keeps resolvers clean

![](../.gitbook/assets/grafik-4.png)

A well-organized codebase is key for the ability to maintain and easily introduce changes into an app. Figuring out the right structure for your code remains a continuous challenge - especially as an application grows and more developers are joining a project.

A common problem in GraphQL servers is that resolvers often get cluttered with business logic, making the entire resolver system harder to understand and maintain.

GraphQL Middleware uses the [_middleware pattern_](https://dzone.com/articles/understanding-middleware-pattern-in-expressjs) \(well-known from Express.js\) to pull out repetitive code from resolvers and execute it before or after one of your resolvers is invoked. This improves code modularity and keeps your resolvers clean and simple.

