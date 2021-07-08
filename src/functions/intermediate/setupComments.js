// Require the Node Modules
const faunaDB = require('faunadb')

// Initialize FaunaDB with the key from environment variables
const commentsDB = new faunaDB.Client({
  secret: process.env.FAUNADB
})

// Set showdown config
const showdownConfig = {
  emoji: true,
  tables: true,
  underline: true,
  noHeaderId: true,
  encodeEmails: true,
  strikethrough: true,
  simpleLineBreaks: true,
  parseImgDimensions: true,
  simplifiedAutoLink: true,
  openLinksInNewWindow: true,
  omitExtraWLInCodeBlocks: true,
  backslashEscapesHTMLTags: true,
  literalMidWordUnderscores: true
}

/*
The following async function is responsible for setting up our database. It checks if a collection exists for the
requested page (title argument). If it does, our code from the functions continues, while if it does not, we first
create a collection, then, we create an index and then we process the rest of our function.
*/

async function setupComments(title) {

  /*
  Since we need to wait for this function to finish executing before our other functions are called, we need to
  return a promise. We resolve this promise according to our condition.
  */
  
  return new Promise(resolve => {
  
    // Check if a collection with the same name already exists
    commentsDB.query(faunaDB.query.Exists(faunaDB.query.Collection(title)))
      .then(answer => {
    
        /*
        The answer would be true or false based on the existence of the collection. If it's true, we directly resolve
        the promise. If it's false, it means, we need to create a collection and an index and once it's done, we
        resolve the promise.
        */
        
        if (answer) {
        
          // Resolve the promise
          return resolve()
        
        } else {
        
          // We create a collection first
          return commentsDB.query(faunaDB.query.CreateCollection({
            name: title,
            history_days: 0
          }))
            .then(() => {
          
              // Now, we create an index and store the fields that we require
              return commentsDB.query(faunaDB.query.CreateIndex({
                unique: true,
                name: title + 'Index',
                source: faunaDB.query.Collection(title),
                values: [{
                  field: 'ts',
                  reverse: true
                }, {
                  field: 'ref'
                }, {
                  field: ['data', 'name']
                }, {
                  field: ['data', 'comment']
                }, {
                  field: ['data', 'parent']
                }]
              }))
          
            })
              .then(() => {
          
                // Resolve the promise
                return resolve()
          
              })
        
        }
    
      })
  
  })

}

// Export all our modules
module.exports = {
  faunaDB,
  commentsDB,
  setupComments,
  showdownConfig
}