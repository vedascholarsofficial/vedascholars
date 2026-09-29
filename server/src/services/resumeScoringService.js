const calculateResumeScore = (resumeData) => {
    let score = 0;
    const suggestions = [];

    // Safety check for empty resume blocks
    if (!resumeData || Object.keys(resumeData).length === 0) {
        return {
            score: 0,
            suggestions: ["Build your resume to get score."]
        };
    }

    // 1. Summary (10 points)
    if (resumeData.summary && resumeData.summary.trim().length > 10) {
        score += 10;
    } else {
        suggestions.push("Add a comprehensive summary (at least two sentences) to highlight your professional goals.");
    }

    // 2. Skills (20 points)
    if (resumeData.skills && Array.isArray(resumeData.skills)) {
        const skillCount = resumeData.skills.length;
        if (skillCount >= 5) {
            score += 20;
        } else if (skillCount > 0) {
            score += skillCount * 4; // 4 points per skill up to 20
            suggestions.push(`You currently list ${skillCount} skill(s). Add at least 5 key skills to max out your algorithmic score.`);
        } else {
            suggestions.push("List technical and soft skills to pass recruiter filters.");
        }
    } else {
        suggestions.push("Skills array is missing.");
    }

    // 3. Education (15 points)
    if (resumeData.education && resumeData.education.length > 0) {
        // Just verify at least 1 valid entry exists
        const validEdu = resumeData.education.filter(e => e.degree || e.institution);
        if (validEdu.length > 0) {
            score += 15;
        } else {
            suggestions.push("Provide degree and institution details for your education.");
        }
    } else {
        suggestions.push("Education background is required for entry-level roles.");
    }

    // 4. Experience (25 points)
    if (resumeData.experience && resumeData.experience.length > 0) {
        const validExp = resumeData.experience.filter(e => e.company || e.role);
        if (validExp.length >= 2) {
            score += 25;
        } else if (validExp.length === 1) {
            score += 15;
            suggestions.push("Add more professional experience entries if possible to boost your score to the max (25 pts).");
        } else {
            suggestions.push("Detail your work experience including company names and roles.");
        }
        
        // Bonus micro-check: Do experiences have descriptions?
        const missingDesc = validExp.some(e => !e.description || e.description.trim() === '');
        if (missingDesc && validExp.length > 0) {
             suggestions.push("Flesh out your experience blocks with detailed descriptions of your achievements.");
        }
    } else {
        suggestions.push("Professional experience is highly sought after. Add internships or prior work.");
    }

    // 5. Projects (20 points)
    if (resumeData.projects && resumeData.projects.length > 0) {
        const validProj = resumeData.projects.filter(p => p.title);
        if (validProj.length >= 2) {
            score += 20;
        } else if (validProj.length === 1) {
            score += 10;
            suggestions.push("Adding a second key project will maximize your project score (20 pts).");
        } else {
            suggestions.push("Projects demonstrate practical ability. Please add your key projects.");
        }
    } else {
        suggestions.push("Add academic or personal projects to showcase your practical coding/design abilities.");
    }

    // 6. Completeness (10 points)
    if (score >= 80) {
        score += 10; // Bonus for a highly fleshed out profile
    } else {
         suggestions.push("Fill out missing sections entirely to earn the final Completeness bonus points.");
    }

    // Ensure score bounded to 100
    score = Math.min(score, 100);

    return {
        score,
        suggestions
    };
};

module.exports = { calculateResumeScore };
