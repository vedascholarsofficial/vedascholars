const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const darkClassRegex = /(bg-primary|bg-\[\#0B1F3A\]|bg-slate-900|bg-slate-800)/;

walkDir(path.join(__dirname, 'src'), function(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // We can confidently do a simple component-level string replace if there's a dark background:
    // If a file represents a purely "dark" component (e.g. ServicesHero, TrustSignals),
    // or if the file contains both, we can try to be smart.
    // Instead of full AST parsing, let's just globally replace 'text-primary' with 'text-white' 
    // ON THE LINE where dark background is present.
    
    let lines = content.split('\n');
    let insideDarkDiv = 0; // Extremely rough heuristic
    
    const openingTagRegex = /<[a-zA-Z]+[^>]*className=[^>]*>/g;
    
    // Actually, a simpler approach: many of these are inside strings or template literals.
    // Replace text-primary with text-white on ANY line that has bg-primary.
    for (let i = 0; i < lines.length; i++) {
         if (darkClassRegex.test(lines[i])) {
              lines[i] = lines[i].replace(/text-primary/g, 'text-white');
              lines[i] = lines[i].replace(/text-slate-600/g, 'text-slate-300');
              lines[i] = lines[i].replace(/text-slate-700/g, 'text-slate-300');
              lines[i] = lines[i].replace(/text-slate-800/g, 'text-white');
         }
    }
    
    content = lines.join('\n');
    
    // Now replace common known dark component patterns specifically.
    // VedaBot Page was handled.
    if (content !== original) {
         fs.writeFileSync(filePath, content, 'utf-8');
         console.log("Updated same-line contrast issues in: " + filePath);
    }
});

console.log("Pass 1 Complete.");
