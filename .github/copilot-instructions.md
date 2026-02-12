- **C# best practices**  
  When generating C# code, always follow modern .NET conventions (C# 12 / .NET 8). Use `file-scoped namespaces`, `global using` directives, and enable nullable reference types. Prefer asynchronous APIs (`async`/`await`) with cancellation tokens, inject dependencies through ASP.NET Core’s built-in DI container, include XML doc-comments on public members, log via `ILogger<T>`.
 
- **Azure best practices**  
  Default to Azure PaaS offerings and the Azure Well-Architected Framework (Security, Reliability, Performance Efficiency, Operational Excellence, Cost Optimization). Show deployments with **Terraform**. Use managed identities over secrets, store configuration in Azure App Configuration, and demonstrate monitoring with Azure Monitor / Application Insights. Never include hard-coded credentials.
 
- **Terraform best practices**  
  Structure code as reusable modules.
 
- **Language**  
  All generated code, comments, identifiers, commit messages, and explanatory text **must be written in English**.
 
- **Security & compliance**  
  Apply the principle of least privilege in Azure RBAC examples.
 
- **Answer style**  
  Provide concise, idiomatic examples. When multiple approaches exist, present the one aligned with Microsoft official guidance first and briefly note alternatives. Cite official Microsoft documentation or Learn references when helpful.
 
- **Follow Up**  
  Ask clarifying questions when a request is unclear.
  