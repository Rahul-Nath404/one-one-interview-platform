# Contributing to InterviewOS

Thank you for your interest in contributing to InterviewOS! We welcome contributions from everyone.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/interviewos.git
   cd interviewos
   ```
3. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

See [SETUP.md](./SETUP.md) for complete setup instructions.

Quick start:
```bash
docker-compose up
```

## Code Standards

### Frontend (TypeScript/React)
- Use TypeScript for type safety
- Follow ESLint rules
- Use functional components with hooks
- Keep components small and focused
- Add proper error handling
- Write descriptive commit messages

### Backend (Go)
- Follow Go idioms and best practices
- Use `gofmt` for formatting
- Write unit tests for business logic
- Add error handling for all operations
- Use meaningful variable names
- Document exported functions

## Commit Guidelines

Use conventional commits:
```
type(scope): description

feat(auth): add JWT token validation
fix(room): resolve WebRTC connection issue
docs(readme): update setup instructions
test(interview): add unit tests for scheduling
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Pull Request Process

1. **Update your branch** with latest main:
   ```bash
   git pull origin main
   ```

2. **Test your changes**:
   ```bash
   make lint
   make type-check
   make test
   ```

3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub with:
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes
   - Any breaking changes clearly marked

5. **Address feedback** from reviewers

## Reporting Issues

When reporting a bug, please include:
- **Description** of the issue
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Environment** (OS, Node.js version, Go version, etc.)
- **Screenshots** or logs if applicable

## Feature Requests

Feature requests should include:
- **Clear description** of the feature
- **Use case** or problem it solves
- **Example implementation** if possible
- **Any alternatives** you've considered

## Documentation

- Update README.md if you change behavior
- Add inline comments for complex logic
- Document new environment variables
- Update CHANGELOG.md with your changes

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for >80% code coverage

Frontend:
```bash
cd frontend
npm test
```

Backend:
```bash
cd backend
go test ./...
```

## Communication

- GitHub Issues: For bugs and features
- GitHub Discussions: For questions and ideas
- Pull Requests: For code reviews

## Code Review

- Be respectful and constructive
- Acknowledge good work
- Ask questions instead of making demands
- Suggest improvements with examples

## License

By contributing to InterviewOS, you agree that your contributions will be licensed under its MIT License.

## Questions?

Feel free to open an issue or ask in GitHub Discussions!

Thank you for contributing to InterviewOS! 🎉
