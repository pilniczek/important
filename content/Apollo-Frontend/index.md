---
archived: true
title: Apollo - Frontend
tags:
  - API
type: Tool
---

Apollo is most oldest and powerfull client library to loading data from Graphql endpoints. Library Relay can be alternative (used under the hood in Gatsby framework). You can use Apollo to buildup Graphql endpoint in the backend too but we are in the frontend part now.

## Usage

Apollo is for runtime data loading. Easest way is to wrap you React App into Provider and quering using hooks. Loading data tooks few seconds so you need to desice what to do until data is already loaded you can show some progress bar or Skeletons. When you fetching a data you can run into errors because backend can responde 404, 500 or return invalid data so you need to decide what to do when error is received.

Apollo has very advanced caching support but every decision around caching is hard work.

## Advanced usage

When you building medium or large SPA you can see repeating code for example converting float into percentage or transform number based on some formula, transforming datetimes, etc.. In this case you can use Field policies [https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies](https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies) to place your repeating code into one place

When your backend devs team are to slow you can use Local-Only fields to implement some basic functionality on the frontend.

When your backend devs team is missing or you are not able to connect to Graphql endpoint you can bypass this need and simulate connection to graphql endpoint using Reactive Vars or Local Resolvers.
