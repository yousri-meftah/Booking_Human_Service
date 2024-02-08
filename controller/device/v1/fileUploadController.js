/**
 * fileUploadController.js
 * @description :: exports all method related file upload
 */

const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const validUrl = require('valid-url');

let defaultDirectory = 'public/assets';
let allowedFileTypes = [ 'png', 'jpeg', 'jpg' ];
let maxFileSize = 128; //In Megabyte

/**
 * @description : uploads file using formidable.
 * @param {Object} req : request of file upload API
 * @param {Object} res : response of file upload API.
 * @return {Object} : response of file upload. {status, message, data}
 */
const upload = async (req, res) => {
  try {
    // Create Directory if not exist.
    await makeDirectory(defaultDirectory);

    // Setting up formidable options.
    const options = {
      multiples : true,
      maxFileSize : 300 * 1024 * 1024, //300 MB
      maxFieldsSize : 100 * 1024 * 1024 //50 MB
    };
    const form = new formidable.IncomingForm(options);

    //Upload File one by one
    const uploadFileRes = await new Promise(async (resolve, reject) => {

      form.parse(req, async function (error, fields, files) {

        if (error) {
          reject(error);
        }

        let uploadSuccess = [];
        let uploadFailed = [];
        let fileCount = 1;

        let fileArr = [];
        if (!files['files']) {
          reject({
            'message': 'Select at least one file to upload.',
            'name': 'validationError'
          });
        }
        if (!Array.isArray(files['files'])) {
          fileArr.push(files['files']);
          files['files'] = fileArr;
        }

        for (let file of files['files']) {

          let response = await uploadFiles(file, fields, fileCount++);

          if (response.status == false) {
            uploadFailed.push({
              'name': file.originalFilename,
              'error': response.message,
              'status': false
            });
          } else {
            let url = response.data;
            if (!validUrl.isUri(response.data)) {
              response.data = response.data.replace('/public', '');
              url = `${response.data}`;
            }
            uploadSuccess.push({
              'name': file.originalFilename,
              'path': url,
              'status': true
            });
          }
        }
        resolve({
          uploadSuccess,
          uploadFailed
        });
      });
    });
    
    if (uploadFileRes.uploadSuccess.length > 0) {
      let message = `${uploadFileRes.uploadSuccess.length} File uploaded successfully out of ${uploadFileRes.uploadSuccess.length + uploadFileRes.uploadFailed.length}`;
      return res.success({
        message: message,
        data: uploadFileRes
      });
    } else {
      let message = 'Failed to upload files.';
      return res.failure({
        message: message,
        data: uploadFileRes
      });
    }
  } catch (error) {
    if (error.name && error.name == 'validationError') {
      return res.validationError({ message: error.message });
    } else {
      return res.internalServerError({ message:error.message }); 
    }
  }
};

/**
 * @description : create directory to specified path
 * @param {string} directoryPath : location where directory will be created
 * @return {boolean} : returns true if directory is created or false
 */
const makeDirectory = async (directoryPath) => {

  if (!fs.existsSync(directoryPath)) {
    fs.promises.mkdir(directoryPath, { recursive: true }, (error) => {
      if (error) {
        return false;
      };
      return true;
    });
  }
  return true;
};

/**
 * @description : upload files
 * @param {Object} file : file to upload
 * @param {Object} fields : fields for file
 * @param {number} fileCount : total number of files to upload
 * @return {Object} : response for file upload
 */
const uploadFiles = async  (file, fields, fileCount) => {

  let tempPath = file.filepath;
  let unlink;
  let fileName = file.originalFilename;

  let extension = path.extname(file.originalFilename);
  extension = extension.split('.').pop();

  fileType = file.mimetype;

  if (allowedFileTypes.length == 0 || !allowedFileTypes.includes(extension)) {
    return {
      status: false,
      message: 'Filetype not allowed.'
    };
  }

  // Check File Size
  const fileSize = ((file.size / 1024) / 1024);
  if (maxFileSize < fileSize) {
    return {
      status: false,
      message: `Allow file size upto ${maxFileSize} MB.`
    };
  }

  //Create New path
  let newPath = defaultDirectory + '/' + new Date().getTime() + path.extname(file.originalFilename);

  //Create Requested Directory,if given in request parameter.
  if (fields && fields.folderName) {
    let newDir = defaultDirectory + '/' + fields.folderName;
    const createDir = await makeDirectory(newDir);
    if (createDir) {
      if (fields.fileName) {
        newPath = newDir + '/' + fields.fileName + '-' + fileCount + path.extname(file.originalFilename);
        fileName = fields.fileName;
      }
    }
  }
  else if (fields && fields.fileName) {
    newPath = defaultDirectory + '/' + fields.fileName + '-' + fileCount + path.extname(file.originalFilename);
    fileName = fields.fileName;
  }
  
  const response = await new Promise(async (resolve, reject) => {
    fs.readFile(tempPath, function (error, data) {
      fs.writeFile(newPath, data, async function (error) {
  
        //Remove file from temp
        unlink = await unlinkFile(tempPath);
  
        if (unlink.status == false) {
          reject(unlink);
        } else {
          resolve({
            status: true,
            message: 'File upload successfully.',
            data: '/' + newPath
          });
        }
      });
    });
  });

  return response;
};

/**
 * @description : unlink(delete) file from specified path
 * @param {string} path : location of file 
 * @return {Object} : return unlink file status {status, message}
 */
const unlinkFile = async (path) => {

  fs.unlink(path, function (error) {
    if (error) {
      return {
        status: false,
        message: error.message
      };
    }
  });

  return { status: true };
};

module.exports = { upload };
