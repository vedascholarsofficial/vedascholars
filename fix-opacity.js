const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(path.join(__dirname, 'src'), function(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // STEP 1: GLobally replace low opacity text and dark slates to safe colors
    content = content.replace(/text-primary\/20\b/g, 'text-white/70');
    content = content.replace(/text-primary\/30\b/g, 'text-white/80');
    content = content.replace(/text-primary\/40\b/g, 'text-white/90');
    
    // For anything matching text-primary/[number], change to text-white
    content = content.replace(/text-primary\/10\b/g, 'text-white/50');
    
    // Specifically fix gradient overlays
    // bg-gradient-to-... text-transparent bg-clip-text
    content = content.replace(/text-transparent\s+bg-clip-text\s+bg-gradient-to-[a-z0-9-\[\]]+\s+from-[a-z0-9-\[\]]+\s+to-[a-z0-9-\[\]]+/g, 'text-white');
    content = content.replace(/bg-gradient-to-[a-z0-9-\[\]]+\s+from-[a-z0-9-\[\]]+\s+to-[a-z0-9-\[\]]+\s+text-transparent\s+bg-clip-text/g, 'text-white');

    // STEP 4: HERO TITLES FIX. If the file contains University Network, My Applications, or Resume Builder Engine, make sure their H1 has text-white.
    // Instead of regex targeting HTML tags directly which can be messy over multiple lines,
    // let's do targeted string replacements for the exact known strings.
    
    // Fix "My Applications"
    if (content.includes('My <span className="text-[#C6A94A]">Applications</span>') && !content.includes('text-white text-4xl')) {
         content = content.replace(
              /<h1 className="([^"]*)">(\s*My <span className="text-\[\#C6A94A\]">Applications<\/span>\s*)<\/h1>/gi, 
              '<h1 className="$1 text-white">$2</h1>'
         );
    }
    
    // Fix "Resume Builder Engine"
    if (content.includes('Resume Builder Engine')) {
         content = content.replace(
              /<h1 className="([^"]*)">Resume Builder Engine<\/h1>/gi, 
              (m, classes) => {
                  if(!classes.includes('text-white')) return `<h1 className="${classes} text-white">Resume Builder Engine</h1>`;
                  return m;
              }
         );
    }

    // Fix "University Network"
    if (content.includes('University Network')) {
         content = content.replace(
              /<h1 className="([^"]*)">University Network<\/h1>/gi, 
              (m, classes) => {
                  if(!classes.includes('text-white')) return `<h1 className="${classes} text-white">University Network</h1>`;
                  return m;
              }
         );
         content = content.replace(
              /<h1 className="([^"]*)">([^<]*University Network[^<]*)<\/h1>/gi, 
              (m, classes, inner) => {
                  if(!classes.includes('text-white')) return `<h1 className="${classes} text-white">${inner}</h1>`;
                  return m;
              }
         );
    }

    // STEP 6: FIX SCORE PANEL (resume/page.tsx)
    if (content.includes('Algorithmic Score')) {
         content = content.replace(/<span className="font-bold text-slate-200">Algorithmic Score<\/span>/g, '<span className="font-bold text-white">Algorithmic Score</span>');
         content = content.replace(/className="text-xs text-slate-400 space-y-1 mt-2"/g, 'className="text-xs text-slate-300 space-y-1 mt-2"');
         content = content.replace(/text-slate-400 font-medium">\/100/g, 'text-slate-300 font-medium">/100');
         content = content.replace(/text-slate-500 italic ml-4/g, 'text-slate-300 italic ml-4');
    }
    
    // STEP 5: Dark cards
    if (content.includes('bg-[#0B1F3A]') || content.includes('bg-primary') || content.includes('bg-slate-900')) {
         // Generic replace for slate colors to boost contrast
         content = content.replace(/text-slate-500/g, 'text-slate-300');
         content = content.replace(/text-slate-600/g, 'text-slate-300');
         // We do NOT replace text-slate-400 globally unless it's an issue, but the user said "Small text -> text-slate-400" so 400 is fine.
    }

    if (content !== original) {
         fs.writeFileSync(filePath, content, 'utf-8');
         console.log("Improved opacity and UI contrast in: " + filePath);
    }
});
console.log("Pass 3 Complete.");
