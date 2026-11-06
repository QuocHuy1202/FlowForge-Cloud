# Continuous integration

The `CI` workflow runs for pull requests into `develop` or `main`, pushes to
those branches or `ci/**`, and manual runs in GitHub Actions.

Two independent checks must pass:

- **Backend build and tests**: restore the .NET 10 solution, build Release,
  and run its test projects. Integration tests use in-memory SQLite; no
  PostgreSQL, Redis, application server, or production credentials are required.
- **Frontend build and tests**: install Node.js 24 and Yarn 1.22.22, install
  the committed lockfile without changing it, run Vitest, and build Angular
  in production mode with its existing bundle budgets.

Each job uploads test reports even after a failure. A successful frontend job
also uploads its production build. Artifacts are retained for seven days.
The workflow does not deploy or publish the application.

GitHub Actions need only read access to repository contents. Actions are pinned
to commit hashes. No repository secrets are needed for this workflow.

## Run the same checks locally

From the repository root with the .NET 10 SDK installed:

```sh
dotnet restore backend/FlowForge.slnx
dotnet build backend/FlowForge.slnx --configuration Release --no-restore
dotnet test backend/FlowForge.slnx --configuration Release --no-build --no-restore --logger trx --results-directory artifacts/backend-tests
```

From `frontend/angular`, with Node.js 24 and Yarn 1.22.22 installed:

```sh
yarn install --frozen-lockfile --non-interactive
yarn test --reporter=default --reporter=junit --outputFile=test-results/vitest.xml
yarn build:prod
```

Lint is not included yet: the repository currently mixes Angular ESLint 22
with ESLint 8 and a legacy `.eslintrc.json`. Migrate that configuration before
adding lint as a required check; the CI change does not alter application
dependencies or source code.

After merging, a repository administrator can require these two checks in the
branch protection rules for `develop` and `main`. The workflow itself does not
change repository protection settings.
