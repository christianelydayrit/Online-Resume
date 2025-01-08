// Configure AWS SDK
AWS.config.update({
    accessKeyId: "AKIA4MI2JXJFHF7FGT7J",       // Replace with your AWS Access Key ID
    secretAccessKey: "aXsMTRNTHpzzXzqBH+iMgj17W+ZJKySO1lq2fxYa", // Replace with your AWS Secret Access Key
    region: "ap-southeast-2"                    // Replace with your S3 bucket's region
  });
  
  // Create an S3 instance
  const s3 = new AWS.S3();
  
  /**
   * Function to count the number of objects in an S3 bucket
   * @param {string} bucketName - Name of the S3 bucket
   * @param {string} prefix - Prefix for filtering objects (optional)
   * @returns {Promise<number>} - Total object count
   */
  async function countObjectsInBucket(bucketName, prefix = '') {
    try {
      const params = {
        Bucket: bucketName,
        Prefix: prefix, // Optional: Filter by prefix if needed
      };
  
      let totalObjects = 0;
      let isTruncated = true;
      let continuationToken;
  
      while (isTruncated) {
        if (continuationToken) {
          params.ContinuationToken = continuationToken;
        }
  
        const data = await s3.listObjectsV2(params).promise();
        totalObjects += data.Contents.length; // Add the number of objects in the current response
        isTruncated = data.IsTruncated;      // Check if there are more objects to fetch
        continuationToken = data.NextContinuationToken; // Get the token for the next batch
      }
  
      return totalObjects;
    } catch (error) {
      console.error("Error counting objects:", error);
      return 0; // Return 0 if there's an error
    }
  }
  
  /**
   * Function to display the object count on the HTML page
   */
  async function displayObjectCount() {
    const bucketName = "nucketnoggets"; // Replace with your bucket name
    const prefix = "AWSLogs/850995558986/CloudFront/"; // Optional: Specify a prefix to count objects in a specific folder
  
    // Count the objects
    const count = await countObjectsInBucket(bucketName, prefix);
  
    // Display the count in the HTML element with id "objectCount"
    document.getElementById("objectCount").innerText = `Total Visits: ${count}`;
  }
  
  // Trigger the function on page load
  window.onload = displayObjectCount;

  
  