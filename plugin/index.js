// Require the Node Modules
const fs = require('fs')

// Start the plugin
module.exports = {

  // Hook into preBuild
  onPreBuild: ({constants}) => {

    // Get functions folder from config
    const destination = constants.FUNCTIONS_SRC

    // Store reused strings as constants
    const intermediate = destination + '/intermediate'
    const nodeFolder = 'node_modules/threadtalkjs/functions'

    /*
      Since we allow users to override the built-in functions, we need to check at each step if the file or folder
      already exists. If it does, we don't touch it, if it does not, we create the folder or copy the file.
     */

    // Check if the functions folder exists
    if (fs.existsSync(destination)) {

      // functions folder exists, log in the console
      console.log(destination + ' already exists. Proceeding...')

      // Check if functions/intermediate folder exists
      if (fs.existsSync(intermediate)) {

        // functions/intermediate folder exists, log in the console
        console.log(intermediate + ' already exists. Proceeding...')

      } else {

        // functions/intermediate folder does not exist, try to create it
        try {

          // Create functions/intermediate folder
          fs.mkdirSync(intermediate)

          // Log the success in console
          console.log(intermediate + ' has been created. Proceeding...')

        } catch (error) {

          // Received an error, log it in console
          console.error(intermediate + ' could not be created. ' + error)

        }

      }

    } else {

      // functions folder does not exist, try to create it and also the functions/intermediate folder in one go
      try {

        // Create both the folders
        fs.mkdirSync(intermediate, {recursive: true})

        // Log the success in console
        console.log(destination + ' & ' + intermediate + ' have been created. Proceeding...')

      } catch (error) {

        // Received an error, log it in console
        console.error(destination + ' & ' + intermediate + ' could not be created. ' + error)

      }

    }

    /*
      The following function handles the copying of each file. If the file exists, it's not copied so that a user can
      override the built-in serverless function with one of his/her own. The function takes one non-optional argument
      and that's the path of file as a child of the ThreadTalk.JS Node Modules folder.
     */

    function copyFile(file) {

      // Check if the destination file exists
      if (fs.existsSync(destination + '/' + file)) {

        // It exists, warn that it's being overridden
        console.warn(file + ' is being overridden as it already exists.')

      } else {

        // It does not exist, try to copy it
        try {

          // Copy the file
          fs.copyFileSync(nodeFolder + '/' + file, destination + '/' + file)

          // Log the success
          console.log(file + ' successfully copied.')

        } catch (error) {

          // Received an error, log it in console
          console.error(file + ' could not be copied. ' + error)

        }

      }

    }

    // Copy each of the following files
    copyFile('intermediate/setupComments.js')
    copyFile('addComment.js')
    copyFile('getComments.js')
    copyFile('previewComment.js')

  }

}