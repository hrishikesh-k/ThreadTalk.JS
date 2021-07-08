// Require the Node Modules
import GoTrue from 'gotrue-js'

module.exports = function ThreadTalkJS(config) {

  // Set the following variables to be manipulated later
  let notification
  let commentCount = 0
  let replyLabel = false

  // Set the title from config
  let title = config.title

  // Set the offset from config
  let scrollOffset = config.scrollOffset || 15

  // Extract the hash string from URL
  let hashComment = location.hash.substr(1)

  // Set the form selector from config
  let formSelector = config.form || '#comment-form'

  // Select the comment form based on config
  let commentForm = document.querySelector(formSelector)

  // Select the load button based on config
  let loadButton = document.querySelector(config.loadButton || '#load-button')

  // Select the comment box based on config
  let commentBox = commentForm.querySelector(config.textarea || 'textarea')

  // Select the element to append to based on config
  let appendTo = document.querySelector(config.commentContainer) || document.body

  // Initialize the auth based on config
  let auth = new GoTrue({
    APIUrl: config.apiUrl || 'https://' + location.hostname + '/.netlify/identity'
  })

  /*
  Methods are not directly declared as functions. This is because, the declared methods act as variables and thus,
  lose the hoisting feature of functions. So, any method cannot be accessed before it's declared in the code. This
  causes problems are we need functions even before being able to declare them. Thus, setting methods like the
  following helps us overcome this problem. All of these methods accept the same arguments as the actual function
  and simply call the actual functions.
  */

  // Destroy method
  this.destroy = () => {
    destroy()
  }

  // Add comment method
  this.addComment = () => {
    addComment()
  }

  // Show preview method
  this.showPreview = () => {
    showPreview()
  }

  // Remove reply method
  this.removeReply = () => {
    removeReply()
  }

  // Manage shake method
  this.manageShake = element => {
    manageShake(element)
  }

  // Calculate top method
  this.calculateTop = element => {
    calculateTop(element)
  }

  // Load comments method
  this.loadComments = (autoScrollTo) => {
    loadComments(autoScrollTo)
  }

  // Callback scroll method
  this.callbackScroll = (top, callback) => {
    callbackScroll(top, callback)
  }

  // Remove notification method
  this.removeNotification = (element, callback) => {
    removeNotification(element, callback)
  }

  // Creat comment method
  this.createComment = (id, name, time, comment, parent) => {
    createComment(id, name, time, comment, parent)
  }

  // Create notification method
  this.createNotification = (innerHTML, timeout, callback) => {
    createNotification(innerHTML, timeout, callback)
  }

  // Create element method
  this.createElement = (tagName, attributes, innerHTML, appendTo, insertBefore) => {
    createElement(tagName, attributes, innerHTML, appendTo, insertBefore)
  }

  /*
  The following function is responsible for the security of the backend. It relies on Netlify Identity to create a
  user, and get an authorization token. The presence of this auth token means that the request is made from our
  website only. Only when this is true, we process the rest of our serverless functions.
  */

  async function setupAuth() {

    // Define the following variables for further processing
    let email = ''
    let domain = ''
    let password = ''
    let domainCharacters = 'abcdefghijklmnopqrstuvwxyz'
    let emailCharacters = domainCharacters + '1234567890'
    let passwordCharacters = emailCharacters + '!@#$%^&*()-+<>ABCDEFGHIJKLMNOP'

    // Generate random strings from the above configs
    for (let stringLength = 0; stringLength < 5; stringLength++) {
      email += emailCharacters.charAt(Math.floor(Math.random() * emailCharacters.length))
      domain += domainCharacters.charAt(Math.floor(Math.random() * domainCharacters.length))
      password += passwordCharacters.charAt(Math.floor(Math.random() * passwordCharacters.length))
    }

    // Release the variables from memory
    emailCharacters = null
    domainCharacters = null
    passwordCharacters = null

    // Set email in the format of an email
    email += '@' + domain + '.com'

    // Wait for signup to finish
    await auth.signup(email, password)

    // Wait for login to finish
    let login = await auth.login(email, password)

    // Release the variables from memory
    email = null
    domain = null
    password = null

    // Return the auth token
    return login.token.access_token

  }

  /*
  The following function is responsible for removing all possible event listeners, DOM element and variables stored
  in memory by this code. It might be useful in some cases where the developer needs to reinitialize comments.
  */

  function destroy() {

    // If load button exists, do the following
    if (loadButton) {

      // Remove its event listener
      loadButton.onclick = null

      // Remove the element
      loadButton.remove()

      // Release variable from memory
      loadButton = null

    } else {

      /*
      Load button does not exist and it means, comments have loaded. So, there would exist the <hr> and <h3> elements
      that need to be removed.
      */

      // Remove <hr> and <h3>
      commentForm.nextElementSibling.remove()
      commentForm.nextElementSibling.remove()

    }

    if (replyLabel) {

      // Select the label
      let label = document.querySelector('.t-label')

      // Remove click listener from all of its children
      label.querySelectorAll('*').forEach(child => {
        child.onclick = null
      })

      // Release the variable from memory
      label = null

    }

    // If any notification exists, remove it
    notification && removeNotification(notification)

    // Remove input event listener from textarea
    commentBox.oninput = null

    // Remove submit event listener from form
    commentForm.onsubmit = null

    // Remove click event listener from preview button
    commentForm.querySelector('button[type="button"]').onclick = null

    // Remove form from DOM
    commentForm.remove()

    // Process all comments on page
    document.querySelectorAll('.t-comment').forEach(comment => {

      // Select all links with # prefix and process them
      comment.querySelectorAll('a[href^="#"]').forEach(link => {

        // Remove the click event listener
        link.onclick = null

        // Release the variable from memory
        link = null

      })

      // Remove the element
      comment.remove()

      // Release the variable from memory
      comment = null

    })

    // Release the following variables from memory
    formSelector = null
    scrollOffset = null
    commentCount = null
    notification = null
    hashComment = null
    commentForm = null
    commentBox = null
    replyLabel = null
    appendTo = null
    title = null
    auth = null

    // Dispatch the destroy event
    window.dispatchEvent(new CustomEvent('comments-destroy'))

  }

  /*
  The following function is responsible for adding a new comment to the DOM upon submission of the form. It's
  declared separately instead of writing it in submit event of the form because we need this function as a method.
  */

  function addComment() {

    // Run the code if the event was not cancelled
    if (window.dispatchEvent(new CustomEvent('comment-adding', {cancelable: true}))) {

      // Disable the form
      commentForm.setAttribute('t-disabled', '')

      // Disable the load button if it exists
      loadButton && loadButton.setAttribute('t-disabled', '')

      // Function called after notification
      function continueSubmit() {

        /*
        The following part creates new form data and appends the values from the form to it. It's important to note
        that this variable always logs empty in console. The order of appending should not be changed at all because
        the serverless functions are setup to process the data accordingly.
        */

        let formData = new FormData()

        // Value of first <input> element in the form
        formData.append('name', commentForm.querySelector('input').value)

        // Value of first <input type = "email"> element in form
        formData.append('email', commentForm.querySelector('input[type="email"]').value)

        // Reply attribute of form
        formData.append('parent', commentForm.getAttribute('data-reply'))

        // Value of message box
        formData.append('comment', commentBox.value)

        // Call setupAuth() before calling our API
        setupAuth()
          .then(response => {

            /*
            We fetch the addComment function. with some options like the body and the headers. We would get a JSON
            string as a response that we need to parse and thus, we need to convert the response to JSON. Once it's
            done, we move ahead to process the received data. If the fetch call fails, we create a notification with a
            timeout. This shows the error text.
            */

            fetch('/api/addComment/' + '?title=' + title, {
              method: 'POST',
              body: new URLSearchParams(formData).toString(),
              headers: {
                Authorization: 'Bearer ' + response,
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
              .then(response => {

                // Check if response was ok
                if (response.ok) {

                  // Return the JSON parsed response
                  return response.json()

                } else {

                  // Throw the error for .catch to handle it
                  throw response.statusText

                }

              })
                .then(commentData => {

                  // Run the code if event was not cancelled and pass new comment as data
                  if (window.dispatchEvent(new CustomEvent('comment-added', {cancelable: true, detail: {data: commentData}}))) {

                    // Function called after notification closed
                    function postClose() {

                      /*
                      If loadButton exists, it means, the comments have not yet loaded. Since we have already added the
                      new comment to the database, now we will receive all the comments including the one added now.
                      Thus, we simply call the loadComments() function and let it handle the rest. However, if the
                      button doesn't exist, it means that the comments have already loaded and thus, if we call
                      loadComments(), it will unnecessarily request data from database again. Instead, we use the data
                      returned by our addComment function (commentData). commentData is a object and consists of the
                      following data:

                      1. commentData.ref['@ref'] (object): The ref of the document
                        1.1: commentData.ref['@ref'].id (number): The ID of the comment
                      2. commentData.ts (number): Timestamp of the comment in UNIX milliseconds
                      3. commentData.data (object): The actual data stored in the comment
                        3.1: commentData.data.name (string): Name of the comment creator
                        3.2: commentData.data.parent (string): ID of the parent comment
                        3.3: commentData.data.comment (string): The HTML content of the comment message
                      */

                      if (loadButton) {

                        loadComments()

                      } else {

                        /*
                        Here we call our createComment() function and set the innerHTML of the comment counter element.
                        If commentCount > 1, we use the plural or we use the singular form of the word 'comment'. We use
                        document.querySelector('.t-comment') because it will always return the first comment in the DOM.
                        Our comment counter element always exists before the first comment in DOM.
                        */

                        commentCount++
                        createComment(commentData.ref['@ref'].id, commentData.data.name, commentData.ts, commentData.data.comment, commentData.data.parent)
                        document.querySelector('.t-comment').previousElementSibling.innerHTML = commentCount + (commentCount > 1 ? ' comments' : ' comment')

                      }

                      // Reset the form
                      commentForm.reset()

                      // If user was replying to an existing comment, clear it
                      replyLabel && removeReply()

                      // Set the initial height of commentBox
                      commentBox.style.height = '125px'

                      // Clear formData from memory
                      formData = null

                      // Enable the commentForm
                      commentForm.removeAttribute('t-disabled')

                      // Enable the load button is it exists
                      loadButton && loadButton.removeAttribute('t-disabled')

                    }

                    // Remove the notification and run the function
                    removeNotification(notification, postClose)

                  }

                })
                  .catch(error => {

                    // Enable the form
                    commentForm.removeAttribute('t-disabled')

                    // Enable the load button if it exists
                    loadButton && loadButton.removeAttribute('t-disabled')

                    // Show notification if event is not cancelled
                    window.dispatchEvent(new CustomEvent('comment-add-error', {cancelable: true, detail: {data: error}})) && createNotification('<span>' + error + '</span>', 5000)

                  })

          })

      }

      // Create the notification and run the function
      createNotification('<div></div><span>Adding comment...</span>', null, continueSubmit)

    }

  }

  /*
  The following function is responsible for loading a preview of the comment that's typed till now. Since we support
  Markdown, users might want to see if they have formatted it correctly before posting it, especially since we don't
  provide a way to edit or delete the comments later.
  */

  function showPreview() {

    if (commentBox.value.length > 0) {

      // Run the code if event was not cancelled
      if (window.dispatchEvent(new CustomEvent('comment-previewing', {cancelable: true}))) {

        // Function to call after notification is shown
        function fetchPreview() {

          // Disable the form
          commentForm.setAttribute('t-disabled', '')

          // If the load button exists, disable it
          loadButton && loadButton.setAttribute('t-disabled', '')

          // Create new form data
          let formData = new FormData()

          // Append the value of message box
          formData.append('comment', commentBox.value)

          // Call setupAuth() before calling our API
          setupAuth()
            .then(response => {

              /*
              Now we fetch our showPreview function. Since its URL can be configured, we need to select the appropriate
              URL as we did for our other fetch requests. Again, we need to set the body and headers. Just like other
              fetch, we need to check if the response is ok before doing anything else.
              */

              fetch('/api/previewComment/', {
                method: 'POST',
                body: new URLSearchParams(formData).toString(),
                headers: {
                  Authorization: 'Bearer ' + response,
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              })
                .then(response => {

                  // Check if response was ok
                  if (response.ok) {

                  // Return the JSON parsed response
                  return response.json()

                  } else {

                    // Throw the error for .catch to handle it
                    throw response.statusText

                  }

                })
                  .then(preview => {

                    // Run the code if event was not cancelled and pass preview as data
                    if (window.dispatchEvent(new CustomEvent('comment-previewed', {cancelable: true, detail: {data: preview}}))) {

                      let html = document.querySelector('html')

                      // Release the variable from memory
                      formData = null

                      // Function to call after removing the notification
                      function showModal() {

                        // Enable the form
                        commentForm.removeAttribute('t-disabled')

                        // Hide the overflow of <html> so that the background does not scroll
                        html.style.overflowY = 'hidden'

                        // Enable the load button if it exists
                        loadButton && loadButton.removeAttribute('t-disabled')

                        // Create a modal
                        let modal = createElement('div', {'class': 't-scale-up t-modal'}, '<div class=t-animation><h3>Preview</h3><span>✖</span><hr><div><div class=comment>' + preview + '</div></div></div>', document.body)

                        // Handle the onclick of the close button
                        modal.querySelector('span').onclick = event => {

                          // Remove the animation class
                          modal.classList.remove('t-scale-up')

                          // Run the function after the animation is completed
                          setTimeout(() => {

                            // Let the <html> be scrolled again
                            html.style.overflowY = 'auto'

                            // Remove the onclick event handler
                            event.target.onclick = null

                            // Remove the element from DOM
                            modal.remove()

                            // Release the variables from memory
                            modal = null
                            html = null

                          }, 500)

                        }

                      }

                      // Remove the notification and call the function
                      removeNotification(notification, showModal)

                    }

                  })
                    .catch(error => {

                      // Enable the form
                      commentForm.removeAttribute('t-disabled')

                      // Enable the load button if it exists
                      loadButton && loadButton.removeAttribute('t-disabled')

                      // Show notification if event is not cancelled
                      window.dispatchEvent(new CustomEvent('comment-preview-error', {cancelable: true, detail: {data: error}})) && createNotification('<span>' + error + '</span>', 5000)

                    })

            })

        }

        // Show the notification
        createNotification('<div></div><span>Generating preview...</span>', null, fetchPreview)

      }

    } else {

      // Show the error
      createNotification('<span>Please enter some text to preview</span>', 5000)

    }

  }

  /*
  The following function handles removing all the traces of the user choosing to reply to an existing comment. This
  is called when user dismisses the replyLabel, or if the submission of comment has succeeded.
  */

  function removeReply() {

    /*
    We select the label. Since this function is called only when it already exists, it's safe to assume it's the
    first instance of an element with the label class.
    */

    let label = document.querySelector('.t-label')

    // Remove all click event listeners
    label.querySelectorAll('*').forEach(child => child.onclick = null)

    // Remove the reply attribute from the form
    commentForm.removeAttribute('data-reply')

    // Set this variable as false for further conditions
    replyLabel = false

    // Actually remove the element
    label.remove()

    // Release the variable from memory
    label = null

  }

  /*
  The following function handles the shake animation of an element. It takes one argument that is a valid DOM
  element itself.
  */

  function manageShake(element) {

    // Add the classes
    ['t-animation', 't-shake'].map(addClass => element.classList.add(addClass))

    // Set a timeout of 500 ms (duration of the animation)
    setTimeout(() => {

      // Remove the classes
      ['t-animation', 't-shake'].map(removeClass => element.classList.remove(removeClass))

      // Release the element from memory
      element = null

    }, 500)

  }

  /*
  The following function calculates the required offset for our window.scrollTo({}) calls. This takes one argument
  and that's the valid DOM element. It then returns the value.
  */

  function calculateTop(element) {
    return Math.floor(element.getBoundingClientRect().top + window.pageYOffset)
  }

  /*
  The following function is responsible for loading the comments from the database. It takes an optional argument.
  It's the ID of the comment to automatically scroll to once the comments have loaded. This feature is designed
  to add the comment link in notification e-mails. In this setup, the autoScrollTo argument is automatically
  extracted from hashComment.
  */

  function loadComments(autoScrollTo) {

    // Run the code if the event was not cancelled
    if (window.dispatchEvent(new CustomEvent('comments-loading', {cancelable: true}))) {

      // At this point loadButton exists in DOM, so just disable it
      loadButton.setAttribute('t-disabled', '')

      // Disable the form
      commentForm.setAttribute('t-disabled', '')

      // Function called after notification
      function continueLoading() {

        // Call setupAuth() before calling our API
        setupAuth()
          .then(response => {

              /*
              Here we fetch the getComments function. The handling is almost same as the addComment function, except the
              data that we receive, differs to some extent.
              */

              fetch('/api/getComments/' + '?title=' + title, {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer ' + response
                }
              })
                .then(response => {

                  // Check if response was ok
                  if (response.ok) {

                  // Return the JSON parsed response
                  return response.json()

                  } else {

                  // Throw the error for .catch to handle it
                  throw response.statusText

                  }

                })
                  .then(comments => {

                    // Run the code if event was not cancelled and pass comments as data
                    if (window.dispatchEvent(new CustomEvent('comments-loaded', {cancelable: true, detail: {data: comments}}))) {

                      // Create a divider (<hr>) between form and comments
                      createElement('hr', '', '', appendTo)

                      /*
                      Here we check if we actually received any comments. If we did, we would get an array with each
                      comment's own array in it. If there are no comments, we won't receive anything. Thus, we show no
                      comments yet text in that case.
                      */

                      if (comments) {

                        // Set this variable as the length of this array
                        commentCount = comments.length

                        // Create a <h3> to show the number of counts. We check for pluralization of the word even here.
                        createElement('h3', '', commentCount + ' ' + (commentCount > 1 ? 'comments' : 'comment'), appendTo)

                        /*
                        We process the comments array here. For each comment, we create a comment element and append it to
                        the DOM. Each comment's own array consists of the following data:

                        [0] (string): Timestamp of the comment in UNIX milliseconds
                        [1]['@ref'] (object): The ref object of the comment
                        [1]['@ref'].id: The ID of the comment
                        [2] (string): Name of the comment writer
                        [3] (string): HTML data of the comment
                        [4] (string): ID of the parent comment
                        */

                        comments.forEach(commentData => createComment(commentData[1]['@ref'].id, commentData[2], commentData[0], commentData[3], commentData[4]))

                      } else {

                        // Create a no comments text
                        createElement('h3', '', 'No comments yet', appendTo)

                      }

                    }

                  })
                    .then(() => {

                      // Enable the form
                      commentForm.removeAttribute('t-disabled')

                      // Remove the loading notification
                      removeNotification(notification)

                      // Remove click event listener of load button
                      loadButton.onclick = null

                      // Remove the load button from DOM
                      loadButton.remove()

                      // Release the variable from memory
                      loadButton = null

                      // Check if the function was loaded with an argument
                      if (parseInt(autoScrollTo)) {

                        // Get the element
                        let scrollTarget = document.getElementById(autoScrollTo)

                        // Check if the element exists in DOM
                        if (scrollTarget) {

                          // Function to run after scroll completes
                          function postScroll() {

                            // Shake the element
                            manageShake(scrollTarget)

                            // Clear the hash string from URL so that it doesn't trigger the function on reload
                            history.replaceState('', '', location.href.split('#')[0])

                          }

                          // Scroll to target
                          callbackScroll(calculateTop(scrollTarget) - scrollOffset, postScroll)

                        } else {

                          // Create a notification to show the error
                          createNotification('<span>Invalid comment ID</span>', 5000)

                        }

                      }

                    })
                      .catch(error => {

                        // Enable the form
                        commentForm.removeAttribute('t-disabled')

                        // Enable the load button if it exists
                        loadButton && loadButton.removeAttribute('t-disabled')

                        // Show notification if event is not cancelled
                        window.dispatchEvent(new CustomEvent('comment-load-error', {cancelable: true, detail: {data: error}})) && createNotification('<span>' + error + '</span>', 5000)

                      })

          })

      }

      // Create a notification and run the function
      createNotification('<div></div><span>Loading comments...</span>', null, continueLoading)

    }

  }

  /*
  The following function is responsible for a function to be run after a smooth window.ScrollTo(). It takes two
  arguments, top means number of pixels to scroll from the top of the window and callback is the function.
  */

  function callbackScroll(top, callback) {

    // If top < 0, set top = 0
    top < 0 && (top = 0)
    // TODO: console.log(document.querySelector('html').offsetHeight)

    /*
    The following function id declared to be used while scrolling. It's defined as a separate function so that it can
    be removed by removeEventListener(). We are using event listener and not onscroll because when using this library
    in other webpages, there's a huge chance that the page already has some scroll event listeners. If we use
    onscroll, that would lead to incompatibility with those event listeners.
    */

    function checkScroll() {

      /*
      We check for two conditions separated by or. The first condition checks if the document is scrolled to the end.
      The second one checks if it's actually equal to top. It either of these is true, we continue.
      */

      if (window.pageYOffset === top || window.innerHeight + window.scrollY >= document.body.offsetHeight) {

        // Call callback
        callback()

        // Release both from memory
        top = null
        callback = null

        // Remove the event listener
        window.removeEventListener('scroll', checkScroll)

      }

    }

    /*
    If we are already at the scroll position, directly call the callback. This will happen when the comment is
    already visible without scrolling.
    */

    if (window.pageYOffset === top) {

      // Call the function
      callback()

    } else {

      // Add the event listener
      window.addEventListener('scroll', checkScroll)

      // Scroll
      window.scrollTo({
        top: top,
        behavior: 'smooth'
      })

    }

  }

  /*
  The following function is responsible for removing a notification from the DOM with the animation and call a
  function after it's done. It takes two arguments, element, that is the notification element and callback, that is
  the function to call after removing the element. callback is an optional argument.
  */

  function removeNotification(element, callback) {

    // Remove the class
    element.classList.remove('t-fade-bottom')

    // Set timeout equal to the duration of the animation
    setTimeout(() => {

      // Remove all click event listeners from all elements within the notification
      element.querySelectorAll('*').forEach(child => child.onclick = null)

      // Remove the notification from DOM
      element.remove()

      // If callback is supplied, call the callback function or else, release the element from memory
      callback ? callback() : element = null

    }, 500)

  }

  /*
  The following function is responsible for creating the comment element and appending it to the DOM. It takes five
  arguments and only the fifth is optional.

  1. id (number): ID of the comment
  2. name (string): Name of the person who commented
  3. time (number): Timestamp of the comment in UNIX milliseconds
  4. comment (string): The HTML content of the comment body
  5. parent (number): ID of the parent comment
  */

  function createComment(id, name, time, comment, parent) {

    // Declare a variable
    let appendBefore

    // If load button does not exist in DOM, set the above variable as the first comment element
    !loadButton && (appendBefore = document.querySelector('.t-comment'))

    /*
    Create the comment element. The HTML is minified already because it does not get minified while building. We use
    the arguments passed to this function to build the HTML. For profile photos, a random colour is generated as
    a background colour and the first letter of the name is used. These are not images and the colour is not stored
    in the database. Thus, a new one is generated on every load.
    */

    let commentElement = createElement('div', {'id': id, 'class': 't-comment'}, '<div><div><div><div style=background:#' + (Math.random().toString(16) + '00000').slice(2, 8) + '><h3>' + name.charAt(0) + '</h3></div></div><div><h3>' + name + '</h3><ul><li>' + new Intl.DateTimeFormat(config.dateFormat || 'en-US', {day: 'numeric', month: 'short', year: 'numeric'}).format(new Date(time/1000)) + '</li><li><a href=' + formSelector + '>Reply</a></li></ul></div></div></div><div>'+ comment + '</div>', appendTo, appendBefore)

    // The following adds a onclick function to the reply button
    commentElement.querySelector('a[href="' + formSelector + '"]').onclick = event => {

      // The function to call after scroll
      function postScroll() {

        /*
        The following function handles the click event for reply labels. It's declared as a separate function
        because we need it multiple times.
        */

        function clickListener(event) {

          // Function to call after scroll
          function subPostScroll() {

            // Function to run after notification
            function postNotification() {

              // Function to handle onclick of link in notification
              notification.querySelector('a[href^="#"]').onclick = event => {

                function dismissNotification() {

                  // Shake the reply label
                  manageShake(document.querySelector('.t-label'))

                  // Remove the notification
                  removeNotification(notification)

                }

                // Prevent the default action of the click
                event.preventDefault()

                // Scroll and call the function
                callbackScroll(calculateTop(commentForm) - 55, dismissNotification)

              }

              // onclick handler for notification close button
              notification.querySelector('span + span').onclick = () => {

                // Remove the notification
                removeNotification(notification)

              }

            }

            // Shake the element
            manageShake(targetElement)

            // Create notification abd call the function
            createNotification('<span>Back to <a href="' + formSelector + '">Form</a></span><span>✖</span>', null, postNotification)

          }

          // Prevents the default action of click
          event.preventDefault()

          // Scroll to target
          callbackScroll(calculateTop(targetElement) - scrollOffset, subPostScroll)

        }

        // Get the id of the current element's parent
        let requiredID = event.target.closest('.t-comment').getAttribute('id')

        // Set the reply attribute for the form
        commentForm.setAttribute('data-reply', requiredID)

        // Set the variable for further use
        let targetElement = document.getElementById(requiredID)

        /*
        If a reply label already exists, we need not delete it and create it again. We can simply change the
        innerHTML to match the new reply. That's what we do here.
        */

        if (replyLabel) {

          // Since we know that reply label already exists, it's safe to assume it's the first element with label class
          let previousLabel = document.querySelector('.t-label')

          // Remove the onclick event of the previous link
          previousLabel.querySelector('a[href^="#"]').onclick = null

          // Set the new innerHTML
          previousLabel.querySelector('span').innerHTML = '<span>Replying to <a href=#' + requiredID + '> #' + requiredID + '</a></span>'

          // Add the new onclick event
          previousLabel.querySelector('a[href^="#"]').onclick = clickListener

          // Shake the label
          manageShake(previousLabel)

        } else {

          // Create a new reply label
          let replyLabelElement = createElement('span', {'class': 't-label'}, '<span>Replying to <a href=#' + requiredID + '>#' + requiredID + '</a></span><span>✖</span>', document.body, commentForm)

          // Add the click listener to link
          replyLabelElement.querySelector('a[href^="#"]').onclick = clickListener

          // Add the click listener to remove button
          replyLabelElement.children[1].onclick = removeReply

          // Shake the label
          manageShake(replyLabelElement)

          // Set this variable to true
          replyLabel = true

        }

        // Release the variable from memory
        requiredID = null

      }

      // Prevent the default action of the event
      event.preventDefault()

      // Scroll to form
      callbackScroll(calculateTop(commentForm) - 55, postScroll)

    }

    /*
    Since we pass the parent argument without checking if it's valid, we need to check it here. FaunaDB always stores
    the ID as a number and we use the same number as a parent if the user replies to an existing comment. Note that,
    the ID set by FaunaDB is generally out of limits of parseInt of JavaScript. However, we just need to check if it
    was an integer, thus it works.
    */

    if (parseInt(parent)) {

      // Select the body od the comment
      let commentBody = commentElement.children[1]

      // Insert a label after the body starts
      commentBody.insertAdjacentHTML('afterbegin', '<span class=t-label><span>Replied to <a href=#' + parent + '> #' + parent + '</a></span></span>')

      // Add a onclick function for the link
      commentBody.querySelector('a[href^="#"]').onclick = event => {

        // Function to call after scroll
        function postScroll() {

          // Shake the element
          manageShake(targetElement)

          // Function to call after notification
          function postNotification() {

            // onclick handler for link in notification
            notification.querySelector('a[href^="#"]').onclick = event => {

              // Function to call after scroll
              function dismissNotification() {

                // Shake the target element
                manageShake(parentElement)

                // Remove the notification
                removeNotification(notification)

              }

              // Prevent the default action of the click
              event.preventDefault()

              // Select the element
              let parentElement = document.getElementById(id)

              // Scroll and call the function
              callbackScroll(calculateTop(parentElement) - scrollOffset, dismissNotification)

            }

            // onclick handler for notification close button
            notification.querySelector('span + span').onclick = () => {

              // Remove the notification
              removeNotification(notification)

            }

            // Release the variable from memory
            targetElement = null

          }

          // Create a notification and call the function
          createNotification('<span>Back to <a href=#' + id + '>#' + id + '</a></span><span>✖</span>', null, postNotification)

        }

        // Prevent the default action of click
        event.preventDefault()

        // Set the variable
        let targetElement = document.getElementById(parent)

        // Scroll to the target and call the function
        callbackScroll(calculateTop(targetElement) - scrollOffset, postScroll)

      }

      // Release the variable from memory
      commentBody = null

    }

    // Release the variables from memory
    commentElement = null
    appendBefore = null

  }

  /*
  The following function is responsible for creating a notification. It takes three arguments. Only the first is
  required. It is the innerHTML to set in the notification. The timeout, if specified, sets the duration of the
  notification after which it will be dismissed automatically. Its value is in milliseconds. The callback is the
  function to call after the notification is created.
  */

  function createNotification(innerHTML, timeout, callback) {

    // Function to create a new notification
    function newNotification() {

      // Create and store the new element as the variable
      notification = createElement('div', {'class': 't-animation t-fade-bottom t-notification'}, innerHTML, document.body)

    }

    // Select the current notification
    notification = document.querySelector('.t-notification')

    // If notification exists, remove it and then create another notification, else just create a new notification
    notification ? removeNotification(notification, newNotification) : newNotification()

    // If timeout is specified, remove the notification after the timeout
    timeout && setTimeout(() => removeNotification(notification, callback), timeout)

    // If callback is specified without timeout, then call the callback after the creation of notification
    callback && !timeout && setTimeout(() => callback(), 500)

    // Return the element
    return notification

  }

  /*
  The following function creates a new element and appends it to the DOM. It takes five arguments and only the fifth
  is optional. The first attribute is the name of the tag. The second attribute is the attributes that need to be
  added to the element. It's a object. The third is the innerHTML of the element. The fourth is the element to which
  the new element has to be appended. The fifth argument is the element before which the new element should be
  appended. The fourth and fifth argument have to be a valid DOM element. The function returns the element.
  */

  function createElement(tagName, attributes, innerHTML, appendTo, insertBefore) {

    // Create the element
    let element = document.createElement(tagName)

    // Set attributes from the object
    Object.keys(attributes).forEach(attribute => element.setAttribute(attribute, attributes[attribute]))

    // If insertBefore is specified, insert the new element before it, or else just insert it to the end
    insertBefore ? appendTo.insertBefore(element, insertBefore) : appendTo.appendChild(element)

    // Set the innerHTML of the element
    element.innerHTML = innerHTML

    // Return the element
    return element

  }

  // If autoLoad is set to true, load the comments
  config.autoLoad && loadComments()

  // If hashComment value is an integer, load the comments with the value
  parseInt(hashComment) && loadComments(hashComment)

  // Call the function on click
  loadButton.onclick = loadComments

  // Resize the textarea on input
  commentBox.oninput = () => {

    // Set height to auto first to fix cut, delete, etc.
    commentBox.style.height = 'auto'

    // Set the actual height
    commentBox.style.height = commentBox.scrollHeight + 2 + 'px'

  }

  // Handle the form submission
  commentForm.onsubmit = event => {

    // Call the function
    addComment()

    // Prevent the default action of the event
    event.preventDefault()

  }

  // Handle the onclick of preview button
  commentForm.querySelector('button[type="button"]').onclick = event => {

    // Call the function
    showPreview()

    // Prevent the default action of the event
    event.preventDefault()

  }

  // Dispatch the init event
  window.dispatchEvent(new CustomEvent('comments-init'))

}