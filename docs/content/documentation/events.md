---
title: "Events"
menu: "main"
weight: 4
---

## Usage
{class = "text-3xl"}

ThreadTalk.JS fires many events for you to be able to change the default behaviour. All the events are fired on `window`, so to listen to them, you can do something like:
{class = "mt-5"}

{{< highlight js >}}
window.addEventListener('event-name', event => {
 event.preventDefault()
 console.log(event.detail.data)
 // run your code
})
{{< /highlight >}}

Almost all events are cancellable, thus you can easily call `event.preventDefault()` to stop the execution of the default code. Some events also pass on some data which you can access using `event.detail.data`.
{class = "mt-5"}

## Explanation
{class = "text-3xl"}

The available events have been classified into a few categories. This is because, three primary actions are relevant; adding a comment, loading comments and preview a comment. Each of these categories has three events, doing, done, and error. Please note that the names of the events are kept in sync with the grammar and thus, lack uniformity. For example, you can only add or preview one comment at a time, thus their events are prefixed 'comment', while multiple comments can be loaded at the same time, thus its events are prefixed 'comments'.
{class = "mt-5"}

### Adding comment
{class = "text-2xl"}

These events fire at various stages during adding a comment.
{class = "mt-5"}

#### `comment-adding`
{class = "text-xl"}

Fired after the form is submitted, but before the `setupComments` API is called.
{class = "mt-5"}

#### `comment-added`
{class = "text-xl"}

Fired after the comment is added in the database and before it's appended to the DOM. `event.detail.data` consists of:
{class = "mt-5"}

{{< highlight js >}}
let commentData = event.detail.data

commentData.ref['@ref'].id // ID of the comment
commentData.ts // Timestamp in UNIX milliseconds
commentData.data.name // Name of the person who commented
commentData.data.parent // ID of the parent of the comment
commentData.data.comment // HTML of the comment
{{< /highlight >}}

#### `comment-add-error`
{class = "text-xl"}

Fired after the fetch request for the API failed or encountered an error, but before showing a notification. `event.detail.data` consists of the error text.
{class = "mt-5"}

### Loading comments
{class = "text-2xl"}

These events fire at various stages during loading all comments.
{class = "mt-5"}

#### `comments-loading`
{class = "text-xl"}

Fired after the loading has started, but before the `setupComments` API is called.
{class = "mt-5"}

#### `comments-loaded`
{class = "text-xl"}

Fired after the comments are fetched from the database and before it's appended to the DOM. `event.detail.data` consists of:
{class = "mt-5"}

{{< highlight js >}}
let comments = event.detail.data // [[comment1], [comment2],...]

let commentData = comments[0]

commentData[0] // Timestamp in UNIX milliseconds
commentData[1]['@ref'].id // ID of the comment
commentData[2] // Name of the person who commented
commentData[3] // HTML of the comment
commentData[4] // ID of the parent of the comment
{{< /highlight >}}

#### `comments-load-error`
{class = "text-xl"}

Fired after the fetch request for the API failed or encountered an error, but before showing a notification. `event.detail.data` consists of the error text.
{class = "mt-5"}

### Previewing comment
{class = "text-2xl"}

These events fire at various stages during previewing a comment.
{class = "mt-5"}

#### `comment-previewing`
{class = "text-xl"}

Fired after the user clicks on the Preview button but before making a call to the API.
{class = "mt-5"}

#### `comment-previewed`
{class = "text-xl"}

Fired after the preview is fetched from the API and before it's appended to the DOM. `event.detail.data` consists of the generated HTML.
{class = "mt-5"}

#### `comment-preview-error`
{class = "text-xl"}

Fired after the fetch request for the API failed or encountered an error, but before showing a notification. `event.detail.data` consists of the error text.
{class = "mt-5"}

### Others
{class = "text-2xl"}

These events fire at arbitrary stages of the code.
{class = "mt-5"}

#### `comments-init`
{class = "text-xl"}

Fired after the library has finished initializing and is ready to process data. **This event is non-cancellable** because the initialization has already completed by the time it's fired.
{class = "mt-5"}

#### `comments-destroy`
{class = "text-xl"}

Fired after the library has finished destroying its instance. **This event is non-cancellable** because the instance has already been destroyed by the time it's fired.
{class = "mt-5"}