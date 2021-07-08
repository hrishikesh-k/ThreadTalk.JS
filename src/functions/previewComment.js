// Require the Node Modules
const fetch = require('node-fetch')
const showdown = require('showdown')

// Require our own modules
const showdownConfig = require('./intermediate/setupComments').showdownConfig

// Start the function
exports.handler = async (event, context) => {
  
  // Store identity and user context
  const {identity, user} = context.clientContext
  
  /*
  The following is a security check. The following will return true only when a user of your website has logged in
  before calling the function. This would prevent anyone else including the same user to be able to spam the
  system. Others cannot spam because they've not logged in, and the same user can't spam because we're deleting the
  user right away.
  */
  
  if (user) {
  
    // Delete the user before proceeding
    return fetch(identity.url + '/admin/users/' + user.sub, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + identity.token
      }
    })
      .then(() => {
    
        /*
        The following generates HTML from Markdown. It uses Showdown and we are specifying its config here. However,
        notice that we're using decodeURIComponent, not just for this but for everything. It's because the form data gets
        encoded and special characters are escaped. But, spaces don't get unescaped as they are converted to +, so first,
        we need to convert spaces to their escaped version that is %20, and then decode the string.
        */
        
        return {
          statusCode: 200,
          body: JSON.stringify(new showdown.Converter(showdownConfig).makeHtml(decodeURIComponent(event.body.substr(8).replace(/\+/g, '%20')))),
          headers: {
            'cache-control': 'public, max-age=0, must-revalidate'
          }
        }
    
    })
  
  } else {
  
    // Show an error
    return {
      statusCode: 401,
      body: JSON.stringify('Unauthorized'),
      headers: {
        'cache-control': 'public, max-age=0, must-revalidate'
      }
    }
  
  }

}