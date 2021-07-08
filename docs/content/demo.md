---
title: "Comments Test"
layout: "demo"
---

<h3>Add a comment</h3>
<form id = "comment-form" autocomplete = "off">
  <label for = "name-box">Name</label>
  <input type = "text" name = "name"  placeholder = "Required" id = "name-box" required>
  <label for = "email-box">E-mail</label>
  <input type = "email" name = "email" placeholder = "Optional" id = "email-box">
  <label for = "comment-box">Comment</label>
  <textarea rows = "5" name = "comment" placeholder = "Required; Markdown is supported" id = "comment-box" required></textarea>
  <button type = "button">Preview</button>
  <button type = "submit">Submit</button>
</form>
<button id = "load-button">Load comments</button>