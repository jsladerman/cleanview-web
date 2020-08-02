# Github Workflow

## Overview
There is a Project Board for each sprint with 5 buckets:
1. **Backlog-** a list of all lower-priority tasks
2. **To-do-** a list of higher-priority tasks that should get done during the current sprint
3. **In Progress-** tasks currently in progress
4. **In Review-** tasks with a PR open, awaiting review or reviewer has approved the changes
5. **Done-** PR has been merged to staging

Once a PR has been linked to an issue, it will move between In Progress, In Review, and Done automatically.
1. When you link an issue in `To-do` or `Backlog` to a PR, the issue will move to `In Progress`.
2. An issue will automatically move from `In Progress` to `In Review` if you add a reviewer or the reviewer completed the review.
3. An issue will automatically move from `In Review`to `Done` when the PR has been moved to staging.

In order for all of this to happen, you **must** link the PR to the issue.



## Workflow

### Creating a task
In the current sprint's Project Board, create a note for the task. Convert the note to an issue by clicking on the `...` in the upper right hand corner of the note, then selecting `Convert to issue`.
* **Assignees-** assign whoever will complete the task
* **Labels-** add the labels which best describe the task
* **Column**
    * If you will work on it now, `In Progress` column.
    * If you will work on it later this sprint, `To-do` column.
    * If you will work on it sometime in the future, but not this sprint, `Backlog` column.

### Beginning a task
1. When you begin to work on the task, move the issue associated with the task to `In Progress `.
2. Create a new branch.

  ```
  {yourFirstName}/{task-description}
  ```

  _Example:_
  ```
  gabi/github-documentation
  ```
3. At any point during the task, you may create a Pull Request (PR).

  Make sure to **link the PR to the issue**, which can be done either in the issue or the PR. This will allow for the issue to automatically move through the `In Progress`, `In Review`, and `Done` columns.

  If you create a PR before the task is not ready for review, include `[-]` ahead of the PR title.

  _Example:_
  ```
  [-] Github Documentation
  ```

### Task review
1. If you have not already created a PR, create one and **link the issue to the PR**.
2. Assign someone as a `Reviewer` to review your PR.
3. The reviewer must comment `looks good` when they confirm the PR is ready to be merged.

### Merging the task
1. Once the PR has been reviewed, it can be merged to staging. Make sure to **Squash and Merge** and include a descriptive title for the commit (consider using the PR title). Once it is merged to staging, the issue will automatically move to the `Done` column.
2. If you do not need to reference the earlier commits in your branch, you can delete the branch. You also have the option to keep the branch, but after 2 weeks if the branch is not modified (i.e. behind staging instead of ahead) it will be removed.
