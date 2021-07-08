---
title: "Caveats"
menu: "main"
weight: 6
---

## The problem
{class = "text-3xl"}

ThreadTalk.JS has been developed by me in my free time and with my limited knowledge about JavaScript among other things. So, it is far from perfect. I've tried to keep it as lightweight, customisable, and secure as possible, but I understand it might not be enough for everyone's requirements. You're free to report issues, open pull requests and request features, but before you do that, it's recommended that you go through the current known limitations (and their possible workarounds). If you've any other requests, visit the [support page](/documentation/support/) to know what to do. Also, you could check [upcoming changes](/documentation/upcoming-changes/) to see if any of this is already being worked upon.
{class = "mt-5"}

## Limitations
{class = "text-3xl"}

The following section talks about the possible shortcomings of ThreadTalk.JS. These are the known ones as of now, but there might be more.
{class = "mt-5"}

### Form
{class = "text-2xl"}

Form fields cannot be changed. It's not possible to add additional fields or remove the existing ones. This is because the database, API and client-side JS are hard-coded in a specific way. Moreover, the database is set up by the API to return the expected data in a specific order. Thus, changing order or fields would lead to unexpected results. I don't intend to change this myself as I don't know how I could do it. Pull requests are welcome.
{class = "mt-5"}

### Spam prevention
{class = "text-2xl"}

Currently, there's no in-built mechanism to fight spam. You'd have to delete the malicious comment from the database yourself. The reason behind this is that I did not find any good spam prevention services that did the job for free. I found Akismet, but that integration failed the tests. So, I've removed it for now, but if anyone can get it working or has any other way, feel free to open a pull request.
{class = "mt-5"}

### Identity
{class = "text-2xl"}

ThreadTalk.JS relies on Netlify Identity for security. This might seem robust but comes with a huge problem. According to the current pricing of Netlify, users for a given billing cycle are counted even after they're deleted. This means, suppose you have 1000 users (free limit of Netlify Identity) and you delete one. You'd think you've 999 users are you can add 1 more. However, as soon as you add another, you now have a total of 1001 users. Thus, you'd be charged for it. This is reset after your billing cycle. Thus, if you now have 999 users (after you deleted 1 from 1000), from the next billing cycle, you'd be able to add the 1000<sup>th</sup> member. So, even though ThreadTalk.JS deletes the users, it might not be very practical if you plan to get over 1000 comments a month.
{class = "mt-5"}

One possible workaround for this is that you'd have to upgrade and use unlimited Netlify Identity or fork ThreadTalk.JS and create an instance that doesn't rely on that.
{class = "mt-5"}

Another workaround would be a rather hacky way to manage this. You could keep your Netlify Identity instance in a separate website/account. You could then specify [`apiUrl`](/documentation/options/#apiurl) to point to that Netlify Identity instance. This would help keep your original Netlify Identity instance isolated to be used with closed registration. If you are close to the limit of your free users, you could delete the Netlify Identity instance and create another one. This method is not recommended as it's not tested. It's unknown if Netlify Identity is able to validate or delete users this way. If it's unable to validate, no one would be able to read or write to your databse at all. If it's not able to delete the users, anyone could get hold of the Authorization headers and spam your database. Both of these shortcomings would be unacceptable.
{class = "mt-5"}

### Speed
{class = "text-2xl"}

ThreadTalk.JS creates a user in Netlify Identity before making the actual API call. Then it deletes the user and finally fetches the data from the database. This layer of security does hinder the speed. It takes more time for the comments to load or get posted. But, according to me, the tradeoff is important. The fix for this is the same as above, fork ThreadTalk.JS and create an instance that doesn't rely on Netlify Identity.
{class = "mt-5"}

### Animation
{class = "text-2xl"}

Currently, the toast notification slides in from the bottom. However, if the user clicks somewhere that would lead to the closing of the notification while the animation is in progress, the animation abruptly ends. Since it's using CSS animations, I am not sure of any way to prevent this, but it might be possible. I'll keep looking.
{class = "mt-5"}

### `html` height
{class = "text-2xl"}

ThreadTalk.JS relies on `window.scrollTo()`. It's a known limitation that `window.scrollTo()` doesn't work when `html` has `height: 100%`. The solution is to replace that with `min-height: 100%`.
{class = "mt-5"}

### Service worker
{class = "text-2xl"}

When using service worker with ThreadTalk.JS, it is important for the service worker to ignore POST requests. All requests made by ThreadTalk.JS to the API are made with the POST method and if the service worker intercepts those requests, it might return an error. To avoid this, the service worker can be configured something like:
{class = "mt-5"}

{{< highlight js >}}
// rest of the code

self.addEventListener('fetch', event => {
  if (event.request.method === 'POST') {
    return
  }
})
{{< /highlight >}}