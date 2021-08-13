# Contributing to Manifesto Drupal Starter Kit

#### Table Of Contents
1. [Code reviews](#markdown-header-code-reviews)
    * [Reviewing considerations](#markdown-header-reviewing-considerations)
    * [Pull Requests Guidelines](#markdown-header-pull-request-guidelines)

### Code reviews

#### Reviewing considerations
* Code reviews need to be kept to manageable volumes of code. The more code someone has to read, the less well-inspected it tends to be. For example, peer review each small feature rather than the epic.
* Code should be easily understandable. If you don’t understand what the code is doing - there is a problem.
* Use constructive language. This is not about finding fault, but encouraging learning and well-structured code.
* Understand the author. Whether the person is junior/senior, has worked on the codebase for years or is new to the project.
* Learn from reviewing. It is not only about you as the reviewer looking to improve someone else code. Look for great code you can take away from the review.
* Create visibility. No one likes silo’s, reviews allow the code and project requirements to be shared.
* Standards. Creating consistently written code allows for another developer to pick this project up quicker.
* Use reviews as your own mental break.
* ADD PROJECT RELATED CONSIDERATION

#### Pull Request Guidelines

Below guidelines explain the MUST-do for developers who want to see their Pull Request merged into the the repo.

## I made a Pull Request pointing to right main/parent branch
Make sure this PR is targeting the right parent branch. This is normally `master` or `develop`, according with the repo
workflow, but sometime it may be an epic branch.

## JIRA ticket is correctly linked to my PR
Visit each ticket covered by this PR and make sure the 'Pull Request [open]' links to it.
In order to achieve that you can either:

* Create the branch from the JIRA ticket, but may be it's now too late.
* Use ticket(s) ID on commits message (Working on #ID, Fixes #ID, Closes #ID).
* Use ticket name on PR name/description (Fixes #ID, Closes #ID).

## JIRA ticket is well documented for Testers to be able to reproduce it
Make sure you've added links, screenshots and notes to the **Tester Tasks** section of the ticket Description (create
one if missing), so testers will be able to easily understand the issue and reproduce the bug and validate the fix/feature.
Testers often don't have full CSM/framework knowledge so try to be as clear as possible.

## PR branch ‘Close branch after merge’ is set
Branches will be closed after merge. Always. So make sure this branch PR is not different.

## Code is following the Drupal Standards.
Make sure your code is not introducing new Drupal Code Standards violations but instead is also - eventually - fixing previous violations introduced before my changes.
If you unsure how to check this please ask.

## Git history is not a mess.
We don't like messy history. If you made a 1 line code change and your PR contains 99 commits, then there is something wrong.
Please use `git rebase -i your-target-branch` on your feature branch and squash unneeded commits.

## Changes require an Architecture Decision Records
An architecture decision record is a short text file that describes a set of forces and a single decision in response to
those forces. [See this list](https://bitbucket.org/manifestodigital/manifesto-documentation-standards/src/master/#markdown-header-document-important-decisions-with-adrs) to understand when an ADR may be required.

## What are you changing, do you need to change it?
Often unwanted code changes - i.e. from previous work - leak into a commit. Those can be really dangerous and often cause merge conflicts. A really common case is in the configuration files.
Make sure all changes are relevant to the current issue the PR is about.

## Deleting entity_types (config entities) will block import if there are instances of that entity type.
Deleting a node type, a vocabulary, a webform (config entities) will block the import if the destination Drupal instance
has for example nodes of that type, terms of that vocabulary, webform submission for that webform.
Make sure the Dev/Reviewer/Committer understands the implication AND/OR make sure an update hooks take care of the
problem by deleting the instances before import.

## [Multisite] make sure reference ticket specifies which site/sites is/are the target.
Make sure from the Pull Request, the linked ticket and the code is clear the site(s) we are targeting.

## [Multisite] make sure code and configuration changes don’t affect (or DO affect is it’s a fix) the other sites.
Make sure the changes don't affect the other sites. On the contrary if changes MUST effect other sites too, then make
 sure code and configuration cover both.

## Changing entity type or field storage may require a hook update
Are you changing any field.storage? Or base-fields for an entity type? You may need to write a hook update
in order for the updates to take place as expected. See https://www.drupal.org/node/3034742 .

## ADD YOUR PROJECT OWN GUIDELINES
Add additional guidelines specific to your project...

:tada: Thank you :tada:
