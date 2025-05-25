const cheerio = require("cheerio");
const axios = require("axios");
const xlsx = require('xlsx');

const scrapeJob = async () => {
  const url =
    "https://www.timesjobs.com/candidate/job-search.html?searchType=Home_Search&from=submit&asKey=OFF&txtKeywords=&cboPresFuncArea=35";
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const results = [];
    
    $('.job-bx').each((i, el)=>{
        const jobTitle = $(el).find('.heading-trun a').text().trim();
        const companyName = $(el).find('.joblist-comp-name').text().trim();
        const location = $(el).find('.location-tru').text().trim();
        const postedDate = $(el).find('.sim-posted span').text().trim();
        const jobDescription = $(el).find('.job-description__').text().trim(); 
        results.push({
            "Job Title":jobTitle,
            "Company Name": companyName,
            "Location": location,
            "Posted Date": postedDate,
            "Job Description": jobDescription.substring(0, jobDescription.length-3)
        });
    });
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(results);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Job Results");
    xlsx.writeFile(workbook, "Job Scrape.xlsx");
  } catch (error) {
    console.log(error);
  }
};
scrapeJob();
