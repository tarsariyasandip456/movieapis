import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import bodyParser from "body-parser";
import cors from 'cors'
import serverless from 'serverless-http'
import NodeCache from "node-cache";
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
const cache = new NodeCache();
// parse application/json
app.use(bodyParser.json())

const corsOpts = {
    origin: ["http://localhost:3000"],
  
    methods: [
      'GET',
      'POST',
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
  };
  
  app.use(cors(corsOpts));
  app.get("/Download/:number/:name", async (req, res) => {
    const cacheKey = `downloadLink:${req.params.number}:${req.params.name}`;
    
    // Check if the data is already cached
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit");
      return res.json(cachedData);
    }
  
    try {
      const response = await axios.get(`https://myforwap.site/confirm/${req.params.number}/${req.params.name}`);
      const $ = cheerio.load(response?.data);
  
      const downloadLink = $("div.list a[onclick]").attr("href");
      console.log("download", downloadLink);
  
      // Cache the download link for future requests with a TTL (time-to-live) of 1 hour (3600 seconds)
      cache.set(cacheKey, { downloadLink }, 3600);
  
      res.json({ downloadLink });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });
  
//   app.get("/Download/:number/:name", async (req, res) => {
//     console.log(req?.params?.number)
//     console.log(req?.params?.name)
//     try {
//       const response = await axios.get(`https://myforwap.site/confirm/${req.params.number}/${req.params.name}`);
//       const $ = cheerio.load(response?.data);
//       const movies = [];
// //       const imgSrc = $("div.thumbnail img").attr("src");
// // const movieTitle = $("div.menu").text().trim();
// // const genre = $("td:contains('Genre') + td div.genre").text().trim();
// // const duration = $("td:contains('Duration') + td").text().trim();
// // const releaseDate = $("td:contains('Release Date') + td").text().trim();
// // const language = $("td:contains('Language') + td").text().trim();
// // const cast = $("td:contains('Cast') + td div.starcast").text().trim();
// // const downloadLink = $("div.list a[onclick]").attr("href");

// // res.json({
// //   imgSrc,
// //   movieTitle,
// //   genre,
// //   duration,
// //   releaseDate,
// //   language,
// //   cast,
// //   downloadLink,
// // });


// const downloadLink = $("div.list a[onclick]").attr("href");
// console.log("download",downloadLink)
// res.json({
//   downloadLink,
// });
 
  
   
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "An error occurred" });
//     }
//   });

    // app.get("/DownloadDetail/:number/:name", async (req, res) => {
    //     console.log(req.params.number)
    //     console.log(req.params.name)
    //     try {
    //       const response = await axios.get(`https://flymywap.site/download/${req.params.number}/${req.params.name}`);
    //       const $ = cheerio.load(response.data);
    //       const movies = [];
    // //       const imgSrc = $("div.thumbnail img").attr("src");
    // // const movieTitle = $("div.menu").text().trim();
    // // const genre = $("td:contains('Genre') + td div.genre").text().trim();
    // // const duration = $("td:contains('Duration') + td").text().trim();
    // // const releaseDate = $("td:contains('Release Date') + td").text().trim();
    // // const language = $("td:contains('Language') + td").text().trim();
    // // const cast = $("td:contains('Cast') + td div.starcast").text().trim();
    // // const downloadLink = $("div.list a[onclick]").attr("href");

    // // res.json({
    // //   imgSrc,
    // //   movieTitle,
    // //   genre,
    // //   duration,
    // //   releaseDate,
    // //   language,
    // //   cast,
    // //   downloadLink,
    // // });
    
    // const imgSrc = $("div.thumbnail img").attr("src");
    // // const movieTitle = $("div.menu").text().trim();
    // const movieTitle = $("div.menu:eq(0)").text().replace("Code Name", "").trim();
    // // Selecting table rows within the movie details table
    // const movieDetailsRows = $("div.list table tbody tr");

    // // Extracting specific data based on the table rows
    // const genre = $(movieDetailsRows[1]).find("td").eq(2).text().trim();
    // const duration = $(movieDetailsRows[2]).find("td").eq(2).text().trim();
    // const releaseDate = $(movieDetailsRows[3]).find("td").eq(2).text().trim();
    // const language = $(movieDetailsRows[4]).find("td").eq(2).text().trim();
    // const cast = $(movieDetailsRows[5]).find("td").eq(2).text().trim();
    // const downloadLink = $("div.list a[onclick]").attr("href");

    // res.json({
    //   imgSrc,
    //   movieTitle,
    //   genre,
    //   duration,
    //   releaseDate,
    //   language,
    //   cast,
    //   downloadLink,
    // });
     
      
       
    //     } catch (error) {
    //       console.error(error);
    //       res.status(500).json({ error: "An error occurred" });
    //     }
    //   });

    app.get("/DownloadDetail/:number/:name", async (req, res) => {
      const cacheKey = `downloadDetail:${req.params.number}:${req.params.name}`;
      
      // Check if the data is already cached
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log("Cache hit");
        return res.json(cachedData);
      }
    
      try {
        const response = await axios.get(`https://flymywap.site/download/${req.params.number}/${req.params.name}`);
        const $ = cheerio.load(response.data);
    
        const imgSrc = $("div.thumbnail img").attr("src");
        const movieTitle = $("div.menu:eq(0)").text().replace("Code Name", "").trim();
        const movieDetailsRows = $("div.list table tbody tr");
        const genre = $(movieDetailsRows[1]).find("td").eq(2).text().trim();
        const duration = $(movieDetailsRows[2]).find("td").eq(2).text().trim();
        const releaseDate = $(movieDetailsRows[3]).find("td").eq(2).text().trim();
        const language = $(movieDetailsRows[4]).find("td").eq(2).text().trim();
        const cast = $(movieDetailsRows[5]).find("td").eq(2).text().trim();
        const downloadLink = $("div.list a[onclick]").attr("href");
    
        const responseData = {
          imgSrc,
          movieTitle,
          genre,
          duration,
          releaseDate,
          language,
          cast,
          downloadLink,
        };
    
        // Cache the data for future requests with a TTL (time-to-live) of 1 hour (3600 seconds)
        cache.set(cacheKey, responseData, 3600);
    
        res.json(responseData);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      }
    });
    app.get("/DownloadByQulity/:name", async (req, res) => {
      const cacheKey = `downloadLinks:${req.params.name}`;
    
      // Check if the data is already cached
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log("Cache hit");
        return res.json(cachedData);
      }
    
      try {
        const response = await axios.get(`https://linkmake.in/view/${req.params.name}`);
        const $ = cheerio.load(response.data);
    
        // Extract the movie title
        const movieTitle = $("head title").text().trim();
    
        // Initialize an array to store download links and their associated text
        const downloadLinks = [];
    
        // Find and iterate over all the download links
        $("div.dlink.dl").each((index, element) => {
          const linkElement = $(element);
          const linkText = linkElement.find("div.dll").text().trim();
          const linkUrl = linkElement.find("a").attr("href");
    
          // Add the download link details to the array
          downloadLinks.push({ text: linkText, url: linkUrl });
        });
    
        // Cache the download links for future requests with a TTL (time-to-live) of 1 hour (3600 seconds)
        cache.set(cacheKey, { movieTitle, downloadLinks }, 3600);
    
        res.json({ movieTitle, downloadLinks });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      }
    });
    
// app.get("/DownloadByQulity/:name", async (req, res) => {  
//   console.log(req?.params?.name)

//   try {
//     const response = await axios.get(`https://linkmake.in/view/${req?.params?.name}`);
//         const $ = cheerio.load(response.data);
//       // Extract the movie title
//       const movieTitle = $("head title").text().trim();

//       // Initialize an array to store download links and their associated text
//       const downloadLinks = [];
  
//       // Find and iterate over all the download links
//       $("div.dlink.dl").each((index, element) => {
//         const linkElement = $(element);
//         const linkText = linkElement.find("div.dll").text().trim();
//         const linkUrl = linkElement.find("a").attr("href");
  
//         // Add the download link details to the array
//         downloadLinks.push({ text: linkText, url: linkUrl });
//       });
  
//       res.json({
//         movieTitle,
//         downloadLinks,
//       });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "An error occurred" });
//       }
//     });
  
    app.get("/SearchMovie/:name", async (req, res) => {
      console.log(req?.params?.name)
      try {
        const response = await axios.get(`https://flymywap.site/page-category.html?to-title=${req?.params?.name?.replace(/ +/g, "+")}`);
        const $ = cheerio.load(response?.data);
        const movies = [];
  
        $("div[class='list'] > table > tbody > tr").each((index, element) => {
          const imgSrc = $(element).find("td > img").attr("src");
          const movieTitle = $(element).find("td > a").text();
          const movieLink = $(element).find("td > a").attr("href");
          const movieDescription = $(element).find("td > p > span").text();
    
          movies.push({
            imgSrc,
            movieTitle,
            movieLink,
            movieDescription,
          });
        });
        res.json({ movies });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      }
    });
// app.get("/Latest_Movie", async (req, res) => {
//     try {
//       const response = await axios.get("https://flymywap.site/index.html");
//       const $ = cheerio.load(response.data);
//       const movies = [];
  
//       $("div[class='list'] > table > tbody > tr").each((index, element) => {
//          const imgSrc = $(element).find("td > img").attr("src");
//         const movieTitle = $(element).find("td > a").text();
//         const movieLink = $(element).find("td > a").attr("href");
//         const movieDescription = $(element).find("td > p > span").text();
  
//         movies.push({
//           imgSrc,
//           movieTitle,
//           movieLink,
//           movieDescription,
//         });
//       });
  
//       res.json({ movies });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "An error occurred" });
//     }
//   });
app.get("/Latest_Movie", async (req, res) => {
  try {
    // Check if the data is already cached
    const cachedData = cache.get("latestMovies");
    if (cachedData) {
      return res.json({ movies: cachedData });
    }

    const response = await axios.get("https://flymywap.site/index.html");
    const $ = cheerio.load(response.data);
    const movies = [];

    const moviePromises = $("div[class='list'] > table > tbody > tr").map(async (index, element) => {
      const imgSrc = $(element).find("td > img").attr("src");
      const movieTitle = $(element).find("td > a").text();
      const movieLink = $(element).find("td > a").attr("href");
      const movieDescription = $(element).find("td > p > span").text();

      return {
        imgSrc,
        movieTitle,
        movieLink,
        movieDescription,
      };
    }).get();

    // Wait for all promises to resolve using Promise.all
    const resolvedMovies = await Promise.all(moviePromises);

    // Cache the data for future requests
    cache.set("latestMovies", resolvedMovies);

    res.json({ movies: resolvedMovies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});
app.listen(9000,()=>{
    console.log("running",9000)
});