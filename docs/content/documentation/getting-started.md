---
title: "Getting Started"
menu: "main"
weight: 1
---

## Project setup
{class = "text-3xl"}

Since ThreadTalk.JS is not a standalone library, you'd need to go through some steps before you can get it working. This page intends to cover all you need, in the sense, all the services you need to sign-up with and how you can integrate them with the library. None of these is optional. This documentation won't go into the details of how you can work with the services or how you need to create accounts, etc. as it is expected that you can figure it out. I'll be discussing only the parts that are required to get the library working.
{class = "mt-5"}

This page also includes some tools and configurations related to Node.js. Thus, it is assumed that it's installed, and you know the very basics of the same.
{class = "mt-5"}

### Services
{class = "text-2xl"}

The following is the list of services that you would need to use to integrate ThreadTalk.JS into your website. This guide goes through the most important things that would be needed for ThreadTalk.JS to work. All of these are free with some limits. There might or might not be direct alternatives available for these services, and even if there are, they mostly won't work without any change in the configuration. So, make changes with caution. This guide will assume that you've not changed these defaults.
{class = "mt-5"}

#### Netlify
{class = "text-xl"}

ThreadTalk.JS relies on Netlify Functions and Netlify Identity and to use them, you need to have a website on Netlify. To know how to create a website and other basics, head over to Netlify documentation (linked below).
{class = "mt-5"}

Once you have a Netlify website ready, add the following Environment Variables to it:
{class = "mt-5"}

{{< highlight text >}}
FAUNADB <value>
SENDINBLUE_PASS <value>
SENDINBLUE_SENDER <value>
SENDINBLUE_USER <value>
{{< /highlight >}}

None of these variables is optional. The values of each of these will be populated later.
{class = "mt-5"}

{{< note >}}
Do not set these variables in your `netlify.toml` file because the values set in it are used only during the build and can't be used when accessing them using Functions.
{{< /note >}}

Furthermore, make sure your `netlify.toml` file contains this:
{class = "mt-5"}

{{< highlight toml >}}
[build]
 functions = "functions"

[[redirects]]
 from = "/api/*"
 to = "/.netlify/functions/:splat"
 status = 200

[[plugins]]
 package = "netlify-plugin-threadtalkjs"
{{< /highlight >}}

The redirect is being used to make all functions available at `/api/` instead of `/.netlify/functions/`. Since the client-side JS is configured to make API calls at `/api/`, this redirect rule is not optional.
{class = "mt-5"}

The plugin is used to copy the required serverless functions from the module's files to your deployment. If you remove it, you'll have to manually copy the functions before deployment.
{class = "mt-5"}

Lastly, also set up a Netlify Identity instance for your website. Go to the Identity tab and tap on 'Enable Identity'. Once it's created, go to its settings and make sure registration preferences is set to open and `Autoconfirm` is turned on.
{class = "mt-5"}

{{< note >}}
It's not possible to use this with registration preferences set to closed. ThreadTalk.JS uses Netlify Identity for security purposes so that it's difficult to query your database without using your website. So, if you're using Identity for features like Netlify CMS with registration preferences set as closed, you'd have to switch it. There's a non-recommended workaround [discussed on caveats page](/documentation/caveats/#identity).
{{< /note >}}

Important Links:
{class = "mt-5"}

* [Netlify](https://www.netlify.com/)
* [Identity](https://documentation.netlify.com/visitor-access/identity/)
* [Redirects](https://documentation.netlify.com/routing/redirects/)
* [Functions](https://documentation.netlify.com/functions/overview/)
* [Build Plugins](https://documentation.netlify.com/configure-builds/build-plugins/)
* [Environment Variables](https://documentation.netlify.com/configure-builds/environment-variables/)
* [Netlify Command Line Interface](https://documentation.netlify.com/cli/get-started/)
{class = "mt-5 ml-5 space-y-1 list-disc"}
 
#### FaunaDB
{class = "text-xl"}

ThreadTalk.JS uses FaunaDB to store the comments. Thus, you'd have to have an account on FaunaDB and create a database **in the Classic region group**. Once you have a database, go to its security settings. Generate a new server key and set its value in the `FAUNADB` environment variable in your Netlify UI.
{class = "mt-5"}

Important Links:
{class = "mt-5"}

* [FaunaDB](https://www.fauna.com/)
* [FaunaDB Keys](https://documentation.fauna.com/fauna/current/security/keys.html)
{class = "mt-5 ml-5 space-y-1 list-disc"}

#### Sendinblue
{class = "text-xl"}

ThreadTalk.JS relies on Sendinblue SMTP to send e-mail notifications. This is not optional, and the provider cannot be changed easily. Once you've got your Sendinblue account set up, go to `https://account.sendinblue.com/advanced/api/` to get your SMTP credentials. The SMTP server and port are already configured, so all you need is the SMTP username and password. The username is the same as the e-mail address you used to create an account with Sendinblue. For password, you can choose to use the master password or create another key. I'd personally recommend the latter.
{class = "mt-5"}

{{< tip >}}
Technically, you can change the SMTP provider. The Netlify plugin is configured in a way that allows file-shadowing. This means, if you already have a file with the same name at the same location, it won't be overwritten. So, you could copy the original function and replace the SMTP provider if needed. [Read this to learn more](#functions).
{{< /tip >}}

Once you've got all the required values, go to your Netlify UI and enter those credentials. `SENDINBLUE_USER` is your SMTP username, `SENDINBLUE_PASS` is your SMTP password. The `SENDINBLUE_SENDER` can be any string in the following format:
{class = "mt-5"}

{{< highlight text >}}
"Foo Bar <foo@bar.com>"
{{< /highlight >}}

It's basically, the sender name followed by the sender e-mail address. The brackets `<` and `>` are required. The quotes are required too because some systems might need them to be able to read spaces in the value. This is the name and e-mail address visible to the e-mail client of the user.
{class = "mt-5"}

Important Links:
{class = "mt-5"}

* [Sendinblue](https://www.sendinblue.com/)
* [Sendinblue SMTP](https://help.sendinblue.com/hc/en-us/articles/209462765-What-is-Sendinblue-SMTP-)
{class = "mt-5 ml-5 space-y-1 list-disc"}

## Installation
{class = "text-3xl"}

Once the project is set up, you're ready to install ThreadTalk.JS into your project. Since Node.js is a must to use ThreadTalk.JS, the only option to install it is through the npm registry.
{class = "mt-5"}

Install the Node Modules:
{class = "mt-5"}

{{< highlight sh >}}
npm i threadtalkjs netlify-plugin-threadtalkjs
{{< /highlight >}}

Then, import the JS in your bundle:
{class = "mt-5"}

{{< highlight js >}}
import ThreadTalkJS from 'threadtalkjs'
// const ThreadTalkJS = require('threadtalkjs')

let comments = new ThreadTalkJS({

// configuration goes here

})
{{< /highlight >}}

Also import CSS in your SCSS:
{class = "mt-5"}

{{< highlight scss >}}
@import 'node_modules/threadtalkjs';
{{< /highlight >}}

Finally, add the (recommended) HTML to the page:
{class = "mt-5"}

{{< highlight html >}}
<form id = "comment-form" autocomplete = "off"> <!-- Element must exist -->
  <label for = "name-box">Name</label>
  <input type = "text" name = "name"  placeholder = "Required" id = "name-box" required> <!-- Element must exist -->
  <label for = "email-box">E-mail</label>
  <input type = "email" name = "email" placeholder = "Optional" id = "email-box"> <!-- Element must exist -->
  <label for = "comment-box">Comment</label>
  <textarea rows = "5" name = "comment" placeholder = "Required; Markdown is supported" id = "comment-box" required></textarea> <!-- Element must exist -->
  <button type = "button">Preview</button> <!-- Element must exist -->
  <button type = "submit">Submit</button> <!-- Element must exist -->
</form>
<button id = "load-button">Load comments</button> <!-- Element must exist -->
{{< /highlight >}}

## Functions
{class = "text-3xl"}

ThreadTalk.JS relies on three individual serverless functions: `addComment.js`, `getComments.js` and `previewComment.js`. The steps covered before (declaring the plugin in `netlify.toml` and installing it via `npm`) are enough to automatically copy the functions during the building of the website. However, in case you need to override the default functions (probably to change the SMTP server or something else), you can do so by creating a file with the same name at the same location as the original function. For example, if your functions folder is called `functions` and you wish to override `addComment.js`, you need to create a file at `functions/addComment.js`.
{class = "mt-5"}