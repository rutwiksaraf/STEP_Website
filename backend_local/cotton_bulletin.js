const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const directoriesToFetch = [
  "./uploads/cottoninsurance",
  "./uploads/cottonmarketingOptions",
  "./uploads/cottondefault",
];

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

router.get("/listcottonFiles", (req, res) => {
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

router.get("/listCottonDefaultFiles", (req, res) => {
  const folderPath = "./uploads/cottondefault"; // Change this to the path of your "uploads" folder
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

router.get("/listCottonInsuranceFiles", (req, res) => {
  const folderPath = "./uploads/cottoninsurance"; // Change this to the path of your "uploads" folder
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

router.get("/listCottonMarketingFiles", (req, res) => {
  const folderPath = "./uploads/cottonmarketingOptions"; // Change this to the path of your "uploads" folder
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

// router.get("/listFiles", (req, res) => {
//   const folderPath = "./uploads/default"; // Change this to the path of your "uploads" folder

//   // Read the contents of the "uploads" folder
//   fs.readdir(folderPath, (err, files) => {
//     if (err) {
//       console.error("Error reading folder:", err);
//       res.status(500).json({ message: "Internal server error" });
//     } else {
//       // Send the list of files as a JSON response
//       res.status(200).json({ files });
//     }
//   });
// });

router.get("/downloadCottonTeamFile/:teamName/:fileName", (req, res) => {
  const teamName = decodeURIComponent(req.params.teamName).trim();
  const fileName = decodeURIComponent(req.params.fileName);
  const fileDir = path.join(__dirname, "uploads", "cotton", teamName, fileName);

  // Check if file exists
  if (fs.existsSync(fileDir)) {
    res.download(fileDir, fileName);
  } else {
    res.status(404).send("File not found.");
  }
});

router.get("/downloadDefaultCottonFile/:fileName", (req, res) => {
  const folderPath = "./uploads/cottondefault"; // Change this to the path of your "uploads" folder
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

router.get("/downloadInsuranceCottonFile/:fileName", (req, res) => {
  const folderPath = "./uploads/cottoninsurance"; // Change this to the path of your "uploads" folder
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

router.get("/downloadMarketingCottonFile/:fileName", (req, res) => {
  const folderPath = "./uploads/cottonmarketingOptions"; // Change this to the path of your "uploads" folder
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

router.get("/latestcottonmarketingFiles", (req, res) => {
  const metadataFilePath = path.join(
    "./uploads/cottonmarketingOptions",
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

      // Get the latest date
      // const latestDate =
      //   files.length > 0 ? files[0].uploadDate.split("T")[0] : null;

      // if (!latestDate) {
      //   return res.status(404).json({ message: "No files found" });
      // }

      // // Filter files to include only those from the latest date
      // const latestFiles = files.filter((file) =>
      //   file.uploadDate.startsWith(latestDate)
      // );

      res.json({ files: files });
    } catch (parseError) {
      console.error("Error parsing metadata file:", parseError);
      res.status(500).json({ message: "Error parsing metadata file" });
    }
  });
});

router.get("/latestcottonInsuranceFiles", (req, res) => {
  const metadataFilePath = path.join(
    "./uploads/cottoninsurance",
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

      // Get the latest date
      // const latestDate =
      //   files.length > 0 ? files[0].uploadDate.split("T")[0] : null;

      // if (!latestDate) {
      //   return res.status(404).json({ message: "No files found" });
      // }

      // // Filter files to include only those from the latest date
      // const latestFiles = files.filter((file) =>
      //   file.uploadDate.startsWith(latestDate)
      // );

      res.json({ files: files });
    } catch (parseError) {
      console.error("Error parsing metadata file:", parseError);
      res.status(500).json({ message: "Error parsing metadata file" });
    }
  });
});

router.get("/listCottonTeamFiles/:teamName", (req, res) => {
  const teamName = req.params.teamName;
  const directoryPath = path.join(__dirname, "uploads", "cotton", teamName);

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Could not list the directory.", err);
      return res.status(500).json({ message: "Failed to list files" });
    }

    // Filter out non-file entities and send the list of files
    const fileList = files.filter((file) =>
      fs.statSync(path.join(directoryPath, file)).isFile()
    );
    res.json({ files: fileList });
  });
});

// New endpoints for cotton team subfolder files
router.get("/listCottonTeamSubfolderFiles/:teamName/:subFolder", (req, res) => {
  const requestedTeam = decodeURIComponent(req.params.teamName)
    .replace(/[''‛`´]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  
  const subFolder = decodeURIComponent(req.params.subFolder);
  const baseDir = path.join(__dirname, "uploads", "cotton");

  if (!fs.existsSync(baseDir)) {
    return res.status(404).json({ message: "Base uploads folder not found" });
  }

  const folders = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const normalize = (str) =>
    str
      .replace(/[''‛`´]/g, "'")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  
  const matchedFolder = folders.find(folder => normalize(folder) === requestedTeam);

  if (!matchedFolder) {
    return res.status(404).json({ message: "Team folder not found" });
  }

  const subFolderPath = path.join(baseDir, matchedFolder, subFolder);
  
  // Ensure subfolder exists
  if (!fs.existsSync(subFolderPath)) {
    fs.mkdirSync(subFolderPath, { recursive: true });
    return res.json({ files: [] });
  }

  const files = fs.readdirSync(subFolderPath).filter(file =>
    fs.statSync(path.join(subFolderPath, file)).isFile()
  );

  res.json({ files });
});

router.get("/downloadCottonTeamSubfolderFile/:teamName/:subFolder/:fileName", (req, res) => {
  const requestedTeam = decodeURIComponent(req.params.teamName)
    .replace(/[''‛`´]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  const subFolder = decodeURIComponent(req.params.subFolder);
  const baseDir = path.join(__dirname, "uploads", "cotton");
  
  if (!fs.existsSync(baseDir)) {
    return res.status(404).json({ message: `Base uploads folder not found: ${baseDir}` });
  }

  const folders = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const normalize = (s) =>
    s.replace(/[''‛`´]/g, "'").replace(/\s+/g, " ").trim().toLowerCase();

  const matchedFolder = folders.find(folder => normalize(folder) === requestedTeam);
  if (!matchedFolder) return res.status(404).json({ message: "Team folder not found" });

  const safeFileName = path.basename(decodeURIComponent(req.params.fileName));
  const filePath = path.join(baseDir, matchedFolder, subFolder, safeFileName);

  if (fs.existsSync(filePath)) {
    res.download(filePath, safeFileName);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

