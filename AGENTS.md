# Overview

This project is a website for an event I'm hosting called "Build-a-Bowl Night".

The premise of the event is that we are making our own rice bowls, and each guest brings one or more components that could be put into a rice bowl.

The website will have two main purposes:
1. View what others are bringing
2. Submit what you are bringing

## Architecture

The frontend will be hosted on GitHub pages

The backend storage will also be hosted on GitHub, as raw text / CSV files

## UI Requirements

1. The user identifies themself by phone number - new users should be keyed by phone number and have a name stored
2. The user can view the full list of items bring brought
3. The user can edit or remove any item associated with them
4. The user can submit a new item they plan to bring

## Backend Requirements

1. Two concurrent edits to data by different users will not overwrite each other
   1. Data is stored as a log of events, which when combined forms the full state of the system
2. Data is stored in a GitHub repository as raw text, and is read/written using the GitHub API
