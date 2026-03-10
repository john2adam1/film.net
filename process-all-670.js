// Process ALL 670 movies automatically
import fs from 'fs';

function processAllMovies() {
  const csvData = fs.readFileSync('movies.csv', 'utf8');
  const lines = csvData.split('\n').filter(line => line.trim());
  
  const fixedLines = ['title,description,thumbnail_url,video_url,category,is_hero'];
  
  console.log(`📊 Processing ${lines.length - 1} movies...`);
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line properly
    const parts = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
        current += char;
      } else if (char === ',' && !inQuotes) {
        parts.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    parts.push(current);
    
    // Extract and clean data
    let title = parts[0]?.trim() || '';
    let description = parts[1]?.trim() || '';
    let thumbnail_url = parts[2]?.trim() || '';
    let video_url = parts[3]?.trim() || '';
    let category = parts[4]?.trim() || '';
    let is_hero = parts[5]?.trim() || 'false';
    
    // Handle rows with extra fields
    if (parts.length > 6) {
      is_hero = parts[parts.length - 1]?.trim() || 'false';
      // Merge extra parts into description
      for (let k = 5; k < parts.length - 1; k++) {
        description += ',' + (parts[k]?.trim() || '');
      }
    }
    
    // Clean quotes
    title = title.replace(/^"|"$/g, '').replace(/""/g, '"');
    description = description.replace(/^"|"$/g, '').replace(/""/g, '"');
    
    // Quote fields with commas
    if (title.includes(',') || title.includes('"')) {
      title = `"${title.replace(/"/g, '""')}"`;
    }
    
    if (description.includes(',') || description.includes('"')) {
      description = `"${description.replace(/"/g, '""')}"`;
    }
    
    fixedLines.push(`${title},${description},${thumbnail_url},${video_url},${category},${is_hero}`);
    
    // Progress indicator
    if (i % 100 === 0) {
      console.log(`✅ Processed ${i}/${lines.length - 1} movies...`);
    }
  }
  
  const fixedCSV = fixedLines.join('\n');
  fs.writeFileSync('movies_complete_670.csv', fixedCSV, 'utf8');
  
  console.log(`\n🎉 Complete! Saved ${fixedLines.length - 1} movies to movies_complete_670.csv`);
  console.log(`📁 File is ready for Supabase import!`);
}

processAllMovies();
