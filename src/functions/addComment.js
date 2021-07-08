// Require the Node Modules
const fetch = require('node-fetch')
const showdown = require('showdown')
const SMTPClient = require('emailjs').SMTPClient

// Require our own modules
const faunaDB = require('./intermediate/setupComments').faunaDB
const commentsDB = require('./intermediate/setupComments').commentsDB
const setupComments = require('./intermediate/setupComments').setupComments
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
    
        // Set the title
        const title =  event.queryStringParameters.title
        
        // Check the setup before proceeding
        return setupComments(title)
          .then(() => {
        
            /*
            We receive data like this:
            name=foo&email=foo@bar.com&parent=bar&comment=blah
            
            Thus, we split it using '&' and select the data from the array. Then, we need to use substr to remove the parts
            before =. Thus, we get an array as [name, email, parent, comment]. Then, we're using decodeURIComponent. It's
            because the form data gets encoded and special characters are escaped. But, spaces don't get unescaped as they
            are converted to +, so first, we need to convert spaces to their escaped version that is %20, and then decode
            the string.
            */
            
            // Split the data at &.
            const submittedData = event.body.split('&')
            
            // Now we create a document and add it to the collection
            return commentsDB.query(faunaDB.query.Create(faunaDB.query.Collection(title), {
              data: {
                name: decodeURIComponent(submittedData[0].substr(5).replace(/\+/g, '%20')),
                email: decodeURIComponent(submittedData[1].substr(6)),
                comment: new showdown.Converter(showdownConfig).makeHtml(decodeURIComponent(submittedData[3].substr(8).replace(/\+/g, '%20'))),
                parent: decodeURIComponent(submittedData[2].substr(7))
              }
            }))
              .then(commentData => {
            
                /*
                With the following code, we handle the sending of email notification to the parent comment if it exists.
                Because FaunaDB stores null as a string, we need to check if parent is an integer and thus, parseInt. If the
                condition is true, we get the document with the parent's ID and use the data from that.
                */
                
                if (parseInt(commentData.data.parent)) {
                
                  // Get the document with parent's ID
                  return commentsDB.query(faunaDB.query.Get(faunaDB.query.Ref(faunaDB.query.Collection(title), commentData.data.parent)))
                    .then(parentData => {
                  
                      // Save the name
                      const receiverName = parentData.data.name
                      
                      // Save the email address
                      const receiverEmail = parentData.data.email
                      
                      // Check if the email address contains '@' which any email must contain or else the email might be null
                      if (receiverEmail.includes('@')) {
                      
                        // Store the url as a constant
                        const url = process.env.URL
                        
                        // Store the sender as a constant
                        const sender = process.env.SENDINBLUE_SENDER
                        
                        // Send the email
                        return new SMTPClient({
                          port: 587,
                          tls: true,
                          host: 'smtp-relay.sendinblue.com',
                          user: process.env.SENDINBLUE_USER,
                          password: process.env.SENDINBLUE_PASS
                        })
                          .sendAsync({
                            from: sender,
                            subject: 'New reply to your comment',
                            to: receiverName + ' <' + receiverEmail + '>',
                            text: '<p style="margin:0">Dear ' + receiverName + ',</p><p style="margin:0">Greetings!</p><br><p style="margin:0">This is to inform you that, ' + commentData.data.name + ' has replied to your comment on <a href="' + url + '">' + url + '</a>. You can see the reply <a href="' + event.headers.referer + '#' + String(commentData.ref).match(/\d+/g)[0] + '">here</a>. Kindly note that this was an automated e-mail and replying to this would do nothing.</p><br><p style="margin:0">Regards,</p><p style="margin:0">' + sender.split('<')[0] + '</p>',
                          })
                            .then(() => {
                        
                              // Return the data of the comment for client-side processing
                              return {
                                statusCode: 200,
                                body: JSON.stringify(commentData),
                                headers: {
                                  'cache-control': 'public, max-age=0, must-revalidate'
                                }
                              }
                        
                            })
                      
                      }
                  
                    })
                
                } else {
                
                  // Return the data of the comment for client-side processing
                  return {
                    statusCode: 200,
                    body: JSON.stringify(commentData),
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