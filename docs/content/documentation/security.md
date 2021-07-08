---
title: "Security"
menu: "main"
weight: 5
---

## Motive
{class = "text-3xl"}

ThreadTalk.JS is an anonymous comment system, that is no one needs to sign up anywhere before being able to post a comment. This sounds great because many people might not comment if it makes them work more than required. However, this introduces some problems for the developers. The primary problem is security. By moving to serverless functions instead of client-side processing, we have successfully hidden our access keys from the end-users, but this doesn't end here. Anyone can just find your APIs' URLs and set up a bot to keep sending requests to it. This won't just consume your function invocations, but would also hurt your database and add spam comments on your page. This is unacceptable.
{class = "mt-5"}

## Security model
{class = "text-3xl"}

The current model of security can prevent unauthorized users from being able to access data in our database to some extent. This is because only the users who load comments or add a new comment from your website can initiate a connection to the database. We can ensure this by using Netlify Identity. When ThreadTalk.JS is about to hit an API endpoint, it first creates a temporary user in your Identity instance. The user has a random e-mail address and password, but without its existence, the API will return a 403. Thus, your database calls are protected.
{class = "mt-5"}

To prevent abuse using the Authorization header, the API call also automatically deletes the user. However, this has some [ceveats](/documentation/caveats/#identity).
{class = "mt-5"}