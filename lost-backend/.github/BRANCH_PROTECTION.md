# Branch Protection Setup

To ensure code can only be merged when the CI pipeline passes, set up branch protection rules in GitHub:

## Steps to Configure Branch Protection:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Branches**
3. Click **Add rule** or edit existing rule
4. Configure the following settings:

### Branch Protection Rules for `dev` and `main` branches:

#### Required Settings:

- ✅ **Require a pull request before merging**

  - ✅ Require approvals: 1
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners (if CODEOWNERS file exists)

- ✅ **Require status checks to pass before merging**

  - ✅ Require branches to be up to date before merging
  - ✅ Required status checks:
    - `test` (from CI Pipeline workflow)
    - `security` (from CI Pipeline workflow)

- ✅ **Require conversation resolution before merging**

- ✅ **Restrict pushes that create files larger than 100 MB**

#### Optional but Recommended:

- ✅ **Require signed commits**
- ✅ **Include administrators** (applies rules to admins too)
- ✅ **Allow force pushes** - DISABLE this
- ✅ **Allow deletions** - DISABLE this

## Status Checks Required:

The CI pipeline defines two jobs that must pass:

1. **test** - Runs linting, type checking, and build
2. **security** - Runs security audit

## How it Works:

1. Developer creates a pull request to `dev` or `main`
2. CI pipeline automatically runs on the PR
3. All status checks must pass (green) before merge is allowed
4. At least 1 approval is required
5. Branch must be up-to-date with target branch

## Emergency Override:

Administrators can override these rules if absolutely necessary, but this should be rare and well-documented.
