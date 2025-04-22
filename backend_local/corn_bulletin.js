const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const directoriesToFetch = [
  "./uploads/insurance",
  "./uploads/marketingOptions",
  "./uploads/default",
];

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

router.get("/listdefaultFiles", (req, res) => {
  const folderPath = "./uploads/default"; // Change this to the path of your "uploads" folder
  ensureDirectoryExists(folderPath);
  if (fs.existsSync(folderPath)) {
    // Read the contents of the "uploads" folder
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error("Error reading folder:", err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        // Send the list of files as a JSON response
        res.status(200).json({ files });
      }
    });
  } else {
    res.status(404).json({ message: "Directory not found" });
  }
});

router.get("/listFiles", (req, res) => {
  const allFiles = [];
  let directoriesProcessed = 0; // Counter for processed directories

  // Iterate through each directory and read its contents

  directoriesToFetch.forEach((directory) => {
    if (fs.existsSync(directory)) {
      fs.readdir(directory, (err, files) => {
        if (err) {
          console.error("Error reading folder:", err);
          res.status(500).json({ message: "Internal server error" });
          return; // Early exit on error
        }

        // Add the files from this directory to the list
        allFiles.push(...files);

        // Increment the counter for processed directories
        directoriesProcessed++;

        // If this is the last directory, send the list of files as a JSON response
        if (directoriesProcessed === directoriesToFetch.length) {
          res.status(200).json({ files: allFiles });
        }
      });
    } else {
      // If the directory doesn't exist, return a 404 response
      directoriesProcessed++;
      if (directoriesProcessed === directoriesToFetch.length) {
        res.status(404).json({ message: "Directory or files not found" });
      }

      // res.status(404).json({ message: "Directory not found" });
    }
  });
});

// router.get("/latestinsuranceFiles", (req, res) => {
//   const metadataFilePath = path.join("./uploads/insurance", "metadata.json");

//   fs.readFile(metadataFilePath, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading metadata file:", err);
//       return res.status(500).json({ message: "Internal server error" });
//     }

//     try {
//       let files = JSON.parse(data);

//       // Sort files by upload date in descending order
//       files.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

//       // Get the latest date
//       const latestDate =
//         files.length > 0 ? files[0].uploadDate.split("T")[0] : null;

//       if (!latestDate) {
//         return res.status(404).json({ message: "No files found" });
//       }

//       // Filter files to include only those from the latest date
//       const latestFiles = files.filter((file) =>
//         file.uploadDate.startsWith(latestDate)
//       );

//       res.json({ files: latestFiles });
//     } catch (parseError) {
//       console.error("Error parsing metadata file:", parseError);
//       res.status(500).json({ message: "Error parsing metadata file" });
//     }
//   });
// });

router.get("/latestinsuranceFiles", (req, res) => {
  const metadataFilePath = path.join("./uploads/insurance", "metadata.json");

  fs.readFile(metadataFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading metadata file:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    try {
      let files = JSON.parse(data);

      // Sort files by upload date in descending order
      files.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

      res.json({ files: files });
    } catch (parseError) {
      console.error("Error parsing metadata file:", parseError);
      res.status(500).json({ message: "Error parsing metadata file" });
    }
  });
});

router.get("/listInsuranceFiles", (req, res) => {
  const folderPath = "./uploads/insurance"; // Change this to the path of your "uploads" folder
  ensureDirectoryExists(folderPath);
  if (fs.existsSync(folderPath)) {
    // Read the contents of the "uploads" folder
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error("Error reading folder:", err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        // Send the list of files as a JSON response
        res.status(200).json({ files });
      }
    });
  } else {
    res.status(404).json({ message: "Directory not found" });
  }
});

router.get("/listMarketingFiles", (req, res) => {
  const folderPath = "./uploads/marketingOptions"; // Change this to the path of your "uploads" folder
  ensureDirectoryExists(folderPath);
  if (fs.existsSync(folderPath)) {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error("Error reading folder:", err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        // Send the list of files as a JSON response
        res.status(200).json({ files });
      }
    });
  } else {
    res.status(404).json({ message: "Directory not found" });
  }
});

// router.get("/latestmarketingFiles", (req, res) => {
//   const metadataFilePath = path.join(
//     "./uploads/marketingOptions",
//     "metadata.json"
//   );

//   fs.readFile(metadataFilePath, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading metadata file:", err);
//       return res.status(500).json({ message: "Internal server error" });
//     }

//     try {
//       let files = JSON.parse(data);

//       // Sort files by upload date in descending order
//       files.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

//       // Get the latest date
//       const latestDate =
//         files.length > 0 ? files[0].uploadDate.split("T")[0] : null;

//       if (!latestDate) {
//         return res.status(404).json({ message: "No files found" });
//       }

//       // Filter files to include only those from the latest date
//       const latestFiles = files.filter((file) =>
//         file.uploadDate.startsWith(latestDate)
//       );

//       res.json({ files: latestFiles });
//     } catch (parseError) {
//       console.error("Error parsing metadata file:", parseError);
//       res.status(500).json({ message: "Error parsing metadata file" });
//     }
//   });
// });

router.get("/latestmarketingFiles", (req, res) => {
  const metadataFilePath = path.join(
    "./uploads/marketingOptions",
    "metadata.json"
  );

  fs.readFile(metadataFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading metadata file:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    try {
      let files = JSON.parse(data);

      // Sort files by upload date in descending order
      files.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

      res.json({ files: files });
    } catch (parseError) {
      console.error("Error parsing metadata file:", parseError);
      res.status(500).json({ message: "Error parsing metadata file" });
    }
  });
});


router.get("/listTeamFiles/:teamName", (req, res) => {
  const requestedTeam = decodeURIComponent(req.params.teamName)
    .replace(/[’‘‛`´]/g, "'")
    .replace(/\s+/g, " ") // normalize multiple spaces
    .trim()
    .toLowerCase(); // make comparison case-insensitive

    const baseDir = path.join(__dirname, "uploads", "corn");

  console.log("Resolved uploads path:", baseDir);


  if (!fs.existsSync(baseDir)) {
    return res.status(404).json({ message: `Base uploads folder not found: ${baseDir}` });
  }

  const folders = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // Try to match the folder ignoring case and trailing spaces
  const normalize = (str) =>
    str
      .replace(/[’‘‛`´]/g, "'")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  
  const matchedFolder = folders.find(folder => normalize(folder) === requestedTeam);
  

  if (!matchedFolder) {
    return res.status(404).json({ message: "Team folder not found" });
  }

  const teamDir = path.join(baseDir, matchedFolder);
  const files = fs.readdirSync(teamDir).filter(file =>
    fs.statSync(path.join(teamDir, file)).isFile()
  );

  res.json({ files });
});


// router.get("/listTeamFiles/:teamName", (req, res) => {
//   const teamName = req.params.teamName;
//   const directoryPath = path.join(__dirname, "uploads", "corn", teamName);
//   // ensureDirectoryExists(directoryPath);
//   if (fs.existsSync(directoryPath)) {
//     fs.readdir(directoryPath, (err, files) => {
//       if (err) {
//         console.error("Could not list the directory.", err);
//         return res.status(500).json({ message: "Failed to list files" });
//       }

//       // Filter out non-file entities and send the list of files
//       const fileList = files.filter((file) =>
//         fs.statSync(path.join(directoryPath, file)).isFile()
//       );
//       res.json({ files: fileList });
//     });
//   } else {
//     res.status(404).json({ message: "File not found" });
//   }
// });

router.get("/downloadTeamFile/:teamName/:fileName", (req, res) => {
  const { teamName, fileName } = req.params;
  const fileDir = path.join(__dirname, "uploads", "corn", teamName, fileName);

  // Check if file exists
  if (fs.existsSync(fileDir)) {
    res.download(fileDir, fileName);
  } else {
    res.status(404).send("File not found.");
  }
});

router.get("/downloadDefaultFile/:fileName", (req, res) => {
  const folderPath = "./uploads/default"; // Change this to the path of your "uploads" folder
  const fileName = req.params.fileName;
  const filePath = path.join(folderPath, fileName);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set the appropriate content type for the file
    res.setHeader("Content-Type", "application/octet-stream");
    // Set the file name in the Content-Disposition header
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    // Create a read stream from the file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

router.get("/downloadInsuranceFile/:fileName", (req, res) => {
  const folderPath = "./uploads/insurance"; // Change this to the path of your "uploads" folder
  const fileName = req.params.fileName;
  const filePath = path.join(folderPath, fileName);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set the appropriate content type for the file
    res.setHeader("Content-Type", "application/octet-stream");
    // Set the file name in the Content-Disposition header
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    // Create a read stream from the file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

router.get("/downloadMarketingFile/:fileName", (req, res) => {
  const folderPath = "./uploads/marketingOptions"; // Change this to the path of your "uploads" folder
  const fileName = req.params.fileName;
  const filePath = path.join(folderPath, fileName);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set the appropriate content type for the file
    res.setHeader("Content-Type", "application/octet-stream");
    // Set the file name in the Content-Disposition header
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    // Create a read stream from the file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

module.exports = router;
