// Require our own modules
const fetch = require('node-fetch')
const faunaDB = require('./intermediate/setupComments').faunaDB
const commentsDB = require('./intermediate/setupComments').commentsDB
const setupComments = require('./intermediate/setupComments').setupComments

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
        
        // Set title from query string
        const title = event.queryStringParameters.title
        
        // Check setup before proceeding
        return setupComments(title)
          .then(() => {
        
            // Get the documents from the index
            return commentsDB.query(faunaDB.query.Paginate(faunaDB.query.Match(faunaDB.query.Index(title + 'Index'))))
              .then(indexedComments => {
            
                // Since we get an array, we check for its length to determine if we actually received comments
                if (indexedComments.data.length > 0) {
                
                  // Return the array for client-side processing
                  return {
                    statusCode: 200,
                    body: JSON.stringify(indexedComments.data),
                    headers: {
                      'cache-control': 'public, max-age=0, must-revalidate'
                    }
                  }
                
                } else {
                
                  // Return null so client-side code shows no comments message
                  return {
                    statusCode: 200,
                    body: JSON.stringify(null),
                    headers: {
                      'cache-control': 'public, max-age=0, must-revalidate'
                    }
                  }
                
                }
            
              })
        
          })
    
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